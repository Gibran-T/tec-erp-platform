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

export interface CapstoneSubmissionView {
  readonly id: string;
  readonly status: string;
  readonly diagnose: string;
  readonly prioritize: string;
  readonly execute: string;
  readonly analyze: string;
  readonly recommend: string;
  readonly executiveSummary: string | null;
  readonly submittedAt: string | null;
  readonly reviewStatus: string | null;
  readonly professorNotes?: string | null;
  readonly lifecycleStatus?: string;
  readonly lifecycleStatusLabel?: string;
  readonly currentStage?: string | null;
  readonly separateFromRegularMissions?: boolean;
  readonly stages?: ReadonlyArray<{ readonly code: string; readonly title: string }>;
}

export interface CapstoneSubmitPayload {
  readonly diagnose: string;
  readonly prioritize: string;
  readonly execute: string;
  readonly analyze: string;
  readonly recommend: string;
  readonly executiveSummary: string;
}

export async function getCapstoneSubmission() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/capstone/submission`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<CapstoneSubmissionView>(response, "Impossible de charger le dossier capstone.");
}

export async function submitCapstoneExecutiveSummary(payload: CapstoneSubmitPayload) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/capstone/submission`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<CapstoneSubmissionView>(response, "Impossible de soumettre le dossier capstone.");
}

export async function listProfessorCapstoneQueue() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/capstone/submissions`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ submissions: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger la file capstone.",
  );
}

export async function reviewProfessorCapstoneSubmission(
  submissionId: string,
  payload: { approved: boolean; notes?: string },
) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/capstone/submissions/${encodeURIComponent(submissionId)}/review`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  return parseJson<{ ok: true }>(response, "Impossible d'enregistrer la revue capstone.");
}

export async function getProfessorPredictions(studentId: string) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/predictions/${encodeURIComponent(studentId)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return parseJson<Record<string, unknown>>(response, "Impossible de charger les predictions.");
}
