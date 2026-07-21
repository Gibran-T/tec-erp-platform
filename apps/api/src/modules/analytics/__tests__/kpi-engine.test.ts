import { describe, expect, it } from "vitest";

import { computeKpis } from "../kpi-engine.js";

describe("kpi-engine zero-safe", () => {
  it("returns zero percent KPIs when source datasets are empty", () => {
    const kpis = computeKpis({
      inventoryMovements: [],
      financialPostings: [],
      businessDocuments: [],
      masterDataRecords: [],
      missionAttempts: [],
      now: new Date("2026-07-21T12:00:00.000Z"),
    });

    expect(kpis.find((kpi) => kpi.key === "otif")?.value).toBe(0);
    expect(kpis.find((kpi) => kpi.key === "fillRate")?.value).toBe(0);
    expect(kpis.find((kpi) => kpi.key === "margin")?.value).toBe(0);
    expect(kpis.find((kpi) => kpi.key === "exceptionRate")?.value).toBe(0);
    expect(kpis.find((kpi) => kpi.key === "dataQuality")?.value).toBe(0);
  });

  it("marks KPIs stale when no activity within 30 days", () => {
    const old = new Date("2026-06-01T12:00:00.000Z");
    const kpis = computeKpis({
      inventoryMovements: [{ createdAt: old, direction: "in", quantity: 10 }],
      financialPostings: [],
      businessDocuments: [],
      masterDataRecords: [],
      missionAttempts: [],
      now: new Date("2026-07-21T12:00:00.000Z"),
    });

    expect(kpis.every((kpi) => kpi.stale)).toBe(true);
  });
});
