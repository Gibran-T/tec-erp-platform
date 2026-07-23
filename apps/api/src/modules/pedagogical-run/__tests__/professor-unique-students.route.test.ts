import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import express from "express";

import { createPedagogicalRunProfessorRouter } from "../pedagogical-run.routes.js";

const countDistinctStudentsForInstitutionalMetric = vi.fn();

vi.mock("@tec-platform/database-erp", () => ({
  getPrismaClient: () => ({
    employee: {
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => {
        if (where.id === "prof_a") {
          return { id: "prof_a", companyId: "co_a" };
        }
        if (where.id === "prof_b") {
          return { id: "prof_b", companyId: "co_b" };
        }
        return null;
      }),
    },
  }),
}));

function buildApp(actorId: string) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as { employee?: { id: string; role: string } }).employee = {
      id: actorId,
      role: "PROFESSOR",
    };
    next();
  });
  app.use(
    "/api/v1/professor",
    createPedagogicalRunProfessorRouter({
      countDistinctStudentsForInstitutionalMetric,
    } as never),
  );
  return app;
}

describe("professor unique-students metric alias", () => {
  beforeEach(() => {
    countDistinctStudentsForInstitutionalMetric.mockReset();
  });

  it("returns OFFICIAL_COHORT_RESULT for professor company scope", async () => {
    countDistinctStudentsForInstitutionalMetric.mockResolvedValue(2);
    const response = await request(buildApp("prof_a"))
      .get("/api/v1/professor/pedagogical-course-runs/metrics/unique-students")
      .expect(200);

    expect(response.body).toEqual({ mode: "OFFICIAL_COHORT_RESULT", studentCount: 2 });
    expect(countDistinctStudentsForInstitutionalMetric).toHaveBeenCalledWith("co_a");
  });

  it("scopes the metric to the professor company", async () => {
    countDistinctStudentsForInstitutionalMetric.mockResolvedValue(0);
    await request(buildApp("prof_b"))
      .get("/api/v1/professor/pedagogical-course-runs/metrics/unique-students")
      .expect(200);

    expect(countDistinctStudentsForInstitutionalMetric).toHaveBeenCalledWith("co_b");
  });
});
