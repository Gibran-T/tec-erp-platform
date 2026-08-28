import {
  UpdateSapIee2eCalendarRequestSchema,
  UpdateSapIee2eSelfReportRequestSchema,
} from "@tec-platform/contracts";
import { DomainError, Result } from "@tec-platform/core";
import { Router } from "express";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { SapIee2eService } from "./sap-iee2e.service.js";

export function createSapIee2eMeRouter(service: SapIee2eService): Router {
  const router = Router();

  router.get("/sap-iee2e-self-report", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json(await service.getMyReport(employee.id));
    } catch (error) {
      next(error);
    }
  });

  router.put("/sap-iee2e-self-report", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = UpdateSapIee2eSelfReportRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Déclaration IEE2E invalide.");
      }
      const result = await service.saveMyReport(employee.id, parsed.data);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export function createSapIee2eProfessorRouter(service: SapIee2eService): Router {
  const router = Router();

  router.get("/sap-iee2e/cohort", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json(await service.getProfessorCohort(employee.id));
    } catch (error) {
      next(error);
    }
  });

  router.put("/sap-iee2e/calendar", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = UpdateSapIee2eCalendarRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Date de séance 1 invalide.");
      }
      const result = await service.saveProfessorCalendar(employee.id, parsed.data);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
