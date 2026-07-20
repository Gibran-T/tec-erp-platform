import {
  FIRST_TASK_KEY,
  MANAGER_MESSAGE_KEY,
} from "../first-day/first-day.catalog.js";
import type { FirstDayStateRepository } from "../first-day/first-day.types.js";

export type OrganizationFirstDayStateReader = Pick<
  FirstDayStateRepository,
  "findMessageState" | "findTaskState"
>;

export interface OrganizationAccessReader {
  hasCompletedFirstDay(employeeId: string): Promise<boolean>;
}

export function createOrganizationAccessReader(
  stateReader: OrganizationFirstDayStateReader,
): OrganizationAccessReader {
  return {
    async hasCompletedFirstDay(employeeId) {
      const [messageState, taskState] = await Promise.all([
        stateReader.findMessageState(employeeId, MANAGER_MESSAGE_KEY),
        stateReader.findTaskState(employeeId, FIRST_TASK_KEY),
      ]);

      return messageState?.readAt != null && taskState?.completedAt != null;
    },
  };
}
