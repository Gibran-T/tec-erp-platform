import type {
  MissionDetail,
  MissionStatus,
  MissionSubmitRequest,
  MissionsResponse,
} from "@tec-platform/contracts";
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
  requestMissionDetail,
  requestMissions,
  requestStartMission,
  requestSubmitMission,
} from "../api/mission.js";

const FALLBACK_LOAD_ERROR =
  "Impossible de charger le Centre de mission. Veuillez réessayer.";
const FALLBACK_START_ERROR = "Impossible de démarrer la mission. Veuillez réessayer.";
const FALLBACK_SUBMIT_ERROR =
  "Impossible de soumettre votre découverte. Veuillez réessayer.";

export interface MissionDataContextValue {
  readonly missions: MissionsResponse | null;
  readonly selectedMission: MissionDetail | null;
  readonly summaryStatus: MissionStatus | null;
  readonly initialLoading: boolean;
  readonly refreshing: boolean;
  readonly loadError: string | null;
  readonly startError: string | null;
  readonly submitError: string | null;
  readonly starting: boolean;
  readonly submitting: boolean;
  readonly refresh: (options?: { quiet?: boolean }) => Promise<void>;
  readonly selectMission: (missionKey: string) => Promise<void>;
  readonly clearSelectedMission: () => void;
  readonly startMission: (missionKey: string) => Promise<boolean>;
  readonly submitMission: (
    missionKey: string,
    body: MissionSubmitRequest,
  ) => Promise<boolean>;
  readonly clearStartError: () => void;
  readonly clearSubmitError: () => void;
}

const MissionDataContext = createContext<MissionDataContextValue | null>(null);

export interface MissionDataProviderProps {
  readonly children: ReactNode;
}

export function MissionDataProvider({ children }: MissionDataProviderProps): ReactNode {
  const [missions, setMissions] = useState<MissionsResponse | null>(null);
  const [selectedMission, setSelectedMission] = useState<MissionDetail | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async (options?: { quiet?: boolean }) => {
    const quiet = options?.quiet === true;

    if (quiet) {
      setRefreshing(true);
    } else {
      setInitialLoading(true);
      setLoadError(null);
    }

    try {
      const missionsResponse = await requestMissions();
      setMissions(missionsResponse);

      let detailKey: string | null = null;
      setSelectedMission((current) => {
        detailKey = current?.missionKey ?? null;
        return current;
      });

      if (detailKey) {
        const detail = await requestMissionDetail(detailKey);
        setSelectedMission(detail);
      }

      setLoadError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : FALLBACK_LOAD_ERROR;
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

  const selectMission = useCallback(async (missionKey: string) => {
    setLoadError(null);

    try {
      const detail = await requestMissionDetail(missionKey);
      setSelectedMission(detail);
    } catch (error) {
      const message = error instanceof Error ? error.message : FALLBACK_LOAD_ERROR;
      setLoadError(message);
    }
  }, []);

  const clearSelectedMission = useCallback(() => {
    setSelectedMission(null);
  }, []);

  const startMission = useCallback(
    async (missionKey: string): Promise<boolean> => {
      setStarting(true);
      setStartError(null);

      try {
        const started = await requestStartMission(missionKey);
        setSelectedMission((current) =>
          current
            ? {
                ...current,
                status: started.attempt.status === "completed" ? "completed" : "in_progress",
                attempt: started.attempt,
              }
            : current,
        );
        const missionsResponse = await requestMissions();
        setMissions(missionsResponse);
        return true;
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : FALLBACK_START_ERROR;
        setStartError(message);
        return false;
      } finally {
        setStarting(false);
      }
    },
    [],
  );

  const submitMission = useCallback(
    async (missionKey: string, body: MissionSubmitRequest): Promise<boolean> => {
      setSubmitting(true);
      setSubmitError(null);

      try {
        const submitted = await requestSubmitMission(missionKey, body);
        setSelectedMission((current) =>
          current
            ? {
                ...current,
                status: "completed",
                attempt: submitted.attempt,
              }
            : current,
        );
        const missionsResponse = await requestMissions();
        setMissions(missionsResponse);
        return true;
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : FALLBACK_SUBMIT_ERROR;
        setSubmitError(message);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [],
  );

  const value = useMemo<MissionDataContextValue>(
    () => ({
      missions,
      selectedMission,
      summaryStatus: missions?.missions[0]?.status ?? null,
      initialLoading,
      refreshing,
      loadError,
      startError,
      submitError,
      starting,
      submitting,
      refresh,
      selectMission,
      clearSelectedMission,
      startMission,
      submitMission,
      clearStartError: () => setStartError(null),
      clearSubmitError: () => setSubmitError(null),
    }),
    [
      missions,
      selectedMission,
      initialLoading,
      refreshing,
      loadError,
      startError,
      submitError,
      starting,
      submitting,
      refresh,
      selectMission,
      clearSelectedMission,
      startMission,
      submitMission,
    ],
  );

  return <MissionDataContext.Provider value={value}>{children}</MissionDataContext.Provider>;
}

export function useMissionData(): MissionDataContextValue {
  const value = useContext(MissionDataContext);

  if (!value) {
    throw new Error("useMissionData must be used within MissionDataProvider.");
  }

  return value;
}
