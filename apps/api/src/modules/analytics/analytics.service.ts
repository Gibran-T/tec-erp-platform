import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

import { computeKpis, filterKpisByDashboard, type ComputedKpi } from "./kpi-engine.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function createAnalyticsService(client = getPrismaClient()) {
  async function resolveCompanyId(employeeId: string, companyId?: string): Promise<ResultType<string>> {
    const employee = await client.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      return Result.fail(DomainError.notFound("Employe introuvable."));
    }
    if (companyId && companyId !== employee.companyId) {
      return Result.fail(DomainError.forbidden("Acces entreprise non autorise."));
    }
    return Result.ok(companyId ?? employee.companyId);
  }

  async function loadKpiInput(companyId: string) {
    const [inventoryMovements, financialPostings, businessDocuments, masterDataRecords, missionAttempts] =
      await Promise.all([
        client.inventoryMovement.findMany({ where: { companyId }, orderBy: { createdAt: "desc" }, take: 500 }),
        client.financialPosting.findMany({ where: { companyId }, orderBy: { createdAt: "desc" }, take: 500 }),
        client.businessDocument.findMany({ where: { companyId }, orderBy: { createdAt: "desc" }, take: 500 }),
        client.masterDataRecord.findMany({ where: { companyId }, orderBy: { updatedAt: "desc" }, take: 500 }),
        client.missionAttempt.findMany({
          where: { employee: { companyId } },
          orderBy: { completedAt: "desc" },
          take: 200,
        }),
      ]);

    return {
      inventoryMovements,
      financialPostings,
      businessDocuments,
      masterDataRecords,
      missionAttempts,
    };
  }

  async function persistSnapshots(companyId: string, kpis: readonly ComputedKpi[]) {
    await client.kpiRecord.createMany({
      data: kpis.map((kpi) => ({
        companyId,
        kpiKey: kpi.key,
        value: kpi.value,
        unit: kpi.unit,
        stale: kpi.stale,
        snapshotJson: toInputJson({ drillDown: kpi.drillDown, formattedValue: kpi.formattedValue }),
      })),
    });
  }

  async function getProfessorHeatmap(
    professorId: string,
    options?: { readonly analyticsMode?: string; readonly selectedRunId?: string },
  ) {
    const professor = await client.employee.findUnique({ where: { id: professorId } });
    if (!professor) {
      return Result.fail(DomainError.notFound("Professeur introuvable."));
    }

    const {
      parseAnalyticsMode,
      resolveRunIdsForAnalytics,
      pickOfficialRun,
      isEligibleForOfficial,
    } = await import("./official-run-policy.js");
    const mode = parseAnalyticsMode(options?.analyticsMode);

    const memberships = await client.cohortMembership.findMany({
      where: { employeeId: professorId, roleInCohort: "professor" },
      select: { cohortId: true },
    });
    const cohortIds = memberships.map((item) => item.cohortId);
    if (cohortIds.length === 0) {
      return Result.ok({
        mode,
        enrolledStudentCount: 0,
        rows: [] as Array<Record<string, unknown>>,
      });
    }

    const students = await client.cohortMembership.findMany({
      where: { cohortId: { in: cohortIds }, roleInCohort: "student" },
      include: { employee: true },
    });

    // One institutional row per student (never per run).
    const uniqueStudents = new Map<string, (typeof students)[number]>();
    for (const membership of students) {
      if (!uniqueStudents.has(membership.employeeId)) {
        uniqueStudents.set(membership.employeeId, membership);
      }
    }

    const rows: Array<Record<string, unknown>> = [];
    for (const membership of uniqueStudents.values()) {
      const runFilter = await resolveRunIdsForAnalytics({
        employeeId: membership.employeeId,
        mode,
        selectedRunId: options?.selectedRunId,
      });

      const attemptWhere =
        runFilter === "ALL"
          ? {
              employeeId: membership.employeeId,
              status: "completed" as const,
              pedagogicalCourseRun: {
                runType: { not: "DEMONSTRATION" },
                status: { not: "CANCELLED" },
              },
            }
          : {
              employeeId: membership.employeeId,
              status: "completed" as const,
              pedagogicalCourseRunId: { in: runFilter },
            };

      const attempts = await client.missionAttempt.findMany({
        where: attemptWhere,
        include: {
          missionDefinition: { select: { missionKey: true, moduleId: true } },
        },
      });

      // Deduplicate mission keys so ALL_RUNS does not inflate completion by replaying runs
      const completedKeys =
        mode === "ALL_RUNS"
          ? [...new Set(attempts.map((attempt) => attempt.missionDefinition.missionKey))]
          : attempts.map((attempt) => attempt.missionDefinition.missionKey);

      const studentRuns = await client.pedagogicalCourseRun.findMany({
        where: { employeeId: membership.employeeId },
        select: {
          id: true,
          employeeId: true,
          runSequence: true,
          runType: true,
          status: true,
          runCode: true,
          curriculumVersion: true,
        },
      });
      const official = pickOfficialRun(studentRuns);
      const { moduleCodeForMissionInCurriculum, parseCurriculumVersion } = await import(
        "@tec-platform/mission-catalog"
      );
      const curriculumVersion = parseCurriculumVersion(official?.curriculumVersion);

      const moduleCounts: Record<string, number> = {};
      for (const key of completedKeys) {
        const moduleCode =
          moduleCodeForMissionInCurriculum(curriculumVersion, key) ??
          (/^m(\d+)/i.exec(key)?.[0]?.toUpperCase() ?? "M?");
        moduleCounts[moduleCode] = (moduleCounts[moduleCode] ?? 0) + 1;
      }

      rows.push({
        studentId: membership.employee.id,
        employeeNumber: membership.employee.employeeNumber,
        displayName: membership.employee.displayName,
        completedMissions: completedKeys.length,
        moduleCounts,
        curriculumVersion,
        officialRunCode: official?.runCode ?? null,
        runCount: studentRuns.filter(isEligibleForOfficial).length,
        note:
          curriculumVersion === "V1"
            ? "Curriculum V1 historique — ne pas comparer module-à-module avec V2 (HCM)."
            : "Curriculum V2 — M8 HCM, M9 Gouvernance, M10 BI/IA; Capstone séparé.",
      });
    }

    return Result.ok({
      mode,
      enrolledStudentCount: rows.length,
      curriculumVersionsPresent: [...new Set(rows.map((row) => row.curriculumVersion))],
      rows,
    });
  }

  async function getProfessorCompetencies(
    professorId: string,
    options?: { readonly analyticsMode?: string; readonly selectedRunId?: string },
  ) {
    const heatmap = await getProfessorHeatmap(professorId, options);
    if (Result.isFail(heatmap)) {
      return heatmap;
    }

    const modules = await client.courseModule.findMany({
      orderBy: { sequence: "asc" },
      include: { missions: { orderBy: { sequence: "asc" } } },
    });

    const competencies = modules.map((module) => {
      const missionCount = module.missions.length;
      const completedAcrossStudents = heatmap.value.rows.reduce((sum, row) => {
        const counts = row.moduleCounts as Record<string, number>;
        return sum + (counts[module.moduleCode] ?? 0);
      }, 0);
      const studentCount = Math.max(heatmap.value.enrolledStudentCount, 1);
      const denominator = Math.max(missionCount * studentCount, 1);
      const coveragePercent = Math.round((completedAcrossStudents / denominator) * 100);
      return {
        moduleCode: module.moduleCode,
        title: module.title,
        missionCount,
        coveragePercent,
      };
    });

    return Result.ok({
      mode: heatmap.value.mode,
      enrolledStudentCount: heatmap.value.enrolledStudentCount,
      competencies,
    });
  }

  return {
    async listDashboards() {
      const dashboards = await client.dashboardDefinition.findMany({ orderBy: { title: "asc" } });
      return {
        dashboards: dashboards.map((dashboard) => ({
          id: dashboard.key,
          title: dashboard.title,
          description: dashboard.description,
        })),
        summaryText: "Indicateurs calcules a partir des transactions simulees NordHabitat.",
        generatedAt: new Date().toISOString(),
      };
    },

    async getKpis(employeeId: string, query: { readonly companyId?: string; readonly dashboardId?: string }) {
      const companyResult = await resolveCompanyId(employeeId, query.companyId);
      if (Result.isFail(companyResult)) {
        return companyResult;
      }
      const companyId = companyResult.value;
      const input = await loadKpiInput(companyId);
      const computed = computeKpis(input);

      let filtered = computed;
      if (query.dashboardId) {
        const dashboard = await client.dashboardDefinition.findUnique({ where: { key: query.dashboardId } });
        if (!dashboard) {
          return Result.fail(DomainError.notFound("Tableau de bord introuvable."));
        }
        const kpiKeys = Array.isArray(dashboard.kpiKeys)
          ? (dashboard.kpiKeys as string[])
          : [];
        filtered = filterKpisByDashboard(computed, kpiKeys);
      }

      await persistSnapshots(companyId, filtered);
      return Result.ok({ kpis: filtered });
    },

    async listExceptions(employeeId: string, companyId?: string) {
      const companyResult = await resolveCompanyId(employeeId, companyId);
      if (Result.isFail(companyResult)) {
        return companyResult;
      }
      const docs = await client.businessDocument.findMany({
        where: {
          companyId: companyResult.value,
          status: { in: ["exception", "blocked", "needs_review"] },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return Result.ok({
        exceptions: docs.map((doc) => ({
          id: doc.id,
          category: doc.documentType,
          severity: doc.status === "blocked" ? ("high" as const) : ("medium" as const),
          summary: `${doc.documentNumber} — ${doc.status}`,
          sourceType: "business_document",
          detectedAt: doc.createdAt.toISOString(),
        })),
      });
    },

    getProfessorHeatmap,
    getProfessorCompetencies,
  };
}

export type AnalyticsService = ReturnType<typeof createAnalyticsService>;
