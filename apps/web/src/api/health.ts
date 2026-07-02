import { HealthResponseSchema, type HealthResponse } from "@tec-platform/contracts";

export type ApiConnectivityState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "connected"; readonly health: HealthResponse }
  | { readonly status: "error"; readonly message: string };

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
}

export async function fetchApiHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/health`, { signal });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  const payload: unknown = await response.json();
  return HealthResponseSchema.parse(payload);
}
