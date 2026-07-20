import {
  ApiErrorEnvelopeSchema,
  OrganizationResponseSchema,
  type OrganizationResponse,
} from "@tec-platform/contracts";

import { loadStoredTokens } from "./auth.js";
import { getApiBaseUrl } from "./health.js";

/**
 * RC01 Slice E — Organizational ERP read-only client.
 * GET only. No write methods. No production data fallback on the client.
 */

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

export async function requestOrganization(accessToken?: string): Promise<OrganizationResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await fetch(`${getApiBaseUrl()}/api/v1/me/organization`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de charger l’organisation NordHabitat. Veuillez réessayer.",
      ),
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("La réponse de l’organisation est invalide. Veuillez réessayer.");
  }

  const parsed = OrganizationResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("La réponse de l’organisation est invalide. Veuillez réessayer.");
  }

  return parsed.data;
}
