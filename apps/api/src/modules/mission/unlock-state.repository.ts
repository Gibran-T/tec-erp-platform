import { getPrismaClient } from "@tec-platform/database-erp";

import type { UnlockStateRepository } from "./mission.types.js";

export function createPrismaUnlockStateRepository(): UnlockStateRepository {
  return {
    async isUnlocked(employeeId, resourceType, resourceKey) {
      const prisma = getPrismaClient();
      const row = await prisma.unlockState.findUnique({
        where: {
          employeeId_resourceType_resourceKey: {
            employeeId,
            resourceType,
            resourceKey,
          },
        },
      });
      return row !== null;
    },

    async unlock(employeeId, resourceType, resourceKey, unlockedAt) {
      const prisma = getPrismaClient();
      await prisma.unlockState.upsert({
        where: {
          employeeId_resourceType_resourceKey: {
            employeeId,
            resourceType,
            resourceKey,
          },
        },
        create: {
          employeeId,
          resourceType,
          resourceKey,
          unlockedAt,
        },
        update: {},
      });
    },

    async listUnlockedKeys(employeeId, resourceType) {
      const prisma = getPrismaClient();
      const rows = await prisma.unlockState.findMany({
        where: { employeeId, resourceType },
        select: { resourceKey: true },
      });
      return rows.map((row) => row.resourceKey);
    },
  };
}
