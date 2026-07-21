import { DomainError, Result, type Result as ResultType } from "@tec-platform/core";
import type {
  CompleteTaskResponse,
  InboxResponse,
  MarkMessageReadResponse,
  MessageKey,
  TaskKey,
  TasksResponse,
} from "@tec-platform/contracts";

import {
  FIRST_DAY_MESSAGE_CATALOG,
  FIRST_DAY_TASK_CATALOG,
  isKnownMessageKey,
  isKnownTaskKey,
  MANAGER_MESSAGE_KEY,
} from "./first-day.catalog.js";
import type { FirstDayStateRepository } from "./first-day.types.js";

export interface FirstDayServiceDependencies {
  readonly stateRepository: FirstDayStateRepository;
  readonly now?: () => Date;
}

export interface FirstDayService {
  getInbox(employeeId: string): Promise<InboxResponse>;
  markMessageRead(employeeId: string, messageKey: string): Promise<ResultType<MarkMessageReadResponse>>;
  getTasks(employeeId: string): Promise<TasksResponse>;
  completeTask(employeeId: string, taskKey: string): Promise<ResultType<CompleteTaskResponse>>;
}

export function createFirstDayService(dependencies: FirstDayServiceDependencies): FirstDayService {
  const { stateRepository } = dependencies;
  const now = dependencies.now ?? (() => new Date());

  return {
    async getInbox(employeeId) {
      const states = await stateRepository.findMessageStates(employeeId);
      const readAtByKey = new Map(states.map((state) => [state.messageKey, state.readAt]));

      const messages = FIRST_DAY_MESSAGE_CATALOG.map((catalogMessage) => {
        const readAt = readAtByKey.get(catalogMessage.messageKey) ?? null;

        return {
          messageKey: catalogMessage.messageKey,
          fromName: catalogMessage.fromName,
          subject: catalogMessage.subject,
          preview: catalogMessage.preview,
          body: catalogMessage.body,
          readAt: readAt ? readAt.toISOString() : null,
        };
      });

      const unreadCount = messages.filter((message) => message.readAt === null).length;

      return { messages, unreadCount };
    },

    async markMessageRead(employeeId, messageKey) {
      if (!isKnownMessageKey(messageKey)) {
        return Result.fail(DomainError.notFound("Message not found."));
      }

      const existing = await stateRepository.findMessageState(employeeId, messageKey);

      if (existing) {
        return Result.ok({
          messageKey: messageKey as MessageKey,
          readAt: existing.readAt.toISOString(),
        });
      }

      const created = await stateRepository.createMessageState(employeeId, messageKey, now());

      return Result.ok({
        messageKey: messageKey as MessageKey,
        readAt: created.readAt.toISOString(),
      });
    },

    async getTasks(employeeId) {
      const managerRead = await stateRepository.findMessageState(
        employeeId,
        MANAGER_MESSAGE_KEY,
      );

      if (!managerRead) {
        return { tasks: [] };
      }

      const taskStates = await stateRepository.findTaskStates(employeeId);
      const completedAtByKey = new Map(
        taskStates.map((state) => [state.taskKey, state.completedAt]),
      );

      const tasks = FIRST_DAY_TASK_CATALOG.map((catalogTask) => {
        const completedAt = completedAtByKey.get(catalogTask.taskKey);

        return {
          taskKey: catalogTask.taskKey,
          title: catalogTask.title,
          description: catalogTask.description,
          status: completedAt ? ("terminee" as const) : ("a_faire" as const),
        };
      });

      return { tasks };
    },

    async completeTask(employeeId, taskKey) {
      if (!isKnownTaskKey(taskKey)) {
        return Result.fail(DomainError.notFound("Task not found."));
      }

      const managerRead = await stateRepository.findMessageState(
        employeeId,
        MANAGER_MESSAGE_KEY,
      );

      if (!managerRead) {
        return Result.fail(
          DomainError.conflict(
            "Complete the manager welcome message before finishing tasks.",
          ),
        );
      }

      const existing = await stateRepository.findTaskState(employeeId, taskKey);

      if (existing) {
        return Result.ok({
          taskKey: taskKey as TaskKey,
          completedAt: existing.completedAt.toISOString(),
        });
      }

      const created = await stateRepository.createTaskState(employeeId, taskKey, now());

      return Result.ok({
        taskKey: taskKey as TaskKey,
        completedAt: created.completedAt.toISOString(),
      });
    },
  };
}
