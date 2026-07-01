import { describe, expect, it } from "vitest";

import { createHealthResponse, HealthResponseSchema } from "../health.js";

describe("health contracts", () => {
  it("creates a valid health response", () => {
    const response = createHealthResponse("ok", "2026-07-01T12:00:00.000Z");

    expect(HealthResponseSchema.parse(response)).toEqual({
      status: "ok",
      timestamp: "2026-07-01T12:00:00.000Z",
      version: "0.1.0",
      apiVersion: "v1",
      platformVersion: "0.1.0",
    });
  });

  it("rejects invalid health status", () => {
    expect(() =>
      HealthResponseSchema.parse({
        status: "unknown",
        timestamp: "2026-07-01T12:00:00.000Z",
        version: "0.1.0",
        apiVersion: "v1",
        platformVersion: "0.1.0",
      }),
    ).toThrow();
  });
});
