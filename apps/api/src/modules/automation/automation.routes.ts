import { Router } from "express";
import { z } from "zod";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { AutomationService } from "./automation.service.js";

const RunSchema = z.object({
  ruleKey: z.string().min(1),
  companyId: z.string().optional(),
  employeeId: z.string().optional(),
});

export function createAutomationAdminRouter(service: AutomationService): Router {
  const router = Router();

  router.get("/rules", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      res.status(200).json({ rules: service.listPredefinedRules() });
    } catch (error) {
      next(error);
    }
  });

  router.get("/executions", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      const ruleKey = typeof req.query.ruleKey === "string" ? req.query.ruleKey : undefined;
      res.status(200).json({ executions: await service.listExecutions(ruleKey) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/run", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = RunSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Automatisation invalide.");
      }
      const result = await service.execute(employee.id, parsed.data.ruleKey, {
        companyId: parsed.data.companyId,
        employeeId: parsed.data.employeeId,
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
