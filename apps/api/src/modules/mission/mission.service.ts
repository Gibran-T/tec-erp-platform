import { DomainError, Result, type Result as ResultType } from "@tec-platform/core";
import type {
  GenericMissionSubmitRequest,
  MissionAttemptState,
  MissionDetail,
  MissionKey,
  MissionStartResponse,
  MissionStatus,
  MissionSubmitRequest,
  MissionSubmitResponse,
  MissionsResponse,
} from "@tec-platform/contracts";
import {
  GenericMissionSubmitRequestSchema,
  MissionSubmitRequestSchema,
} from "@tec-platform/contracts";
import { getMissionByKey, listAllMissions } from "@tec-platform/mission-catalog";

import {
  ENTERPRISE_DISCOVERY_MISSION_KEY,
  getMissionCatalogEntry,
  isAllowedDepartmentProblemPair,
  isKnownMissionKey,
  JUSTIFICATION_MAX_LENGTH,
  JUSTIFICATION_MIN_LENGTH,
  MINIMUM_MAPPING_COUNT,
  MISSION_CONTEXT_CATALOG,
  MISSION_DEPARTMENT_CATALOG,
  MISSION_FEEDBACK_CATALOG,
  MISSION_FEEDBACK_COMPLETE_KEY,
  MISSION_PROBLEM_CATALOG,
  pairKey,
  REQUIRED_ACKNOWLEDGED_INPUT_KEYS,
} from "./mission.catalog.js";
import { nextUnlockKeyAfterMission } from "./mission.migration-mapper.js";
import { applyMissionCompletionUnlocks } from "./mission.unlock-engine.js";
import type {
  CourseProgressRepository,
  MissionAttemptRecord,
  MissionAttemptRepository,
  MissionUnlockStateReader,
  UnlockStateRepository,
} from "./mission.types.js";
import {
  evaluateMissionResponses,
  type ScoredResponse,
} from "./scoring/evaluator.js";

export interface MissionServiceDependencies {
  readonly attemptRepository: MissionAttemptRepository;
  readonly unlockReader: MissionUnlockStateReader;
  readonly unlockStates?: UnlockStateRepository;
  readonly courseProgress?: CourseProgressRepository;
  readonly now?: () => Date;
}

export interface MissionService {
  listMissions(employeeId: string): Promise<MissionsResponse>;
  getMission(employeeId: string, missionKey: string): Promise<ResultType<MissionDetail>>;
  startMission(employeeId: string, missionKey: string): Promise<ResultType<MissionStartResponse>>;
  submitMission(
    employeeId: string,
    missionKey: string,
    body: unknown,
  ): Promise<ResultType<MissionSubmitResponse>>;
}

function toAttemptState(record: MissionAttemptRecord): MissionAttemptState {
  const feedbackBody =
    record.feedbackKey !== null
      ? (MISSION_FEEDBACK_CATALOG[record.feedbackKey] ?? null)
      : null;

  return {
    status: record.status === "completed" ? "completed" : "in_progress",
    startedAt: record.startedAt.toISOString(),
    completedAt: record.completedAt ? record.completedAt.toISOString() : null,
    acknowledgedInputKeys: [...record.acknowledgedInputKeys],
    departmentProblemMappings: record.departmentProblemMappings.map((mapping) => ({
      departmentKey: mapping.departmentKey,
      problemKey: mapping.problemKey,
    })),
    justification: record.justification,
    feedbackKey: record.feedbackKey,
    feedbackBody,
    scorePercent: record.scorePercent ?? null,
    attemptNumber: record.attemptNumber,
  };
}

async function isMissionUnlocked(
  deps: MissionServiceDependencies,
  employeeId: string,
  missionKey: MissionKey,
): Promise<boolean> {
  if (missionKey === ENTERPRISE_DISCOVERY_MISSION_KEY) {
    const [messageRead, taskComplete] = await Promise.all([
      deps.unlockReader.hasManagerMessageRead(employeeId),
      deps.unlockReader.hasFirstDayTaskCompleted(employeeId),
    ]);
    return messageRead && taskComplete;
  }

  if (deps.unlockStates) {
    const explicitlyUnlocked = await deps.unlockStates.isUnlocked(
      employeeId,
      "mission",
      missionKey,
    );
    if (explicitlyUnlocked) {
      return true;
    }
  }

  // Derive unlock from previous mission completion when unlock_state is absent.
  const previousKey = listAllMissions()
    .filter((mission) => mission.moduleCode === "M1")
    .sort((left, right) => left.sequence - right.sequence)
    .find((mission) => nextUnlockKeyAfterMission(mission.missionKey) === missionKey)?.missionKey;

  if (!previousKey) {
    return false;
  }

  const previous = await deps.attemptRepository.findAttempt(employeeId, previousKey);
  return previous?.status === "completed";
}

async function resolveDerivedStatus(
  deps: MissionServiceDependencies,
  employeeId: string,
  missionKey: MissionKey,
): Promise<{ status: MissionStatus; attempt: MissionAttemptRecord | null }> {
  const attempt = await deps.attemptRepository.findAttempt(employeeId, missionKey);

  if (attempt) {
    return {
      status: attempt.status === "completed" ? "completed" : "in_progress",
      attempt,
    };
  }

  const unlocked = await isMissionUnlocked(deps, employeeId, missionKey);
  if (unlocked) {
    return { status: "available", attempt: null };
  }

  return { status: "locked", attempt: null };
}

function validateLegacySubmitBody(body: unknown): ResultType<MissionSubmitRequest> {
  const parsed = MissionSubmitRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Result.fail(DomainError.validation("La soumission de mission est invalide."));
  }

  const payload = parsed.data;

  for (const requiredKey of REQUIRED_ACKNOWLEDGED_INPUT_KEYS) {
    if (!payload.acknowledgedInputKeys.includes(requiredKey)) {
      return Result.fail(
        DomainError.validation(
          "Vous devez reconnaître les contextes requis avant de soumettre votre découverte.",
        ),
      );
    }
  }

  if (
    payload.justification.length < JUSTIFICATION_MIN_LENGTH ||
    payload.justification.length > JUSTIFICATION_MAX_LENGTH
  ) {
    return Result.fail(DomainError.validation("La justification a une longueur invalide."));
  }

  const knownDepartmentKeys = new Set(MISSION_DEPARTMENT_CATALOG.map((item) => item.key));
  const knownProblemKeys = new Set(MISSION_PROBLEM_CATALOG.map((item) => item.key));
  const seen = new Set<string>();

  for (const mapping of payload.departmentProblemMappings) {
    if (!knownDepartmentKeys.has(mapping.departmentKey) || !knownProblemKeys.has(mapping.problemKey)) {
      return Result.fail(DomainError.validation("Une association contient une clé inconnue."));
    }

    const key = pairKey(mapping.departmentKey, mapping.problemKey);
    if (seen.has(key)) {
      return Result.fail(DomainError.validation("Les associations ne doivent pas être dupliquées."));
    }
    seen.add(key);

    if (!isAllowedDepartmentProblemPair(mapping.departmentKey, mapping.problemKey)) {
      return Result.fail(
        DomainError.validation(
          "Une association département/problème n’est pas valide pour cette découverte.",
        ),
      );
    }
  }

  if (payload.departmentProblemMappings.length < MINIMUM_MAPPING_COUNT) {
    return Result.fail(
      DomainError.validation(
        `Associez au moins ${MINIMUM_MAPPING_COUNT} relations département/problème pertinentes.`,
      ),
    );
  }

  return Result.ok(payload);
}

function validateGenericSubmitBody(body: unknown): ResultType<GenericMissionSubmitRequest> {
  const parsed = GenericMissionSubmitRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Result.fail(DomainError.validation("La soumission de mission est invalide."));
  }
  return Result.ok(parsed.data);
}

function buildDetail(
  catalog: NonNullable<ReturnType<typeof getMissionCatalogEntry>>,
  status: MissionStatus,
  attempt: MissionAttemptRecord | null,
): MissionDetail {
  const definition = getMissionByKey(catalog.missionKey);
  const isDiscovery = catalog.missionKey === ENTERPRISE_DISCOVERY_MISSION_KEY;

  if (status === "locked") {
    return {
      missionKey: catalog.missionKey,
      title: catalog.title,
      status,
      preview: catalog.preview,
      unlockExplanation: catalog.unlockExplanation,
      briefing: null,
      contextItems: null,
      departments: null,
      problems: null,
      attempt: null,
      interactions: null,
    };
  }

  return {
    missionKey: catalog.missionKey,
    title: catalog.title,
    status,
    preview: catalog.preview,
    unlockExplanation: null,
    briefing: catalog.briefing,
    contextItems: isDiscovery
      ? MISSION_CONTEXT_CATALOG.map((item) => ({ ...item }))
      : (definition?.contextItems.map((item) => ({ ...item })) ?? []),
    departments: isDiscovery
      ? MISSION_DEPARTMENT_CATALOG.map((item) => ({ ...item }))
      : [],
    problems: isDiscovery ? MISSION_PROBLEM_CATALOG.map((item) => ({ ...item })) : [],
    attempt: attempt ? toAttemptState(attempt) : null,
    interactions: isDiscovery
      ? null
      : (definition?.interactions.map((interaction) => ({
          id: interaction.id,
          type: interaction.type,
          prompt: interaction.prompt,
          options: interaction.options?.map((option) => ({
            key: option.key,
            label: option.label,
            description: option.description,
          })),
        })) ?? null),
  };
}

export function createMissionService(dependencies: MissionServiceDependencies): MissionService {
  const now = dependencies.now ?? (() => new Date());

  async function afterComplete(employeeId: string, missionKey: string, completedAt: Date): Promise<void> {
    if (!dependencies.unlockStates || !dependencies.courseProgress) {
      return;
    }
    await applyMissionCompletionUnlocks({
      employeeId,
      missionKey,
      completedAt,
      unlockStates: dependencies.unlockStates,
      courseProgress: dependencies.courseProgress,
      attemptRepository: dependencies.attemptRepository,
    });
  }

  return {
    async listMissions(employeeId) {
      const missions = [];

      for (const catalog of listAllMissions()) {
        const missionKey = catalog.missionKey as MissionKey;
        const { status } = await resolveDerivedStatus(dependencies, employeeId, missionKey);

        missions.push({
          missionKey,
          title: catalog.title,
          status,
          preview: catalog.preview,
          unlockExplanation: status === "locked" ? catalog.unlockExplanation : null,
        });
      }

      return { missions };
    },

    async getMission(employeeId, missionKey) {
      if (!isKnownMissionKey(missionKey)) {
        return Result.fail(DomainError.notFound("Mission introuvable."));
      }

      const catalog = getMissionCatalogEntry(missionKey);
      if (!catalog) {
        return Result.fail(DomainError.notFound("Mission introuvable."));
      }

      const { status, attempt } = await resolveDerivedStatus(dependencies, employeeId, missionKey);
      return Result.ok(buildDetail(catalog, status, attempt));
    },

    async startMission(employeeId, missionKey) {
      if (!isKnownMissionKey(missionKey)) {
        return Result.fail(DomainError.notFound("Mission introuvable."));
      }

      const { status, attempt } = await resolveDerivedStatus(dependencies, employeeId, missionKey);

      if (status === "locked") {
        const catalog = getMissionCatalogEntry(missionKey);
        return Result.fail(
          DomainError.conflict(
            catalog?.unlockExplanation ??
              "Cette mission est verrouillée. Terminez d’abord les prérequis.",
          ),
        );
      }

      if (attempt) {
        return Result.ok({
          missionKey,
          attempt: toAttemptState(attempt),
          created: false,
        });
      }

      const created = await dependencies.attemptRepository.createAttempt({
        employeeId,
        missionKey,
        startedAt: now(),
      });

      return Result.ok({
        missionKey,
        attempt: toAttemptState(created),
        created: true,
      });
    },

    async submitMission(employeeId, missionKey, body) {
      if (!isKnownMissionKey(missionKey)) {
        return Result.fail(DomainError.notFound("Mission introuvable."));
      }

      const { status, attempt } = await resolveDerivedStatus(dependencies, employeeId, missionKey);

      if (status === "locked") {
        return Result.fail(
          DomainError.conflict(
            "Cette mission est verrouillée. Terminez d’abord les prérequis.",
          ),
        );
      }

      if (status === "available" || attempt === null) {
        return Result.fail(
          DomainError.conflict("Démarrez la mission avant de soumettre votre découverte."),
        );
      }

      if (attempt.status === "completed") {
        return Result.ok({
          missionKey,
          attempt: toAttemptState(attempt),
        });
      }

      if (missionKey === ENTERPRISE_DISCOVERY_MISSION_KEY) {
        const validation = validateLegacySubmitBody(body);
        if (Result.isFail(validation)) {
          return validation;
        }

        const payload = validation.value;
        const completedAt = now();
        const completed = await dependencies.attemptRepository.completeAttempt({
          employeeId,
          missionKey,
          completedAt,
          acknowledgedInputKeys: payload.acknowledgedInputKeys,
          departmentProblemMappings: payload.departmentProblemMappings,
          justification: payload.justification,
          feedbackKey: MISSION_FEEDBACK_COMPLETE_KEY,
        });

        await afterComplete(employeeId, missionKey, completedAt);

        return Result.ok({
          missionKey: ENTERPRISE_DISCOVERY_MISSION_KEY,
          attempt: toAttemptState(completed),
        });
      }

      const validation = validateGenericSubmitBody(body);
      if (Result.isFail(validation)) {
        return validation;
      }

      const definition = getMissionByKey(missionKey);
      if (!definition) {
        return Result.fail(DomainError.notFound("Mission introuvable."));
      }

      const scoredResponses: ScoredResponse[] = validation.value.responses.map((item) => ({
        interactionId: item.interactionId,
        value: item.value,
      }));

      const score = evaluateMissionResponses(definition, scoredResponses);
      const completedAt = now();
      const responsesJson: Record<string, unknown> = {
        responses: validation.value.responses,
      };

      let completed: MissionAttemptRecord;

      if (dependencies.attemptRepository.completeV1Attempt) {
        completed = await dependencies.attemptRepository.completeV1Attempt({
          attemptId: attempt.id,
          completedAt,
          status: score.passed ? "completed" : "failed",
          responsesJson,
          scorePercent: score.scorePercent,
          earnedPoints: score.earnedPoints,
          maxPoints: score.maxPoints,
          feedbackJson: { feedback: score.feedback },
        });
      } else {
        // In-memory / test path: store generic payload fields into legacy complete shape.
        completed = await dependencies.attemptRepository.completeAttempt({
          employeeId,
          missionKey,
          completedAt,
          acknowledgedInputKeys: [],
          departmentProblemMappings: [],
          justification: score.feedback,
          feedbackKey: score.passed ? "fb-generic-pass" : "fb-generic-fail",
        });
        completed = {
          ...completed,
          status: score.passed ? "completed" : "in_progress",
          scorePercent: score.scorePercent,
          completedAt: score.passed ? completedAt : null,
        };
      }

      if (score.passed) {
        await afterComplete(employeeId, missionKey, completedAt);
      }

      return Result.ok({
        missionKey,
        attempt: {
          ...toAttemptState({
            ...completed,
            status: score.passed ? "completed" : "in_progress",
            feedbackKey: null,
            justification: null,
            scorePercent: score.scorePercent,
          }),
          feedbackBody: score.feedback,
        },
        score: {
          scorePercent: score.scorePercent,
          earnedPoints: score.earnedPoints,
          maxPoints: score.maxPoints,
          passed: score.passed,
          feedback: score.feedback,
        },
      });
    },
  };
}
