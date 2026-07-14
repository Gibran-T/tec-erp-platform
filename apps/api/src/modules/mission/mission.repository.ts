import { getPrismaClient } from "@tec-platform/database-erp";

import type {
  MissionAttemptRecord,
  MissionAttemptRepository,
  MissionDepartmentProblemMappingRecord,
  PersistedMissionStatus,
} from "./mission.types.js";

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

function mapAttempt(row: {
  id: string;
  employeeId: string;
  missionKey: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  acknowledgedInputKeys: unknown;
  departmentProblemMappings: unknown;
  justification: string | null;
  feedbackKey: string | null;
}): MissionAttemptRecord {
  return {
    id: row.id,
    employeeId: row.employeeId,
    missionKey: row.missionKey,
    status: row.status as PersistedMissionStatus,
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    acknowledgedInputKeys: parseStringArray(row.acknowledgedInputKeys),
    departmentProblemMappings: parseMappings(row.departmentProblemMappings),
    justification: row.justification,
    feedbackKey: row.feedbackKey,
  };
}

export function createPrismaMissionAttemptRepository(): MissionAttemptRepository {
  return {
    async findAttempt(employeeId, missionKey) {
      const prisma = getPrismaClient();
      const row = await prisma.employeeMissionAttempt.findUnique({
        where: {
          employeeId_missionKey: { employeeId, missionKey },
        },
      });

      return row ? mapAttempt(row) : null;
    },

    async createAttempt(input) {
      const prisma = getPrismaClient();
      const row = await prisma.employeeMissionAttempt.create({
        data: {
          employeeId: input.employeeId,
          missionKey: input.missionKey,
          status: "in_progress",
          startedAt: input.startedAt,
          acknowledgedInputKeys: [],
          departmentProblemMappings: [],
        },
      });

      return mapAttempt(row);
    },

    async completeAttempt(input) {
      const prisma = getPrismaClient();
      const row = await prisma.employeeMissionAttempt.update({
        where: {
          employeeId_missionKey: {
            employeeId: input.employeeId,
            missionKey: input.missionKey,
          },
        },
        data: {
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

      return mapAttempt(row);
    },
  };
}
