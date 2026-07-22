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

export async function getProfessorAnalyticsHeatmap() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/analytics/heatmap`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{
    mode?: string;
    enrolledStudentCount?: number;
    curriculumVersionsPresent?: string[];
    rows: Array<Record<string, unknown>>;
  }>(response, "Impossible de charger la carte de chaleur.");
}

export async function getProfessorCompetencySummary() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/analytics/competencies`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{
    mode?: string;
    enrolledStudentCount?: number;
    competencies: Array<Record<string, unknown>>;
  }>(response, "Impossible de charger le resume des competences.");
}
