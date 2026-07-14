import { DomainError, Result } from "@tec-platform/core";
import {
  MissionDetailSchema,
  MissionStartResponseSchema,
  MissionSubmitRequestSchema,
  MissionSubmitResponseSchema,
  MissionsResponseSchema,
} from "@tec-platform/contracts";
import type { NextFunction, Request, Response } from "express";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { MissionService } from "./mission.service.js";

export interface MissionHandlers {
  listMissions(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMission(req: Request, res: Response, next: NextFunction): Promise<void>;
  startMission(req: Request, res: Response, next: NextFunction): Promise<void>;
  submitMission(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export function createMissionHandlers(service: MissionService): MissionHandlers {
  return {
    async listMissions(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const missions = await service.listMissions(employee.id);
        res.status(200).json(MissionsResponseSchema.parse(missions));
      } catch (error) {
        next(error);
      }
    },

    async getMission(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const outcome = await service.getMission(employee.id, req.params.missionKey ?? "");

        if (Result.isFail(outcome)) {
          next(outcome.error);
          return;
        }

        res.status(200).json(MissionDetailSchema.parse(outcome.value));
      } catch (error) {
        next(error);
      }
    },

    async startMission(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const outcome = await service.startMission(employee.id, req.params.missionKey ?? "");

        if (Result.isFail(outcome)) {
          next(outcome.error);
          return;
        }

        res
          .status(outcome.value.created ? 201 : 200)
          .json(MissionStartResponseSchema.parse(outcome.value));
      } catch (error) {
        next(error);
      }
    },

    async submitMission(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const parsed = MissionSubmitRequestSchema.safeParse(req.body);

        if (!parsed.success) {
          throw DomainError.validation("La soumission de mission est invalide.");
        }

        const outcome = await service.submitMission(
          employee.id,
          req.params.missionKey ?? "",
          parsed.data,
        );

        if (Result.isFail(outcome)) {
          next(outcome.error);
          return;
        }

        res.status(200).json(MissionSubmitResponseSchema.parse(outcome.value));
      } catch (error) {
        next(error);
      }
    },
  };
}
