import { randomUUID } from "node:crypto";

import type {
  CourseProgressRecord,
  CourseProgressRepository,
  MissionAttemptRecord,
  MissionAttemptRepository,
  MissionDepartmentProblemMappingRecord,
  ModuleProgressRecord,
  PersistedMissionStatus,
  UnlockStateRepository,
} from "../mission.types.js";

export function createInMemoryMissionAttemptRepository(
  initial: readonly MissionAttemptRecord[] = [],
): MissionAttemptRepository {
  const attempts = [...initial];

  return {
    findAttempt(employeeId, missionKey) {
      const matching = attempts
        .filter(
          (attempt) => attempt.employeeId === employeeId && attempt.missionKey === missionKey,
        )
        .sort((left, right) => (right.attemptNumber ?? 1) - (left.attemptNumber ?? 1));
      return Promise.resolve(matching[0] ?? null);
    },

    listAttemptsForEmployee(employeeId) {
      return Promise.resolve(attempts.filter((attempt) => attempt.employeeId === employeeId));
    },

    createAttempt(input) {
      const existingCount = attempts.filter(
        (attempt) =>
          attempt.employeeId === input.employeeId && attempt.missionKey === input.missionKey,
      ).length;

      const record: MissionAttemptRecord = {
        id: `attempt_${randomUUID()}`,
        employeeId: input.employeeId,
        missionKey: input.missionKey,
        status: "in_progress",
        startedAt: input.startedAt,
        completedAt: null,
        acknowledgedInputKeys: [],
        departmentProblemMappings: [],
        justification: null,
        feedbackKey: null,
        scorePercent: null,
        attemptNumber: existingCount + 1,
      };
      attempts.push(record);
      return Promise.resolve(record);
    },

    completeAttempt(input) {
      const index = attempts.findIndex(
        (attempt) =>
          attempt.employeeId === input.employeeId &&
          attempt.missionKey === input.missionKey &&
          attempt.status === "in_progress",
      );

      if (index < 0) {
        return Promise.reject(new Error("Attempt not found for complete."));
      }

      const current = attempts[index]!;
      const updated: MissionAttemptRecord = {
        ...current,
        status: "completed" satisfies PersistedMissionStatus,
        completedAt: input.completedAt,
        acknowledgedInputKeys: [...input.acknowledgedInputKeys],
        departmentProblemMappings: input.departmentProblemMappings.map(
          (mapping): MissionDepartmentProblemMappingRecord => ({
            departmentKey: mapping.departmentKey,
            problemKey: mapping.problemKey,
          }),
        ),
        justification: input.justification,
        feedbackKey: input.feedbackKey,
        scorePercent: 100,
      };
      attempts[index] = updated;
      return Promise.resolve(updated);
    },

    completeV1Attempt(input) {
      const index = attempts.findIndex((attempt) => attempt.id === input.attemptId);
      if (index < 0) {
        return Promise.reject(new Error("Attempt not found for completeV1."));
      }

      const current = attempts[index]!;
      const responses = input.responsesJson;
      const updated: MissionAttemptRecord = {
        ...current,
        status: input.status === "completed" ? "completed" : "in_progress",
        completedAt: input.status === "completed" ? input.completedAt : null,
        scorePercent: input.scorePercent,
        acknowledgedInputKeys: Array.isArray(responses.acknowledgedInputKeys)
          ? (responses.acknowledgedInputKeys as string[])
          : current.acknowledgedInputKeys,
        departmentProblemMappings: Array.isArray(responses.departmentProblemMappings)
          ? (responses.departmentProblemMappings as MissionDepartmentProblemMappingRecord[])
          : current.departmentProblemMappings,
        justification:
          typeof responses.justification === "string"
            ? responses.justification
            : current.justification,
        feedbackKey:
          typeof input.feedbackJson.feedbackKey === "string"
            ? input.feedbackJson.feedbackKey
            : current.feedbackKey,
      };
      attempts[index] = updated;
      return Promise.resolve(updated);
    },
  };
}

export function createInMemoryUnlockStateRepository(
  initial: ReadonlyArray<{
    employeeId: string;
    resourceType: string;
    resourceKey: string;
  }> = [],
): UnlockStateRepository {
  const rows = initial.map((row) => ({ ...row }));

  return {
    isUnlocked(employeeId, resourceType, resourceKey) {
      return Promise.resolve(
        rows.some(
          (row) =>
            row.employeeId === employeeId &&
            row.resourceType === resourceType &&
            row.resourceKey === resourceKey,
        ),
      );
    },

    unlock(employeeId, resourceType, resourceKey) {
      if (
        !rows.some(
          (row) =>
            row.employeeId === employeeId &&
            row.resourceType === resourceType &&
            row.resourceKey === resourceKey,
        )
      ) {
        rows.push({ employeeId, resourceType, resourceKey });
      }
      return Promise.resolve();
    },

    listUnlockedKeys(employeeId, resourceType) {
      return Promise.resolve(
        rows
          .filter((row) => row.employeeId === employeeId && row.resourceType === resourceType)
          .map((row) => row.resourceKey),
      );
    },
  };
}

export function createInMemoryCourseProgressRepository(): CourseProgressRepository {
  const courses: CourseProgressRecord[] = [];
  const modules: ModuleProgressRecord[] = [];

  return {
    getCourseProgress(employeeId, courseCode) {
      return Promise.resolve(
        courses.find((row) => row.employeeId === employeeId && row.courseCode === courseCode) ??
          null,
      );
    },

    upsertCourseProgress(input) {
      const index = courses.findIndex(
        (row) => row.employeeId === input.employeeId && row.courseCode === input.courseCode,
      );
      if (index >= 0) {
        courses[index] = input;
      } else {
        courses.push(input);
      }
      return Promise.resolve(input);
    },

    getModuleProgress(employeeId, moduleCode) {
      return Promise.resolve(
        modules.find((row) => row.employeeId === employeeId && row.moduleCode === moduleCode) ??
          null,
      );
    },

    upsertModuleProgress(input) {
      const index = modules.findIndex(
        (row) => row.employeeId === input.employeeId && row.moduleCode === input.moduleCode,
      );
      if (index >= 0) {
        modules[index] = input;
      } else {
        modules.push(input);
      }
      return Promise.resolve(input);
    },
  };
}
