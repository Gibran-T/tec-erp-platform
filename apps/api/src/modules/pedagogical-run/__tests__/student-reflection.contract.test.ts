import { describe, expect, it } from "vitest";

import {
  CreateStudentMissionReflectionRequestSchema,
  UpdateStudentMissionReflectionRequestSchema,
} from "@tec-platform/contracts";

describe("student mission reflection contracts", () => {
  it("rejects likert values outside 1-5", () => {
    const parsed = CreateStudentMissionReflectionRequestSchema.safeParse({
      missionKey: "m1-m01",
      clarity: 6,
      confidence: 3,
      cognitiveLoad: 3,
      realism: 3,
      relevance: 3,
      navigationQuality: 3,
      feedbackQuality: 3,
      visualQuality: 3,
      externalExplanationRequired: false,
      externalSlidesWouldHelp: false,
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts a valid reflection payload", () => {
    const parsed = CreateStudentMissionReflectionRequestSchema.safeParse({
      missionKey: "m1-m01",
      clarity: 4,
      confidence: 4,
      cognitiveLoad: 2,
      realism: 5,
      relevance: 5,
      navigationQuality: 4,
      feedbackQuality: 4,
      visualQuality: 3,
      aiUsefulness: null,
      biUsefulness: 3,
      externalExplanationRequired: true,
      externalSlidesWouldHelp: false,
      qualitativeNote: "Besoin de clarification processus",
    });
    expect(parsed.success).toBe(true);
  });

  it("update schema omits missionKey", () => {
    const parsed = UpdateStudentMissionReflectionRequestSchema.safeParse({
      clarity: 5,
      confidence: 5,
      cognitiveLoad: 1,
      realism: 4,
      relevance: 4,
      navigationQuality: 4,
      feedbackQuality: 4,
      visualQuality: 4,
      externalExplanationRequired: false,
      externalSlidesWouldHelp: true,
    });
    expect(parsed.success).toBe(true);
  });
});
