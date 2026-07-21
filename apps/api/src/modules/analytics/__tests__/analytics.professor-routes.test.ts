import express, { type NextFunction, type Request, type Response } from "express";
import request from "supertest";
import { DomainError, Result } from "@tec-platform/core";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AuthenticatedRequest } from "../../../middleware/require-employee.js";
import { requireProfessor } from "../../../middleware/require-professor.js";
import { createErrorHandler } from "../../../middleware/error-handler.js";
import { createAnalyticsProfessorRouter } from "../analytics.routes.js";
import type { AnalyticsService } from "../analytics.service.js";

const silentLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

function attachEmployee(
  employee: AuthenticatedRequest["employee"],
): (req: Request, _res: Response, next: NextFunction) => void {
  return (req, _res, next) => {
    (req as AuthenticatedRequest).employee = employee;
    next();
  };
}

describe("professor analytics routes", () => {
  const getProfessorHeatmap = vi.fn();
  const getProfessorCompetencies = vi.fn();

  const service = {
    getProfessorHeatmap,
    getProfessorCompetencies,
  } as unknown as AnalyticsService;

  const professor = {
    id: "emp_prof",
    employeeNumber: "#QA-PROF",
    email: "professor.qa@nordhabitat.ca",
    displayName: "Professeur QA",
    role: "PROFESSOR" as const,
    companyName: "NordHabitat",
  };

  const student = {
    ...professor,
    id: "emp_student",
    employeeNumber: "#QA-STU",
    email: "student.qa@nordhabitat.ca",
    displayName: "Etudiant QA",
    role: "JR_BUSINESS_ANALYST" as const,
  };

  beforeEach(() => {
    getProfessorHeatmap.mockReset();
    getProfessorCompetencies.mockReset();
    getProfessorHeatmap.mockResolvedValue(Result.ok({ rows: [] }));
    getProfessorCompetencies.mockResolvedValue(
      Result.ok({
        competencies: [
          {
            moduleCode: "M1",
            title: "Module 1",
            missionCount: 3,
            coveragePercent: 0,
          },
        ],
      }),
    );
  });

  function createApp(employee: AuthenticatedRequest["employee"] | null) {
    const app = express();
    app.use(express.json());
    if (employee) {
      app.use(attachEmployee(employee));
      app.use(requireProfessor);
    } else {
      app.use((_req, _res, next) => {
        next(DomainError.unauthorized("Jeton d'acces manquant ou invalide."));
      });
    }
    app.use(createAnalyticsProfessorRouter(service));
    app.use(createErrorHandler(silentLogger));
    return app;
  }

  it("returns 200 heatmap for an authenticated professor with empty cohort rows", async () => {
    const response = await request(createApp(professor))
      .get("/analytics/heatmap")
      .expect(200);

    expect(response.body).toEqual({ rows: [] });
    expect(getProfessorHeatmap).toHaveBeenCalledWith("emp_prof");
  });

  it("returns 200 competencies for an authenticated professor with deterministic module ordering payload", async () => {
    getProfessorCompetencies.mockResolvedValue(
      Result.ok({
        competencies: [
          { moduleCode: "M1", title: "A", missionCount: 3, coveragePercent: 10 },
          { moduleCode: "M2", title: "B", missionCount: 3, coveragePercent: 20 },
        ],
      }),
    );

    const response = await request(createApp(professor))
      .get("/analytics/competencies")
      .expect(200);

    expect(response.body.competencies).toHaveLength(2);
    expect(response.body.competencies[0]?.moduleCode).toBe("M1");
    expect(response.body.competencies[1]?.moduleCode).toBe("M2");
    expect(getProfessorCompetencies).toHaveBeenCalledWith("emp_prof");
  });

  it("rejects student access to heatmap and competencies", async () => {
    await request(createApp(student)).get("/analytics/heatmap").expect(403);
    await request(createApp(student)).get("/analytics/competencies").expect(403);
    expect(getProfessorHeatmap).not.toHaveBeenCalled();
    expect(getProfessorCompetencies).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated access", async () => {
    await request(createApp(null)).get("/analytics/heatmap").expect(401);
    await request(createApp(null)).get("/analytics/competencies").expect(401);
  });

  it("rejects cross-company service failures as forbidden", async () => {
    getProfessorHeatmap.mockResolvedValue(
      Result.fail(DomainError.forbidden("Acces entreprise non autorise.")),
    );

    const response = await request(createApp(professor))
      .get("/analytics/heatmap")
      .expect(403);

    expect(response.body.error.code).toBe("FORBIDDEN");
  });
});
