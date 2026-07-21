import { describe, expect, it } from "vitest";
import {
  getMissionByKey,
  isKnownCatalogMissionKey,
  listAllMissions,
  listMissionsForModule,
  listModules,
} from "../registry.js";

describe("mission catalog registry", () => {
  it("registers Module 1 with three ordered missions", () => {
    const modules = listModules();
    expect(modules).toHaveLength(1);
    expect(modules[0]?.moduleCode).toBe("M1");
    expect(modules[0]?.missionKeys).toEqual([
      "m1-m01-decouvrir-entreprise",
      "m1-m02-connecter-departements",
      "m1-m03-diagnostiquer-preparation",
    ]);

    const missions = listMissionsForModule("M1");
    expect(missions).toHaveLength(3);
    expect(missions.map((mission) => mission.sequence)).toEqual([1, 2, 3]);
    expect(listAllMissions()).toHaveLength(3);
  });

  it("resolves known mission keys", () => {
    expect(isKnownCatalogMissionKey("m1-m02-connecter-departements")).toBe(true);
    expect(getMissionByKey("m1-m02-connecter-departements")?.title).toContain(
      "départements",
    );
    expect(getMissionByKey("unknown-mission")).toBeUndefined();
  });
});
