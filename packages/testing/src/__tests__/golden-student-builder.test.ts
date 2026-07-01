import { describe, expect, it } from "vitest";

import {
  createGoldenStudent,
  GoldenStudentBuilder,
} from "../builders/golden-student-builder.js";

describe("GoldenStudentBuilder", () => {
  it("builds the canonical foundation persona", () => {
    const student = new GoldenStudentBuilder().build();

    expect(student).toEqual({
      id: "golden-student-001",
      email: "golden.student@tec.local",
      displayName: "Golden Student",
      cohortCode: "COHORT-FOUNDATION",
      productId: "tec-erp",
    });
  });

  it("supports fluent overrides", () => {
    const student = new GoldenStudentBuilder()
      .withId("student-override")
      .withEmail("override@tec.local")
      .withDisplayName("Override Student")
      .withCohortCode("COHORT-2026")
      .withProductId("tec-wms")
      .build();

    expect(student.id).toBe("student-override");
    expect(student.email).toBe("override@tec.local");
    expect(student.displayName).toBe("Override Student");
    expect(student.cohortCode).toBe("COHORT-2026");
    expect(student.productId).toBe("tec-wms");
  });

  it("creates a baseline student with partial overrides", () => {
    const student = createGoldenStudent({ displayName: "Partial Override" });

    expect(student.displayName).toBe("Partial Override");
    expect(student.id).toBe("golden-student-001");
    expect(student.productId).toBe("tec-erp");
  });
});
