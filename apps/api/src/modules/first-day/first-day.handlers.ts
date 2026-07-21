import { Result } from "@tec-platform/core";
import {
  CompleteTaskResponseSchema,
  InboxResponseSchema,
  MarkMessageReadResponseSchema,
  TasksResponseSchema,
} from "@tec-platform/contracts";
import type { NextFunction, Request, Response } from "express";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { FirstDayService } from "./first-day.service.js";

export interface FirstDayHandlers {
  getInbox(req: Request, res: Response, next: NextFunction): Promise<void>;
  markMessageRead(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTasks(req: Request, res: Response, next: NextFunction): Promise<void>;
  completeTask(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export function createFirstDayHandlers(service: FirstDayService): FirstDayHandlers {
  return {
    async getInbox(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const inbox = await service.getInbox(employee.id);
        res.status(200).json(InboxResponseSchema.parse(inbox));
      } catch (error) {
        next(error);
      }
    },

    async markMessageRead(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const outcome = await service.markMessageRead(employee.id, req.params.messageKey ?? "");

        if (Result.isFail(outcome)) {
          next(outcome.error);
          return;
        }

        res.status(200).json(MarkMessageReadResponseSchema.parse(outcome.value));
      } catch (error) {
        next(error);
      }
    },

    async getTasks(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const tasks = await service.getTasks(employee.id);
        res.status(200).json(TasksResponseSchema.parse(tasks));
      } catch (error) {
        next(error);
      }
    },

    async completeTask(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const outcome = await service.completeTask(employee.id, req.params.taskKey ?? "");

        if (Result.isFail(outcome)) {
          next(outcome.error);
          return;
        }

        res.status(200).json(CompleteTaskResponseSchema.parse(outcome.value));
      } catch (error) {
        next(error);
      }
    },
  };
}
