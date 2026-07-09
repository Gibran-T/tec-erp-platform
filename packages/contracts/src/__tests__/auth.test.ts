import { describe, expect, it } from "vitest";

import {
  EmployeeRoleSchema,
  LoginRequestSchema,
  LoginResponseSchema,
} from "../auth.js";

describe("auth contracts", () => {
  it("accepts a well-formed login request", () => {
    const parsed = LoginRequestSchema.safeParse({
      email: "demo.analyste@nordhabitat.ca",
      password: "Bienvenue2025!",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const parsed = LoginRequestSchema.safeParse({
      email: "not-an-email",
      password: "Bienvenue2025!",
    });

    expect(parsed.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const parsed = LoginRequestSchema.safeParse({
      email: "demo.analyste@nordhabitat.ca",
      password: "",
    });

    expect(parsed.success).toBe(false);
  });

  it("only permits the JR_BUSINESS_ANALYST role in RC01", () => {
    expect(EmployeeRoleSchema.safeParse("JR_BUSINESS_ANALYST").success).toBe(true);
    expect(EmployeeRoleSchema.safeParse("ADMIN").success).toBe(false);
  });

  it("validates a complete login response", () => {
    const parsed = LoginResponseSchema.safeParse({
      employee: {
        id: "emp_1",
        employeeNumber: "#NHE-DEMO",
        email: "demo.analyste@nordhabitat.ca",
        displayName: "Analyste Démo",
        role: "JR_BUSINESS_ANALYST",
        companyName: "NordHabitat",
      },
      tokens: {
        accessToken: "a.b.c",
        refreshToken: "d.e.f",
        accessTokenExpiresAt: new Date().toISOString(),
        refreshTokenExpiresAt: new Date().toISOString(),
      },
    });

    expect(parsed.success).toBe(true);
  });
});
