import { describe, expect, it } from "vitest";

import { ConfigurationError, loadConfig } from "../config.js";

const STRONG_ACCESS_SECRET = "a".repeat(48);
const STRONG_REFRESH_SECRET = "b".repeat(48);

function productionEnv(overrides: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  return {
    NODE_ENV: "production",
    PORT: "3000",
    CORS_ORIGIN: "https://erp.example.com",
    LOG_LEVEL: "info",
    JWT_ACCESS_SECRET: STRONG_ACCESS_SECRET,
    JWT_REFRESH_SECRET: STRONG_REFRESH_SECRET,
    ...overrides,
  };
}

describe("loadConfig — development fallbacks", () => {
  it("allows the dev fallback secrets outside production", () => {
    const config = loadConfig({ NODE_ENV: "development" });

    expect(config.nodeEnv).toBe("development");
    expect(config.jwtAccessSecret).toBe("dev-access-secret-not-for-production");
    expect(config.jwtRefreshSecret).toBe("dev-refresh-secret-not-for-production");
  });

  it("allows the dev fallback secrets in the test environment", () => {
    const config = loadConfig({ NODE_ENV: "test" });

    expect(config.nodeEnv).toBe("test");
    expect(config.jwtAccessSecret).toContain("dev-access-secret");
  });
});

describe("loadConfig — production fail-closed", () => {
  it("accepts strong, distinct production secrets", () => {
    const config = loadConfig(productionEnv());

    expect(config.nodeEnv).toBe("production");
    expect(config.jwtAccessSecret).toBe(STRONG_ACCESS_SECRET);
    expect(config.jwtRefreshSecret).toBe(STRONG_REFRESH_SECRET);
  });

  it("throws when JWT secrets are missing (dev fallback would otherwise activate)", () => {
    expect(() =>
      loadConfig({
        NODE_ENV: "production",
        CORS_ORIGIN: "https://erp.example.com",
      }),
    ).toThrow(ConfigurationError);
  });

  it("throws when an access secret is too weak", () => {
    expect(() =>
      loadConfig(productionEnv({ JWT_ACCESS_SECRET: "short-secret" })),
    ).toThrow(/JWT_ACCESS_SECRET must be at least 32 characters/);
  });

  it("throws when a refresh secret is too weak", () => {
    expect(() =>
      loadConfig(productionEnv({ JWT_REFRESH_SECRET: "short-secret" })),
    ).toThrow(/JWT_REFRESH_SECRET must be at least 32 characters/);
  });

  it("throws when access and refresh secrets are reused", () => {
    expect(() =>
      loadConfig(
        productionEnv({ JWT_REFRESH_SECRET: STRONG_ACCESS_SECRET }),
      ),
    ).toThrow(/JWT_REFRESH_SECRET must differ from JWT_ACCESS_SECRET/);
  });

  it("produces a controlled error that never echoes the secret value", () => {
    const weakSecret = "leaky-weak-secret";

    try {
      loadConfig(productionEnv({ JWT_ACCESS_SECRET: weakSecret }));
      throw new Error("expected loadConfig to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigurationError);
      expect((error as ConfigurationError).message).not.toContain(weakSecret);
      expect((error as ConfigurationError).message).toContain("jwtAccessSecret");
    }
  });
});
