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
    throw new Error(fallback);
  }
  return (await response.json()) as T;
}

export async function listAssessments() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ assessments: Array<Record<string, unknown>> }>(
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
  return parseJson<{ attemptId: string; questions: Array<Record<string, unknown>> }>(
    response,
    "Impossible de demarrer l'evaluation.",
  );
}

export async function submitAssessment(
  code: string,
  responses: Array<{ questionKey: string; value: string | string[] }>,
) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments/${code}/submit`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ responses }),
  });
  return parseJson<{ scorePercent: number; passed: boolean }>(
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
  return parseJson<Record<string, unknown>>(response, "Impossible d'emettre le certificat Silver.");
}

export async function listCertificates() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/assessments/certificates`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ certificates: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger les certificats.",
  );
}
