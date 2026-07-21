import { describe, expect, it } from "vitest";
import { getMissionByKey } from "@tec-platform/mission-catalog";

import {
  evaluateMissionResponses,
  matchRequiredConcepts,
} from "../scoring/evaluator.js";

describe("mission scoring evaluator", () => {
  it("matches required concept keywords with accent-insensitive comparison", () => {
    const matched = matchRequiredConcepts(
      "La fragmentation de l'inventaire entre départements est critique.",
      ["fragmentation", "inventaire", "départements"],
    );

    expect(matched).toEqual(["fragmentation", "inventaire", "départements"]);
  });

  it("scores M1-M02 interactions and applies the 70% pass threshold", () => {
    const definition = getMissionByKey("m1-m02-connecter-departements");
    expect(definition).toBeDefined();
    if (!definition) {
      return;
    }

    const passing = evaluateMissionResponses(definition, [
      { interactionId: "primary-owner", value: "dept-entrepot" },
      {
        interactionId: "impacted-units",
        value: ["dept-ti", "dept-operations", "dept-ventes", "dept-finance"],
      },
      {
        interactionId: "process-order",
        value: [
          "step-observe",
          "step-verify",
          "step-alert-ops",
          "step-inform-sales",
          "step-finance",
        ],
      },
      { interactionId: "gap-size", value: 4 },
      {
        interactionId: "connection-rationale",
        value:
          "Connecter les départements partage l’information et évite des décisions contradictoires.",
      },
    ]);

    expect(passing.scorePercent).toBeGreaterThanOrEqual(70);
    expect(passing.passed).toBe(true);

    const failing = evaluateMissionResponses(definition, [
      { interactionId: "primary-owner", value: "dept-ventes" },
      { interactionId: "impacted-units", value: ["dept-rh"] },
      { interactionId: "process-order", value: ["step-finance"] },
      { interactionId: "gap-size", value: 10 },
      { interactionId: "connection-rationale", value: "ok" },
    ]);

    expect(failing.passed).toBe(false);
    expect(failing.scorePercent).toBeLessThan(70);
  });
});
