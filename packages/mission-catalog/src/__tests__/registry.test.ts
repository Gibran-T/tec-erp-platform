import { describe, expect, it } from "vitest";
import {
  getMissionByKey,
  isKnownCatalogMissionKey,
  listAllMissions,
  listMissionsForModule,
  listModules,
} from "../registry.js";

describe("mission catalog registry", () => {
  it("registers Modules 1–6 with eighteen ordered missions", () => {
    const modules = listModules();
    expect(modules).toHaveLength(6);
    expect(modules.map((module) => module.moduleCode)).toEqual([
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
    ]);
    expect(modules[0]?.missionKeys).toEqual([
      "m1-m01-decouvrir-entreprise",
      "m1-m02-connecter-departements",
      "m1-m03-diagnostiquer-preparation",
    ]);

    const missions = listMissionsForModule("M1");
    expect(missions).toHaveLength(3);
    expect(missions.map((mission) => mission.sequence)).toEqual([1, 2, 3]);
    expect(listAllMissions()).toHaveLength(18);
    expect(listMissionsForModule("M2")).toHaveLength(3);
    expect(listMissionsForModule("M6")).toHaveLength(3);
  });

  it("resolves known mission keys", () => {
    expect(isKnownCatalogMissionKey("m1-m02-connecter-departements")).toBe(true);
    expect(getMissionByKey("m1-m02-connecter-departements")?.title).toContain(
      "départements",
    );
    expect(isKnownCatalogMissionKey("m3-m02-creer-traiter-commande-achat")).toBe(true);
    expect(getMissionByKey("unknown-mission")).toBeUndefined();
  });

  it("M4–M6 missions use French labels and unique competency codes", () => {
    const wave2Missions = listAllMissions().filter((mission) =>
      ["M4", "M5", "M6"].includes(mission.moduleCode),
    );
    expect(wave2Missions).toHaveLength(9);

    const competencyCodes: string[] = [];
    for (const mission of wave2Missions) {
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
});
