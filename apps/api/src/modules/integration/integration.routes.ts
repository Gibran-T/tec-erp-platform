import { Router } from "express";
import { z } from "zod";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { IntegrationService } from "./integration.service.js";

const RunSchema = z.object({
  connectionId: z.string().min(1),
  idempotencyKey: z.string().min(1).optional(),
  retry: z.boolean().optional(),
});

const ConnectionSchema = z.object({
  adapterKey: z.string().min(1),
  name: z.string().min(1),
  configJson: z.record(z.unknown()).optional(),
  secretRef: z.string().optional(),
});

export function createIntegrationAdminRouter(service: IntegrationService): Router {
  const router = Router();

  router.get("/connections", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ connections: await service.listConnectionsForEmployee(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/connections", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = ConnectionSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Connexion invalide.");
      }
      const created = await service.createConnectionForEmployee(employee.id, parsed.data);
      res.status(201).json({ connection: created });
    } catch (error) {
      next(error);
    }
  });

  router.post("/run", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      const parsed = RunSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Execution integration invalide.");
      }
      const idempotencyKey =
        parsed.data.idempotencyKey ?? `run-${parsed.data.connectionId}-${Date.now()}`;
      const result = await service.runJob(
        parsed.data.connectionId,
        idempotencyKey,
        parsed.data.retry ?? false,
      );
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.get("/connections/:connectionId/runs", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      res.status(200).json({ runs: await service.listRuns(req.params.connectionId ?? "") });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
