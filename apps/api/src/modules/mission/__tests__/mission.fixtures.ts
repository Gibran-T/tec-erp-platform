import { randomUUID } from "node:crypto";

import type {
  MissionAttemptRecord,
  MissionAttemptRepository,
  MissionDepartmentProblemMappingRecord,
  PersistedMissionStatus,
} from "../mission.types.js";

export function createInMemoryMissionAttemptRepository(
  initial: readonly MissionAttemptRecord[] = [],
): MissionAttemptRepository {
  const attempts = [...initial];

  return {
    findAttempt(employeeId, missionKey) {
      const row = attempts.find(
        (attempt) => attempt.employeeId === employeeId && attempt.missionKey === missionKey,
      );
      return Promise.resolve(row ?? null);
    },

    createAttempt(input) {
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
      };
      attempts.push(record);
      return Promise.resolve(record);
    },

    completeAttempt(input) {
      const index = attempts.findIndex(
        (attempt) =>
          attempt.employeeId === input.employeeId && attempt.missionKey === input.missionKey,
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
      };
      attempts[index] = updated;
      return Promise.resolve(updated);
    },
  };
}
