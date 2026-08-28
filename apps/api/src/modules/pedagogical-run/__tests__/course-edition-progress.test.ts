import { describe, expect, it } from "vitest";

import {
  computeCourseEditionProgressPercent,
  mergeCourseEditionIntoMetadata,
  normalizeCourseEditionProgress,
  readCourseEditionFromMetadata,
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

  it("merges into metadataJson without dropping existing keys", () => {
    const merged = mergeCourseEditionIntoMetadata(
      { reason: "cohort-start", bootstrap: true },
      normalizeCourseEditionProgress("M1", {
        moduleCode: "M1",
        completedSurfaces: ["apprendre"],
        connectionLabPassed: false,
        connectionLabScorePercent: null,
        quizPassed: false,
        quizPercent: null,
        framesViewed: ["frame-01-enterprise-integrated"],
        documentsOpened: [],
      }),
    );

    expect(merged.reason).toBe("cohort-start");
    expect(merged.bootstrap).toBe(true);
    const ce = merged.courseEdition as Record<string, unknown>;
    expect(ce.M1).toMatchObject({
      moduleCode: "M1",
      progressPercent: 25,
      connectionLabPassed: false,
    });
  });

  it("reads namespaced Course Edition progress from metadata", () => {
    const progress = readCourseEditionFromMetadata(
      {
        courseEdition: {
          M1: {
            moduleCode: "M1",
            completedSurfaces: ["apprendre", "connecter"],
            connectionLabPassed: true,
            connectionLabScorePercent: 75,
            quizPassed: false,
            quizPercent: null,
            framesViewed: [],
            documentsOpened: [],
            updatedAt: "2026-07-24T12:00:00.000Z",
          },
        },
      },
      "M1",
    );

    expect(progress?.connectionLabPassed).toBe(true);
    expect(computeCourseEditionProgressPercent(progress!.completedSurfaces)).toBe(50);
  });
});
