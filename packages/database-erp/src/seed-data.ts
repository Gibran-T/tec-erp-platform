import { Password } from "@tec-platform/core";

/**
 * Deterministic seed data for RC01 — Identity & First Day, Slice A.
 *
 * Contains only the institutional demo employee (#NHE-DEMO) used for classroom
 * demonstration and automated tests. No real student / personal data is stored.
 *
 * The demo credential is intentionally well-known and documented. Its hash uses
 * a fixed salt so that `buildDemoSeed()` is byte-for-byte deterministic across
 * runs, which keeps classroom resets and seed idempotency reproducible. This
 * fixed-salt behaviour is DEMO-ONLY; real credentials always use random salts.
 */
export const NORDHABITAT_COMPANY = {
  code: "NORDHABITAT",
  name: "NordHabitat",
} as const;

export const DEMO_EMPLOYEE_NUMBER = "#NHE-DEMO";
export const DEMO_EMPLOYEE_EMAIL = "demo.analyste@nordhabitat.ca";
export const DEMO_EMPLOYEE_DISPLAY_NAME = "Analyste Démo";
export const DEMO_EMPLOYEE_ROLE = "JR_BUSINESS_ANALYST" as const;

/** DEMO-ONLY password. Documented and non-sensitive — never a real credential. */
export const DEMO_EMPLOYEE_PASSWORD = "Bienvenue2025!";

/** DEMO-ONLY fixed salt to keep the seed deterministic. Not used for real users. */
const DEMO_PASSWORD_SALT = "6e6f726468616269746174deadbeef00";

export interface DemoCompanySeed {
  readonly code: string;
  readonly name: string;
}

export interface DemoEmployeeSeed {
  readonly employeeNumber: string;
  readonly email: string;
  readonly displayName: string;
  readonly role: typeof DEMO_EMPLOYEE_ROLE;
  readonly passwordHash: string;
}

export interface DemoSeed {
  readonly company: DemoCompanySeed;
  readonly employee: DemoEmployeeSeed;
}

export function buildDemoSeed(): DemoSeed {
  return {
    company: {
      code: NORDHABITAT_COMPANY.code,
      name: NORDHABITAT_COMPANY.name,
    },
    employee: {
      employeeNumber: DEMO_EMPLOYEE_NUMBER,
      email: DEMO_EMPLOYEE_EMAIL,
      displayName: DEMO_EMPLOYEE_DISPLAY_NAME,
      role: DEMO_EMPLOYEE_ROLE,
      passwordHash: Password.hash(DEMO_EMPLOYEE_PASSWORD, DEMO_PASSWORD_SALT),
    },
  };
}
