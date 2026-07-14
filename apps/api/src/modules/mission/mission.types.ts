export type PersistedMissionStatus = "in_progress" | "completed";

export interface MissionDepartmentProblemMappingRecord {
  readonly departmentKey: string;
  readonly problemKey: string;
}

export interface MissionAttemptRecord {
  readonly id: string;
  readonly employeeId: string;
  readonly missionKey: string;
  readonly status: PersistedMissionStatus;
  readonly startedAt: Date;
  readonly completedAt: Date | null;
  readonly acknowledgedInputKeys: readonly string[];
  readonly departmentProblemMappings: readonly MissionDepartmentProblemMappingRecord[];
  readonly justification: string | null;
  readonly feedbackKey: string | null;
}

export interface CreateMissionAttemptInput {
  readonly employeeId: string;
  readonly missionKey: string;
  readonly startedAt: Date;
}

export interface CompleteMissionAttemptInput {
  readonly employeeId: string;
  readonly missionKey: string;
  readonly completedAt: Date;
  readonly acknowledgedInputKeys: readonly string[];
  readonly departmentProblemMappings: readonly MissionDepartmentProblemMappingRecord[];
  readonly justification: string;
  readonly feedbackKey: string;
}

export interface MissionAttemptRepository {
  findAttempt(employeeId: string, missionKey: string): Promise<MissionAttemptRecord | null>;
  createAttempt(input: CreateMissionAttemptInput): Promise<MissionAttemptRecord>;
  completeAttempt(input: CompleteMissionAttemptInput): Promise<MissionAttemptRecord>;
}

/** Read-only unlock surface from First-Day state (no mutation). */
export interface MissionUnlockStateReader {
  hasManagerMessageRead(employeeId: string): Promise<boolean>;
  hasFirstDayTaskCompleted(employeeId: string): Promise<boolean>;
}
