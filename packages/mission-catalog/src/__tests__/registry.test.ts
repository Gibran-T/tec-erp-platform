import { describe, expect, it } from "vitest";
import {
  HCM_MISSION_KEYS,
  V1_CAPSTONE_MODULE_MISSION_KEYS,
  getMissionByKey,
  getMissionForCurriculum,
  isKnownCatalogMissionKey,
  isRegularMissionInCurriculum,
  listAllKnownMissionDefinitions,
  listAllMissions,
  listMissionsForModule,
  listMissionsForModuleInCurriculum,
  listModules,
  listModulesForCurriculum,
  listRegularMissionKeys,
  listRegularMissionsForCurriculum,
  moduleCodeForMissionInCurriculum,
} from "../index.js";

describe("mission catalog registry", () => {
  it("V1 registers Modules 1–10 with thirty ordered missions (legacy)", () => {
    const modules = listModules();
    expect(modules).toHaveLength(10);
    expect(modules.map((module) => module.moduleCode)).toEqual([
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M7",
      "M8",
      "M9",
      "M10",
    ]);
    expect(modules[7]?.title).toContain("Gouvernance");
    expect(modules[9]?.title).toContain("Capstone");
    expect(listAllMissions()).toHaveLength(30);
    expect(listMissionsForModule("M8").map((m) => m.missionKey)).toEqual([
      "m8-m01-matrice-approbation-pression",
      "m8-m02-revue-acces-sod",
      "m8-m03-autoevaluation-probation",
    ]);
    expect(listMissionsForModule("M10").map((m) => m.missionKey)).toEqual([
      ...V1_CAPSTONE_MODULE_MISSION_KEYS,
    ]);
  });

  it("V2 registers exactly 10×3 regular missions with HCM / Governance / BI", () => {
    const modules = listModulesForCurriculum("V2");
    expect(modules).toHaveLength(10);
    expect(modules.every((module) => module.missionKeys.length === 3)).toBe(true);
    expect(listRegularMissionsForCurriculum("V2")).toHaveLength(30);
    expect(modules[7]?.title).toContain("Ressources humaines");
    expect(modules[8]?.title).toContain("Gouvernance");
    expect(modules[9]?.title).toContain("BI");
    expect(listMissionsForModuleInCurriculum("V2", "M8").map((m) => m.missionKey)).toEqual([
      ...HCM_MISSION_KEYS,
    ]);
    expect(listMissionsForModuleInCurriculum("V2", "M9").map((m) => m.missionKey)).toEqual([
      "m8-m01-matrice-approbation-pression",
      "m8-m02-revue-acces-sod",
      "m8-m03-autoevaluation-probation",
    ]);
    expect(listMissionsForModuleInCurriculum("V2", "M10").map((m) => m.missionKey)).toEqual([
      "m9-m01-atelier-definition-kpi",
      "m9-m02-tableau-bord-comite",
      "m9-m03-analyse-concurrentielle-ia",
    ]);
    for (const key of V1_CAPSTONE_MODULE_MISSION_KEYS) {
      expect(isRegularMissionInCurriculum("V2", key)).toBe(false);
    }
    expect(moduleCodeForMissionInCurriculum("V2", "m8-m01-matrice-approbation-pression")).toBe(
      "M9",
    );
    expect(moduleCodeForMissionInCurriculum("V2", "m9-m01-atelier-definition-kpi")).toBe("M10");
    expect(moduleCodeForMissionInCurriculum("V2", "m10-m01-diapositive-conseil")).toBeUndefined();
  });

  it("keeps historical V1 Capstone module missions resolvable without inventing HCM on V1", () => {
    expect(isKnownCatalogMissionKey("m10-m03-presentation-capstone-or")).toBe(true);
    expect(getMissionByKey("m10-m03-presentation-capstone-or")?.title).toContain("Capstone");
    expect(listAllKnownMissionDefinitions().length).toBeGreaterThanOrEqual(33);
    for (const key of HCM_MISSION_KEYS) {
      expect(isRegularMissionInCurriculum("V1", key)).toBe(false);
      expect(isRegularMissionInCurriculum("V2", key)).toBe(true);
      expect(getMissionForCurriculum("V2", key)?.moduleCode).toBe("M8");
    }
    expect(listRegularMissionKeys("V1")).not.toEqual(expect.arrayContaining([...HCM_MISSION_KEYS]));
  });

  it("has no duplicate M2 and unique regular keys per version", () => {
    for (const version of ["V1", "V2"] as const) {
      const keys = listRegularMissionKeys(version);
      expect(new Set(keys).size).toBe(30);
      expect(listModulesForCurriculum(version).filter((m) => m.moduleCode === "M2")).toHaveLength(1);
    }
  });

  it("resolves known mission keys", () => {
    expect(isKnownCatalogMissionKey("m1-m02-connecter-departements")).toBe(true);
    expect(getMissionByKey("m1-m02-connecter-departements")?.title).toContain("départements");
    expect(isKnownCatalogMissionKey("m8-m01-integrer-nouvel-employe")).toBe(true);
    expect(isKnownCatalogMissionKey("unknown-mission")).toBe(false);
  });

  it("M4–M6 missions use French labels and unique competency codes", () => {
    const wave2LateMissions = listAllMissions().filter((mission) =>
      ["M4", "M5", "M6"].includes(mission.moduleCode),
    );
    expect(wave2LateMissions).toHaveLength(9);

    const competencyCodes: string[] = [];
    for (const mission of wave2LateMissions) {
      for (const interaction of mission.interactions) {
        for (const option of interaction.options ?? []) {
          expect(option.label).not.toBe(option.key);
          expect(option.label.length).toBeGreaterThan(2);
        }
      }
      competencyCodes.push(...mission.competencyCodes);
    }

    expect(new Set(competencyCodes).size).toBe(competencyCodes.length);
    for (const code of competencyCodes) {
      expect(code).toMatch(/^C-(O2C|SC|FIN)-\d+$/);
    }
  });

  it("V1 M7–M10 missions keep legacy competency patterns", () => {
    const wave3Missions = listAllMissions().filter((mission) =>
      ["M7", "M8", "M9", "M10"].includes(mission.moduleCode),
    );
    expect(wave3Missions).toHaveLength(12);

    const competencyCodes: string[] = [];
    for (const mission of wave3Missions) {
      for (const interaction of mission.interactions) {
        for (const option of interaction.options ?? []) {
          expect(option.label).not.toBe(option.key);
        }
      }
      competencyCodes.push(...mission.competencyCodes);
      expect(mission.contextItems).toHaveLength(3);
      expect(mission.interactions).toHaveLength(5);
    }

    expect(new Set(competencyCodes).size).toBe(competencyCodes.length);
  });

  it("HCM missions include traps, documents, and quantitative scoring", () => {
    const hcm = listMissionsForModuleInCurriculum("V2", "M8");
    expect(hcm).toHaveLength(3);
    for (const mission of hcm) {
      expect(mission.contextItems.length).toBeGreaterThanOrEqual(3);
      expect(mission.interactions.length).toBeGreaterThanOrEqual(5);
      expect(mission.competencyCodes.every((code) => code.startsWith("C-HCM-"))).toBe(true);
    }
    expect(
      getMissionByKey("m8-m02-gerer-temps-absences")?.interactions.some(
        (interaction) => interaction.type === "NUMERIC_INPUT",
      ),
    ).toBe(true);
  });
});
