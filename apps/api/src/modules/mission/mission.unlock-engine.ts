import { listMissionsForModule, listModules } from "@tec-platform/mission-catalog";

import { moduleCodeForMission, nextUnlockKeyAfterMission } from "./mission.migration-mapper.js";
import type {
  CourseProgressRepository,
  MissionAttemptRepository,
  UnlockStateRepository,
} from "./mission.types.js";

function nextModuleCode(moduleCode: string): string | null {
  const modules = listModules()
    .slice()
    .sort((left, right) => left.sequence - right.sequence);
  const index = modules.findIndex((module) => module.moduleCode === moduleCode);
  if (index < 0 || index >= modules.length - 1) {
    return null;
  }
  return modules[index + 1]?.moduleCode ?? null;
}

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

  const moduleCode = moduleCodeForMission(input.missionKey) ?? "M1";
  const moduleMissions = listMissionsForModule(moduleCode);
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
    moduleCode,
    percentComplete,
    status: moduleStatus,
  });

  const allModules = listModules();
  let courseCompletedMissions = 0;
  let courseTotalMissions = 0;
  for (const module of allModules) {
    const missions = listMissionsForModule(module.moduleCode);
    courseTotalMissions += missions.length;
    courseCompletedMissions += missions.filter((mission) =>
      completedKeys.has(mission.missionKey),
    ).length;
  }
  const coursePercent =
    courseTotalMissions === 0
      ? 0
      : Math.round((courseCompletedMissions / courseTotalMissions) * 10000) / 100;

  await input.courseProgress.upsertCourseProgress({
    employeeId: input.employeeId,
    courseCode: "TEC_ERP_V1",
    percentComplete: coursePercent,
    status: coursePercent >= 100 ? "completed" : "in_progress",
  });

  if (moduleStatus === "completed") {
    const following = nextModuleCode(moduleCode);
    if (following) {
      await input.unlockStates.unlock(input.employeeId, "module", following, input.completedAt);
      await input.unlockStates.unlock(
        input.employeeId,
        "module_ready",
        following,
        input.completedAt,
      );
    }
  }
}
