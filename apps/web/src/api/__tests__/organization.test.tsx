import { afterEach, describe, expect, it, vi } from "vitest";

import { saveStoredTokens } from "../auth.js";
import { requestOrganization } from "../organization.js";

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

  it("throws a French error message on a non-ok response", async () => {
    seedAuthTokens();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        jsonResponse(
          { error: { code: "INTERNAL", message: "Erreur serveur.", requestId: "req_test" } },
          500,
        ),
      ),
    );

    await expect(requestOrganization()).rejects.toThrow("Erreur serveur.");
  });

  it("throws defensively when the payload does not match the contract", async () => {
    seedAuthTokens();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ access: "unexpected" })),
    );

    await expect(requestOrganization()).rejects.toThrow(
      "La réponse de l’organisation est invalide. Veuillez réessayer.",
    );
  });

  it("requires authentication when no token is stored", async () => {
    await expect(requestOrganization()).rejects.toThrow("Authentification requise.");
  });
});
