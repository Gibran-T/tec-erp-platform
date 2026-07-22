import {
  CourseOverviewResponseSchema,
  ModuleDetailResponseSchema,
} from "@tec-platform/contracts";
import { Result } from "@tec-platform/core";
import type { NextFunction, Request, Response } from "express";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import {
  extractRunId,
  withEmployeeRunContext,
} from "../pedagogical-run/with-employee-run.js";
import type { CourseService } from "./course.service.js";

export interface CourseHandlers {
  getCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getModule(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export function createCourseHandlers(service: CourseService): CourseHandlers {
  return {
    async getCourse(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const overview = await withEmployeeRunContext({
          employeeId: employee.id,
          explicitRunId: extractRunId(req),
          forWrite: false,
          fn: () => service.getCourseOverview(employee.id),
        });
        res.status(200).json(CourseOverviewResponseSchema.parse(overview));
      } catch (error) {
        next(error);
      }
    },

    async getModule(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const outcome = await withEmployeeRunContext({
          employeeId: employee.id,
          explicitRunId: extractRunId(req),
          forWrite: false,
          fn: () => service.getModule(employee.id, req.params.moduleCode ?? ""),
        });

        if (Result.isFail(outcome)) {
          next(outcome.error);
          return;
        }

        res.status(200).json(ModuleDetailResponseSchema.parse(outcome.value));
      } catch (error) {
        next(error);
      }
    },
  };
}
