import { Router } from "express";
import {
  ProfessorOverrideRequestSchema,
  ProfessorRevokeCertificateRequestSchema,
} from "@tec-platform/contracts";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { ProfessorService } from "./professor.service.js";

export function createProfessorRouter(service: ProfessorService): Router {
  const router = Router();

  router.get("/cohorts", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ cohorts: await service.listCohorts(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  router.get("/students", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ students: await service.listStudents(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  router.get("/students/:studentId", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.getStudentDetail(employee.id, req.params.studentId ?? "");
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
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

  router.get("/audit", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ events: await service.listAuditEvents(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  router.get("/export.csv", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const csv = await service.exportCsv(employee.id);
      res.status(200).type("text/csv").send(csv);
    } catch (error) {
      next(error);
    }
  });

  router.post("/students/:studentId/override", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = ProfessorOverrideRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Requete professeur invalide.");
      }
      const result = await service.applyOverride(
        employee.id,
        req.params.studentId ?? "",
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

  router.post("/certificates/:certificateNumber/revoke", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = ProfessorRevokeCertificateRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Revocation invalide — raison et confirmation requises.");
      }
      const result = await service.revokeCertificate(
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
