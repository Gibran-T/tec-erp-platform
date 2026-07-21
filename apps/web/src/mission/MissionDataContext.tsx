import type {
  CourseOverviewResponse,
  MissionDetail,
  MissionScoreSummary,
  MissionStatus,
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

import { requestCourse } from "../api/course.js";
import {
  requestMissionDetail,
  requestMissions,
  requestStartMission,
  requestSubmitMission,
  type MissionSubmitBody,
} from "../api/mission.js";

const FALLBACK_LOAD_ERROR =
  "Impossible de charger le Centre de mission. Veuillez réessayer.";
const FALLBACK_START_ERROR = "Impossible de démarrer la mission. Veuillez réessayer.";
const FALLBACK_SUBMIT_ERROR =
  "Impossible de soumettre votre découverte. Veuillez réessayer.";

function toMissionListStatus(attemptStatus: string): MissionStatus {
  return attemptStatus === "completed" ? "completed" : "in_progress";
}

export interface MissionDataContextValue {
  readonly course: CourseOverviewResponse | null;
  readonly missions: MissionsResponse | null;
  readonly selectedMission: MissionDetail | null;
  readonly lastScore: MissionScoreSummary | null;
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
  readonly submitMission: (missionKey: string, body: MissionSubmitBody) => Promise<boolean>;
  readonly clearStartError: () => void;
  readonly clearSubmitError: () => void;
  readonly clearLastScore: () => void;
}

const MissionDataContext = createContext<MissionDataContextValue | null>(null);

export interface MissionDataProviderProps {
  readonly children: ReactNode;
}

export function MissionDataProvider({ children }: MissionDataProviderProps): ReactNode {
  const [course, setCourse] = useState<CourseOverviewResponse | null>(null);
  const [missions, setMissions] = useState<MissionsResponse | null>(null);
  const [selectedMission, setSelectedMission] = useState<MissionDetail | null>(null);
  const [lastScore, setLastScore] = useState<MissionScoreSummary | null>(null);
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
      const [missionsResponse, courseResponse] = await Promise.all([
        requestMissions(),
        requestCourse(),
      ]);
      setMissions(missionsResponse);
      setCourse(courseResponse);

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
    setLastScore(null);

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
    setLastScore(null);
  }, []);

  const startMission = useCallback(async (missionKey: string): Promise<boolean> => {
    setStarting(true);
    setStartError(null);
    setLastScore(null);

    try {
      const started = await requestStartMission(missionKey);
      setSelectedMission((current) =>
        current
          ? {
              ...current,
              status: toMissionListStatus(started.attempt.status),
              attempt: started.attempt,
            }
          : current,
      );
      const [missionsResponse, courseResponse] = await Promise.all([
        requestMissions(),
        requestCourse(),
      ]);
      setMissions(missionsResponse);
      setCourse(courseResponse);
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
  }, []);

  const submitMission = useCallback(
    async (missionKey: string, body: MissionSubmitBody): Promise<boolean> => {
      setSubmitting(true);
      setSubmitError(null);

      try {
        const submitted = await requestSubmitMission(missionKey, body);
        const nextStatus =
          submitted.score?.passed === false
            ? "in_progress"
            : submitted.attempt.status === "completed"
              ? "completed"
              : "in_progress";

        setSelectedMission((current) =>
          current
            ? {
                ...current,
                status: nextStatus,
                attempt: submitted.attempt,
              }
            : current,
        );
        setLastScore(submitted.score ?? null);

        try {
          const [missionsResponse, courseResponse] = await Promise.all([
            requestMissions(),
            requestCourse(),
          ]);
          setMissions(missionsResponse);
          setCourse(courseResponse);
        } catch {
          // Submission already succeeded; list refresh is best-effort.
        }

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
      course,
      missions,
      selectedMission,
      lastScore,
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
      clearLastScore: () => setLastScore(null),
    }),
    [
      course,
      missions,
      selectedMission,
      lastScore,
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
