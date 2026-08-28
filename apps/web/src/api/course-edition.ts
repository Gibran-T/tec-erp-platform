import type { CourseEditionProgressRecord } from "@tec-platform/contracts";

import { loadStoredTokens } from "./auth.js";
import { getApiBaseUrl } from "./health.js";
import { safeFetch } from "./http.js";

async function authHeaders(): Promise<HeadersInit> {
  const tokens = loadStoredTokens();
  if (!tokens) {
    throw new Error("Session requise.");
  }
  return {
    Authorization: `Bearer ${tokens.accessToken}`,
    "Content-Type": "application/json",
  };
}

export async function fetchCourseEditionProgress(
  moduleCode: string,
): Promise<CourseEditionProgressRecord | null> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/me/course-edition/${encodeURIComponent(moduleCode.toUpperCase())}`,
    { headers: await authHeaders() },
  );
  if (!response.ok) {
    return null;
  }
  const body = (await response.json()) as { progress?: CourseEditionProgressRecord | null };
  return body.progress ?? null;
}

export async function persistCourseEditionProgress(
  progress: CourseEditionProgressRecord,
): Promise<CourseEditionProgressRecord | null> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/me/course-edition/${encodeURIComponent(progress.moduleCode)}`,
    {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify({
        moduleCode: progress.moduleCode,
        completedSurfaces: progress.completedSurfaces,
        connectionLabPassed: progress.connectionLabPassed,
        connectionLabScorePercent: progress.connectionLabScorePercent,
        quizPassed: progress.quizPassed,
        quizPercent: progress.quizPercent,
        framesViewed: progress.framesViewed,
        documentsOpened: progress.documentsOpened,
        progressPercent: progress.progressPercent,
        moduleComplete: progress.moduleComplete,
        updatedAt: progress.updatedAt,
      }),
    },
  );
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as CourseEditionProgressRecord;
}
