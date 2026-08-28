import type { CourseEditionProgressRecord } from "@tec-platform/contracts";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

import { parseStoredCourseEditionProgress } from "./course-edition-progress.js";
import type { CourseEditionProgressRepository } from "./course-edition-progress.types.js";

function toJson(progress: CourseEditionProgressRecord): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(progress)) as Prisma.InputJsonValue;
}

export function createPrismaCourseEditionProgressRepository(): CourseEditionProgressRepository {
  return {
    async findByEmployeeAndModule(employeeId, moduleCode) {
      const prisma = getPrismaClient();
      const row = await prisma.courseEditionProgress.findUnique({
        where: {
          employeeId_moduleCode: { employeeId, moduleCode: moduleCode.toUpperCase() },
        },
      });
      return row ? parseStoredCourseEditionProgress(row.progressJson, row.moduleCode) : null;
    },

    async findByEmployeeIdsAndModule(employeeIds, moduleCode) {
      if (employeeIds.length === 0) {
        return [];
      }
      const prisma = getPrismaClient();
      const rows = await prisma.courseEditionProgress.findMany({
        where: {
          employeeId: { in: [...employeeIds] },
          moduleCode: moduleCode.toUpperCase(),
        },
      });
      const mapped: Array<{ employeeId: string; progress: CourseEditionProgressRecord }> = [];
      for (const row of rows) {
        const progress = parseStoredCourseEditionProgress(row.progressJson, row.moduleCode);
        if (progress) {
          mapped.push({ employeeId: row.employeeId, progress });
        }
      }
      return mapped;
    },

    async upsert(input) {
      const prisma = getPrismaClient();
      const moduleCode = input.progress.moduleCode.toUpperCase();
      const row = await prisma.courseEditionProgress.upsert({
        where: {
          employeeId_moduleCode: { employeeId: input.employeeId, moduleCode },
        },
        create: {
          employeeId: input.employeeId,
          moduleCode,
          progressJson: toJson(input.progress),
        },
        update: {
          progressJson: toJson(input.progress),
        },
      });
      const saved = parseStoredCourseEditionProgress(row.progressJson, row.moduleCode);
      if (!saved) {
        throw new Error("Course Edition progress JSON invalide après persist.");
      }
      return saved;
    },
  };
}
