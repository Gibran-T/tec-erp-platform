import { describe, expect, it } from "vitest";

import { OFFICIAL_UNITS_FR } from "../../poc/sap-iee2e/officialCourse.js";
import { SESSION_PLANS } from "../../poc/sap-iee2e/sessionPlans.js";
import {
  SAP_COLLEGE_SESSIONS,
  TEACHING_SESSION_CODES,
} from "../sapCollegeCalendar.js";

describe("SAP college calendar (sofa)", () => {
  it("has 10 Collège sessions matching the Comfort Pack", () => {
    expect(TEACHING_SESSION_CODES).toEqual(["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"]);
    expect(SAP_COLLEGE_SESSIONS).toHaveLength(10);
    expect(SAP_COLLEGE_SESSIONS.map((s) => s.sessionNumber)).toEqual(
      SESSION_PLANS.map((p) => p.sessionNumber),
    );
  });

  it("follows official SAP unit numbers — not TEC M1–M10", () => {
    expect(SAP_COLLEGE_SESSIONS.map((s) => s.relatedUnit)).toEqual([1, 2, 3, 4, 4, 5, 6, 7, 8, 9]);
    const unit4 = OFFICIAL_UNITS_FR.find((u) => u.unitNumber === 4);
    expect(SAP_COLLEGE_SESSIONS[3]?.sapUnitTitleFr).toBe(unit4?.titleFr);
    expect(SAP_COLLEGE_SESSIONS[4]?.sapUnitTitleFr).toBe(unit4?.titleFr);
    expect(SAP_COLLEGE_SESSIONS[6]?.sofaCushion?.moduleCode).toBe("M3");
    expect(SAP_COLLEGE_SESSIONS[3]?.sofaCushion?.moduleCode).toBe("M6");
  });
});
