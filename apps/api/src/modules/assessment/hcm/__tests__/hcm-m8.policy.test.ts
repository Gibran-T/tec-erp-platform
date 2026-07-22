import { describe, expect, it } from "vitest";

import { lockReasonForAssessment, requiredModulesForAssessment } from "../hcm-m8.policy.js";

describe("HCM_M8 policy helpers", () => {
  it("scopes HCM unlock to module M8 only", () => {
    expect(requiredModulesForAssessment("HCM_M8")).toEqual(["M8"]);
    expect(requiredModulesForAssessment("GOLD_M7_M10")).toEqual(["M7", "M8", "M9", "M10"]);
  });

  it("returns French lock reason for incomplete HCM", () => {
    const reason = lockReasonForAssessment({
      assessmentCode: "HCM_M8",
      curriculumVersion: "V2",
      modulesComplete: false,
    });
    expect(reason).toContain("M8-M01");
    expect(reason).toContain("M8-M02");
    expect(reason).toContain("M8-M03");
  });
});
