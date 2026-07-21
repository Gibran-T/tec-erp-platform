import {
  ApiErrorEnvelopeSchema,
  MissionDetailSchema,
  MissionStartResponseSchema,
  MissionSubmitResponseSchema,
  MissionsResponseSchema,
  type GenericMissionSubmitRequest,
  type MissionDetail,
  type MissionStartResponse,
  type MissionSubmitRequest,
  type MissionSubmitResponse,
  type MissionsResponse,
} from "@tec-platform/contracts";

import { loadStoredTokens } from "./auth.js";
import { getApiBaseUrl } from "./health.js";
import { safeFetch } from "./http.js";

export type MissionSubmitBody = MissionSubmitRequest | GenericMissionSubmitRequest;

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const envelope = ApiErrorEnvelopeSchema.safeParse(await response.json());
    if (envelope.success) {
      return envelope.data.error.message;
    }
  } catch {
    // Ignore — fall through to the generic message.
  }

  return fallback;
}

function requireAccessToken(): string {
  const tokens = loadStoredTokens();

  if (!tokens?.accessToken) {
    throw new Error("Authentification requise.");
  }

  return tokens.accessToken;
}

export async function requestMissions(accessToken?: string): Promise<MissionsResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/missions`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de charger le Centre de mission. Veuillez réessayer.",
      ),
    );
  }

  try {
    return MissionsResponseSchema.parse(await response.json());
  } catch {
    throw new Error("La réponse du Centre de mission est invalide. Veuillez réessayer.");
  }
}

export async function requestMissionDetail(
  missionKey: string,
  accessToken?: string,
): Promise<MissionDetail> {
  const token = accessToken ?? requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/missions/${missionKey}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Impossible de charger la mission. Veuillez réessayer."),
    );
  }

  try {
    return MissionDetailSchema.parse(await response.json());
  } catch {
    throw new Error("La réponse de la mission est invalide. Veuillez réessayer.");
  }
}

export async function requestStartMission(
  missionKey: string,
  accessToken?: string,
): Promise<MissionStartResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/missions/${missionKey}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de démarrer la mission. Veuillez réessayer.",
      ),
    );
  }

  try {
    return MissionStartResponseSchema.parse(await response.json());
  } catch {
    throw new Error("La confirmation de démarrage est invalide. Veuillez réessayer.");
  }
}

export async function requestSubmitMission(
  missionKey: string,
  body: MissionSubmitBody,
  accessToken?: string,
): Promise<MissionSubmitResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/missions/${missionKey}/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de soumettre votre découverte. Veuillez réessayer.",
      ),
    );
  }

  try {
    return MissionSubmitResponseSchema.parse(await response.json());
  } catch {
    throw new Error("La confirmation de soumission est invalide. Veuillez réessayer.");
  }
}
