import { describe, expect, it } from "vitest";

import {
  computeCourseEditionProgressPercent,
  normalizeCourseEditionProgress,
  parseStoredCourseEditionProgress,
} from "../course-edition-progress.js";

describe("course-edition-progress helpers", () => {
  it("normalizes progress and computes module completion", () => {
    const record = normalizeCourseEditionProgress("m1", {
      moduleCode: "m1",
      completedSurfaces: ["apprendre", "connecter", "missions", "bilan", "apprendre"],
      connectionLabPassed: true,
      connectionLabScorePercent: 88,
      quizPassed: true,
      quizPercent: 100,
      framesViewed: ["frame-01-enterprise-integrated"],
      documentsOpened: ["doc-inventory-signal"],
    });

    expect(record.moduleCode).toBe("M1");
    expect(record.completedSurfaces).toEqual(["apprendre", "connecter", "missions", "bilan"]);
    expect(record.progressPercent).toBe(100);
    expect(record.moduleComplete).toBe(true);
  });

  it("parses stored JSON without reading PedagogicalCourseRun metadata", () => {
    const stored = normalizeCourseEditionProgress("M1", {
      moduleCode: "M1",
      completedSurfaces: ["apprendre"],
      connectionLabPassed: false,
      connectionLabScorePercent: null,
      quizPassed: false,
      quizPercent: null,
      framesViewed: ["frame-01-enterprise-integrated"],
      documentsOpened: [],
    });

    const parsed = parseStoredCourseEditionProgress(stored, "M1");
    expect(parsed?.connectionLabPassed).toBe(false);
    expect(computeCourseEditionProgressPercent(parsed!.completedSurfaces)).toBe(25);
    expect(parseStoredCourseEditionProgress({ poison: true }, "M1")).toBeNull();
  });
});
