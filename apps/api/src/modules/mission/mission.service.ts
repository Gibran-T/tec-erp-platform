import { DomainError, Result, type Result as ResultType } from "@tec-platform/core";
import type {
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
  ENTERPRISE_DISCOVERY_MISSION_KEY,
  getMissionCatalogEntry,
  isAllowedDepartmentProblemPair,
  isKnownMissionKey,
  JUSTIFICATION_MAX_LENGTH,
  JUSTIFICATION_MIN_LENGTH,
  MINIMUM_MAPPING_COUNT,
  MISSION_CATALOG,
  MISSION_CONTEXT_CATALOG,
  MISSION_DEPARTMENT_CATALOG,
  MISSION_FEEDBACK_CATALOG,
  MISSION_FEEDBACK_COMPLETE_KEY,
  MISSION_PROBLEM_CATALOG,
  pairKey,
  REQUIRED_ACKNOWLEDGED_INPUT_KEYS,
} from "./mission.catalog.js";
import type {
  MissionAttemptRecord,
  MissionAttemptRepository,
  MissionUnlockStateReader,
} from "./mission.types.js";

export interface MissionServiceDependencies {
  readonly attemptRepository: MissionAttemptRepository;
  readonly unlockReader: MissionUnlockStateReader;
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
    status: record.status,
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
  };
}

async function resolveDerivedStatus(
  unlockReader: MissionUnlockStateReader,
  attemptRepository: MissionAttemptRepository,
  employeeId: string,
  missionKey: MissionKey,
): Promise<{ status: MissionStatus; attempt: MissionAttemptRecord | null }> {
  const attempt = await attemptRepository.findAttempt(employeeId, missionKey);

  if (attempt) {
    return {
      status: attempt.status === "completed" ? "completed" : "in_progress",
      attempt,
    };
  }

  const [messageRead, taskComplete] = await Promise.all([
    unlockReader.hasManagerMessageRead(employeeId),
    unlockReader.hasFirstDayTaskCompleted(employeeId),
  ]);

  if (messageRead && taskComplete) {
    return { status: "available", attempt: null };
  }

  return { status: "locked", attempt: null };
}

function validateSubmitBody(
  body: unknown,
): ResultType<MissionSubmitRequest> {
  if (body === null || typeof body !== "object") {
    return Result.fail(DomainError.validation("Le corps de la soumission est invalide."));
  }

  const record = body as Record<string, unknown>;
  const acknowledgedRaw = record.acknowledgedInputKeys;
  const mappingsRaw = record.departmentProblemMappings;
  const justificationRaw = record.justification;

  if (!Array.isArray(acknowledgedRaw) || !Array.isArray(mappingsRaw) || typeof justificationRaw !== "string") {
    return Result.fail(
      DomainError.validation(
        "La soumission doit inclure acknowledgedInputKeys, departmentProblemMappings et justification.",
      ),
    );
  }

  const acknowledgedInputKeys = acknowledgedRaw.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0,
  );
  const justification = justificationRaw.trim();

  if (justification.length < JUSTIFICATION_MIN_LENGTH) {
    return Result.fail(
      DomainError.validation(
        `La justification doit contenir au moins ${JUSTIFICATION_MIN_LENGTH} caractères.`,
      ),
    );
  }

  if (justification.length > JUSTIFICATION_MAX_LENGTH) {
    return Result.fail(
      DomainError.validation(
        `La justification ne peut pas dépasser ${JUSTIFICATION_MAX_LENGTH} caractères.`,
      ),
    );
  }

  for (const requiredKey of REQUIRED_ACKNOWLEDGED_INPUT_KEYS) {
    if (!acknowledgedInputKeys.includes(requiredKey)) {
      return Result.fail(
        DomainError.validation(
          "Vous devez reconnaître les contextes requis avant de soumettre votre découverte.",
        ),
      );
    }
  }

  const knownDepartmentKeys = new Set(MISSION_DEPARTMENT_CATALOG.map((item) => item.key));
  const knownProblemKeys = new Set(MISSION_PROBLEM_CATALOG.map((item) => item.key));
  const seen = new Set<string>();
  const departmentProblemMappings: MissionSubmitRequest["departmentProblemMappings"] = [];

  for (const item of mappingsRaw) {
    if (
      item === null ||
      typeof item !== "object" ||
      typeof (item as { departmentKey?: unknown }).departmentKey !== "string" ||
      typeof (item as { problemKey?: unknown }).problemKey !== "string"
    ) {
      return Result.fail(DomainError.validation("Les associations département/problème sont invalides."));
    }

    const departmentKey = (item as { departmentKey: string }).departmentKey;
    const problemKey = (item as { problemKey: string }).problemKey;

    if (!knownDepartmentKeys.has(departmentKey) || !knownProblemKeys.has(problemKey)) {
      return Result.fail(DomainError.validation("Une association contient une clé inconnue."));
    }

    const key = pairKey(departmentKey, problemKey);
    if (seen.has(key)) {
      return Result.fail(DomainError.validation("Les associations ne doivent pas être dupliquées."));
    }
    seen.add(key);

    if (!isAllowedDepartmentProblemPair(departmentKey, problemKey)) {
      return Result.fail(
        DomainError.validation(
          "Une association département/problème n’est pas valide pour cette découverte.",
        ),
      );
    }

    departmentProblemMappings.push({ departmentKey, problemKey });
  }

  if (departmentProblemMappings.length < MINIMUM_MAPPING_COUNT) {
    return Result.fail(
      DomainError.validation(
        `Associez au moins ${MINIMUM_MAPPING_COUNT} relations département/problème pertinentes.`,
      ),
    );
  }

  return Result.ok({
    acknowledgedInputKeys,
    departmentProblemMappings,
    justification,
  });
}

export function createMissionService(dependencies: MissionServiceDependencies): MissionService {
  const { attemptRepository, unlockReader } = dependencies;
  const now = dependencies.now ?? (() => new Date());

  return {
    async listMissions(employeeId) {
      const missions = [];

      for (const catalog of MISSION_CATALOG) {
        const { status } = await resolveDerivedStatus(
          unlockReader,
          attemptRepository,
          employeeId,
          catalog.missionKey,
        );

        missions.push({
          missionKey: catalog.missionKey,
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

      const { status, attempt } = await resolveDerivedStatus(
        unlockReader,
        attemptRepository,
        employeeId,
        missionKey,
      );

      if (status === "locked") {
        return Result.ok({
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
        });
      }

      return Result.ok({
        missionKey: catalog.missionKey,
        title: catalog.title,
        status,
        preview: catalog.preview,
        unlockExplanation: null,
        briefing: catalog.briefing,
        contextItems: MISSION_CONTEXT_CATALOG.map((item) => ({ ...item })),
        departments: MISSION_DEPARTMENT_CATALOG.map((item) => ({ ...item })),
        problems: MISSION_PROBLEM_CATALOG.map((item) => ({ ...item })),
        attempt: attempt ? toAttemptState(attempt) : null,
      });
    },

    async startMission(employeeId, missionKey) {
      if (!isKnownMissionKey(missionKey)) {
        return Result.fail(DomainError.notFound("Mission introuvable."));
      }

      const { status, attempt } = await resolveDerivedStatus(
        unlockReader,
        attemptRepository,
        employeeId,
        missionKey,
      );

      if (status === "locked") {
        return Result.fail(
          DomainError.conflict(
            "Terminez d’abord votre première journée avant de démarrer cette mission.",
          ),
        );
      }

      if (attempt) {
        return Result.ok({
          missionKey: missionKey as MissionKey,
          attempt: toAttemptState(attempt),
          created: false,
        });
      }

      const created = await attemptRepository.createAttempt({
        employeeId,
        missionKey,
        startedAt: now(),
      });

      return Result.ok({
        missionKey: missionKey as MissionKey,
        attempt: toAttemptState(created),
        created: true,
      });
    },

    async submitMission(employeeId, missionKey, body) {
      if (!isKnownMissionKey(missionKey)) {
        return Result.fail(DomainError.notFound("Mission introuvable."));
      }

      const { status, attempt } = await resolveDerivedStatus(
        unlockReader,
        attemptRepository,
        employeeId,
        missionKey,
      );

      if (status === "locked") {
        return Result.fail(
          DomainError.conflict(
            "Terminez d’abord votre première journée avant de soumettre cette mission.",
          ),
        );
      }

      if (status === "available" || attempt === null) {
        return Result.fail(
          DomainError.conflict(
            "Démarrez la mission avant de soumettre votre découverte.",
          ),
        );
      }

      if (attempt.status === "completed") {
        return Result.ok({
          missionKey: missionKey as MissionKey,
          attempt: toAttemptState(attempt),
        });
      }

      const validation = validateSubmitBody(body);
      if (Result.isFail(validation)) {
        return validation;
      }

      const payload = validation.value;
      const completed = await attemptRepository.completeAttempt({
        employeeId,
        missionKey,
        completedAt: now(),
        acknowledgedInputKeys: payload.acknowledgedInputKeys,
        departmentProblemMappings: payload.departmentProblemMappings,
        justification: payload.justification,
        feedbackKey: MISSION_FEEDBACK_COMPLETE_KEY,
      });

      return Result.ok({
        missionKey: ENTERPRISE_DISCOVERY_MISSION_KEY,
        attempt: toAttemptState(completed),
      });
    },
  };
}
