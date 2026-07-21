import { Router } from "express";
import { z } from "zod";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { CertificationService } from "./certification.service.js";

const IssueGoldSchema = z.object({
  studentId: z.string().min(1),
  reason: z.string().min(5),
  confirm: z.literal(true),
});

const RevokeSchema = z.object({
  reason: z.string().min(5),
  confirm: z.literal(true),
});

export function createCertificationMeRouter(service: CertificationService): Router {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ certificates: await service.listMyCertificates(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export function createCertificationProfessorRouter(service: CertificationService): Router {
  const router = Router();

  router.post("/certificates/gold/issue", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = IssueGoldSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Emission Gold invalide — confirmation requise.");
      }
      const result = await service.issueGold(employee.id, parsed.data.studentId, parsed.data.reason);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(201).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/certificates/:certificateNumber/revoke-gold", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = RevokeSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Revocation Gold invalide.");
      }
      const result = await service.revokeGold(
        employee.id,
        req.params.certificateNumber ?? "",
        parsed.data.reason,
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

export function createCertificationPublicRouter(service: CertificationService): Router {
  const router = Router();

  router.get("/certificates/verify/:tokenOrNumber", async (req, res, next) => {
    try {
      const payload = await service.verifyPublic(req.params.tokenOrNumber ?? "");
      if (!payload.found) {
        res.status(404).json(payload);
        return;
      }
      res.status(200).json(payload);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
