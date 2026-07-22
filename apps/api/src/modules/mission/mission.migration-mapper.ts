/**
 * Maps RC01 employee_mission_attempt rows into V1 mission_attempt payloads.
 * Owns versioned sequential unlock chains for curriculum V1 / V2.
 */

import {
  DEFAULT_CURRICULUM_VERSION,
  listRegularMissionKeys,
  moduleCodeForMissionInCurriculum,
  nextUnlockKeyAfterMissionInCurriculum,
  type CurriculumVersion,
} from "@tec-platform/mission-catalog";

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

/** @deprecated Prefer listRegularMissionKeys(version). Kept as V1 alias. */
export const COURSE_MISSION_SEQUENCE: readonly string[] = listRegularMissionKeys("V1");

function fallbackModuleCodeFromKey(missionKey: string): string | undefined {
  const match = /^m(\d+)/i.exec(missionKey);
  if (!match?.[1]) {
    return undefined;
  }
  return `M${match[1]}`;
}

export function moduleCodeForMission(
  missionKey: string,
  version: CurriculumVersion = DEFAULT_CURRICULUM_VERSION,
): string | undefined {
  return (
    moduleCodeForMissionInCurriculum(version, missionKey) ?? fallbackModuleCodeFromKey(missionKey)
  );
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

export function nextUnlockKeyAfterMission(
  missionKey: string,
  version: CurriculumVersion = DEFAULT_CURRICULUM_VERSION,
): string | null {
  return nextUnlockKeyAfterMissionInCurriculum(version, missionKey) ?? null;
}
