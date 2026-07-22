import { getPrismaClient } from "@tec-platform/database-erp";

import {
  getCurrentPedagogicalRun,
  requireCurrentPedagogicalRunId,
} from "../pedagogical-run/run-context.js";
import type { UnlockStateRepository } from "./mission.types.js";

export function createPrismaUnlockStateRepository(): UnlockStateRepository {
  return {
    async isUnlocked(employeeId, resourceType, resourceKey) {
      const prisma = getPrismaClient();
      const run = getCurrentPedagogicalRun();
      if (!run) {
        return false;
      }
      const row = await prisma.unlockState.findUnique({
        where: {
          employeeId_resourceType_resourceKey_pedagogicalCourseRunId: {
            employeeId,
            resourceType,
            resourceKey,
            pedagogicalCourseRunId: run.id,
          },
        },
      });
      return row !== null;
    },

    async unlock(employeeId, resourceType, resourceKey, unlockedAt) {
      const prisma = getPrismaClient();
      const pedagogicalCourseRunId = requireCurrentPedagogicalRunId();
      await prisma.unlockState.upsert({
        where: {
          employeeId_resourceType_resourceKey_pedagogicalCourseRunId: {
            employeeId,
            resourceType,
            resourceKey,
            pedagogicalCourseRunId,
          },
        },
        create: {
          employeeId,
          resourceType,
          resourceKey,
          pedagogicalCourseRunId,
          unlockedAt,
        },
        update: {},
      });
    },

    async listUnlockedKeys(employeeId, resourceType) {
      const prisma = getPrismaClient();
      const run = getCurrentPedagogicalRun();
      if (!run) {
        return [];
      }
      const rows = await prisma.unlockState.findMany({
        where: { employeeId, resourceType, pedagogicalCourseRunId: run.id },
        select: { resourceKey: true },
      });
      return rows.map((row) => row.resourceKey);
    },
  };
}
