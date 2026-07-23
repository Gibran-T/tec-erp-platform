import { loadStoredTokens } from "./auth.js";
import { getApiBaseUrl } from "./health.js";
import { safeFetch } from "./http.js";

function requireAccessToken(): string {
  const tokens = loadStoredTokens();
  if (!tokens?.accessToken) {
    throw new Error("Authentification requise.");
  }
  return tokens.accessToken;
}

async function parseJson<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    let detail = fallback;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) {
        detail = body.error.message;
      }
    } catch {
      // keep fallback
    }
    throw new Error(detail);
  }
  return (await response.json()) as T;
}

export interface AnalyticsKpiCard {
  readonly key: string;
  readonly label: string;
  readonly value: number | null;
  readonly unit: string;
  readonly trend: "up" | "down" | "stable" | "unknown";
  readonly stale: boolean;
  readonly formattedValue: string;
}

export interface AnalyticsExceptionRow {
  readonly id: string;
  readonly category: string;
  readonly severity: "low" | "medium" | "high";
  readonly summary: string;
  readonly sourceType: string;
  readonly detectedAt: string;
}

export interface AnalyticsDashboardResponse {
  readonly dashboards: Array<{ id: string; title: string; description: string }>;
  readonly summaryText: string;
  readonly generatedAt: string;
}

export async function getAnalyticsDashboards() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/analytics/dashboards`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<AnalyticsDashboardResponse>(
    response,
    "Impossible de charger les tableaux de bord.",
  );
}

export async function getAnalyticsKpis(dashboardId?: string) {
  const token = requireAccessToken();
  const query = dashboardId ? `?dashboardId=${encodeURIComponent(dashboardId)}` : "";
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/analytics/kpis${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ kpis: AnalyticsKpiCard[] }>(response, "Impossible de charger les indicateurs.");
}

export async function getAnalyticsExceptions() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/analytics/exceptions`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ exceptions: AnalyticsExceptionRow[] }>(
    response,
    "Impossible de charger les exceptions.",
  );
}

/** Matches `GET /api/v1/professor/analytics/heatmap` (analytics.service). */
export interface ProfessorHeatmapStudentRow {
  readonly studentId: string;
  readonly employeeNumber: string;
  readonly displayName: string;
  readonly completedMissions: number;
  readonly moduleCounts: Record<string, number>;
  readonly curriculumVersion: string;
  readonly officialRunCode: string | null;
  readonly runCount: number;
  readonly note: string;
}

export interface ProfessorHeatmapResponse {
  readonly mode?: string;
  readonly enrolledStudentCount: number;
  readonly curriculumVersionsPresent: string[];
  readonly rows: ProfessorHeatmapStudentRow[];
}

/** Matches `GET /api/v1/professor/analytics/competencies`. */
export interface ProfessorCompetencyRow {
  readonly moduleCode: string;
  readonly title: string;
  readonly missionCount: number;
  readonly coveragePercent: number;
}

export interface ProfessorCompetencyResponse {
  readonly mode?: string;
  readonly enrolledStudentCount: number;
  readonly competencies: ProfessorCompetencyRow[];
}

export const EMPTY_PROFESSOR_HEATMAP: ProfessorHeatmapResponse = {
  enrolledStudentCount: 0,
  curriculumVersionsPresent: [],
  rows: [],
};

export const EMPTY_PROFESSOR_COMPETENCIES: ProfessorCompetencyResponse = {
  enrolledStudentCount: 0,
  competencies: [],
};

export async function getProfessorAnalyticsHeatmap(): Promise<ProfessorHeatmapResponse> {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/analytics/heatmap`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<ProfessorHeatmapResponse>(
    response,
    "Impossible de charger la carte de chaleur.",
  );
}

export async function getProfessorCompetencySummary(): Promise<ProfessorCompetencyResponse> {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/analytics/competencies`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<ProfessorCompetencyResponse>(
    response,
    "Impossible de charger le resume des competences.",
  );
}
