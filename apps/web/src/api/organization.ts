import { OrganizationResponseSchema, type OrganizationResponse } from "@tec-platform/contracts";

import {
  ORGANIZATION_ERROR_AUTH,
  ORGANIZATION_ERROR_FALLBACK,
  ORGANIZATION_ERROR_MALFORMED,
  ORGANIZATION_ERROR_NETWORK,
} from "../pages/workspace/organization/organizationCopy.js";
import { loadStoredTokens } from "./auth.js";
import { getApiBaseUrl } from "./health.js";

/**
 * RC01 Slice E — Organizational ERP read-only client.
 * GET only. No write methods. No production data fallback on the client.
 *
 * Safety rule: this client never surfaces raw server error-envelope text or
 * raw fetch/browser exception messages to the employee. Every failure path
 * below throws one of the fixed, safe French messages from organizationCopy.
 * The organization endpoint has no legitimate business-facing error copy to
 * relay (see RC01_SLICE_E plan §11 — only 401/500 are possible error
 * statuses, with locked/available both returned as 200), so discarding the
 * server's message body entirely is deliberate, not a regression.
 */

function requireAccessToken(): string {
  const tokens = loadStoredTokens();

  if (!tokens?.accessToken) {
    throw new Error(ORGANIZATION_ERROR_AUTH);
  }

  return tokens.accessToken;
}

export async function requestOrganization(accessToken?: string): Promise<OrganizationResponse> {
  const token = accessToken ?? requireAccessToken();

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/api/v1/me/organization`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Network/browser-level failure (offline, DNS, CORS, "Failed to fetch", etc.).
    throw new Error(ORGANIZATION_ERROR_NETWORK);
  }

  if (!response.ok) {
    // Deliberately does not read the response body: server error envelopes
    // may contain English or internal-looking text that must never reach
    // the employee-facing UI.
    throw new Error(ORGANIZATION_ERROR_FALLBACK);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error(ORGANIZATION_ERROR_MALFORMED);
  }

  const parsed = OrganizationResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(ORGANIZATION_ERROR_MALFORMED);
  }

  return parsed.data;
}
