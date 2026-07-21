import { listMissionsForModule } from "@tec-platform/mission-catalog";

import { nextUnlockKeyAfterMission } from "./mission.migration-mapper.js";
import type {
  CourseProgressRepository,
  MissionAttemptRepository,
  UnlockStateRepository,
} from "./mission.types.js";

export async function applyMissionCompletionUnlocks(input: {
  readonly employeeId: string;
  readonly missionKey: string;
  readonly completedAt: Date;
  readonly unlockStates: UnlockStateRepository;
  readonly courseProgress: CourseProgressRepository;
  readonly attemptRepository: MissionAttemptRepository;
}): Promise<void> {
  const nextKey = nextUnlockKeyAfterMission(input.missionKey);
  if (nextKey) {
    await input.unlockStates.unlock(input.employeeId, "mission", nextKey, input.completedAt);
  }

  const moduleMissions = listMissionsForModule("M1");
  const attempts = input.attemptRepository.listAttemptsForEmployee
    ? await input.attemptRepository.listAttemptsForEmployee(input.employeeId)
    : [];

  const completedKeys = new Set(
    attempts.filter((attempt) => attempt.status === "completed").map((attempt) => attempt.missionKey),
  );
  completedKeys.add(input.missionKey);

  const completedCount = moduleMissions.filter((mission) =>
    completedKeys.has(mission.missionKey),
  ).length;
  const percentComplete =
    moduleMissions.length === 0
      ? 0
      : Math.round((completedCount / moduleMissions.length) * 10000) / 100;

  const moduleStatus =
    completedCount === 0
      ? "available"
      : completedCount >= moduleMissions.length
        ? "completed"
        : "in_progress";

  await input.courseProgress.upsertModuleProgress({
    employeeId: input.employeeId,
    moduleCode: "M1",
    percentComplete,
    status: moduleStatus,
  });

  await input.courseProgress.upsertCourseProgress({
    employeeId: input.employeeId,
    courseCode: "TEC_ERP_V1",
    percentComplete,
    status: moduleStatus === "completed" ? "in_progress" : moduleStatus,
  });

  if (moduleStatus === "completed") {
    // Module 2 is marked ready but remains locked for content until institutional open.
    await input.unlockStates.unlock(input.employeeId, "module", "M2", input.completedAt);
    await input.unlockStates.unlock(input.employeeId, "module_ready", "M2", input.completedAt);
  }
}
