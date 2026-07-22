import { Router, type Request, type Response, type NextFunction } from "express";

import {
  CreatePedagogicalCourseRunRequestSchema,
  CreateProfessorInterventionRequestSchema,
  CreateStudentMissionReflectionRequestSchema,
  TransitionPedagogicalCourseRunRequestSchema,
  UpdateStudentMissionReflectionRequestSchema,
} from "@tec-platform/contracts";

import { getPrismaClient } from "@tec-platform/database-erp";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { PedagogicalRunService } from "./pedagogical-run.service.js";

async function resolveActorCompanyId(actorId: string): Promise<string> {
  const prisma = getPrismaClient();
  const employee = await prisma.employee.findUnique({ where: { id: actorId } });
  if (!employee) {
    throw new Error("Actor introuvable");
  }
  return employee.companyId;
}

function sendResult(res: Response, result: { ok: boolean; value?: unknown; error?: { code: string; message: string } }): void {
  if (result.ok) {
    res.status(200).json(result.value);
    return;
  }
  const status =
    result.error?.code === "NOT_FOUND"
      ? 404
      : result.error?.code === "FORBIDDEN"
        ? 403
        : result.error?.code === "CONFLICT"
          ? 409
          : 400;
  res.status(status).json({
    error: {
      code: result.error?.code ?? "VALIDATION",
      message: result.error?.message ?? "Erreur",
      requestId: res.getHeader("x-request-id"),
    },
  });
}

export function createPedagogicalRunMeRouter(service: PedagogicalRunService): Router {
  const router = Router();
  router.get("/pedagogical-course-runs", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.listForEmployee(employee.id);
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/pedagogical-course-runs/:runId/reflections", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const result = await service.listReflections({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        runId: req.params.runId,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/pedagogical-course-runs/:runId/reflections/:missionKey", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const result = await service.getReflection({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        runId: req.params.runId,
        missionKey: req.params.missionKey,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/pedagogical-course-runs/:runId/reflections", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const parsed = CreateStudentMissionReflectionRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: "VALIDATION", message: "Reflexion invalide." } });
        return;
      }
      const { missionKey, ...body } = parsed.data;
      const result = await service.upsertReflection({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        runId: req.params.runId,
        missionKey,
        body,
        isUpdate: false,
      });
      if (result.ok) {
        res.status(201).json(result.value);
        return;
      }
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.put("/pedagogical-course-runs/:runId/reflections/:missionKey", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const parsed = UpdateStudentMissionReflectionRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: "VALIDATION", message: "Reflexion invalide." } });
        return;
      }
      const result = await service.upsertReflection({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        runId: req.params.runId,
        missionKey: req.params.missionKey,
        body: parsed.data,
        isUpdate: true,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export function createPedagogicalRunProfessorRouter(service: PedagogicalRunService): Router {
  const router = Router();

  router.get("/pedagogical-course-runs", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const companyId = await resolveActorCompanyId(actor.id);
      const result = await service.listForCompany(companyId, {
        employeeId: typeof req.query.employeeId === "string" ? req.query.employeeId : undefined,
        cohortId: typeof req.query.cohortId === "string" ? req.query.cohortId : undefined,
        status: typeof req.query.status === "string" ? req.query.status : undefined,
        runType: typeof req.query.runType === "string" ? req.query.runType : undefined,
        professorId: actor.id,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/pedagogical-course-runs", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const parsed = CreatePedagogicalCourseRunRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: "VALIDATION", message: "Requête invalide." } });
        return;
      }
      const result = await service.createRun({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        request: parsed.data,
      });
      if (result.ok) {
        res.status(201).json(result.value);
        return;
      }
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/pedagogical-course-runs/:runId/transition", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const parsed = TransitionPedagogicalCourseRunRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: "VALIDATION", message: "Transition invalide." } });
        return;
      }
      const result = await service.transition({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        runId: req.params.runId,
        request: parsed.data,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/pedagogical-course-runs/compare", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const leftRunId = typeof req.query.leftRunId === "string" ? req.query.leftRunId : "";
      const rightRunId = typeof req.query.rightRunId === "string" ? req.query.rightRunId : "";
      const result = await service.compare({
        actorCompanyId: await resolveActorCompanyId(actor.id),
        leftRunId,
        rightRunId,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/pedagogical-course-runs/:runId/interventions", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const parsed = CreateProfessorInterventionRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: "VALIDATION", message: "Intervention invalide." } });
        return;
      }
      const result = await service.createIntervention({
        professorId: actor.id,
        professorCompanyId: await resolveActorCompanyId(actor.id),
        runId: req.params.runId,
        body: parsed.data,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/pedagogical-course-runs/:runId/reflections", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const result = await service.listReflections({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        runId: req.params.runId,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export function createPedagogicalRunAdminRouter(service: PedagogicalRunService): Router {
  const router = Router();

  router.get("/pedagogical-course-runs", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const companyId = await resolveActorCompanyId(actor.id);
      const result = await service.listForCompany(companyId, {
        employeeId: typeof req.query.employeeId === "string" ? req.query.employeeId : undefined,
        cohortId: typeof req.query.cohortId === "string" ? req.query.cohortId : undefined,
        professorId: typeof req.query.professorId === "string" ? req.query.professorId : undefined,
        status: typeof req.query.status === "string" ? req.query.status : undefined,
        runType: typeof req.query.runType === "string" ? req.query.runType : undefined,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/pedagogical-course-runs", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const parsed = CreatePedagogicalCourseRunRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: "VALIDATION", message: "Requête invalide." } });
        return;
      }
      const result = await service.createRun({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        request: parsed.data,
      });
      if (result.ok) {
        res.status(201).json(result.value);
        return;
      }
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/pedagogical-course-runs/:runId/transition", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const parsed = TransitionPedagogicalCourseRunRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: { code: "VALIDATION", message: "Transition invalide." } });
        return;
      }
      const result = await service.transition({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        runId: req.params.runId,
        request: parsed.data,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/pedagogical-course-runs/compare", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const result = await service.compare({
        actorCompanyId: await resolveActorCompanyId(actor.id),
        leftRunId: String(req.query.leftRunId ?? ""),
        rightRunId: String(req.query.rightRunId ?? ""),
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  router.get("/pedagogical-course-runs/metrics/unique-students", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const count = await service.countDistinctStudentsForInstitutionalMetric(
        await resolveActorCompanyId(actor.id),
      );
      res.status(200).json({ mode: "OFFICIAL_COHORT_RESULT", studentCount: count });
    } catch (error) {
      next(error);
    }
  });

  router.get("/pedagogical-course-runs/:runId/reflections", async (req, res, next) => {
    try {
      const actor = getAuthenticatedEmployee(req);
      const result = await service.listReflections({
        actorId: actor.id,
        actorRole: actor.role,
        actorCompanyId: await resolveActorCompanyId(actor.id),
        runId: req.params.runId,
      });
      sendResult(res, result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
