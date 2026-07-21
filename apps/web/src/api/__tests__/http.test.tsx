import { afterEach, describe, expect, it, vi } from "vitest";

import { requestLogin } from "../auth.js";
import { NETWORK_ERROR_MESSAGE, safeFetch } from "../http.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("safeFetch", () => {
  it("returns the response unchanged on success", async () => {
    const response = { ok: true } as Response;
    const fetchMock = vi.fn(async () => response);
    vi.stubGlobal("fetch", fetchMock);

    await expect(safeFetch("https://example.test")).resolves.toBe(response);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("converts a rejected fetch into a safe French message, never the raw text", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    let caught: Error | null = null;
    try {
      await safeFetch("https://example.test");
    } catch (error) {
      caught = error as Error;
    }

    expect(caught).not.toBeNull();
    expect(caught?.message).toBe(NETWORK_ERROR_MESSAGE);
    expect(caught?.message).not.toMatch(/failed to fetch/i);
  });
});

describe("auth client network hygiene", () => {
  it("surfaces a safe French message when the login request fails at the network level", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("Failed to fetch");
      }),
    );

    let caught: Error | null = null;
    try {
      await requestLogin("demo.analyste@nordhabitat.ca", "secret");
    } catch (error) {
      caught = error as Error;
    }

    expect(caught).not.toBeNull();
    expect(caught?.message).toBe(NETWORK_ERROR_MESSAGE);
    expect(caught?.message).not.toMatch(/failed to fetch/i);
  });
});
