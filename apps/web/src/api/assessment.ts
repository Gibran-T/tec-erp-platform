import type { AssessmentAttemptView, AssessmentSummary, CertificateView } from "@tec-platform/contracts";

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

export async function listAssessments() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ assessments: AssessmentSummary[] }>(
    response,
    "Impossible de charger les evaluations.",
  );
}

export async function startAssessment(code: string) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments/${code}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  return parseJson<AssessmentAttemptView>(response, "Impossible de demarrer l'evaluation.");
}

export async function getActiveAssessmentAttempt(code: string) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments/${code}/attempt`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<AssessmentAttemptView>(response, "Aucune tentative en cours.");
}

export async function saveAssessmentDraft(
  code: string,
  responses: Array<{ questionKey: string; value: string | string[] }>,
) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments/${code}/draft`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ responses }),
  });
  return parseJson<{ ok: true }>(response, "Impossible d'enregistrer le brouillon.");
}

export async function submitAssessment(
  code: string,
  responses: Array<{ questionKey: string; value: string | string[] }>,
) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments/${code}/submit`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ responses, confirmFinalSubmission: true }),
  });
  return parseJson<{ scorePercent: number; passed: boolean; feedback: string }>(
    response,
    "Impossible de soumettre l'evaluation.",
  );
}

export async function issueSilver() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments/silver/issue`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<CertificateView>(response, "Impossible d'emettre le certificat Silver.");
}

export async function listCertificates() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments/certificates`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ certificates: CertificateView[] }>(
    response,
    "Impossible de charger les certificats.",
  );
}
