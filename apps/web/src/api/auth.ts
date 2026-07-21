import {
  ApiErrorEnvelopeSchema,
  AuthTokensSchema,
  LoginResponseSchema,
  RefreshResponseSchema,
  SessionResponseSchema,
  type AuthenticatedEmployee,
  type AuthTokens,
  type LoginResponse,
} from "@tec-platform/contracts";

import { getApiBaseUrl } from "./health.js";
import { safeFetch } from "./http.js";

const TOKEN_STORAGE_KEY = "tec.erp.auth.tokens";

export function loadStoredTokens(): AuthTokens | null {
  try {
    const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = AuthTokensSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveStoredTokens(tokens: AuthTokens): void {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens(): void {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

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

export async function requestLogin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Échec de la connexion. Veuillez réessayer."),
    );
  }

  return LoginResponseSchema.parse(await response.json());
}

export async function requestRefresh(refreshToken: string): Promise<AuthTokens> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Le renouvellement de la session a échoué."),
    );
  }

  return RefreshResponseSchema.parse(await response.json()).tokens;
}

export async function requestSession(accessToken: string): Promise<AuthenticatedEmployee> {
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/auth/session`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "La session n’est pas valide."));
  }

  return SessionResponseSchema.parse(await response.json()).employee;
}

export async function requestLogout(accessToken: string | null): Promise<void> {
  try {
    await fetch(`${getApiBaseUrl()}/api/v1/auth/logout`, {
      method: "POST",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
  } catch {
    // Logout is best-effort; the client clears tokens regardless.
  }
}
