import {
  ApiErrorEnvelopeSchema,
  CourseOverviewResponseSchema,
  ModuleDetailResponseSchema,
  type CourseOverviewResponse,
  type ModuleDetailResponse,
} from "@tec-platform/contracts";

import { loadStoredTokens } from "./auth.js";
import { getApiBaseUrl } from "./health.js";
import { safeFetch } from "./http.js";

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

export async function requestCourse(accessToken?: string): Promise<CourseOverviewResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/course`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de charger la progression. Veuillez réessayer.",
      ),
    );
  }

  try {
    return CourseOverviewResponseSchema.parse(await response.json());
  } catch {
    throw new Error("La réponse de progression est invalide. Veuillez réessayer.");
  }
}

export async function requestModule(
  moduleCode: string,
  accessToken?: string,
): Promise<ModuleDetailResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/me/modules/${encodeURIComponent(moduleCode)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de charger le détail du parcours. Veuillez réessayer.",
      ),
    );
  }

  try {
    return ModuleDetailResponseSchema.parse(await response.json());
  } catch {
    throw new Error("La réponse du parcours est invalide. Veuillez réessayer.");
  }
}
