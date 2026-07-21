const STALE_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface KpiComputationInput {
  readonly inventoryMovements: ReadonlyArray<{ readonly createdAt: Date; readonly direction: string; readonly quantity: number }>;
  readonly financialPostings: ReadonlyArray<{ readonly createdAt: Date; readonly debit: number; readonly credit: number; readonly accountCode: string }>;
  readonly businessDocuments: ReadonlyArray<{ readonly createdAt: Date; readonly status: string; readonly documentType: string }>;
  readonly masterDataRecords: ReadonlyArray<{ readonly qualityScore: number | null; readonly updatedAt: Date }>;
  readonly missionAttempts: ReadonlyArray<{ readonly status: string; readonly completedAt: Date | null }>;
  readonly now?: Date;
}

export interface ComputedKpi {
  readonly key: string;
  readonly label: string;
  readonly value: number | null;
  readonly unit: string;
  readonly stale: boolean;
  readonly trend: "up" | "down" | "stable" | "unknown";
  readonly formattedValue: string;
  readonly drillDown: ReadonlyArray<{ readonly id: string; readonly sourceType: string; readonly summary: string }>;
}

function safeRatio(numerator: number, denominator: number): number {
  if (denominator <= 0) {
    return 0;
  }
  return Math.round((numerator / denominator) * 10000) / 100;
}

function latestActivity(dates: readonly Date[]): Date | null {
  if (dates.length === 0) {
    return null;
  }
  return dates.reduce((latest, current) => (current > latest ? current : latest));
}

function isStale(latest: Date | null, now: Date): boolean {
  if (!latest) {
    return true;
  }
  return now.getTime() - latest.getTime() > STALE_DAYS * MS_PER_DAY;
}

function formatPercent(value: number | null): string {
  if (value === null) {
    return "N/D";
  }
  return `${value.toFixed(1)} %`;
}

export function computeKpis(input: KpiComputationInput): ComputedKpi[] {
  const now = input.now ?? new Date();

  const outbound = input.inventoryMovements.filter((movement) => movement.direction === "out");
  const inbound = input.inventoryMovements.filter((movement) => movement.direction === "in");
  const fillRate = safeRatio(
    inbound.reduce((sum, row) => sum + row.quantity, 0),
    outbound.reduce((sum, row) => sum + row.quantity, 0) + inbound.reduce((sum, row) => sum + row.quantity, 0),
  );

  const deliveries = input.businessDocuments.filter((doc) =>
    ["delivery", "goods_issue", "shipment"].includes(doc.documentType),
  );
  const onTime = deliveries.filter((doc) => doc.status === "completed" || doc.status === "delivered").length;
  const otif = safeRatio(onTime, deliveries.length);

  const revenueAccounts = input.financialPostings.filter((row) => row.accountCode.startsWith("4"));
  const costAccounts = input.financialPostings.filter((row) => row.accountCode.startsWith("5"));
  const revenue = revenueAccounts.reduce((sum, row) => sum + row.credit - row.debit, 0);
  const cost = costAccounts.reduce((sum, row) => sum + row.debit - row.credit, 0);
  const margin = safeRatio(revenue - cost, revenue);

  const exceptions = input.businessDocuments.filter((doc) =>
    ["exception", "blocked", "needs_review"].includes(doc.status),
  ).length;
  const exceptionRate = safeRatio(exceptions, input.businessDocuments.length);

  const scored = input.masterDataRecords.filter((row) => row.qualityScore !== null);
  const dataQuality =
    scored.length === 0
      ? 0
      : Math.round(
          (scored.reduce((sum, row) => sum + (row.qualityScore ?? 0), 0) / scored.length) * 100,
        ) / 100;

  const activityDates = [
    ...input.inventoryMovements.map((row) => row.createdAt),
    ...input.financialPostings.map((row) => row.createdAt),
    ...input.businessDocuments.map((row) => row.createdAt),
    ...input.missionAttempts.map((row) => row.completedAt).filter((value): value is Date => value !== null),
  ];
  const stale = isStale(latestActivity(activityDates), now);

  const drillDownDocuments = input.businessDocuments.slice(0, 5).map((doc, index) => ({
    id: `doc-${index + 1}`,
    sourceType: "business_document",
    summary: `${doc.documentType} — ${doc.status}`,
  }));

  return [
    {
      key: "otif",
      label: "OTIF",
      value: deliveries.length === 0 ? 0 : otif,
      unit: "percent",
      stale,
      trend: "unknown",
      formattedValue: formatPercent(deliveries.length === 0 ? 0 : otif),
      drillDown: drillDownDocuments,
    },
    {
      key: "fillRate",
      label: "Taux de service",
      value: fillRate,
      unit: "percent",
      stale,
      trend: "unknown",
      formattedValue: formatPercent(fillRate),
      drillDown: input.inventoryMovements.slice(0, 5).map((row, index) => ({
        id: `inv-${index + 1}`,
        sourceType: "inventory_movement",
        summary: `${row.direction} ${row.quantity}`,
      })),
    },
    {
      key: "margin",
      label: "Marge brute",
      value: revenue <= 0 ? 0 : margin,
      unit: "percent",
      stale,
      trend: "unknown",
      formattedValue: formatPercent(revenue <= 0 ? 0 : margin),
      drillDown: input.financialPostings.slice(0, 5).map((row, index) => ({
        id: `fin-${index + 1}`,
        sourceType: "financial_posting",
        summary: `${row.accountCode} D:${row.debit} C:${row.credit}`,
      })),
    },
    {
      key: "exceptionRate",
      label: "Taux d exceptions",
      value: input.businessDocuments.length === 0 ? 0 : exceptionRate,
      unit: "percent",
      stale,
      trend: "unknown",
      formattedValue: formatPercent(input.businessDocuments.length === 0 ? 0 : exceptionRate),
      drillDown: drillDownDocuments,
    },
    {
      key: "dataQuality",
      label: "Qualite des donnees",
      value: dataQuality,
      unit: "score",
      stale,
      trend: "unknown",
      formattedValue: `${dataQuality.toFixed(1)} / 100`,
      drillDown: input.masterDataRecords.slice(0, 5).map((row, index) => ({
        id: `md-${index + 1}`,
        sourceType: "master_data_record",
        summary: `Score ${row.qualityScore ?? "N/D"}`,
      })),
    },
  ];
}

export function filterKpisByDashboard(
  kpis: readonly ComputedKpi[],
  kpiKeys: readonly string[],
): ComputedKpi[] {
  if (kpiKeys.length === 0) {
    return [...kpis];
  }
  const allowed = new Set(kpiKeys);
  return kpis.filter((kpi) => allowed.has(kpi.key));
}
