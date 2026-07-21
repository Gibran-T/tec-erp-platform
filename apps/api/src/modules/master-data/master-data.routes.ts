import { Router } from "express";
import { z } from "zod";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { MasterDataService } from "./master-data.service.js";

const MasterDataUpsertSchema = z.object({
  entityType: z.string().min(1),
  businessKey: z.string().min(1),
  payloadJson: z.record(z.unknown()),
  status: z.string().min(1).optional(),
});

/**
 * Wave 2 M2 — employee-scoped master data routes mounted under /api/v1/me/master-data.
 */
export function createMasterDataMeRouter(service: MasterDataService): Router {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const entityType =
        typeof req.query.entityType === "string" ? req.query.entityType : undefined;
      const result = await service.list(employee.id, { entityType });
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = MasterDataUpsertSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Corps master data invalide.");
      }
      const result = await service.upsert(employee.id, parsed.data);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json({ record: result.value });
    } catch (error) {
      next(error);
    }
  });

  router.post("/validate", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      const parsed = MasterDataUpsertSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Corps master data invalide.");
      }
      res.status(200).json(service.validate(parsed.data));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
