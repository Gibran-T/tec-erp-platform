import { describe, expect, it } from "vitest";
import {
  HCM_MISSION_KEYS,
  V1_CAPSTONE_MODULE_MISSION_KEYS,
  listModulesForCurriculum,
  listRegularMissionKeys,
  moduleCodeForMissionInCurriculum,
} from "@tec-platform/mission-catalog";

import { moduleCodeForMission } from "../../mission/mission.migration-mapper.js";
import {
  areRegularMissionsComplete,
  computeCapstoneLifecycle,
} from "../../capstone/capstone.lifecycle.js";

describe("curriculum V1/V2 invariants", () => {
  it("keeps exactly 10 modules × 3 missions = 30 regular missions per version", () => {
    for (const version of ["V1", "V2"] as const) {
      const modules = listModulesForCurriculum(version);
      expect(modules).toHaveLength(10);
      expect(modules.every((module) => module.missionKeys.length === 3)).toBe(true);
      expect(listRegularMissionKeys(version)).toHaveLength(30);
      expect(new Set(listRegularMissionKeys(version)).size).toBe(30);
      expect(modules.filter((module) => module.moduleCode === "M2")).toHaveLength(1);
    }
  });

  it("places HCM / Governance / BI correctly in V2 and keeps Capstone out of the 30", () => {
    expect(listModulesForCurriculum("V2")[7]?.title).toMatch(/Ressources humaines|HCM/i);
    expect(listModulesForCurriculum("V2")[8]?.title).toMatch(/Gouvernance/i);
    expect(listModulesForCurriculum("V2")[9]?.title).toMatch(/BI/);
    expect(moduleCodeForMissionInCurriculum("V2", HCM_MISSION_KEYS[0]!)).toBe("M8");
    expect(moduleCodeForMissionInCurriculum("V2", "m8-m01-matrice-approbation-pression")).toBe("M9");
    expect(moduleCodeForMissionInCurriculum("V2", "m9-m01-atelier-definition-kpi")).toBe("M10");
    for (const key of V1_CAPSTONE_MODULE_MISSION_KEYS) {
      expect(listRegularMissionKeys("V2")).not.toContain(key);
    }
  });

  it("does not invent HCM completion on V1 and starts V2 empty", () => {
    const v1Complete = new Set(listRegularMissionKeys("V1"));
    expect(areRegularMissionsComplete("V1", v1Complete)).toBe(true);
    expect(areRegularMissionsComplete("V2", v1Complete)).toBe(false);
    expect(areRegularMissionsComplete("V2", new Set())).toBe(false);
    for (const key of HCM_MISSION_KEYS) {
      expect(v1Complete.has(key)).toBe(false);
    }
  });

  it("keeps Capstone locked until regular completion and requires professor approval for Gold path", () => {
    expect(
      computeCapstoneLifecycle({
        regularMissionsComplete: false,
        runEligible: true,
        status: null,
        reviewStatus: null,
        professorApproved: false,
        hasDraftContent: false,
      }),
    ).toBe("LOCKED");
    expect(
      computeCapstoneLifecycle({
        regularMissionsComplete: true,
        runEligible: true,
        status: "submitted",
        reviewStatus: "pending",
        professorApproved: false,
        hasDraftContent: true,
      }),
    ).toBe("UNDER_REVIEW");
    expect(
      computeCapstoneLifecycle({
        regularMissionsComplete: true,
        runEligible: true,
        status: "submitted",
        reviewStatus: "approved",
        professorApproved: true,
        hasDraftContent: true,
      }),
    ).toBe("APPROVED");
  });

  it("fixes m10 module code mapping (no slice-to-M1 regression)", () => {
    expect(moduleCodeForMission("m10-m01-diapositive-conseil", "V1")).toBe("M10");
    expect(moduleCodeForMission("m10-m03-presentation-capstone-or", "V1")).toBe("M10");
  });
});
