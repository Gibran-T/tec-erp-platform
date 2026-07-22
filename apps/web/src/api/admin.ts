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

export async function listAdminCompanies() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/companies`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ companies: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger les entreprises.",
  );
}

export async function listAdminCohorts() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/cohorts`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ cohorts: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger les cohortes.",
  );
}

export async function listAdminEmployees() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/employees`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ employees: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger les employés.",
  );
}

export async function createAdminEmployee(input: {
  employeeNumber: string;
  email: string;
  displayName: string;
  role: "JR_BUSINESS_ANALYST" | "PROFESSOR" | "ADMIN";
  password: string;
}) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/employees`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<{ employee: Record<string, unknown> }>(
    response,
    "Impossible de créer l'employé.",
  );
}

export async function updateAdminEmployeeRole(
  employeeId: string,
  role: "JR_BUSINESS_ANALYST" | "PROFESSOR" | "ADMIN",
) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/admin/employees/${encodeURIComponent(employeeId)}/role`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    },
  );
  return parseJson<{ employee: Record<string, unknown> }>(
    response,
    "Impossible de mettre à jour le rôle.",
  );
}

export async function createAdminCohort(input: { code: string; name: string }) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/cohorts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<{ cohort: Record<string, unknown> }>(
    response,
    "Impossible de créer la cohorte.",
  );
}

export async function assignAdminProfessor(cohortId: string, employeeId: string) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/admin/cohorts/${encodeURIComponent(cohortId)}/assign-professor`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId }),
    },
  );
  return parseJson<{ ok: true }>(response, "Impossible d'affecter le professeur.");
}

export async function removeAdminProfessor(cohortId: string, employeeId: string) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/admin/cohorts/${encodeURIComponent(cohortId)}/remove-professor`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId }),
    },
  );
  return parseJson<{ ok: true }>(response, "Impossible de retirer le professeur.");
}

export async function enrollAdminStudent(cohortId: string, employeeId: string) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/cohorts/enroll`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ cohortId, employeeId }),
  });
  return parseJson<{ ok: true }>(response, "Impossible d'inscrire l'étudiant.");
}

export async function getAdminConfiguration() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/configuration`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ aiEnabled: boolean; settings: Record<string, unknown> }>(
    response,
    "Impossible de charger la configuration.",
  );
}

export async function updateAdminAiEnabled(aiEnabled: boolean) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/configuration`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ aiEnabled }),
  });
  return parseJson<{ aiEnabled: boolean }>(response, "Impossible de mettre a jour l'IA.");
}

export async function listAdminFeatureFlags() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/feature-flags`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ flags: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger les indicateurs fonctionnels.",
  );
}

export async function updateAdminFeatureFlag(key: string, enabled: boolean) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/admin/feature-flags/${encodeURIComponent(key)}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    },
  );
  return parseJson<{ key: string; enabled: boolean }>(
    response,
    "Impossible de mettre a jour l'indicateur.",
  );
}

export async function listAdminScenarioDrafts() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/scenarios/drafts`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ drafts: Array<Record<string, unknown>> }>(
    response,
    "Impossible de charger les brouillons de scenario.",
  );
}

export async function publishAdminScenarioDraft(draftId: string) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/admin/scenarios/drafts/${encodeURIComponent(draftId)}/publish`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return parseJson<Record<string, unknown>>(response, "Impossible de publier le scenario.");
}

export async function runAdminIntegration(connectionId: string) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/integration/run`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ connectionId }),
  });
  return parseJson<Record<string, unknown>>(response, "Impossible de lancer l'integration.");
}

export async function runAdminAutomation(ruleKey: string) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/automation/run`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ ruleKey }),
  });
  return parseJson<Record<string, unknown>>(response, "Impossible de lancer l'automatisation.");
}
