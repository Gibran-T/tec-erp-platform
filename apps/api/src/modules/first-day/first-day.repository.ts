import { getPrismaClient } from "@tec-platform/database-erp";

import type {
  FirstDayStateRepository,
  MessageStateRecord,
  TaskStateRecord,
} from "./first-day.types.js";

function mapMessageState(row: {
  employeeId: string;
  messageKey: string;
  readAt: Date;
}): MessageStateRecord {
  return {
    employeeId: row.employeeId,
    messageKey: row.messageKey,
    readAt: row.readAt,
  };
}

function mapTaskState(row: {
  employeeId: string;
  taskKey: string;
  completedAt: Date;
}): TaskStateRecord {
  return {
    employeeId: row.employeeId,
    taskKey: row.taskKey,
    completedAt: row.completedAt,
  };
}

export function createPrismaFirstDayStateRepository(): FirstDayStateRepository {
  return {
    async findMessageState(employeeId, messageKey) {
      const prisma = getPrismaClient();
      const row = await prisma.employeeMessageState.findUnique({
        where: {
          employeeId_messageKey: { employeeId, messageKey },
        },
      });

      return row ? mapMessageState(row) : null;
    },

    async findMessageStates(employeeId) {
      const prisma = getPrismaClient();
      const rows = await prisma.employeeMessageState.findMany({
        where: { employeeId },
      });

      return rows.map(mapMessageState);
    },

    async createMessageState(employeeId, messageKey, readAt) {
      const prisma = getPrismaClient();
      const row = await prisma.employeeMessageState.create({
        data: { employeeId, messageKey, readAt },
      });

      return mapMessageState(row);
    },

    async findTaskState(employeeId, taskKey) {
      const prisma = getPrismaClient();
      const row = await prisma.employeeTaskState.findUnique({
        where: {
          employeeId_taskKey: { employeeId, taskKey },
        },
      });

      return row ? mapTaskState(row) : null;
    },

    async findTaskStates(employeeId) {
      const prisma = getPrismaClient();
      const rows = await prisma.employeeTaskState.findMany({
        where: { employeeId },
      });

      return rows.map(mapTaskState);
    },

    async createTaskState(employeeId, taskKey, completedAt) {
      const prisma = getPrismaClient();
      const row = await prisma.employeeTaskState.create({
        data: { employeeId, taskKey, completedAt },
      });

      return mapTaskState(row);
    },
  };
}
