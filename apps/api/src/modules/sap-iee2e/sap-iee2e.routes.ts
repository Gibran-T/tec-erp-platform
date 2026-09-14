import {
  UpdateSapIee2eCalendarRequestSchema,
  UpdateSapIee2eProfessorNoteRequestSchema,
  UpdateSapIee2eSelfReportRequestSchema,
  UpdateSapSuiteProgramAssignmentRequestSchema,
  UpdateSapSuiteStageReviewRequestSchema,
} from "@tec-platform/contracts";
import { DomainError, Result } from "@tec-platform/core";
import { Router } from "express";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { SapIee2eService } from "./sap-iee2e.service.js";

export function createSapIee2eMeRouter(service: SapIee2eService): Router {
  const router = Router();

  router.get("/sap-iee2e/program", (_req, res) => {
    res.status(200).json(service.getProgramCatalog());
  });

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
        throw DomainError.validation("Déclaration institutionnelle SAP invalide.");
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

  router.get("/sap-iee2e/program", (_req, res) => {
    res.status(200).json(service.getProgramCatalog());
  });

  router.get("/sap-iee2e/cohort", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json(await service.getProfessorCohort(employee.id));
    } catch (error) {
      next(error);
    }
  });

  router.get("/sap-iee2e/students/:employeeId", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.getStudentAccompaniment(employee.id, req.params.employeeId);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.put("/sap-iee2e/students/:employeeId/notes", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = UpdateSapIee2eProfessorNoteRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Observation professeur invalide.");
      }
      const result = await service.saveProfessorNote(employee.id, req.params.employeeId, parsed.data);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.put("/sap-iee2e/students/:employeeId/stages", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = UpdateSapSuiteStageReviewRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Révision d’étape invalide.");
      }
      const result = await service.saveProfessorStageReview(
        employee.id,
        req.params.employeeId,
        parsed.data,
      );
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.get("/sap-iee2e/assignments", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json(await service.listProgramAssignments(employee.id));
    } catch (error) {
      next(error);
    }
  });

  router.put("/sap-iee2e/assignments", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = UpdateSapSuiteProgramAssignmentRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Association de cohorte invalide.");
      }
      const result = await service.saveProgramAssignment(employee.id, parsed.data);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
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
