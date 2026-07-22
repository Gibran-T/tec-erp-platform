import { Router } from "express";
import { z } from "zod";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import {
  extractRunId,
  withEmployeeRunContext,
} from "../pedagogical-run/with-employee-run.js";
import type { CapstoneService } from "./capstone.service.js";

const SubmitSchema = z.object({
  diagnose: z.string().min(1),
  prioritize: z.string().min(1),
  execute: z.string().min(1),
  analyze: z.string().min(1),
  recommend: z.string().min(1),
  executiveSummary: z.string().min(1),
});

const ReviewSchema = z.object({
  approved: z.boolean(),
  notes: z.string().optional(),
});

export function createCapstoneMeRouter(service: CapstoneService): Router {
  const router = Router();

  router.get("/submission", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const payload = await withEmployeeRunContext({
        employeeId: employee.id,
        explicitRunId: extractRunId(req),
        forWrite: false,
        fn: () => service.getSubmission(employee.id),
      });
      res.status(200).json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.post("/submission", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = SubmitSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Dossier capstone invalide.");
      }
      const result = await withEmployeeRunContext({
        employeeId: employee.id,
        explicitRunId: extractRunId(req),
        forWrite: true,
        fn: () => service.submit(employee.id, parsed.data),
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

export function createCapstoneProfessorRouter(service: CapstoneService): Router {
  const router = Router();

  router.get("/capstone/submissions", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ submissions: await service.listForProfessor(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/capstone/submissions/:submissionId/review", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = ReviewSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Revue capstone invalide.");
      }
      const result = await service.review(
        employee.id,
        req.params.submissionId ?? "",
        parsed.data.approved,
        parsed.data.notes,
      );
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
