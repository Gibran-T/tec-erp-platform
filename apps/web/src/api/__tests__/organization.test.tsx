import { afterEach, describe, expect, it, vi } from "vitest";

import { saveStoredTokens } from "../auth.js";
import { requestOrganization } from "../organization.js";

const SAFE_SERVER_ERROR_MESSAGE = "Impossible de charger l’organisation NordHabitat. Veuillez réessayer.";
const SAFE_NETWORK_ERROR_MESSAGE =
  "Impossible de charger les informations organisationnelles. Veuillez réessayer.";
const SAFE_MALFORMED_ERROR_MESSAGE =
  "La réponse de l’organisation est invalide. Veuillez réessayer.";

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

function seedAuthTokens(): void {
  saveStoredTokens({
    accessToken: "access-token",
    refreshToken: "refresh-token",
    accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
    refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe("requestOrganization", () => {
  it("performs a GET request with the bearer token and returns the parsed locked response", async () => {
    seedAuthTokens();
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        access: "locked",
        unlockExplanation: {
          code: "premiere-journee-requise",
          title: "Terminez votre première journée",
          description: "Lisez le message de votre gestionnaire.",
        },
        organization: null,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestOrganization();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/me/organization"),
      expect.objectContaining({
        method: "GET",
        headers: { Authorization: "Bearer access-token" },
      }),
    );
    expect(result.access).toBe("locked");
  });

  it("sanitizes a canonical 500 response into the fixed safe French message", async () => {
    seedAuthTokens();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(
          {
            error: {
              code: "INTERNAL",
              message: "An unexpected error occurred.",
              requestId: "req_test",
            },
          },
          500,
        ),
      ),
    );

    await expect(requestOrganization()).rejects.toThrow(SAFE_SERVER_ERROR_MESSAGE);

    try {
      await requestOrganization();
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).not.toMatch(/an unexpected error occurred/i);
    }
  });

  it("sanitizes an arbitrary internal-looking 5xx server message", async () => {
    seedAuthTokens();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(
          {
            error: {
              code: "INTERNAL",
              message: "database connection refused",
              requestId: "req_test",
            },
          },
          503,
        ),
      ),
    );

    let caught: Error | null = null;
    try {
      await requestOrganization();
    } catch (error) {
      caught = error as Error;
    }

    expect(caught).not.toBeNull();
    expect(caught?.message).toBe(SAFE_SERVER_ERROR_MESSAGE);
    expect(caught?.message).not.toMatch(/database connection refused/i);
  });

  it("sanitizes a rejected fetch (network/browser failure) into the fixed safe French message", async () => {
    seedAuthTokens();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    let caught: Error | null = null;
    try {
      await requestOrganization();
    } catch (error) {
      caught = error as Error;
    }

    expect(caught).not.toBeNull();
    expect(caught?.message).toBe(SAFE_NETWORK_ERROR_MESSAGE);
    expect(caught?.message).not.toMatch(/failed to fetch/i);
  });

  it("throws defensively when the payload does not match the contract", async () => {
    seedAuthTokens();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ access: "unexpected" })),
    );

    await expect(requestOrganization()).rejects.toThrow(SAFE_MALFORMED_ERROR_MESSAGE);
  });

  it("sanitizes a response body that fails to parse as JSON", async () => {
    seedAuthTokens();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError("Unexpected token in JSON at position 0");
        },
      })),
    );

    let caught: Error | null = null;
    try {
      await requestOrganization();
    } catch (error) {
      caught = error as Error;
    }

    expect(caught).not.toBeNull();
    expect(caught?.message).toBe(SAFE_MALFORMED_ERROR_MESSAGE);
    expect(caught?.message).not.toMatch(/unexpected token/i);
  });

  it("requires authentication when no token is stored", async () => {
    await expect(requestOrganization()).rejects.toThrow("Authentification requise.");
  });
});
