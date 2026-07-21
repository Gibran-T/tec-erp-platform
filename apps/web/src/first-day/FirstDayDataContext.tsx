import type { InboxResponse, TasksResponse } from "@tec-platform/contracts";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  requestCompleteTask,
  requestInbox,
  requestMarkMessageRead,
  requestTasks,
} from "../api/first-day.js";

const FALLBACK_MARK_READ_ERROR =
  "Impossible de marquer le message comme lu. Veuillez réessayer.";
const FALLBACK_COMPLETE_TASK_ERROR = "Impossible de terminer la tâche. Veuillez réessayer.";
const FALLBACK_LOAD_ERROR =
  "Impossible de charger vos informations de première journée. Veuillez réessayer.";

export interface FirstDayDataContextValue {
  readonly inbox: InboxResponse | null;
  readonly tasks: TasksResponse | null;
  readonly initialLoading: boolean;
  readonly refreshing: boolean;
  readonly loadError: string | null;
  readonly markReadError: string | null;
  readonly completeTaskError: string | null;
  readonly markingMessageKey: string | null;
  readonly completingTaskKey: string | null;
  readonly messageReadSuccess: boolean;
  readonly taskCompleteSuccess: boolean;
  readonly refresh: (options?: { quiet?: boolean }) => Promise<void>;
  readonly markMessageRead: (messageKey: string) => Promise<boolean>;
  readonly completeTask: (taskKey: string) => Promise<boolean>;
  readonly clearMarkReadError: () => void;
  readonly clearCompleteTaskError: () => void;
}

const FirstDayDataContext = createContext<FirstDayDataContextValue | null>(null);

export interface FirstDayDataProviderProps {
  readonly children: ReactNode;
}

export function FirstDayDataProvider({ children }: FirstDayDataProviderProps): ReactNode {
  const [inbox, setInbox] = useState<InboxResponse | null>(null);
  const [tasks, setTasks] = useState<TasksResponse | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [markReadError, setMarkReadError] = useState<string | null>(null);
  const [completeTaskError, setCompleteTaskError] = useState<string | null>(null);
  const [markingMessageKey, setMarkingMessageKey] = useState<string | null>(null);
  const [completingTaskKey, setCompletingTaskKey] = useState<string | null>(null);
  const [messageReadSuccess, setMessageReadSuccess] = useState(false);
  const [taskCompleteSuccess, setTaskCompleteSuccess] = useState(false);

  const refresh = useCallback(async (options?: { quiet?: boolean }) => {
    const quiet = options?.quiet === true;

    if (quiet) {
      setRefreshing(true);
    } else {
      setInitialLoading(true);
      setLoadError(null);
    }

    try {
      const [inboxResponse, tasksResponse] = await Promise.all([requestInbox(), requestTasks()]);
      setInbox(inboxResponse);
      setTasks(tasksResponse);
      setLoadError(null);
    } catch (refreshError) {
      const message =
        refreshError instanceof Error ? refreshError.message : FALLBACK_LOAD_ERROR;

      if (!quiet) {
        setLoadError(message);
      }
    } finally {
      if (quiet) {
        setRefreshing(false);
      } else {
        setInitialLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh({ quiet: false });
  }, [refresh]);

  const markMessageRead = useCallback(
    async (messageKey: string): Promise<boolean> => {
      setMarkingMessageKey(messageKey);
      setMarkReadError(null);

      try {
        await requestMarkMessageRead(messageKey);
        await refresh({ quiet: true });
        setMessageReadSuccess(true);
        return true;
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : FALLBACK_MARK_READ_ERROR;
        setMarkReadError(message);
        return false;
      } finally {
        setMarkingMessageKey(null);
      }
    },
    [refresh],
  );

  const completeTask = useCallback(
    async (taskKey: string): Promise<boolean> => {
      setCompletingTaskKey(taskKey);
      setCompleteTaskError(null);

      try {
        await requestCompleteTask(taskKey);
        await refresh({ quiet: true });
        setTaskCompleteSuccess(true);
        return true;
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : FALLBACK_COMPLETE_TASK_ERROR;
        setCompleteTaskError(message);
        return false;
      } finally {
        setCompletingTaskKey(null);
      }
    },
    [refresh],
  );

  const clearMarkReadError = useCallback(() => {
    setMarkReadError(null);
  }, []);

  const clearCompleteTaskError = useCallback(() => {
    setCompleteTaskError(null);
  }, []);

  const value = useMemo<FirstDayDataContextValue>(
    () => ({
      inbox,
      tasks,
      initialLoading,
      refreshing,
      loadError,
      markReadError,
      completeTaskError,
      markingMessageKey,
      completingTaskKey,
      messageReadSuccess,
      taskCompleteSuccess,
      refresh,
      markMessageRead,
      completeTask,
      clearMarkReadError,
      clearCompleteTaskError,
    }),
    [
      inbox,
      tasks,
      initialLoading,
      refreshing,
      loadError,
      markReadError,
      completeTaskError,
      markingMessageKey,
      completingTaskKey,
      messageReadSuccess,
      taskCompleteSuccess,
      refresh,
      markMessageRead,
      completeTask,
      clearMarkReadError,
      clearCompleteTaskError,
    ],
  );

  return <FirstDayDataContext.Provider value={value}>{children}</FirstDayDataContext.Provider>;
}

export function useFirstDayData(): FirstDayDataContextValue {
  const value = useContext(FirstDayDataContext);

  if (!value) {
    throw new Error("useFirstDayData must be used within FirstDayDataProvider.");
  }

  return value;
}
