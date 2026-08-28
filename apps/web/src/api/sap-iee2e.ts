import type {
  SapIee2eCalendarView,
  SapIee2eCohortResponse,
  SapIee2eSelfReport,
  UpdateSapIee2eCalendarRequest,
  UpdateSapIee2eSelfReportRequest,
} from "@tec-platform/contracts";

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

export async function getMySapIee2eSelfReport(): Promise<SapIee2eSelfReport> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/sap-iee2e-self-report`, {
    headers: await authHeaders(),
  });
  if (!response.ok) {
    throw new Error("Impossible de charger la déclaration SAP.");
  }
  return (await response.json()) as SapIee2eSelfReport;
}

export async function saveMySapIee2eSelfReport(
  input: UpdateSapIee2eSelfReportRequest,
): Promise<SapIee2eSelfReport> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/sap-iee2e-self-report`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Impossible d’enregistrer la déclaration SAP.");
  }
  return (await response.json()) as SapIee2eSelfReport;
}

export async function getProfessorSapIee2eCohort(): Promise<SapIee2eCohortResponse> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/sap-iee2e/cohort`, {
    headers: await authHeaders(),
  });
  if (!response.ok) {
    throw new Error("Impossible de charger la cohorte SAP.");
  }
  return (await response.json()) as SapIee2eCohortResponse;
}

export async function saveProfessorCalendar(
  input: UpdateSapIee2eCalendarRequest,
): Promise<SapIee2eCalendarView> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/sap-iee2e/calendar`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Impossible d’enregistrer la date de séance 1.");
  }
  return (await response.json()) as SapIee2eCalendarView;
}
