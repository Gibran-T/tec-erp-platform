import { getPrismaClient } from "@tec-platform/database-erp";

import {
  getCurrentPedagogicalRun,
  requireCurrentPedagogicalRunId,
} from "../pedagogical-run/run-context.js";
import type { CourseProgressRepository } from "./mission.types.js";

const COURSE_ID = "course_tec_erp_v1";

export function createPrismaCourseProgressRepository(): CourseProgressRepository {
  return {
    async getCourseProgress(employeeId, courseCode) {
      const prisma = getPrismaClient();
      const course = await prisma.course.findUnique({ where: { code: courseCode } });
      if (!course) {
        return null;
      }
      const run = getCurrentPedagogicalRun();
      if (!run) {
        return null;
      }
      const row = await prisma.employeeCourseProgress.findUnique({
        where: {
          employeeId_courseId_pedagogicalCourseRunId: {
            employeeId,
            courseId: course.id,
            pedagogicalCourseRunId: run.id,
          },
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
      const pedagogicalCourseRunId = requireCurrentPedagogicalRunId();
      const row = await prisma.employeeCourseProgress.upsert({
        where: {
          employeeId_courseId_pedagogicalCourseRunId: {
            employeeId: input.employeeId,
            courseId,
            pedagogicalCourseRunId,
          },
        },
        create: {
          employeeId: input.employeeId,
          courseId,
          pedagogicalCourseRunId,
          percentComplete: input.percentComplete,
          status: input.status,
        },
        update: {
          percentComplete: input.percentComplete,
          status: input.status,
        },
      });
      await prisma.pedagogicalCourseRun.update({
        where: { id: pedagogicalCourseRunId },
        data: { completionPercent: input.percentComplete },
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
      const run = getCurrentPedagogicalRun();
      if (!run) {
        return null;
      }
      const row = await prisma.employeeModuleProgress.findUnique({
        where: {
          employeeId_moduleId_pedagogicalCourseRunId: {
            employeeId,
            moduleId: module.id,
            pedagogicalCourseRunId: run.id,
          },
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
      const module = await prisma.courseModule.findUnique({ where: { moduleCode: input.moduleCode } });
      if (!module) {
        throw new Error(`Module introuvable: ${input.moduleCode}`);
      }
      const pedagogicalCourseRunId = requireCurrentPedagogicalRunId();
      const row = await prisma.employeeModuleProgress.upsert({
        where: {
          employeeId_moduleId_pedagogicalCourseRunId: {
            employeeId: input.employeeId,
            moduleId: module.id,
            pedagogicalCourseRunId,
          },
        },
        create: {
          employeeId: input.employeeId,
          moduleId: module.id,
          pedagogicalCourseRunId,
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
