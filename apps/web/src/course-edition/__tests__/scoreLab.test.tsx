import { describe, expect, it } from "vitest";

import { M1_CONNECTION_LAB } from "../content/m1/connectionLab.js";
import { M1_QUIZ } from "../content/m1/quiz.js";
import { scoreConnectionLab, scoreConsolidationQuiz } from "../scoreLab.js";

describe("scoreConnectionLab", () => {
  it("scores a complete correct lab attempt above the pass threshold", () => {
    const result = scoreConnectionLab(M1_CONNECTION_LAB, {
      "lab-matching": [
        { leftKey: "obj-erp", rightKey: "def-lecture-partagee" },
        { leftKey: "dept-entrepot", rightKey: "resp-signal-terrain" },
        { leftKey: "err-4036", rightKey: "cons-fragmentation" },
        { leftKey: "kpi-inv-acc", rightKey: "interp-risque-service" },
      ],
      "lab-ordering": [
        "step-observe",
        "step-verify",
        "step-alert-ops",
        "step-inform-sales",
        "step-finance",
      ],
      "lab-numeric": 4,
      "lab-justification":
        "L’écart d’inventaire révèle une fragmentation entre départements et une lecture système/terrain divergente.",
    });

    expect(result.passed).toBe(true);
    expect(result.scorePercent).toBeGreaterThanOrEqual(70);
    expect(result.summaryFeedback.systemicImplication.length).toBeGreaterThan(20);
    expect(result.activityResults).toHaveLength(4);
  });

  it("fails when numeric variance and ordering are wrong", () => {
    const result = scoreConnectionLab(M1_CONNECTION_LAB, {
      "lab-matching": [{ leftKey: "obj-erp", rightKey: "def-lecture-partagee" }],
      "lab-ordering": [
        "step-finance",
        "step-observe",
        "step-verify",
        "step-alert-ops",
        "step-inform-sales",
      ],
      "lab-numeric": 99,
      "lab-justification": "texte trop court",
    });

    expect(result.passed).toBe(false);
    expect(result.activityResults.find((item) => item.activityId === "lab-numeric")?.earnedPoints).toBe(
      0,
    );
  });
});

describe("scoreConsolidationQuiz", () => {
  it("scores M1 consolidation quiz and preserves explanations", () => {
    const answers = Object.fromEntries(M1_QUIZ.map((item) => [item.id, item.correctKey]));
    const result = scoreConsolidationQuiz(M1_QUIZ, answers);
    expect(result.passed).toBe(true);
    expect(result.earned).toBe(M1_QUIZ.length);
    expect(result.results.every((item) => item.correct)).toBe(true);
  });
});
