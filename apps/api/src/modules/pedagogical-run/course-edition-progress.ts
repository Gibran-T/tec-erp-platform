import type {
  CourseEditionProgressRecord,
  CourseEditionSurfaceId,
  UpsertCourseEditionProgressRequest,
} from "@tec-platform/contracts";

const SURFACE_ORDER: readonly CourseEditionSurfaceId[] = [
  "apprendre",
  "connecter",
  "missions",
  "bilan",
];

function uniqueSurfaces(values: readonly string[]): CourseEditionSurfaceId[] {
  const allowed = new Set<string>(SURFACE_ORDER);
  const out: CourseEditionSurfaceId[] = [];
  for (const value of values) {
    if (!allowed.has(value)) continue;
    const surface = value as CourseEditionSurfaceId;
    if (!out.includes(surface)) {
      out.push(surface);
    }
  }
  return out;
}

export function computeCourseEditionProgressPercent(
  completedSurfaces: readonly CourseEditionSurfaceId[],
): number {
  const done = SURFACE_ORDER.filter((surface) => completedSurfaces.includes(surface)).length;
  return Math.round((done / SURFACE_ORDER.length) * 100);
}

export function normalizeCourseEditionProgress(
  moduleCode: string,
  input: UpsertCourseEditionProgressRequest | CourseEditionProgressRecord,
): CourseEditionProgressRecord {
  const completedSurfaces = uniqueSurfaces(input.completedSurfaces);
  const progressPercent =
    typeof input.progressPercent === "number"
      ? Math.max(0, Math.min(100, Math.round(input.progressPercent)))
      : computeCourseEditionProgressPercent(completedSurfaces);
  const moduleComplete =
    typeof input.moduleComplete === "boolean"
      ? input.moduleComplete
      : completedSurfaces.length >= 4 && input.connectionLabPassed && input.quizPassed;

  return {
    moduleCode: moduleCode.toUpperCase(),
    completedSurfaces,
    connectionLabPassed: input.connectionLabPassed,
    connectionLabScorePercent: input.connectionLabScorePercent,
    quizPassed: input.quizPassed,
    quizPercent: input.quizPercent,
    framesViewed: [...new Set(input.framesViewed)].slice(0, 40),
    documentsOpened: [...new Set(input.documentsOpened)].slice(0, 40),
    progressPercent,
    moduleComplete,
    updatedAt:
      "updatedAt" in input && typeof input.updatedAt === "string" && input.updatedAt.length > 0
        ? input.updatedAt
        : new Date().toISOString(),
  };
}

export function parseStoredCourseEditionProgress(
  progressJson: unknown,
  moduleCode: string,
): CourseEditionProgressRecord | null {
  if (!progressJson || typeof progressJson !== "object" || Array.isArray(progressJson)) {
    return null;
  }
  const raw = progressJson as UpsertCourseEditionProgressRequest & {
    updatedAt?: string;
  };
  if (!Array.isArray(raw.completedSurfaces)) {
    return null;
  }
  return normalizeCourseEditionProgress(moduleCode, {
    moduleCode: moduleCode.toUpperCase(),
    completedSurfaces: raw.completedSurfaces,
    connectionLabPassed: Boolean(raw.connectionLabPassed),
    connectionLabScorePercent:
      typeof raw.connectionLabScorePercent === "number" ? raw.connectionLabScorePercent : null,
    quizPassed: Boolean(raw.quizPassed),
    quizPercent: typeof raw.quizPercent === "number" ? raw.quizPercent : null,
    framesViewed: Array.isArray(raw.framesViewed)
      ? raw.framesViewed.filter((item): item is string => typeof item === "string")
      : [],
    documentsOpened: Array.isArray(raw.documentsOpened)
      ? raw.documentsOpened.filter((item): item is string => typeof item === "string")
      : [],
    progressPercent: typeof raw.progressPercent === "number" ? raw.progressPercent : undefined,
    moduleComplete: typeof raw.moduleComplete === "boolean" ? raw.moduleComplete : undefined,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date(0).toISOString(),
  });
}
