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
  };
}

export type AnalyticsService = ReturnType<typeof createAnalyticsService>;
