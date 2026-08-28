import { describe, expect, it } from "vitest";

import {
  SAP_IEE2E_ACHIEVEMENT_DISCLAIMER,
  SAP_IEE2E_UNIT_COUNT,
  SapIee2eSelfReportSchema,
  UpdateSapIee2eSelfReportRequestSchema,
} from "../sap-iee2e.js";

describe("sap-iee2e contracts", () => {
  it("accepts a declared self-report without treating Achievement as issued by TEC.ERP", () => {
    const units = Array.from({ length: SAP_IEE2E_UNIT_COUNT }, (_, index) => ({
      unitNumber: index + 1,
      status: index < 2 ? "terminee_declaree" : index === 2 ? "en_cours" : "a_decouvrir",
    }));

    const parsed = SapIee2eSelfReportSchema.safeParse({
      currentUnit: 3,
      sessionNumber: 3,
      sapAccess: "commence",
      difficulty: "Structures organisationnelles",
      needsSupport: false,
      note: "",
      achievement: "non_declare",
      lastDeclaredAt: "2026-08-20T15:00:00.000Z",
      lastUpdateLabel: "20 août 2026, 11 h 00",
      progressionLabel: "2/9 unités déclarées terminées · unité 3",
      persisted: true,
      units,
      semaineZero: {
        universalId: true,
        learningHub: true,
        iee2eOpened: true,
        noSharedAccount: true,
        contingencyAck: true,
      },
      semaineZeroReady: true,
      calendar: {
        session1Date: "2026-09-08",
        session1At: "2026-09-08T12:00:00.000Z",
        semaineZeroOpensAt: "2026-08-18T12:00:00.000Z",
        daysUntilSession1: 19,
        windowLabel: "Séance 1 dans 19 j",
      },
    });

    expect(parsed.success).toBe(true);
    expect(SAP_IEE2E_ACHIEVEMENT_DISCLAIMER).toMatch(/n’émet pas/i);
  });

  it("rejects an official unit outside the SAP IEE2E range", () => {
    const parsed = UpdateSapIee2eSelfReportRequestSchema.safeParse({
      currentUnit: 11,
      sessionNumber: 1,
      sapAccess: "confirme",
      difficulty: "",
      needsSupport: false,
      note: "",
      achievement: "non_declare",
      units: [{ unitNumber: 1, status: "en_cours" }],
      semaineZero: {
        universalId: false,
        learningHub: false,
        iee2eOpened: false,
        noSharedAccount: false,
        contingencyAck: false,
      },
    });

    expect(parsed.success).toBe(false);
  });
});
