/**
 * Maps RC01 employee_mission_attempt rows into V1 mission_attempt payloads.
 * Also owns the canonical sequential unlock chain for M1–M6.
 */

export interface LegacyEmployeeMissionAttemptRow {
  readonly id: string;
  readonly employeeId: string;
  readonly missionKey: string;
  readonly status: string;
  readonly startedAt: Date;
  readonly completedAt: Date | null;
  readonly acknowledgedInputKeys: unknown;
  readonly departmentProblemMappings: unknown;
  readonly justification: string | null;
  readonly feedbackKey: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface MigratedMissionAttemptPayload {
  readonly id: string;
  readonly employeeId: string;
  readonly missionDefinitionId: string;
  readonly attemptNumber: number;
  readonly status: "in_progress" | "completed";
  readonly startedAt: Date;
  readonly submittedAt: Date | null;
  readonly completedAt: Date | null;
  readonly responsesJson: Readonly<Record<string, unknown>>;
  readonly scorePercent: number | null;
  readonly earnedPoints: number | null;
  readonly maxPoints: number | null;
  readonly feedbackJson: Readonly<Record<string, unknown>> | null;
}

export const M1_M01_DEFINITION_ID = "md_m1_m01";
export const M1_M01_MISSION_KEY = "m1-m01-decouvrir-entreprise";
export const M1_M02_MISSION_KEY = "m1-m02-connecter-departements";

/** Canonical mission sequence across Modules 1–6 (Wave 2). */
export const COURSE_MISSION_SEQUENCE: readonly string[] = [
  "m1-m01-decouvrir-entreprise",
  "m1-m02-connecter-departements",
  "m1-m03-diagnostiquer-preparation",
  "m2-m01-structurer-organisation",
  "m2-m02-creer-donnees-reference",
  "m2-m03-corriger-qualite-donnees",
  "m3-m01-identifier-besoin-achat",
  "m3-m02-creer-traiter-commande-achat",
  "m3-m03-receptionner-analyser-fournisseur",
  "m4-m01-saisir-commande-institutionnelle",
  "m4-m02-allocation-inter-entrepots",
  "m4-m03-confirmer-livraison-cloture",
  "m5-m01-analyser-stock-reappro",
  "m5-m02-decision-transfert-inter-dc",
  "m5-m03-presentation-sop",
  "m6-m01-reception-facture",
  "m6-m02-exception-rapprochement-trois-voies",
  "m6-m03-expliquer-ecart-finance",
];

const MODULE_BY_MISSION: Readonly<Record<string, string>> = Object.fromEntries(
  COURSE_MISSION_SEQUENCE.map((key) => {
    const moduleCode = key.slice(0, 2).toUpperCase();
    return [key, moduleCode];
  }),
);

export function moduleCodeForMission(missionKey: string): string | undefined {
  return MODULE_BY_MISSION[missionKey];
}

export function mapLegacyAttemptToV1(
  row: LegacyEmployeeMissionAttemptRow,
  missionDefinitionId: string = M1_M01_DEFINITION_ID,
): MigratedMissionAttemptPayload {
  const completed = row.status === "completed";

  return {
    id: `migrated_${row.id}`,
    employeeId: row.employeeId,
    missionDefinitionId,
    attemptNumber: 1,
    status: completed ? "completed" : "in_progress",
    startedAt: row.startedAt,
    submittedAt: completed ? row.completedAt : null,
    completedAt: row.completedAt,
    responsesJson: {
      legacy: true,
      acknowledgedInputKeys: row.acknowledgedInputKeys ?? [],
      departmentProblemMappings: row.departmentProblemMappings ?? [],
      justification: row.justification,
      feedbackKey: row.feedbackKey,
    },
    scorePercent: completed ? 100 : null,
    earnedPoints: completed ? 100 : null,
    maxPoints: completed ? 100 : null,
    feedbackJson: row.feedbackKey ? { feedbackKey: row.feedbackKey } : null,
  };
}

export function nextUnlockKeyAfterMission(missionKey: string): string | null {
  const index = COURSE_MISSION_SEQUENCE.indexOf(missionKey);
  if (index < 0 || index >= COURSE_MISSION_SEQUENCE.length - 1) {
    return null;
  }
  return COURSE_MISSION_SEQUENCE[index + 1] ?? null;
}
