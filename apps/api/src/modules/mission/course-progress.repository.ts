import { getPrismaClient } from "@tec-platform/database-erp";

import type { CourseProgressRepository } from "./mission.types.js";

const COURSE_ID = "course_tec_erp_v1";
const MODULE_ID_BY_CODE: Readonly<Record<string, string>> = {
  M1: "module_m1",
};

export function createPrismaCourseProgressRepository(): CourseProgressRepository {
  return {
    async getCourseProgress(employeeId, courseCode) {
      const prisma = getPrismaClient();
      const course = await prisma.course.findUnique({ where: { code: courseCode } });
      if (!course) {
        return null;
      }
      const row = await prisma.employeeCourseProgress.findUnique({
        where: {
          employeeId_courseId: { employeeId, courseId: course.id },
        },
      });
      if (!row) {
        return null;
      }
      return {
        employeeId,
        courseCode,
        percentComplete: row.percentComplete,
        status: row.status,
      };
    },

    async upsertCourseProgress(input) {
      const prisma = getPrismaClient();
      const course = await prisma.course.findUnique({ where: { code: input.courseCode } });
      const courseId = course?.id ?? COURSE_ID;
      const row = await prisma.employeeCourseProgress.upsert({
        where: {
          employeeId_courseId: { employeeId: input.employeeId, courseId },
        },
        create: {
          employeeId: input.employeeId,
          courseId,
          percentComplete: input.percentComplete,
          status: input.status,
        },
        update: {
          percentComplete: input.percentComplete,
          status: input.status,
        },
      });
      return {
        employeeId: input.employeeId,
        courseCode: input.courseCode,
        percentComplete: row.percentComplete,
        status: row.status,
      };
    },

    async getModuleProgress(employeeId, moduleCode) {
      const prisma = getPrismaClient();
      const module = await prisma.courseModule.findUnique({ where: { moduleCode } });
      if (!module) {
        return null;
      }
      const row = await prisma.employeeModuleProgress.findUnique({
        where: {
          employeeId_moduleId: { employeeId, moduleId: module.id },
        },
      });
      if (!row) {
        return null;
      }
      return {
        employeeId,
        moduleCode,
        percentComplete: row.percentComplete,
        status: row.status,
      };
    },

    async upsertModuleProgress(input) {
      const prisma = getPrismaClient();
      const moduleId = MODULE_ID_BY_CODE[input.moduleCode] ?? (
        await prisma.courseModule.findUnique({ where: { moduleCode: input.moduleCode } })
      )?.id;

      if (!moduleId) {
        throw new Error(`Module introuvable: ${input.moduleCode}`);
      }

      const row = await prisma.employeeModuleProgress.upsert({
        where: {
          employeeId_moduleId: { employeeId: input.employeeId, moduleId },
        },
        create: {
          employeeId: input.employeeId,
          moduleId,
          percentComplete: input.percentComplete,
          status: input.status,
        },
        update: {
          percentComplete: input.percentComplete,
          status: input.status,
        },
      });

      return {
        employeeId: input.employeeId,
        moduleCode: input.moduleCode,
        percentComplete: row.percentComplete,
        status: row.status,
      };
    },
  };
}
