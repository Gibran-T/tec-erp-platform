/**
 * Shared HTTP helper for the employee-facing web client.
 *
 * Error-presentation hygiene (RC01): a raw `fetch` rejection (offline, DNS,
 * CORS, "Failed to fetch", etc.) surfaces a technical, English browser message.
 * `safeFetch` converts any network/browser-level failure into a fixed, safe
 * French message so that internal exception text never reaches the employee.
 * Non-network failures (HTTP status handling, schema validation) remain the
 * responsibility of each caller, exactly as before.
 */
export const NETWORK_ERROR_MESSAGE =
  "Impossible de contacter le serveur. Vérifiez votre connexion, puis réessayez.";

export async function safeFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  networkErrorMessage: string = NETWORK_ERROR_MESSAGE,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    throw new Error(networkErrorMessage);
  }
}
