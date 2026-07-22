import { beforeEach, describe, expect, it, vi } from "vitest";
import { Result } from "@tec-platform/core";

import { createAnalyticsService } from "../analytics.service.js";

describe("professor analytics service", () => {
  const employeeFindUnique = vi.fn();
  const cohortMembershipFindMany = vi.fn();
  const courseModuleFindMany = vi.fn();
  const missionAttemptFindMany = vi.fn();
  const pedagogicalCourseRunFindMany = vi.fn();

  const client = {
    employee: { findUnique: employeeFindUnique },
    cohortMembership: { findMany: cohortMembershipFindMany },
    courseModule: { findMany: courseModuleFindMany },
    missionAttempt: { findMany: missionAttemptFindMany },
    pedagogicalCourseRun: { findMany: pedagogicalCourseRunFindMany },
  };

  beforeEach(() => {
    employeeFindUnique.mockReset();
    cohortMembershipFindMany.mockReset();
    courseModuleFindMany.mockReset();
    missionAttemptFindMany.mockReset();
    pedagogicalCourseRunFindMany.mockReset();
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
      expect(result.value.enrolledStudentCount).toBe(0);
      expect(result.value.mode).toBe("OFFICIAL_COHORT_RESULT");
    }
  });

  it("aggregates completed missions by module for one official run per student", async () => {
    employeeFindUnique.mockResolvedValue({
      id: "emp_prof",
      companyId: "co_nord",
    });
    cohortMembershipFindMany
      .mockResolvedValueOnce([{ cohortId: "cohort_1" }])
      .mockResolvedValueOnce([
        {
          employeeId: "emp_stu",
          employee: {
            id: "emp_stu",
            employeeNumber: "#QA-STU-A",
            displayName: "Etudiant A",
          },
        },
      ]);
    pedagogicalCourseRunFindMany.mockResolvedValue([
      {
        id: "run1",
        employeeId: "emp_stu",
        runSequence: 1,
        runType: "AUTONOMOUS",
        status: "COMPLETED",
        runCode: "A-RUN1",
      },
      {
        id: "run2",
        employeeId: "emp_stu",
        runSequence: 2,
        runType: "INSTRUCTOR_LED",
        status: "ACTIVE",
        runCode: "A-RUN2",
      },
    ]);
    // resolveOfficialRunIdForEmployee uses getPrismaClient internally — heatmap uses
    // resolveRunIdsForAnalytics which also uses getPrismaClient. For unit test we mock
    // missionAttempt after official resolution; when DB client is the mock passed in,
    // resolveRunIdsForAnalytics still uses real getPrismaClient. To keep this unit test
    // hermetic, ALL_RUNS mode avoids official resolver DB dependency.
    missionAttemptFindMany.mockResolvedValue([
      { missionDefinition: { missionKey: "m1-m01-decouvrir-entreprise" } },
      { missionDefinition: { missionKey: "m2-m01-structurer-organisation" } },
      { missionDefinition: { missionKey: "m2-m02-creer-donnees-reference" } },
    ]);

    const service = createAnalyticsService(client as never);
    const result = await service.getProfessorHeatmap("emp_prof", {
      analyticsMode: "ALL_RUNS",
    });

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.value.enrolledStudentCount).toBe(1);
      expect(result.value.rows).toEqual([
        {
          studentId: "emp_stu",
          employeeNumber: "#QA-STU-A",
          displayName: "Etudiant A",
          completedMissions: 3,
          moduleCounts: { M1: 1, M2: 2 },
          curriculumVersion: "V1",
          officialRunCode: "A-RUN1",
          runCount: 2,
          note: "Curriculum V1 historique — ne pas comparer module-à-module avec V2 (HCM).",
        },
      ]);
      expect(result.value.curriculumVersionsPresent).toEqual(["V1"]);
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
          employeeId: "emp_stu",
          employee: {
            id: "emp_stu",
            employeeNumber: "#QA-STU-A",
            displayName: "Etudiant A",
          },
        },
      ]);
    pedagogicalCourseRunFindMany.mockResolvedValue([
      {
        id: "run1",
        employeeId: "emp_stu",
        runSequence: 1,
        runType: "AUTONOMOUS",
        status: "COMPLETED",
        runCode: "A-RUN1",
      },
    ]);
    missionAttemptFindMany.mockResolvedValue([
      { missionDefinition: { missionKey: "m1-m01-decouvrir-entreprise" } },
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
    const result = await service.getProfessorCompetencies("emp_prof", {
      analyticsMode: "ALL_RUNS",
    });

    expect(Result.isOk(result)).toBe(true);
    if (Result.isOk(result)) {
      expect(result.value.enrolledStudentCount).toBe(1);
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
