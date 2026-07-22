import { describe, expect, it } from "vitest";
import { listRegularMissionKeys } from "@tec-platform/mission-catalog";

import { evaluateGoldEligibility } from "../certification.service.js";

describe("gold eligibility gate", () => {
  it("V1 requires historical 30 including m10 Capstone-module missions plus Capstone approval", () => {
    const allKeys = new Set(listRegularMissionKeys("V1"));

    const eligible = evaluateGoldEligibility({
      completedMissionKeys: allKeys,
      goldAssessmentPassed: true,
      capstoneSubmitted: true,
      capstoneProfessorApproved: true,
      professorApproveFlag: true,
      curriculumVersion: "V1",
    });
    expect(eligible.eligible).toBe(true);

    const blocked = evaluateGoldEligibility({
      completedMissionKeys: allKeys,
      goldAssessmentPassed: false,
      capstoneSubmitted: true,
      capstoneProfessorApproved: true,
      professorApproveFlag: true,
      curriculumVersion: "V1",
    });
    expect(blocked.eligible).toBe(false);
    expect(blocked.reasons.some((reason) => reason.includes("GOLD_M7_M10"))).toBe(true);
  });

  it("V2 requires HCM missions and rejects Capstone-as-mission-30 keys as regular progress", () => {
    const v2Keys = new Set(listRegularMissionKeys("V2"));
    expect(v2Keys.has("m8-m01-integrer-nouvel-employe")).toBe(true);
    expect(v2Keys.has("m10-m03-presentation-capstone-or")).toBe(false);

    const eligible = evaluateGoldEligibility({
      completedMissionKeys: v2Keys,
      goldAssessmentPassed: true,
      hcmAssessmentPassed: true,
      capstoneSubmitted: true,
      capstoneProfessorApproved: true,
      professorApproveFlag: true,
      curriculumVersion: "V2",
    });
    expect(eligible.eligible).toBe(true);

    const withoutHcm = evaluateGoldEligibility({
      completedMissionKeys: v2Keys,
      goldAssessmentPassed: true,
      hcmAssessmentPassed: false,
      capstoneSubmitted: true,
      capstoneProfessorApproved: true,
      professorApproveFlag: true,
      curriculumVersion: "V2",
    });
    expect(withoutHcm.eligible).toBe(false);
    expect(withoutHcm.reasons.some((reason) => reason.includes("HCM_M8"))).toBe(true);

    const withoutProfessorCapstone = evaluateGoldEligibility({
      completedMissionKeys: v2Keys,
      goldAssessmentPassed: true,
      hcmAssessmentPassed: true,
      capstoneSubmitted: true,
      capstoneProfessorApproved: false,
      professorApproveFlag: true,
      curriculumVersion: "V2",
    });
    expect(withoutProfessorCapstone.eligible).toBe(false);
    expect(
      withoutProfessorCapstone.reasons.some((reason) => reason.includes("Approbation professeur")),
    ).toBe(true);

    const v1CompleteOnV2 = evaluateGoldEligibility({
      completedMissionKeys: new Set(listRegularMissionKeys("V1")),
      goldAssessmentPassed: true,
      hcmAssessmentPassed: true,
      capstoneSubmitted: true,
      capstoneProfessorApproved: true,
      professorApproveFlag: true,
      curriculumVersion: "V2",
    });
    expect(v1CompleteOnV2.eligible).toBe(false);
    expect(v1CompleteOnV2.reasons.some((reason) => reason.startsWith("Missions"))).toBe(true);
  });

  it("HCM assessment alone never issues Gold and V1 ignores HCM requirement", () => {
    const hcmOnly = evaluateGoldEligibility({
      completedMissionKeys: new Set(),
      goldAssessmentPassed: false,
      hcmAssessmentPassed: true,
      capstoneSubmitted: false,
      capstoneProfessorApproved: false,
      professorApproveFlag: false,
      curriculumVersion: "V2",
    });
    expect(hcmOnly.eligible).toBe(false);

    const v1WithoutHcmFlag = evaluateGoldEligibility({
      completedMissionKeys: new Set(listRegularMissionKeys("V1")),
      goldAssessmentPassed: true,
      capstoneSubmitted: true,
      capstoneProfessorApproved: true,
      professorApproveFlag: true,
      curriculumVersion: "V1",
    });
    expect(v1WithoutHcmFlag.eligible).toBe(true);
  });
});
