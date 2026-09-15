import {
  safeOfficialSapLearningHref,
  type SapIee2eCalendarView,
  type SapIee2eCohortResponse,
  type SapIee2eProfessorNote,
  type SapIee2eSelfReport,
  type SapIee2eStudentAccompaniment,
  type SapSuiteProgramAssignmentList,
  type SapSuiteProgramCatalog,
  type UpdateSapIee2eCalendarRequest,
  type UpdateSapIee2eProfessorNoteRequest,
  type UpdateSapIee2eSelfReportRequest,
  type UpdateSapSuiteProgramAssignmentRequest,
  type UpdateSapSuiteStageReviewRequest,
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

export async function getSapSuiteProgramCatalog(): Promise<SapSuiteProgramCatalog> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/sap-iee2e/program`, {
    headers: await authHeaders(),
  });
  if (!response.ok) {
    throw new Error("Impossible de charger le programme SAP Suite End to End.");
  }
  const payload = (await response.json()) as SapSuiteProgramCatalog;
  return {
    ...payload,
    officialUrl: safeOfficialSapLearningHref(payload.officialUrl),
  };
}

export async function getMySapIee2eSelfReport(): Promise<SapIee2eSelfReport> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/sap-iee2e-self-report`, {
    headers: await authHeaders(),
  });
  if (!response.ok) {
    throw new Error("Impossible de charger la déclaration institutionnelle SAP.");
  }
  const payload = (await response.json()) as SapIee2eSelfReport;
  return {
    ...payload,
    officialUrl: safeOfficialSapLearningHref(payload.officialUrl),
  };
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
    throw new Error("Impossible d’enregistrer la déclaration institutionnelle SAP.");
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

export async function getProfessorStudentAccompaniment(
  employeeId: string,
): Promise<SapIee2eStudentAccompaniment> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/sap-iee2e/students/${employeeId}`,
    { headers: await authHeaders() },
  );
  if (!response.ok) {
    throw new Error("Impossible de charger l’accompagnement de l’étudiant.");
  }
  return (await response.json()) as SapIee2eStudentAccompaniment;
}

export async function saveProfessorStudentNote(
  employeeId: string,
  input: UpdateSapIee2eProfessorNoteRequest,
): Promise<SapIee2eProfessorNote> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/sap-iee2e/students/${employeeId}/notes`,
    {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(input),
    },
  );
  if (!response.ok) {
    throw new Error("Impossible d’enregistrer l’observation professeur.");
  }
  return (await response.json()) as SapIee2eProfessorNote;
}

export async function saveProfessorStageReview(
  employeeId: string,
  input: UpdateSapSuiteStageReviewRequest,
): Promise<SapIee2eStudentAccompaniment> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/sap-iee2e/students/${employeeId}/stages`,
    {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(input),
    },
  );
  if (!response.ok) {
    throw new Error("Impossible d’enregistrer la révision institutionnelle.");
  }
  return (await response.json()) as SapIee2eStudentAccompaniment;
}

export async function getProfessorProgramAssignments(): Promise<SapSuiteProgramAssignmentList> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/sap-iee2e/assignments`, {
    headers: await authHeaders(),
  });
  if (!response.ok) {
    throw new Error("Impossible de charger les associations de cohorte.");
  }
  return (await response.json()) as SapSuiteProgramAssignmentList;
}

export async function saveProfessorProgramAssignment(
  input: UpdateSapSuiteProgramAssignmentRequest,
): Promise<SapSuiteProgramAssignmentList> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/sap-iee2e/assignments`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new Error("Impossible d’enregistrer l’association de cohorte.");
  }
  return (await response.json()) as SapSuiteProgramAssignmentList;
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
