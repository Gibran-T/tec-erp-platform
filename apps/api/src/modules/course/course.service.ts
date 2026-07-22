import { DomainError, Result, type Result as ResultType } from "@tec-platform/core";
import type {
  CourseOverviewResponse,
  ModuleDetailResponse,
  MissionKey,
  MissionStatus,
  ProgressStatus,
} from "@tec-platform/contracts";
import { listMissionsForModule, listModules } from "@tec-platform/mission-catalog";

import { createMissionService, type MissionServiceDependencies } from "../mission/mission.service.js";
import type {
  CourseProgressRepository,
  MissionAttemptRepository,
  MissionUnlockStateReader,
  UnlockStateRepository,
} from "../mission/mission.types.js";

const COURSE_CODE = "TEC_ERP_V1";
const COURSE_TITLE = "TEC.ERP — Analyste ERP et processus d’affaires";
const COURSE_VERSION = "1.0.0";

export interface CourseServiceDependencies {
  readonly attemptRepository: MissionAttemptRepository;
  readonly unlockReader: MissionUnlockStateReader;
  readonly unlockStates: UnlockStateRepository;
  readonly courseProgress: CourseProgressRepository;
  readonly now?: () => Date;
}

export interface CourseService {
  getCourseOverview(employeeId: string): Promise<CourseOverviewResponse>;
  getModule(employeeId: string, moduleCode: string): Promise<ResultType<ModuleDetailResponse>>;
}

function toProgressStatus(value: string | undefined, fallback: ProgressStatus): ProgressStatus {
  if (
    value === "locked" ||
    value === "available" ||
    value === "in_progress" ||
    value === "completed"
  ) {
    return value;
  }
  return fallback;
}

export function createCourseService(dependencies: CourseServiceDependencies): CourseService {
  const missionDeps: MissionServiceDependencies = {
    attemptRepository: dependencies.attemptRepository,
    unlockReader: dependencies.unlockReader,
    unlockStates: dependencies.unlockStates,
    courseProgress: dependencies.courseProgress,
    now: dependencies.now,
  };
  const missionService = createMissionService(missionDeps);

  return {
    async getCourseOverview(employeeId) {
      const listed = await missionService.listMissions(employeeId);
      const byKey = new Map(listed.missions.map((mission) => [mission.missionKey, mission]));
      const storedCourse = await dependencies.courseProgress.getCourseProgress(
        employeeId,
        COURSE_CODE,
      );

      const modules = [];

      for (const moduleEntry of listModules()) {
        const missions = listMissionsForModule(moduleEntry.moduleCode).map((definition) => {
          const summary = byKey.get(definition.missionKey as MissionKey);
          const status: MissionStatus = summary?.status ?? "locked";
          return {
            missionKey: definition.missionKey as MissionKey,
            missionCode: definition.missionCode,
            title: definition.title,
            sequence: definition.sequence,
            status,
            unlockExplanation: summary?.unlockExplanation ?? null,
          };
        });

        const completedCount = missions.filter((mission) => mission.status === "completed").length;
        const percentComplete =
          missions.length === 0
            ? 0
            : Math.round((completedCount / missions.length) * 10000) / 100;

        let status: ProgressStatus = "locked";
        if (completedCount >= missions.length && missions.length > 0) {
          status = "completed";
        } else if (missions.some((mission) => mission.status !== "locked")) {
          status = completedCount > 0 ? "in_progress" : "available";
        }

        const storedModule = await dependencies.courseProgress.getModuleProgress(
          employeeId,
          moduleEntry.moduleCode,
        );

        modules.push({
          moduleCode: moduleEntry.moduleCode,
          title: moduleEntry.title,
          sequence: moduleEntry.sequence,
          status: toProgressStatus(storedModule?.status, status),
          percentComplete: storedModule?.percentComplete ?? percentComplete,
          missions,
        });
      }

      // Z1-002: modules come solely from mission-catalog (exactly one entry per moduleCode).
      // Do not append Wave-1 placeholder Module 2 — it duplicated M2 for completed students.

      const overallPercent =
        modules.length === 0
          ? 0
          : Math.round(
              (modules.reduce((sum, module) => sum + module.percentComplete, 0) / modules.length) *
                100,
            ) / 100;

      return {
        courseCode: COURSE_CODE,
        title: COURSE_TITLE,
        version: COURSE_VERSION,
        status: toProgressStatus(storedCourse?.status, overallPercent > 0 ? "in_progress" : "available"),
        percentComplete: storedCourse?.percentComplete ?? overallPercent,
        modules,
      };
    },

    async getModule(employeeId, moduleCode) {
      const overview = await this.getCourseOverview(employeeId);
      const module = overview.modules.find((item) => item.moduleCode === moduleCode);
      if (!module) {
        return Result.fail(DomainError.notFound("Module introuvable."));
      }

      return Result.ok({
        ...module,
        courseCode: COURSE_CODE,
      });
    },
  };
}
