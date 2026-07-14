import {
  FIRST_TASK_KEY,
  MANAGER_MESSAGE_KEY,
} from "../first-day/first-day.catalog.js";
import type { FirstDayStateRepository } from "../first-day/first-day.types.js";

import type { MissionUnlockStateReader } from "./mission.types.js";

export function createMissionUnlockStateReader(
  firstDayStateRepository: FirstDayStateRepository,
): MissionUnlockStateReader {
  return {
    async hasManagerMessageRead(employeeId) {
      const state = await firstDayStateRepository.findMessageState(
        employeeId,
        MANAGER_MESSAGE_KEY,
      );
      return state?.readAt != null;
    },

    async hasFirstDayTaskCompleted(employeeId) {
      const state = await firstDayStateRepository.findTaskState(employeeId, FIRST_TASK_KEY);
      return state?.completedAt != null;
    },
  };
}
