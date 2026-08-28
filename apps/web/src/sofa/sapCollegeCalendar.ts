/**
 * Canonical Collège calendar: SAP IEE2E is the course; TEC.ERP is the sofa.
 * Session sequence comes from Comfort Pack (sessionPlans). Unit titles from officialCourse.
 * TEC modules are optional cushions — never 1:1 with séance numbers.
 */

import { OFFICIAL_UNITS_FR, SAP_ACHIEVEMENT_LABEL_FR } from "../poc/sap-iee2e/officialCourse.js";
import { SESSION_PLANS } from "../poc/sap-iee2e/sessionPlans.js";

export const TEACHING_SESSION_CODES = [
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
  "S6",
  "S7",
  "S8",
  "S9",
  "S10",
] as const;

export type TeachingSessionCode = (typeof TEACHING_SESSION_CODES)[number];

export interface SofaCushion {
  readonly moduleCode: string;
  readonly label: string;
  readonly optional: true;
}

export interface SapCollegeSession {
  readonly sessionCode: TeachingSessionCode;
  readonly sessionNumber: number;
  readonly titleFr: string;
  readonly relatedUnit: number;
  readonly sapUnitTitleFr: string;
  readonly sapDurationLabel: string;
  readonly sofaCushion: SofaCushion | null;
  readonly comfortObjective: string;
}

const CUSHIONS: Readonly<Record<TeachingSessionCode, SofaCushion | null>> = {
  S1: {
    moduleCode: "M1",
    label: "Coussin optionnel M1 — voir l’entreprise comme système (NordHabitat)",
    optional: true,
  },
  S2: null,
  S3: {
    moduleCode: "M2",
    label: "Coussin optionnel M2 — organisation et données de base (lab, pas SAP)",
    optional: true,
  },
  S4: {
    moduleCode: "M6",
    label: "Coussin optionnel M6 — finance / trois voies (lab léger)",
    optional: true,
  },
  S5: {
    moduleCode: "M6",
    label: "Coussin optionnel M6 — poursuivre le lab finance si utile",
    optional: true,
  },
  S6: {
    moduleCode: "M8",
    label: "Coussin optionnel M8 — HCM (lab, distinct de SuccessFactors)",
    optional: true,
  },
  S7: {
    moduleCode: "M3",
    label: "Coussin optionnel M3 — Procure-to-Pay (lab)",
    optional: true,
  },
  S8: {
    moduleCode: "M5",
    label: "Coussin optionnel M5 — stocks / S&OP (lab, pas un clone PP-SAP)",
    optional: true,
  },
  S9: {
    moduleCode: "M4",
    label: "Coussin optionnel M4 — Order-to-Cash (lab)",
    optional: true,
  },
  S10: {
    moduleCode: "M7",
    label: "Coussin optionnel M7 — service / CRM (lab) · Achievement SAP ≠ certificat TEC",
    optional: true,
  },
};

function officialUnit(unitNumber: number): { titleFr: string; durationLabel: string } {
  const unit = OFFICIAL_UNITS_FR.find((item) => item.unitNumber === unitNumber);
  if (!unit) {
    return { titleFr: SAP_ACHIEVEMENT_LABEL_FR, durationLabel: "—" };
  }
  return { titleFr: unit.titleFr, durationLabel: unit.durationLabel };
}

export const SAP_COLLEGE_SESSIONS: readonly SapCollegeSession[] = SESSION_PLANS.map((plan) => {
  const sessionCode = `S${plan.sessionNumber}` as TeachingSessionCode;
  const sap = officialUnit(plan.relatedUnit);
  return {
    sessionCode,
    sessionNumber: plan.sessionNumber,
    titleFr: plan.titleFr,
    relatedUnit: plan.relatedUnit,
    sapUnitTitleFr: sap.titleFr,
    sapDurationLabel: sap.durationLabel,
    sofaCushion: CUSHIONS[sessionCode] ?? null,
    comfortObjective: plan.objective,
  };
});

export function getSapCollegeSession(code: string): SapCollegeSession | null {
  const normalized = code.trim().toUpperCase();
  return SAP_COLLEGE_SESSIONS.find((session) => session.sessionCode === normalized) ?? null;
}

export function isTeachingSessionCode(value: string): value is TeachingSessionCode {
  return (TEACHING_SESSION_CODES as readonly string[]).includes(value.toUpperCase());
}
