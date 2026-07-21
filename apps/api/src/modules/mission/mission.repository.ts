import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

import {
  ENTERPRISE_DISCOVERY_MISSION_KEY,
  MISSION_FEEDBACK_COMPLETE_KEY,
} from "./mission.catalog.js";
import type {
  MissionAttemptRecord,
  MissionAttemptRepository,
  MissionDepartmentProblemMappingRecord,
  PersistedMissionStatus,
  PersistedV1AttemptStatus,
} from "./mission.types.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

const DEFINITION_ID_BY_KEY: Readonly<Record<string, string>> = {
  "m1-m01-decouvrir-entreprise": "md_m1_m01",
  "m1-m02-connecter-departements": "md_m1_m02",
  "m1-m03-diagnostiquer-preparation": "md_m1_m03",
};

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function parseMappings(value: unknown): MissionDepartmentProblemMappingRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const mappings: MissionDepartmentProblemMappingRecord[] = [];
  for (const item of value) {
    if (
      item !== null &&
      typeof item === "object" &&
      "departmentKey" in item &&
      "problemKey" in item &&
      typeof (item as { departmentKey: unknown }).departmentKey === "string" &&
      typeof (item as { problemKey: unknown }).problemKey === "string"
    ) {
      mappings.push({
        departmentKey: (item as { departmentKey: string }).departmentKey,
        problemKey: (item as { problemKey: string }).problemKey,
      });
    }
  }
  return mappings;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function toApiStatus(status: string): PersistedMissionStatus {
  return status === "completed" ? "completed" : "in_progress";
}

function mapV1RowToLegacy(row: {
  id: string;
  employeeId: string;
  missionDefinitionId: string;
  attemptNumber: number;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  responsesJson: unknown;
  scorePercent: number | null;
  feedbackJson: unknown;
  missionDefinition?: { missionKey: string } | null;
}): MissionAttemptRecord {
  const responses = asRecord(row.responsesJson);
  const feedback = asRecord(row.feedbackJson);
  const missionKey =
    row.missionDefinition?.missionKey ??
    Object.entries(DEFINITION_ID_BY_KEY).find(([, id]) => id === row.missionDefinitionId)?.[0] ??
    "";

  return {
    id: row.id,
    employeeId: row.employeeId,
    missionKey,
    status: toApiStatus(row.status),
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    acknowledgedInputKeys: parseStringArray(responses.acknowledgedInputKeys),
    departmentProblemMappings: parseMappings(responses.departmentProblemMappings),
    justification:
      typeof responses.justification === "string" ? responses.justification : null,
    feedbackKey:
      typeof responses.feedbackKey === "string"
        ? responses.feedbackKey
        : typeof feedback.feedbackKey === "string"
          ? feedback.feedbackKey
          : null,
    scorePercent: row.scorePercent,
    attemptNumber: row.attemptNumber,
  };
}

async function resolveDefinitionId(missionKey: string): Promise<string> {
  const mapped = DEFINITION_ID_BY_KEY[missionKey];
  if (mapped) {
    return mapped;
  }

  const prisma = getPrismaClient();
  const row = await prisma.missionDefinition.findUnique({ where: { missionKey } });
  if (!row) {
    throw new Error(`Mission definition introuvable pour ${missionKey}`);
  }
  return row.id;
}

export function createPrismaMissionAttemptRepository(): MissionAttemptRepository {
  return {
    async findAttempt(employeeId, missionKey) {
      const prisma = getPrismaClient();
      const definitionId = DEFINITION_ID_BY_KEY[missionKey];

      if (definitionId) {
        const row = await prisma.missionAttempt.findFirst({
          where: { employeeId, missionDefinitionId: definitionId },
          orderBy: { attemptNumber: "desc" },
          include: { missionDefinition: true },
        });
        if (row) {
          return mapV1RowToLegacy(row);
        }
      }

      // Fallback for environments where V1 migration has not yet run for this row.
      const legacy = await prisma.employeeMissionAttempt.findUnique({
        where: { employeeId_missionKey: { employeeId, missionKey } },
      });
      if (!legacy) {
        return null;
      }

      return {
        id: legacy.id,
        employeeId: legacy.employeeId,
        missionKey: legacy.missionKey,
        status: legacy.status as PersistedMissionStatus,
        startedAt: legacy.startedAt,
        completedAt: legacy.completedAt,
        acknowledgedInputKeys: parseStringArray(legacy.acknowledgedInputKeys),
        departmentProblemMappings: parseMappings(legacy.departmentProblemMappings),
        justification: legacy.justification,
        feedbackKey: legacy.feedbackKey,
        scorePercent: legacy.status === "completed" ? 100 : null,
        attemptNumber: 1,
      };
    },

    async listAttemptsForEmployee(employeeId) {
      const prisma = getPrismaClient();
      const rows = await prisma.missionAttempt.findMany({
        where: { employeeId },
        include: { missionDefinition: true },
        orderBy: [{ missionDefinitionId: "asc" }, { attemptNumber: "desc" }],
      });
      return rows.map(mapV1RowToLegacy);
    },

    async createAttempt(input) {
      const prisma = getPrismaClient();
      const definitionId = await resolveDefinitionId(input.missionKey);
      const existingCount = await prisma.missionAttempt.count({
        where: { employeeId: input.employeeId, missionDefinitionId: definitionId },
      });

      const row = await prisma.missionAttempt.create({
        data: {
          employeeId: input.employeeId,
          missionDefinitionId: definitionId,
          attemptNumber: existingCount + 1,
          status: "in_progress" satisfies PersistedV1AttemptStatus,
          startedAt: input.startedAt,
          responsesJson: {},
        },
        include: { missionDefinition: true },
      });

      if (input.missionKey === ENTERPRISE_DISCOVERY_MISSION_KEY) {
        await prisma.employeeMissionAttempt.upsert({
          where: {
            employeeId_missionKey: {
              employeeId: input.employeeId,
              missionKey: input.missionKey,
            },
          },
          create: {
            employeeId: input.employeeId,
            missionKey: input.missionKey,
            status: "in_progress",
            startedAt: input.startedAt,
            acknowledgedInputKeys: [],
            departmentProblemMappings: [],
          },
          update: {},
        });
      }

      return mapV1RowToLegacy(row);
    },

    async completeAttempt(input) {
      const prisma = getPrismaClient();
      const definitionId = await resolveDefinitionId(input.missionKey);
      const current = await prisma.missionAttempt.findFirst({
        where: {
          employeeId: input.employeeId,
          missionDefinitionId: definitionId,
          status: "in_progress",
        },
        orderBy: { attemptNumber: "desc" },
      });

      if (!current) {
        throw new Error("Attempt not found for complete.");
      }

      const responsesJson = {
        acknowledgedInputKeys: [...input.acknowledgedInputKeys],
        departmentProblemMappings: input.departmentProblemMappings.map((mapping) => ({
          departmentKey: mapping.departmentKey,
          problemKey: mapping.problemKey,
        })),
        justification: input.justification,
        feedbackKey: input.feedbackKey,
      };

      const row = await prisma.missionAttempt.update({
        where: { id: current.id },
        data: {
          status: "completed",
          submittedAt: input.completedAt,
          completedAt: input.completedAt,
          responsesJson,
          scorePercent: 100,
          earnedPoints: 100,
          maxPoints: 100,
          feedbackJson: { feedbackKey: input.feedbackKey },
        },
        include: { missionDefinition: true },
      });

      if (input.missionKey === ENTERPRISE_DISCOVERY_MISSION_KEY) {
        await prisma.employeeMissionAttempt.upsert({
          where: {
            employeeId_missionKey: {
              employeeId: input.employeeId,
              missionKey: input.missionKey,
            },
          },
          create: {
            employeeId: input.employeeId,
            missionKey: input.missionKey,
            status: "completed",
            startedAt: row.startedAt,
            completedAt: input.completedAt,
            acknowledgedInputKeys: [...input.acknowledgedInputKeys],
            departmentProblemMappings: input.departmentProblemMappings.map((mapping) => ({
              departmentKey: mapping.departmentKey,
              problemKey: mapping.problemKey,
            })),
            justification: input.justification,
            feedbackKey: input.feedbackKey,
          },
          update: {
            status: "completed",
            completedAt: input.completedAt,
            acknowledgedInputKeys: [...input.acknowledgedInputKeys],
            departmentProblemMappings: input.departmentProblemMappings.map((mapping) => ({
              departmentKey: mapping.departmentKey,
              problemKey: mapping.problemKey,
            })),
            justification: input.justification,
            feedbackKey: input.feedbackKey,
          },
        });
      }

      return mapV1RowToLegacy(row);
    },

    async completeV1Attempt(input) {
      const prisma = getPrismaClient();
      const row = await prisma.missionAttempt.update({
        where: { id: input.attemptId },
        data: {
          status: input.status,
          submittedAt: input.completedAt,
          completedAt: input.status === "completed" ? input.completedAt : null,
          responsesJson: toInputJson({ ...input.responsesJson }),
          scorePercent: input.scorePercent,
          earnedPoints: input.earnedPoints,
          maxPoints: input.maxPoints,
          feedbackJson: toInputJson({ ...input.feedbackJson }),
        },
        include: { missionDefinition: true },
      });

      const missionKey = row.missionDefinition.missionKey;
      if (missionKey === ENTERPRISE_DISCOVERY_MISSION_KEY && input.status === "completed") {
        const responses = asRecord(input.responsesJson);
        const mappings = parseMappings(responses.departmentProblemMappings).map((mapping) => ({
          departmentKey: mapping.departmentKey,
          problemKey: mapping.problemKey,
        }));
        await prisma.employeeMissionAttempt.upsert({
          where: {
            employeeId_missionKey: {
              employeeId: row.employeeId,
              missionKey,
            },
          },
          create: {
            employeeId: row.employeeId,
            missionKey,
            status: "completed",
            startedAt: row.startedAt,
            completedAt: input.completedAt,
            acknowledgedInputKeys: parseStringArray(responses.acknowledgedInputKeys),
            departmentProblemMappings: toInputJson(mappings),
            justification:
              typeof responses.justification === "string" ? responses.justification : null,
            feedbackKey: MISSION_FEEDBACK_COMPLETE_KEY,
          },
          update: {
            status: "completed",
            completedAt: input.completedAt,
            acknowledgedInputKeys: parseStringArray(responses.acknowledgedInputKeys),
            departmentProblemMappings: toInputJson(mappings),
            justification:
              typeof responses.justification === "string" ? responses.justification : null,
            feedbackKey: MISSION_FEEDBACK_COMPLETE_KEY,
          },
        });
      }

      return mapV1RowToLegacy(row);
    },
  };
}
