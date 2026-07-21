import { describe, expect, it } from "vitest";

import { DomainError } from "@tec-platform/core";

import { scoreAssessmentResponses } from "../assessment.service.js";

describe("assessment response contracts", () => {
  it("does not award points for unanswered questions", () => {
    const result = scoreAssessmentResponses(
      [{ questionKey: "q1", scoringJson: { maxPoints: 100, correctKeys: ["a"] } }],
      [],
    );
    expect(result.scorePercent).toBe(0);
  });

  it("treats wrong shuffled-position selection as incorrect by key", () => {
    const result = scoreAssessmentResponses(
      [{ questionKey: "q1", scoringJson: { maxPoints: 100, correctKeys: ["foundation"] } }],
      [{ questionKey: "q1", value: "decoration" }],
    );
    expect(result.scorePercent).toBe(0);
  });

  it("scores correct key regardless of display order semantics", () => {
    const result = scoreAssessmentResponses(
      [{ questionKey: "q1", scoringJson: { maxPoints: 100, correctKeys: ["foundation"] } }],
      [{ questionKey: "q1", value: "foundation" }],
    );
    expect(result.scorePercent).toBe(100);
  });

  it("exposes conflict semantics for attempt limits", () => {
    const error = DomainError.conflict("Nombre maximal de tentatives atteint.");
    expect(error.code).toBe("CONFLICT");
  });
});
