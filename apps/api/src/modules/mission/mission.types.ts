import type { MissionKey } from "@tec-platform/contracts";

export type PersistedMissionStatus = "in_progress" | "completed";

export type PersistedV1AttemptStatus =
  | "in_progress"
  | "submitted"
  | "completed"
  | "needs_review"
  | "failed";

export interface MissionDepartmentProblemMappingRecord {
  readonly departmentKey: string;
  readonly problemKey: string;
}

/** Legacy RC01 attempt shape retained for M1-M01 API compatibility. */
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
  readonly scorePercent?: number | null;
  readonly attemptNumber?: number;
}

export interface V1MissionAttemptRecord {
  readonly id: string;
  readonly employeeId: string;
  readonly missionKey: string;
  readonly missionDefinitionId: string;
  readonly attemptNumber: number;
  readonly status: PersistedV1AttemptStatus;
  readonly startedAt: Date;
  readonly submittedAt: Date | null;
  readonly completedAt: Date | null;
  readonly responsesJson: Readonly<Record<string, unknown>>;
  readonly scorePercent: number | null;
  readonly earnedPoints: number | null;
  readonly maxPoints: number | null;
  readonly feedbackJson: Readonly<Record<string, unknown>> | null;
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

export interface CompleteV1MissionAttemptInput {
  readonly attemptId: string;
  readonly completedAt: Date;
  readonly status: PersistedV1AttemptStatus;
  readonly responsesJson: Readonly<Record<string, unknown>>;
  readonly scorePercent: number;
  readonly earnedPoints: number;
  readonly maxPoints: number;
  readonly feedbackJson: Readonly<Record<string, unknown>>;
}

export interface MissionAttemptRepository {
  findAttempt(employeeId: string, missionKey: string): Promise<MissionAttemptRecord | null>;
  createAttempt(input: CreateMissionAttemptInput): Promise<MissionAttemptRecord>;
  completeAttempt(input: CompleteMissionAttemptInput): Promise<MissionAttemptRecord>;
  listAttemptsForEmployee?(employeeId: string): Promise<readonly MissionAttemptRecord[]>;
  completeV1Attempt?(input: CompleteV1MissionAttemptInput): Promise<MissionAttemptRecord>;
}

export interface UnlockStateRepository {
  isUnlocked(
    employeeId: string,
    resourceType: string,
    resourceKey: string,
  ): Promise<boolean>;
  unlock(
    employeeId: string,
    resourceType: string,
    resourceKey: string,
    unlockedAt: Date,
  ): Promise<void>;
  listUnlockedKeys(
    employeeId: string,
    resourceType: string,
  ): Promise<readonly string[]>;
}

/** Read-only unlock surface from First-Day state (no mutation). */
export interface MissionUnlockStateReader {
  hasManagerMessageRead(employeeId: string): Promise<boolean>;
  hasFirstDayTaskCompleted(employeeId: string): Promise<boolean>;
}

export interface CourseProgressRecord {
  readonly employeeId: string;
  readonly courseCode: string;
  readonly percentComplete: number;
  readonly status: string;
}

export interface ModuleProgressRecord {
  readonly employeeId: string;
  readonly moduleCode: string;
  readonly percentComplete: number;
  readonly status: string;
}

export interface CourseProgressRepository {
  getCourseProgress(employeeId: string, courseCode: string): Promise<CourseProgressRecord | null>;
  upsertCourseProgress(input: CourseProgressRecord): Promise<CourseProgressRecord>;
  getModuleProgress(employeeId: string, moduleCode: string): Promise<ModuleProgressRecord | null>;
  upsertModuleProgress(input: ModuleProgressRecord): Promise<ModuleProgressRecord>;
}

export type EngineMissionKey = MissionKey;
