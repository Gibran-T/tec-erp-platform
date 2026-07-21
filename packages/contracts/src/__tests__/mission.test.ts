import { describe, expect, it } from "vitest";

import {
  MissionDetailSchema,
  MissionKeySchema,
  MissionStartResponseSchema,
  MissionStatusSchema,
  MissionSubmitRequestSchema,
  MissionsResponseSchema,
} from "../mission.js";

describe("mission contracts", () => {
  it("accepts the Module 1 mission keys", () => {
    expect(MissionKeySchema.safeParse("m1-m01-decouvrir-entreprise").success).toBe(true);
    expect(MissionKeySchema.safeParse("m1-m02-connecter-departements").success).toBe(true);
    expect(MissionKeySchema.safeParse("m1-m03-diagnostiquer-preparation").success).toBe(true);
    expect(MissionKeySchema.safeParse("decouvrir-nordhabitat").success).toBe(false);
    expect(MissionKeySchema.safeParse("m1-m02").success).toBe(false);
  });

  it("accepts the four mission statuses", () => {
    for (const status of ["locked", "available", "in_progress", "completed"] as const) {
      expect(MissionStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("validates a locked missions list summary", () => {
    const parsed = MissionsResponseSchema.safeParse({
      missions: [
        {
          missionKey: "m1-m01-decouvrir-entreprise",
          title: "Découvrir l’entreprise",
          status: "locked",
          preview: "Claire Fontaine vous assignera bientôt une découverte.",
          unlockExplanation:
            "Terminez votre première journée : lisez le message de Claire et complétez votre première responsabilité.",
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });

  it("validates submit request with at least two mappings and justified length", () => {
    const ok = MissionSubmitRequestSchema.safeParse({
      acknowledgedInputKeys: ["ctx-nordhabitat-overview", "ctx-tom-40-36"],
      departmentProblemMappings: [
        { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
        { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
      ],
      justification:
        "L’écart 40 versus 36 montre une fragmentation entre le système et l’observation terrain.",
    });

    expect(ok.success).toBe(true);
    if (ok.success) {
      expect(ok.data.departmentProblemMappings).toHaveLength(2);
      expect(ok.data.justification.length).toBeGreaterThanOrEqual(40);
      expect(ok.data.justification.length).toBeLessThanOrEqual(1000);
      expect("allowedMappings" in ok.data).toBe(false);
      expect("allowedMappingHints" in ok.data).toBe(false);
    }

    const trimmedOk = MissionSubmitRequestSchema.safeParse({
      acknowledgedInputKeys: [" ctx-nordhabitat-overview ", "ctx-tom-40-36"],
      departmentProblemMappings: [
        { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
        { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
      ],
      justification: `  ${"x".repeat(40)}  `,
    });

    expect(trimmedOk.success).toBe(true);
    if (trimmedOk.success) {
      expect(trimmedOk.data.acknowledgedInputKeys).toEqual([
        "ctx-nordhabitat-overview",
        "ctx-tom-40-36",
      ]);
      expect(trimmedOk.data.justification).toBe("x".repeat(40));
    }
  });

  it("rejects submit requests that violate schema length and mapping rules", () => {
    const baseMappings = [
      { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
      { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
    ];
    const validJustification =
      "L’écart 40 versus 36 montre une fragmentation entre le système et l’observation terrain.";

    expect(
      MissionSubmitRequestSchema.safeParse({
        acknowledgedInputKeys: ["ctx-tom-40-36"],
        departmentProblemMappings: [baseMappings[0]],
        justification: validJustification,
      }).success,
    ).toBe(false);

    expect(
      MissionSubmitRequestSchema.safeParse({
        acknowledgedInputKeys: ["ctx-tom-40-36"],
        departmentProblemMappings: [],
        justification: validJustification,
      }).success,
    ).toBe(false);

    expect(
      MissionSubmitRequestSchema.safeParse({
        acknowledgedInputKeys: ["ctx-tom-40-36"],
        departmentProblemMappings: baseMappings,
        justification: "Trop court",
      }).success,
    ).toBe(false);

    expect(
      MissionSubmitRequestSchema.safeParse({
        acknowledgedInputKeys: ["ctx-tom-40-36"],
        departmentProblemMappings: baseMappings,
        justification: `  ${"x".repeat(39)}  `,
      }).success,
    ).toBe(false);

    expect(
      MissionSubmitRequestSchema.safeParse({
        acknowledgedInputKeys: ["ctx-tom-40-36"],
        departmentProblemMappings: baseMappings,
        justification: "x".repeat(1001),
      }).success,
    ).toBe(false);

    expect(
      MissionSubmitRequestSchema.safeParse({
        acknowledgedInputKeys: [],
        departmentProblemMappings: baseMappings,
        justification: validJustification,
      }).success,
    ).toBe(false);

    expect(
      MissionSubmitRequestSchema.safeParse({
        acknowledgedInputKeys: ["ctx-tom-40-36"],
        departmentProblemMappings: [
          { departmentKey: "dept-entrepot" },
          { problemKey: "prob-coherence-donnees" },
        ],
        justification: validJustification,
      }).success,
    ).toBe(false);
  });

  it("validates start and unlocked detail without answer matrix fields", () => {
    const startedAt = new Date().toISOString();

    const start = MissionStartResponseSchema.safeParse({
      missionKey: "m1-m01-decouvrir-entreprise",
      created: true,
      attempt: {
        status: "in_progress",
        startedAt,
        completedAt: null,
        acknowledgedInputKeys: [],
        departmentProblemMappings: [],
        justification: null,
        feedbackKey: null,
        feedbackBody: null,
      },
    });

    expect(start.success).toBe(true);

    const detail = MissionDetailSchema.safeParse({
      missionKey: "m1-m01-decouvrir-entreprise",
      title: "Découvrir l’entreprise",
      status: "in_progress",
      preview: "Analyser la fragmentation des informations chez NordHabitat.",
      unlockExplanation: null,
      briefing: "Claire vous demande d’observer l’entreprise.",
      contextItems: [
        {
          key: "ctx-tom-40-36",
          title: "Signal Tom",
          body: "Système 40, observation 36.",
          required: true,
        },
      ],
      departments: [
        {
          key: "dept-entrepot",
          label: "Entrepôt",
          description: "Stocks physiques",
        },
      ],
      problems: [
        {
          key: "prob-inventaire-divergent",
          label: "Inventaire divergent",
          description: "Écart système / réalité",
        },
      ],
      attempt: {
        status: "in_progress",
        startedAt,
        completedAt: null,
        acknowledgedInputKeys: [],
        departmentProblemMappings: [],
        justification: null,
        feedbackKey: null,
        feedbackBody: null,
      },
    });

    expect(detail.success).toBe(true);
    if (detail.success) {
      expect("allowedMappingHints" in detail.data).toBe(false);
      expect("allowedMappings" in detail.data).toBe(false);
    }
  });
});
