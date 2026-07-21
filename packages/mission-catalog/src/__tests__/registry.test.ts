import { describe, expect, it } from "vitest";
import {
  getMissionByKey,
  isKnownCatalogMissionKey,
  listAllMissions,
  listMissionsForModule,
  listModules,
} from "../registry.js";

describe("mission catalog registry", () => {
  it("registers Modules 1–10 with thirty ordered missions", () => {
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
    expect(modules[0]?.missionKeys).toEqual([
      "m1-m01-decouvrir-entreprise",
      "m1-m02-connecter-departements",
      "m1-m03-diagnostiquer-preparation",
    ]);

    const missions = listMissionsForModule("M1");
    expect(missions).toHaveLength(3);
    expect(missions.map((mission) => mission.sequence)).toEqual([1, 2, 3]);
    expect(listAllMissions()).toHaveLength(30);
    expect(listMissionsForModule("M2")).toHaveLength(3);
    expect(listMissionsForModule("M6")).toHaveLength(3);
    expect(listMissionsForModule("M7")).toHaveLength(3);
    expect(listMissionsForModule("M10")).toHaveLength(3);
  });

  it("resolves known mission keys", () => {
    expect(isKnownCatalogMissionKey("m1-m02-connecter-departements")).toBe(true);
    expect(getMissionByKey("m1-m02-connecter-departements")?.title).toContain(
      "départements",
    );
    expect(isKnownCatalogMissionKey("m3-m02-creer-traiter-commande-achat")).toBe(true);
    expect(isKnownCatalogMissionKey("m7-m01-ouvrir-dossier-client")).toBe(true);
    expect(getMissionByKey("m10-m03-presentation-capstone-or")?.title).toContain(
      "Capstone",
    );
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

    expect(getMissionByKey("m4-m01-saisir-commande-institutionnelle")?.contextItems).toHaveLength(
      3,
    );
    expect(getMissionByKey("m6-m02-exception-rapprochement-trois-voies")?.interactions).toHaveLength(
      5,
    );
  });

  it("M7–M10 missions use French labels and unique competency codes", () => {
    const wave3Missions = listAllMissions().filter((mission) =>
      ["M7", "M8", "M9", "M10"].includes(mission.moduleCode),
    );
    expect(wave3Missions).toHaveLength(12);

    const competencyCodes: string[] = [];
    for (const mission of wave3Missions) {
      for (const interaction of mission.interactions) {
        for (const option of interaction.options ?? []) {
          expect(option.label).not.toBe(option.key);
          expect(option.label.length).toBeGreaterThan(2);
        }
      }
      competencyCodes.push(...mission.competencyCodes);
      expect(mission.contextItems).toHaveLength(3);
      expect(mission.interactions).toHaveLength(5);
    }

    expect(new Set(competencyCodes).size).toBe(competencyCodes.length);
    for (const code of competencyCodes) {
      expect(code).toMatch(
        /^C-(CRM|QLT|GOV|SEC|PRO|REF|BI|COM|ANL|AI|EXEC|CAP|LEAD)-\d+$/,
      );
    }

    expect(getMissionByKey("m7-m01-ouvrir-dossier-client")?.competencyCodes).toEqual([
      "C-CRM-02",
    ]);
    expect(getMissionByKey("m10-m02-defi-final-equinoxe")?.competencyCodes).toEqual([
      "C-CAP-01",
      "C-CAP-02",
    ]);
  });
});
