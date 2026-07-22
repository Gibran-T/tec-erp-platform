import { beforeEach, describe, expect, it, vi } from "vitest";
import { Result } from "@tec-platform/core";

import { createAnalyticsService } from "../analytics.service.js";

describe("professor analytics service", () => {
  const employeeFindUnique = vi.fn();
  const cohortMembershipFindMany = vi.fn();
  const courseModuleFindMany = vi.fn();

  const client = {
    employee: { findUnique: employeeFindUnique },
    cohortMembership: { findMany: cohortMembershipFindMany },
    courseModule: { findMany: courseModuleFindMany },
  };

  beforeEach(() => {
    employeeFindUnique.mockReset();
    cohortMembershipFindMany.mockReset();
    courseModuleFindMany.mockReset();
  });

  it("returns empty heatmap rows when the professor has no assigned cohorts", async () => {
    employeeFindUnique.mockResolvedValue({
      id: "emp_prof",
      companyId: "co_nord",
    });
    cohortMembershipFindMany.mockResolvedValueOnce([]);

    const service = createAnalyticsService(client as never);
    const result = await service.getProfessorHeatmap("emp_prof");

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.value.rows).toEqual([]);
    }
  });

  it("aggregates completed missions by module code for assigned cohort students", async () => {
    employeeFindUnique.mockResolvedValue({
      id: "emp_prof",
      companyId: "co_nord",
    });
    cohortMembershipFindMany
      .mockResolvedValueOnce([{ cohortId: "cohort_1" }])
      .mockResolvedValueOnce([
        {
          employee: {
            id: "emp_stu",
            employeeNumber: "#QA-STU-A",
            displayName: "Etudiant A",
            v1MissionAttempts: [
              { missionDefinition: { missionKey: "m1-m01-decouvrir-entreprise" } },
              { missionDefinition: { missionKey: "m2-m01-structurer-organisation" } },
              { missionDefinition: { missionKey: "m2-m02-creer-donnees-reference" } },
            ],
          },
        },
      ]);

    const service = createAnalyticsService(client as never);
    const result = await service.getProfessorHeatmap("emp_prof");

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.value.rows).toEqual([
        {
          studentId: "emp_stu",
          employeeNumber: "#QA-STU-A",
          displayName: "Etudiant A",
          completedMissions: 3,
          moduleCounts: { M1: 1, M2: 2 },
        },
      ]);
    }
  });

  it("returns competencies ordered by module sequence with coverage percent", async () => {
    employeeFindUnique.mockResolvedValue({
      id: "emp_prof",
      companyId: "co_nord",
    });
    cohortMembershipFindMany
      .mockResolvedValueOnce([{ cohortId: "cohort_1" }])
      .mockResolvedValueOnce([
        {
          employee: {
            id: "emp_stu",
            employeeNumber: "#QA-STU-A",
            displayName: "Etudiant A",
            v1MissionAttempts: [
              { missionDefinition: { missionKey: "m1-m01-decouvrir-entreprise" } },
            ],
          },
        },
      ]);
    courseModuleFindMany.mockResolvedValue([
      {
        moduleCode: "M1",
        title: "Module 1",
        missions: [{ id: "a" }, { id: "b" }, { id: "c" }],
      },
      {
        moduleCode: "M2",
        title: "Module 2",
        missions: [{ id: "d" }, { id: "e" }, { id: "f" }],
      },
    ]);

    const service = createAnalyticsService(client as never);
    const result = await service.getProfessorCompetencies("emp_prof");

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.value.competencies.map((item) => item.moduleCode)).toEqual(["M1", "M2"]);
      expect(result.value.competencies[0]).toMatchObject({
        moduleCode: "M1",
        missionCount: 3,
        coveragePercent: 33,
      });
      expect(result.value.competencies[1]).toMatchObject({
        moduleCode: "M2",
        coveragePercent: 0,
      });
    }
  });
});
