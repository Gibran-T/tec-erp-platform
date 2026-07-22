import { getApiBaseUrl } from "./health.js";
import { loadStoredTokens } from "./auth.js";
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

function asRunArray(body: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(body)) {
    return body as Array<Record<string, unknown>>;
  }
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (Array.isArray(record.runs)) {
      return record.runs as Array<Record<string, unknown>>;
    }
    // Production/me may return the selected/current run object directly.
    if ("id" in record || "runCode" in record || "runSequence" in record) {
      return [record];
    }
  }
  return [];
}

export async function listMyPedagogicalRuns(): Promise<Array<Record<string, unknown>>> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/pedagogical-course-runs`, {
    headers: await authHeaders(),
  });
  if (!response.ok) {
    throw new Error("Impossible de charger les parcours.");
  }
  const body = (await response.json()) as unknown;
  return asRunArray(body);
}

export async function listAdminPedagogicalRuns(): Promise<Array<Record<string, unknown>>> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/pedagogical-course-runs`, {
    headers: await authHeaders(),
  });
  if (!response.ok) {
    throw new Error("Impossible de charger les parcours admin.");
  }
  const body = (await response.json()) as unknown;
  return Array.isArray(body) ? (body as Array<Record<string, unknown>>) : [];
}

export async function createAdminPedagogicalRun(input: {
  employeeId: string;
  cohortId?: string;
  runType: string;
  runLabel: string;
  reason: string;
  professorId?: string;
  sourceRunId?: string;
  runCode?: string;
  reflectionsEnabled?: boolean;
}): Promise<Record<string, unknown>> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/admin/pedagogical-course-runs`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ ...input, language: "fr" }),
  });
  if (!response.ok) {
    throw new Error("Création de parcours refusée.");
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function transitionAdminPedagogicalRun(
  runId: string,
  action: string,
  reason?: string,
): Promise<Record<string, unknown>> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/admin/pedagogical-course-runs/${encodeURIComponent(runId)}/transition`,
    {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ action, reason }),
    },
  );
  if (!response.ok) {
    throw new Error("Transition de parcours refusée.");
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function listProfessorPedagogicalRuns(
  employeeId?: string,
): Promise<Array<Record<string, unknown>>> {
  const query = employeeId ? `?employeeId=${encodeURIComponent(employeeId)}` : "";
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/pedagogical-course-runs${query}`,
    { headers: await authHeaders() },
  );
  if (!response.ok) {
    throw new Error("Impossible de charger les parcours professeur.");
  }
  const body = (await response.json()) as unknown;
  return asRunArray(body);
}

export async function getProfessorUniqueStudentMetric(): Promise<{
  mode: string;
  studentCount: number;
}> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/pedagogical-course-runs/metrics/unique-students`,
    { headers: await authHeaders() },
  );
  if (!response.ok) {
    throw new Error("Impossible de charger le compteur d'apprenants uniques.");
  }
  return (await response.json()) as { mode: string; studentCount: number };
}

export async function createProfessorPedagogicalRun(input: {
  employeeId: string;
  runType: string;
  runLabel: string;
  reason: string;
  sourceRunId?: string;
  runCode?: string;
  reflectionsEnabled?: boolean;
}): Promise<Record<string, unknown>> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/pedagogical-course-runs`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ ...input, language: "fr", professorId: undefined }),
  });
  if (!response.ok) {
    throw new Error("Création de parcours professeur refusée.");
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function transitionProfessorPedagogicalRun(
  runId: string,
  action: string,
  reason?: string,
): Promise<Record<string, unknown>> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/pedagogical-course-runs/${encodeURIComponent(runId)}/transition`,
    {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify({ action, reason }),
    },
  );
  if (!response.ok) {
    throw new Error("Transition professeur refusée.");
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function compareProfessorPedagogicalRuns(
  leftRunId: string,
  rightRunId: string,
): Promise<Record<string, unknown>> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/pedagogical-course-runs/compare?leftRunId=${encodeURIComponent(leftRunId)}&rightRunId=${encodeURIComponent(rightRunId)}`,
    { headers: await authHeaders() },
  );
  if (!response.ok) {
    throw new Error("Comparaison refusée.");
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function createProfessorIntervention(
  runId: string,
  body: {
    interventionType: string;
    reason: string;
    content: string;
    moduleCode?: string;
    missionCode?: string;
  },
): Promise<Record<string, unknown>> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/pedagogical-course-runs/${encodeURIComponent(runId)}/interventions`,
    {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error("Intervention refusée.");
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function getMyMissionReflection(
  runId: string,
  missionKey: string,
): Promise<Record<string, unknown> | null> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/me/pedagogical-course-runs/${encodeURIComponent(runId)}/reflections/${encodeURIComponent(missionKey)}`,
    { headers: await authHeaders() },
  );
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Impossible de charger la réflexion.");
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function saveMyMissionReflection(input: {
  runId: string;
  missionKey: string;
  isUpdate: boolean;
  body: Record<string, unknown>;
}): Promise<Record<string, unknown>> {
  const url = input.isUpdate
    ? `${getApiBaseUrl()}/api/v1/me/pedagogical-course-runs/${encodeURIComponent(input.runId)}/reflections/${encodeURIComponent(input.missionKey)}`
    : `${getApiBaseUrl()}/api/v1/me/pedagogical-course-runs/${encodeURIComponent(input.runId)}/reflections`;
  const response = await safeFetch(url, {
    method: input.isUpdate ? "PUT" : "POST",
    headers: await authHeaders(),
    body: JSON.stringify(
      input.isUpdate ? input.body : { ...input.body, missionKey: input.missionKey },
    ),
  });
  if (!response.ok) {
    throw new Error("Enregistrement de la réflexion refusé.");
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function listRunReflectionsForProfessor(
  runId: string,
): Promise<Record<string, unknown>> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/professor/pedagogical-course-runs/${encodeURIComponent(runId)}/reflections`,
    { headers: await authHeaders() },
  );
  if (!response.ok) {
    throw new Error("Impossible de charger les réflexions.");
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function listRunReflectionsForAdmin(
  runId: string,
): Promise<Record<string, unknown>> {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/admin/pedagogical-course-runs/${encodeURIComponent(runId)}/reflections`,
    { headers: await authHeaders() },
  );
  if (!response.ok) {
    throw new Error("Impossible de charger les réflexions admin.");
  }
  return (await response.json()) as Record<string, unknown>;
}
