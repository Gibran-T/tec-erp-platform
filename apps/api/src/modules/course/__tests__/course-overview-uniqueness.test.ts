import { describe, expect, it } from "vitest";

import { FIRST_TASK_KEY, MANAGER_MESSAGE_KEY } from "../../first-day/first-day.catalog.js";
import { createInMemoryFirstDayStateRepository } from "../../first-day/__tests__/first-day.fixtures.js";
import { createCourseService } from "../course.service.js";
import { createMissionUnlockStateReader } from "../../mission/mission.unlock.js";
import {
  createInMemoryCourseProgressRepository,
  createInMemoryMissionAttemptRepository,
  createInMemoryUnlockStateRepository,
} from "../../mission/__tests__/mission.fixtures.js";

function createUnlockedReader(employeeId: string) {
  return createMissionUnlockStateReader(
    createInMemoryFirstDayStateRepository({
      messages: [
        {
          employeeId,
          messageKey: MANAGER_MESSAGE_KEY,
          readAt: new Date("2026-07-10T10:00:00.000Z"),
        },
      ],
      tasks: [
        {
          employeeId,
          taskKey: FIRST_TASK_KEY,
          completedAt: new Date("2026-07-10T11:00:00.000Z"),
        },
      ],
    }),
  );
}

describe("Z1-002 course overview uniqueness", () => {
  it("returns exactly 10 unique modules even when module_ready M2 unlock exists", async () => {
    const unlockStates = createInMemoryUnlockStateRepository([
      {
        employeeId: "emp_1",
        resourceType: "module_ready",
        resourceKey: "M2",
      },
    ]);
    const service = createCourseService({
      attemptRepository: createInMemoryMissionAttemptRepository(),
      unlockReader: createUnlockedReader("emp_1"),
      unlockStates,
      courseProgress: createInMemoryCourseProgressRepository(),
    });

    const overview = await service.getCourseOverview("emp_1");
    const codes = overview.modules.map((module) => module.moduleCode);
    expect(codes).toEqual(["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10"]);
    expect(new Set(codes).size).toBe(10);
    expect(overview.modules).toHaveLength(10);
    const missionKeys = overview.modules.flatMap((module) =>
      module.missions.map((mission) => mission.missionKey),
    );
    expect(missionKeys).toHaveLength(30);
    expect(new Set(missionKeys).size).toBe(30);
    const m2 = overview.modules.find((module) => module.moduleCode === "M2");
    expect(m2?.missions).toHaveLength(3);
    expect(m2?.title).not.toMatch(/à venir/i);
  });
});
