import { afterEach, describe, expect, it, vi } from "vitest";

import { loadConfig } from "../config.js";
import { createLogger } from "../logger.js";

const testConfig = loadConfig({ NODE_ENV: "test", LOG_LEVEL: "debug" });

function captureLog(run: () => void): Record<string, unknown> {
  const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);

  try {
    run();
    expect(spy).toHaveBeenCalledTimes(1);
    return JSON.parse(spy.mock.calls[0]?.[0] as string) as Record<string, unknown>;
  } finally {
    spy.mockRestore();
  }
}

describe("StructuredLogger redaction", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redacts authorization headers and tokens", () => {
    const logger = createLogger(testConfig, "test");

    const entry = captureLog(() =>
      logger.info("request_received", {
        authorization: "Bearer super-secret-jwt-token",
        accessToken: "at-123",
        refreshToken: "rt-456",
        method: "GET",
      }),
    );

    const meta = entry.meta as Record<string, unknown>;
    expect(meta.authorization).toBe("[REDACTED]");
    expect(meta.accessToken).toBe("[REDACTED]");
    expect(meta.refreshToken).toBe("[REDACTED]");
    expect(meta.method).toBe("GET");
    expect(JSON.stringify(entry)).not.toContain("super-secret-jwt-token");
  });

  it("redacts nested credential and secret fields without mutating the input", () => {
    const logger = createLogger(testConfig, "test");
    const meta = {
      requestId: "req-1",
      headers: {
        Authorization: "Bearer leaky",
        cookie: "session=leaky",
      },
      config: { jwtAccessSecret: "top-secret", password: "hunter2" },
    };

    const entry = captureLog(() => logger.warn("audit", meta));

    const logged = entry.meta as {
      requestId: string;
      headers: Record<string, unknown>;
      config: Record<string, unknown>;
    };
    expect(logged.requestId).toBe("req-1");
    expect(logged.headers.Authorization).toBe("[REDACTED]");
    expect(logged.headers.cookie).toBe("[REDACTED]");
    expect(logged.config.jwtAccessSecret).toBe("[REDACTED]");
    expect(logged.config.password).toBe("[REDACTED]");

    // Original object is untouched.
    expect(meta.headers.Authorization).toBe("Bearer leaky");
    expect(meta.config.jwtAccessSecret).toBe("top-secret");
  });

  it("preserves non-sensitive metadata unchanged", () => {
    const logger = createLogger(testConfig, "test");

    const entry = captureLog(() =>
      logger.info("request_completed", {
        method: "POST",
        path: "/api/v1/auth/login",
        statusCode: 200,
        durationMs: 12,
      }),
    );

    expect(entry.meta).toEqual({
      method: "POST",
      path: "/api/v1/auth/login",
      statusCode: 200,
      durationMs: 12,
    });
  });
});
