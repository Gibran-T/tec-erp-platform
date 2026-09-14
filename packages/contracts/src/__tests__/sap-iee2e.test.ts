import { describe, expect, it } from "vitest";

import {
  INSTITUTIONAL_STATUS_LABEL_FR,
  SAP_IEE2E_ACHIEVEMENT_DISCLAIMER,
  SAP_IEE2E_UNIT_COUNT,
  SAP_SUITE_E2E_OFFICIAL_PATH_UNITS,
  SAP_SUITE_E2E_STAGE_CODES,
  SAP_SUITE_E2E_STAGES,
  SAP_SUITE_E2E_TITLE,
  SapIee2eSelfReportSchema,
  UpdateSapIee2eSelfReportRequestSchema,
} from "../sap-iee2e.js";

describe("sap-iee2e contracts", () => {
  it("exposes a configurable S1–S10 institutional program without inventing official SAP results", () => {
    expect(SAP_SUITE_E2E_TITLE).toBe("SAP Suite End to End");
    expect(SAP_SUITE_E2E_STAGE_CODES).toHaveLength(10);
    expect(SAP_SUITE_E2E_STAGES.every((stage) => stage.titleStatus === "placeholder")).toBe(true);
    expect(SAP_SUITE_E2E_OFFICIAL_PATH_UNITS).toHaveLength(9);
    expect(INSTITUTIONAL_STATUS_LABEL_FR.progress_declared).toBe("Progrès déclaré");
  });

  it("accepts a declared self-report without treating Achievement as issued by TEC.ERP", () => {
    const units = Array.from({ length: SAP_IEE2E_UNIT_COUNT }, (_, index) => ({
      unitNumber: index + 1,
      status: index < 2 ? "terminee_declaree" : index === 2 ? "en_cours" : "a_decouvrir",
    }));
    const stages = SAP_SUITE_E2E_STAGE_CODES.map((stageCode, index) => ({
      stageCode,
      status: index === 2 ? "progress_declared" : "not_started",
    }));

    const parsed = SapIee2eSelfReportSchema.safeParse({
      currentUnit: 3,
      sessionNumber: 3,
      currentStageCode: "S3",
      institutionalStatus: "progress_declared",
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
      stages,
      evidence: [],
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
      officialUrl:
        "https://learning.sap.com/courses/exploring-end-to-end-business-processes-in-sap-business-suite-fr",
      sapResultOfficial: false,
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

  it("rejects evidence URLs that are not https or that embed credentials", () => {
    const parsed = UpdateSapIee2eSelfReportRequestSchema.safeParse({
      currentUnit: 1,
      sessionNumber: 1,
      sapAccess: "confirme",
      difficulty: "",
      needsSupport: false,
      note: "",
      achievement: "non_declare",
      units: [{ unitNumber: 1, status: "en_cours" }],
      evidence: [
        {
          stageCode: "S1",
          kind: "external_reference",
          label: "token",
          referenceUrl: "https://user:secret@example.com",
        },
      ],
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
