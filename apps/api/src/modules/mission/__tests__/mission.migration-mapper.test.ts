import { describe, expect, it } from "vitest";

import {
  M1_M01_MISSION_KEY,
  mapLegacyAttemptToV1,
  nextUnlockKeyAfterMission,
} from "../mission.migration-mapper.js";

describe("mission migration mapper", () => {
  it("maps completed employee_mission_attempt rows to MissionAttempt completed with score 100", () => {
    const startedAt = new Date("2026-07-12T10:00:00.000Z");
    const completedAt = new Date("2026-07-12T11:00:00.000Z");

    const mapped = mapLegacyAttemptToV1({
      id: "ema_1",
      employeeId: "emp_1",
      missionKey: M1_M01_MISSION_KEY,
      status: "completed",
      startedAt,
      completedAt,
      acknowledgedInputKeys: ["ctx-nordhabitat-overview", "ctx-tom-40-36"],
      departmentProblemMappings: [
        { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
      ],
      justification: "Fragmentation d’information entre départements.",
      feedbackKey: "fb-discovery-complete",
      createdAt: startedAt,
      updatedAt: completedAt,
    });

    expect(mapped).toMatchObject({
      id: "migrated_ema_1",
      employeeId: "emp_1",
      missionDefinitionId: "md_m1_m01",
      attemptNumber: 1,
      status: "completed",
      scorePercent: 100,
      earnedPoints: 100,
      maxPoints: 100,
    });
    expect(mapped.responsesJson).toMatchObject({
      legacy: true,
      justification: "Fragmentation d’information entre départements.",
      feedbackKey: "fb-discovery-complete",
    });
  });

  it("keeps in_progress rows without a score", () => {
    const startedAt = new Date("2026-07-12T10:00:00.000Z");
    const mapped = mapLegacyAttemptToV1({
      id: "ema_2",
      employeeId: "emp_2",
      missionKey: M1_M01_MISSION_KEY,
      status: "in_progress",
      startedAt,
      completedAt: null,
      acknowledgedInputKeys: [],
      departmentProblemMappings: [],
      justification: null,
      feedbackKey: null,
      createdAt: startedAt,
      updatedAt: startedAt,
    });

    expect(mapped.status).toBe("in_progress");
    expect(mapped.scorePercent).toBeNull();
    expect(mapped.submittedAt).toBeNull();
  });

  it("unlocks the next Module 1 mission in sequence", () => {
    expect(nextUnlockKeyAfterMission("m1-m01-decouvrir-entreprise")).toBe(
      "m1-m02-connecter-departements",
    );
    expect(nextUnlockKeyAfterMission("m1-m02-connecter-departements")).toBe(
      "m1-m03-diagnostiquer-preparation",
    );
    expect(nextUnlockKeyAfterMission("m1-m03-diagnostiquer-preparation")).toBeNull();
  });
});
