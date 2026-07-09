import { Password } from "@tec-platform/core";
import {
  buildDemoSeed,
  DEMO_EMPLOYEE_NUMBER,
  DEMO_EMPLOYEE_PASSWORD,
  NORDHABITAT_COMPANY,
} from "@tec-platform/database-erp";
import { describe, expect, it } from "vitest";

describe("demo seed data", () => {
  it("is deterministic across invocations (idempotent seed input)", () => {
    expect(buildDemoSeed()).toEqual(buildDemoSeed());
  });

  it("seeds the NordHabitat company and #NHE-DEMO employee", () => {
    const seed = buildDemoSeed();

    expect(seed.company).toEqual({
      code: NORDHABITAT_COMPANY.code,
      name: NORDHABITAT_COMPANY.name,
    });
    expect(seed.employee.employeeNumber).toBe(DEMO_EMPLOYEE_NUMBER);
    expect(seed.employee.role).toBe("JR_BUSINESS_ANALYST");
  });

  it("stores a credential hash, never a plaintext password", () => {
    const seed = buildDemoSeed();

    expect(seed.employee.passwordHash).not.toContain(DEMO_EMPLOYEE_PASSWORD);
    expect(seed.employee.passwordHash.startsWith("scrypt$")).toBe(true);
    expect(Password.verify(DEMO_EMPLOYEE_PASSWORD, seed.employee.passwordHash)).toBe(true);
  });
});
