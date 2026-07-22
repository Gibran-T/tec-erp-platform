import { Router } from "express";
import { z } from "zod";
import { EmployeeRoleSchema } from "@tec-platform/contracts";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { AdminService } from "./admin.service.js";

const CompanySchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
});

const EnrollSchema = z.object({
  cohortId: z.string().min(1),
  employeeId: z.string().min(1),
});

const CreateEmployeeSchema = z.object({
  employeeNumber: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1),
  role: EmployeeRoleSchema,
  password: z.string().min(8),
});

const PatchRoleSchema = z.object({
  role: EmployeeRoleSchema,
});

const CreateCohortSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
});

const ProfessorAssignSchema = z.object({
  employeeId: z.string().min(1),
});

const AiConfigSchema = z.object({
  aiEnabled: z.boolean(),
});

const FeatureFlagSchema = z.object({
  enabled: z.boolean(),
  companyId: z.string().optional(),
});

export function createAdminRouter(service: AdminService): Router {
  const router = Router();

  router.get("/companies", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      res.status(200).json({ companies: await service.listCompanies() });
    } catch (error) {
      next(error);
    }
  });

  router.post("/companies", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = CompanySchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Entreprise invalide.");
      }
      const created = await service.createCompany(employee.id, parsed.data);
      res.status(201).json({ company: created });
    } catch (error) {
      next(error);
    }
  });

  router.get("/cohorts", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      const companyId = typeof req.query.companyId === "string" ? req.query.companyId : undefined;
      res.status(200).json({ cohorts: await service.listCohorts(companyId) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/cohorts", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = CreateCohortSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Cohorte invalide.");
      }
      const result = await service.createCohort(employee.id, parsed.data);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(201).json({ cohort: result.value });
    } catch (error) {
      next(error);
    }
  });

  router.post("/cohorts/enroll", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = EnrollSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Inscription cohorte invalide.");
      }
      const result = await service.enrollStudent(
        employee.id,
        parsed.data.cohortId,
        parsed.data.employeeId,
      );
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/cohorts/:cohortId/assign-professor", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = ProfessorAssignSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Affectation professeur invalide.");
      }
      const result = await service.assignProfessor(
        employee.id,
        req.params.cohortId ?? "",
        parsed.data.employeeId,
      );
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.post("/cohorts/:cohortId/remove-professor", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = ProfessorAssignSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Retrait professeur invalide.");
      }
      const result = await service.removeProfessor(
        employee.id,
        req.params.cohortId ?? "",
        parsed.data.employeeId,
      );
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.get("/employees", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ employees: await service.listCompanyEmployees(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/employees", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = CreateEmployeeSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Création d'employé invalide.");
      }
      const result = await service.createEmployee(employee.id, parsed.data);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(201).json({ employee: result.value });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/employees/:employeeId/role", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = PatchRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Rôle invalide.");
      }
      const result = await service.updateEmployeeRole(
        employee.id,
        req.params.employeeId ?? "",
        parsed.data.role,
      );
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json({ employee: result.value });
    } catch (error) {
      next(error);
    }
  });

  router.get("/configuration", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json(await service.getConfiguration(employee.id));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/configuration", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = AiConfigSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Configuration invalide.");
      }
      res.status(200).json(await service.updateAiEnabled(employee.id, parsed.data.aiEnabled));
    } catch (error) {
      next(error);
    }
  });

  router.get("/feature-flags", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      const companyId = typeof req.query.companyId === "string" ? req.query.companyId : undefined;
      res.status(200).json({ flags: await service.listFeatureFlags(companyId) });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/feature-flags/:key", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = FeatureFlagSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Indicateur fonctionnel invalide.");
      }
      res.status(200).json(
        await service.updateFeatureFlag(
          employee.id,
          req.params.key ?? "",
          parsed.data.enabled,
          parsed.data.companyId,
        ),
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/system-status", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      res.status(200).json(await service.systemStatus());
    } catch (error) {
      next(error);
    }
  });

  router.get("/assessments", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ assessments: await service.listAssessmentBanks(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  router.get("/assessments/:code", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const includeAnswerKey =
        req.query.includeAnswerKey === "1" || req.query.includeAnswerKey === "true";
      res.status(200).json(
        await service.getAssessmentBank(employee.id, req.params.code ?? "", { includeAnswerKey }),
      );
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

  return router;
}
