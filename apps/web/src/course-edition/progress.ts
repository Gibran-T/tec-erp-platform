import type { CourseEditionProgressRecord } from "@tec-platform/contracts";

import {
  fetchCourseEditionProgress,
  persistCourseEditionProgress,
} from "../api/course-edition.js";
import type { CourseEditionSurfaceId } from "./types.js";

const STORAGE_PREFIX = "tec.course-edition.progress.v1";

export interface CourseEditionProgressState {
  readonly moduleCode: string;
  readonly completedSurfaces: readonly CourseEditionSurfaceId[];
  readonly connectionLabPassed: boolean;
  readonly connectionLabScorePercent: number | null;
  readonly quizPassed: boolean;
  readonly quizPercent: number | null;
  readonly framesViewed: readonly string[];
  readonly documentsOpened: readonly string[];
  readonly updatedAt: string;
}

function storageKey(moduleCode: string): string {
  return `${STORAGE_PREFIX}:${moduleCode.toUpperCase()}`;
}

export function emptyProgress(moduleCode: string): CourseEditionProgressState {
  return {
    moduleCode: moduleCode.toUpperCase(),
    completedSurfaces: [],
    connectionLabPassed: false,
    connectionLabScorePercent: null,
    quizPassed: false,
    quizPercent: null,
    framesViewed: [],
    documentsOpened: [],
    updatedAt: new Date(0).toISOString(),
  };
}

export function computeSurfaceProgressPercent(state: CourseEditionProgressState): number {
  const weights: CourseEditionSurfaceId[] = ["apprendre", "connecter", "missions", "bilan"];
  const done = weights.filter((surface) => state.completedSurfaces.includes(surface)).length;
  return Math.round((done / weights.length) * 100);
}

export function isCourseEditionModuleComplete(state: CourseEditionProgressState): boolean {
  return (
    state.completedSurfaces.length >= 4 && state.connectionLabPassed && state.quizPassed
  );
}

function toServerRecord(state: CourseEditionProgressState): CourseEditionProgressRecord {
  return {
    moduleCode: state.moduleCode.toUpperCase(),
    completedSurfaces: [...state.completedSurfaces],
    connectionLabPassed: state.connectionLabPassed,
    connectionLabScorePercent: state.connectionLabScorePercent,
    quizPassed: state.quizPassed,
    quizPercent: state.quizPercent,
    framesViewed: [...state.framesViewed],
    documentsOpened: [...state.documentsOpened],
    progressPercent: computeSurfaceProgressPercent(state),
    moduleComplete: isCourseEditionModuleComplete(state),
    updatedAt: state.updatedAt,
  };
}

function fromServerRecord(record: CourseEditionProgressRecord): CourseEditionProgressState {
  return {
    moduleCode: record.moduleCode.toUpperCase(),
    completedSurfaces: record.completedSurfaces,
    connectionLabPassed: record.connectionLabPassed,
    connectionLabScorePercent: record.connectionLabScorePercent,
    quizPassed: record.quizPassed,
    quizPercent: record.quizPercent,
    framesViewed: record.framesViewed,
    documentsOpened: record.documentsOpened,
    updatedAt: record.updatedAt,
  };
}

function preferNewer(
  local: CourseEditionProgressState,
  remote: CourseEditionProgressState | null,
): CourseEditionProgressState {
  if (!remote) {
    return local;
  }
  const localTs = Date.parse(local.updatedAt);
  const remoteTs = Date.parse(remote.updatedAt);
  if (Number.isNaN(remoteTs)) {
    return local;
  }
  if (Number.isNaN(localTs) || remoteTs >= localTs) {
    return remote;
  }
  return local;
}

export function loadCourseEditionProgress(moduleCode: string): CourseEditionProgressState {
  if (typeof window === "undefined") {
    return emptyProgress(moduleCode);
  }
  try {
    const raw = window.localStorage.getItem(storageKey(moduleCode));
    if (!raw) {
      return emptyProgress(moduleCode);
    }
    const parsed = JSON.parse(raw) as CourseEditionProgressState;
    if (parsed.moduleCode?.toUpperCase() !== moduleCode.toUpperCase()) {
      return emptyProgress(moduleCode);
    }
    return parsed;
  } catch {
    return emptyProgress(moduleCode);
  }
}

function queueServerPersist(state: CourseEditionProgressState): void {
  if (typeof window === "undefined") {
    return;
  }
  void persistCourseEditionProgress(toServerRecord(state)).catch(() => {
    // Local cache remains available offline; server metadata powers PCC when sync succeeds.
  });
}

export function saveCourseEditionProgress(state: CourseEditionProgressState): CourseEditionProgressState {
  if (typeof window === "undefined") {
    return state;
  }
  const next: CourseEditionProgressState = {
    ...state,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(storageKey(state.moduleCode), JSON.stringify(next));
  queueServerPersist(next);
  return next;
}

export async function hydrateCourseEditionProgress(
  moduleCode: string,
): Promise<CourseEditionProgressState> {
  const local = loadCourseEditionProgress(moduleCode);
  try {
    const remoteRecord = await fetchCourseEditionProgress(moduleCode);
    const remote = remoteRecord ? fromServerRecord(remoteRecord) : null;
    const merged = preferNewer(local, remote);
    window.localStorage.setItem(storageKey(moduleCode), JSON.stringify(merged));
    if (remote && merged === local && local.updatedAt !== remote.updatedAt) {
      queueServerPersist(local);
    }
    return merged;
  } catch {
    return local;
  }
}

export function markSurfaceComplete(
  moduleCode: string,
  surfaceId: CourseEditionSurfaceId,
): CourseEditionProgressState {
  const current = loadCourseEditionProgress(moduleCode);
  const completedSurfaces = current.completedSurfaces.includes(surfaceId)
    ? current.completedSurfaces
    : [...current.completedSurfaces, surfaceId];
  return saveCourseEditionProgress({
    ...current,
    completedSurfaces,
  });
}

export function markFrameViewed(moduleCode: string, frameId: string): CourseEditionProgressState {
  const current = loadCourseEditionProgress(moduleCode);
  const framesViewed = current.framesViewed.includes(frameId)
    ? current.framesViewed
    : [...current.framesViewed, frameId];
  return saveCourseEditionProgress({ ...current, framesViewed });
}

export function markDocumentOpened(
  moduleCode: string,
  documentId: string,
): CourseEditionProgressState {
  const current = loadCourseEditionProgress(moduleCode);
  const documentsOpened = current.documentsOpened.includes(documentId)
    ? current.documentsOpened
    : [...current.documentsOpened, documentId];
  return saveCourseEditionProgress({ ...current, documentsOpened });
}

export function recordConnectionLabResult(
  moduleCode: string,
  scorePercent: number,
  passed: boolean,
): CourseEditionProgressState {
  const current = loadCourseEditionProgress(moduleCode);
  return saveCourseEditionProgress({
    ...current,
    connectionLabPassed: passed || current.connectionLabPassed,
    connectionLabScorePercent: scorePercent,
    completedSurfaces:
      passed && !current.completedSurfaces.includes("connecter")
        ? [...current.completedSurfaces, "connecter"]
        : current.completedSurfaces,
  });
}

export function recordQuizResult(
  moduleCode: string,
  percent: number,
  passed: boolean,
): CourseEditionProgressState {
  const current = loadCourseEditionProgress(moduleCode);
  return saveCourseEditionProgress({
    ...current,
    quizPassed: passed || current.quizPassed,
    quizPercent: percent,
    completedSurfaces:
      passed && !current.completedSurfaces.includes("bilan")
        ? [...current.completedSurfaces, "bilan"]
        : current.completedSurfaces,
  });
}
