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
});
