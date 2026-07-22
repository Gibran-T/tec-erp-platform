import { Router } from "express";
import {
  AssessmentDraftRequestSchema,
  AssessmentSubmitRequestSchema,
} from "@tec-platform/contracts";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import {
  extractRunId,
  withEmployeeRunContext,
} from "../pedagogical-run/with-employee-run.js";
import type { AssessmentService } from "./assessment.service.js";

export function createAssessmentMeRouter(service: AssessmentService): Router {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({
        assessments: await withEmployeeRunContext({
          employeeId: employee.id,
          explicitRunId: extractRunId(req),
          forWrite: false,
          fn: () => service.listForEmployee(employee.id),
        }),
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/certificates", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ certificates: await service.listCertificates(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/silver/issue", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.issueSilverIfEligible(employee.id, employee.id);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(201).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:code/attempt", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await withEmployeeRunContext({
        employeeId: employee.id,
        explicitRunId: extractRunId(req),
        forWrite: false,
        fn: () => service.getActiveAttempt(employee.id, req.params.code ?? ""),
      });
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/:code/start", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await withEmployeeRunContext({
        employeeId: employee.id,
        explicitRunId: extractRunId(req),
        forWrite: true,
        fn: () => service.start(employee.id, req.params.code ?? ""),
      });
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(201).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:code/draft", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = AssessmentDraftRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Brouillon d'evaluation invalide.");
      }
      const result = await withEmployeeRunContext({
        employeeId: employee.id,
        explicitRunId: extractRunId(req),
        forWrite: true,
        fn: () => service.saveDraft(employee.id, req.params.code ?? "", parsed.data),
      });
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/:code/submit", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = AssessmentSubmitRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Soumission d'evaluation invalide.");
      }
      const result = await withEmployeeRunContext({
        employeeId: employee.id,
        explicitRunId: extractRunId(req),
        forWrite: true,
        fn: () => service.submit(employee.id, req.params.code ?? "", parsed.data),
      });
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
