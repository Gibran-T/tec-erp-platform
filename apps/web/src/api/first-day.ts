import {
  ApiErrorEnvelopeSchema,
  CompleteTaskResponseSchema,
  InboxResponseSchema,
  MarkMessageReadResponseSchema,
  TasksResponseSchema,
  type CompleteTaskResponse,
  type InboxResponse,
  type MarkMessageReadResponse,
  type TasksResponse,
} from "@tec-platform/contracts";

import { loadStoredTokens } from "./auth.js";
import { getApiBaseUrl } from "./health.js";

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

export async function requestInbox(accessToken?: string): Promise<InboxResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await fetch(`${getApiBaseUrl()}/api/v1/me/inbox`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de charger la boîte de réception. Veuillez réessayer.",
      ),
    );
  }

  try {
    return InboxResponseSchema.parse(await response.json());
  } catch {
    throw new Error("La réponse de la boîte de réception est invalide. Veuillez réessayer.");
  }
}

export async function requestMarkMessageRead(
  messageKey: string,
  accessToken?: string,
): Promise<MarkMessageReadResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await fetch(`${getApiBaseUrl()}/api/v1/me/inbox/${messageKey}/read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de marquer le message comme lu. Veuillez réessayer.",
      ),
    );
  }

  try {
    return MarkMessageReadResponseSchema.parse(await response.json());
  } catch {
    throw new Error("La confirmation de lecture est invalide. Veuillez réessayer.");
  }
}

export async function requestTasks(accessToken?: string): Promise<TasksResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await fetch(`${getApiBaseUrl()}/api/v1/me/tasks`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Impossible de charger les tâches. Veuillez réessayer."),
    );
  }

  try {
    return TasksResponseSchema.parse(await response.json());
  } catch {
    throw new Error("La réponse des tâches est invalide. Veuillez réessayer.");
  }
}

export async function requestCompleteTask(
  taskKey: string,
  accessToken?: string,
): Promise<CompleteTaskResponse> {
  const token = accessToken ?? requireAccessToken();
  const response = await fetch(`${getApiBaseUrl()}/api/v1/me/tasks/${taskKey}/complete`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de terminer la tâche. Veuillez réessayer.",
      ),
    );
  }

  try {
    return CompleteTaskResponseSchema.parse(await response.json());
  } catch {
    throw new Error("La confirmation de la tâche est invalide. Veuillez réessayer.");
  }
}
