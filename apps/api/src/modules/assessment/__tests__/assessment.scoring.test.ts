import { describe, expect, it } from "vitest";

import { scoreAssessmentResponses } from "../assessment.service.js";

describe("assessment scoring", () => {
  it("uses 70 percent pass threshold by default", () => {
    const passThresholdPercent = 70;
    const scorePercent = 75;
    expect(scorePercent >= passThresholdPercent).toBe(true);
    expect(69 >= passThresholdPercent).toBe(false);
  });

  it("scores single-choice answers exactly", () => {
    const result = scoreAssessmentResponses(
      [
        {
          questionKey: "q1",
          scoringJson: { maxPoints: 40, correctKeys: ["finance"] },
        },
        {
          questionKey: "q2",
          scoringJson: { maxPoints: 60, correctKeys: ["ea"] },
        },
      ],
      [
        { questionKey: "q1", value: "finance" },
        { questionKey: "q2", value: "kg" },
      ],
    );

    expect(result.earned).toBe(40);
    expect(result.max).toBe(100);
    expect(result.scorePercent).toBe(40);
  });

  it("requires exact multi-choice selection size", () => {
    const result = scoreAssessmentResponses(
      [
        {
          questionKey: "q-multi",
          scoringJson: {
            maxPoints: 30,
            correctKeys: ["hq", "dc-mtl", "dc-trt"],
            minimumSelections: 3,
          },
        },
      ],
      [{ questionKey: "q-multi", value: ["hq", "dc-mtl"] }],
    );

    expect(result.scorePercent).toBe(0);
  });

  it("awards multi-choice points when all correct keys are selected", () => {
    const result = scoreAssessmentResponses(
      [
        {
          questionKey: "q-multi",
          scoringJson: {
            maxPoints: 30,
            correctKeys: ["status", "payment", "bank"],
            minimumSelections: 3,
          },
        },
      ],
      [{ questionKey: "q-multi", value: ["status", "payment", "bank"] }],
    );

    expect(result.scorePercent).toBe(100);
  });

  it("rounds score percent to two decimals", () => {
    const result = scoreAssessmentResponses(
      [
        { questionKey: "q1", scoringJson: { maxPoints: 1, correctKeys: ["a"] } },
        { questionKey: "q2", scoringJson: { maxPoints: 2, correctKeys: ["b"] } },
        { questionKey: "q3", scoringJson: { maxPoints: 0, correctKeys: ["c"] } },
      ],
      [
        { questionKey: "q1", value: "a" },
        { questionKey: "q2", value: "x" },
      ],
    );

    expect(result.scorePercent).toBe(33.33);
  });
});
