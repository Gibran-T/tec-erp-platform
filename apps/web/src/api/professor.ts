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

export async function listProfessorStudents() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/students`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ students: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger les etudiants.",
  );
}

export async function listProfessorCohorts() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/cohorts`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ cohorts: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger les cohortes.",
  );
}

export async function getProfessorStudentDetail(studentId: string) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/students/${studentId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<Record<string, unknown>>(response, "Impossible de charger le detail etudiant.");
}

export async function listProfessorCertificates() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/certificates`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ certificates: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger les certificats.",
  );
}

export async function listProfessorAudit() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/audit`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ events: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger l'audit.",
  );
}

export async function professorOverride(studentId: string, body: Record<string, unknown>) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/students/${studentId}/override`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  return parseJson(response, "Impossible d'appliquer l'action professeur.");
}

export async function revokeProfessorCertificate(certificateNumber: string, reason: string) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/certificates/${encodeURIComponent(certificateNumber)}/revoke`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ reason, confirm: true }),
    },
  );
  return parseJson(response, "Impossible de revoquer le certificat.");
}

export async function downloadProfessorCsv(): Promise<string> {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/export.csv`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("Impossible d'exporter le CSV.");
  }
  return response.text();
}
