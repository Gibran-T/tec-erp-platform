import { describe, expect, it } from "vitest";

import { evaluateMissionResponses } from "../evaluator.js";
import type { MissionDefinitionDocument } from "@tec-platform/mission-catalog";

const DEFINITION = {
  missionKey: "test-score",
  missionCode: "T-01",
  moduleCode: "M1",
  title: "Test",
  preview: "Test",
  briefing: "Brief",
  unlockExplanation: "Unlock",
  sequence: 1,
  maxAttempts: 2,
  passThresholdPercent: 70,
  competencyCodes: ["C-TEST"],
  contextItems: [],
  interactions: [
    {
      id: "q1",
      type: "SINGLE_CHOICE",
      prompt: "Q1",
      options: [
        { key: "a", label: "A" },
        { key: "b", label: "B" },
      ],
      scoring: { maxPoints: 70, correctKeys: ["a"] },
    },
    {
      id: "q2",
      type: "SINGLE_CHOICE",
      prompt: "Q2",
      options: [
        { key: "a", label: "A" },
        { key: "b", label: "B" },
      ],
      scoring: { maxPoints: 30, correctKeys: ["a"] },
    },
  ],
  completionFeedback: "Bravo.",
} as MissionDefinitionDocument;

describe("Z1-008 scoring transparency", () => {
  it("explains full score 100", () => {
    const score = evaluateMissionResponses(DEFINITION, [
      { interactionId: "q1", value: "a" },
      { interactionId: "q2", value: "a" },
    ]);
    expect(score.scorePercent).toBe(100);
    expect(score.gapExplanation).toMatch(/maximal/i);
    expect(score.criteria ?? score.interactionResults).toHaveLength(2);
  });

  it("explains partial score around 70 with gap and retry guidance", () => {
    const score = evaluateMissionResponses(DEFINITION, [
      { interactionId: "q1", value: "a" },
      { interactionId: "q2", value: "b" },
    ]);
    expect(score.scorePercent).toBe(70);
    expect(score.passed).toBe(true);
    expect(score.gapExplanation).toMatch(/point/);
    expect(score.retryGuidance.length).toBeGreaterThan(10);
    expect(score.interactionResults.some((item) => item.earnedPoints < item.maxPoints)).toBe(true);
  });
});
