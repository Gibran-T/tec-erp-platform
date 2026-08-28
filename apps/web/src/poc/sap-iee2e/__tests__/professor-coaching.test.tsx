import { describe, expect, it } from "vitest";

import {
  getSessionTeachingGuide,
  SESSION_TEACHING_GUIDES,
  TEACHING_GOLDEN_RULES,
} from "../professorCoaching.js";
import { SESSION_PLANS } from "../sessionPlans.js";

describe("Coaching professeur IEE2E", () => {
  it("couvre les dix séances Collège", () => {
    expect(SESSION_TEACHING_GUIDES).toHaveLength(SESSION_PLANS.length);
    expect(TEACHING_GOLDEN_RULES.length).toBeGreaterThanOrEqual(6);
    expect(TEACHING_GOLDEN_RULES.join(" ")).toMatch(/Semaine Zéro/i);
    for (const plan of SESSION_PLANS) {
      const guide = getSessionTeachingGuide(plan.sessionNumber);
      expect(guide.openingLine.length).toBeGreaterThan(20);
      expect(guide.collegeCase.length).toBeGreaterThan(40);
      expect(guide.sapDoes).toMatch(/unité/i);
      expect(guide.youDo.length).toBeGreaterThan(20);
    }
  });

  it("distingue Achievement SAP et certificat Collège en séance 10", () => {
    const guide = getSessionTeachingGuide(10);
    expect(guide.openingLine).toMatch(/Achievement/i);
    expect(guide.openingLine).toMatch(/Collège/i);
    expect(guide.closeScript).toMatch(/Practice System/i);
  });
});
