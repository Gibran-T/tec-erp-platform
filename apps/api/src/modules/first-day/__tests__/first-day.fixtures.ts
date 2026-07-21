import type {
  FirstDayStateRepository,
  MessageStateRecord,
  TaskStateRecord,
} from "../first-day.types.js";

export function createInMemoryFirstDayStateRepository(
  initial: {
    readonly messages?: readonly MessageStateRecord[];
    readonly tasks?: readonly TaskStateRecord[];
  } = {},
): FirstDayStateRepository {
  const messages = [...(initial.messages ?? [])];
  const tasks = [...(initial.tasks ?? [])];

  return {
    findMessageState(employeeId, messageKey) {
      const row = messages.find(
        (state) => state.employeeId === employeeId && state.messageKey === messageKey,
      );
      return Promise.resolve(row ?? null);
    },

    findMessageStates(employeeId) {
      return Promise.resolve(messages.filter((state) => state.employeeId === employeeId));
    },

    createMessageState(employeeId, messageKey, readAt) {
      const record: MessageStateRecord = { employeeId, messageKey, readAt };
      messages.push(record);
      return Promise.resolve(record);
    },

    findTaskState(employeeId, taskKey) {
      const row = tasks.find(
        (state) => state.employeeId === employeeId && state.taskKey === taskKey,
      );
      return Promise.resolve(row ?? null);
    },

    findTaskStates(employeeId) {
      return Promise.resolve(tasks.filter((state) => state.employeeId === employeeId));
    },

    createTaskState(employeeId, taskKey, completedAt) {
      const record: TaskStateRecord = { employeeId, taskKey, completedAt };
      tasks.push(record);
      return Promise.resolve(record);
    },
  };
}
