import { Router } from "express";
import { z } from "zod";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { ScenarioService } from "./scenario.service.js";

const DraftCreateSchema = z.object({
  missionKey: z.string().min(1),
  draftJson: z.record(z.unknown()),
});

const DraftUpdateSchema = z.object({
  draftJson: z.record(z.unknown()),
});

export function createScenarioAdminRouter(service: ScenarioService): Router {
  const router = Router();

  router.get("/drafts", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      res.status(200).json({ drafts: await service.listDrafts() });
    } catch (error) {
      next(error);
    }
  });

  router.post("/drafts", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = DraftCreateSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Brouillon invalide.");
      }
      const result = await service.createDraft(
        employee.id,
        parsed.data.missionKey,
        parsed.data.draftJson,
      );
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(201).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.put("/drafts/:draftId", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      const parsed = DraftUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Brouillon invalide.");
      }
      const result = await service.updateDraft(req.params.draftId ?? "", parsed.data.draftJson);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.get("/drafts/:draftId/preview", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      const result = await service.preview(req.params.draftId ?? "");
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/drafts/:draftId/publish", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.publish(employee.id, req.params.draftId ?? "");
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(201).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/versions/:versionId/archive", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.archive(employee.id, req.params.versionId ?? "");
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/rollback", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const missionKey = typeof req.body?.missionKey === "string" ? req.body.missionKey : "";
      const versionNumber = Number(req.body?.versionNumber);
      if (!missionKey || !Number.isFinite(versionNumber)) {
        throw DomainError.validation("Rollback invalide.");
      }
      const result = await service.rollback(employee.id, missionKey, versionNumber);
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
