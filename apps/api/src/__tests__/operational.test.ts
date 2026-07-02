import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../app.js";
import { loadConfig } from "../config.js";

const testConfig = loadConfig({
  NODE_ENV: "test",
  PORT: "3000",
  CORS_ORIGIN: "http://localhost:5173",
  LOG_LEVEL: "error",
});

describe("operational routes", () => {
  const app = createApp(testConfig, {
    probeDatabaseReadiness: async () => ({
      isReady: true,
      detail: "up",
    }),
  });

  it("returns health status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toMatchObject({
      status: "ok",
      apiVersion: "v1",
      platformVersion: "0.1.0",
    });
    expect(typeof response.body.timestamp).toBe("string");
  });

  it("returns ready status when database probe succeeds", async () => {
    const response = await request(app).get("/ready").expect(200);

    expect(response.body).toMatchObject({
      status: "ready",
      checks: {
        database: "up",
      },
    });
  });

  it("returns not_ready when database probe fails", async () => {
    const failingApp = createApp(testConfig, {
      probeDatabaseReadiness: async () => ({
        isReady: false,
        detail: "down",
      }),
    });

    const response = await request(failingApp).get("/ready").expect(503);

    expect(response.body).toMatchObject({
      status: "not_ready",
      checks: {
        database: "down",
      },
    });
  });

  it("returns version metadata", async () => {
    const response = await request(app).get("/version").expect(200);

    expect(response.body).toMatchObject({
      name: "erp-api",
      version: "0.1.0",
      apiVersion: "v1",
      platformVersion: "0.1.0",
    });
  });
});

describe("error handling", () => {
  const app = createApp(testConfig, {
    probeDatabaseReadiness: async () => ({
      isReady: true,
      detail: "up",
    }),
  });

  it("returns not found envelope for unknown routes", async () => {
    const response = await request(app).get("/unknown-route").expect(404);

    expect(response.body.error).toMatchObject({
      code: "NOT_FOUND",
    });
    expect(response.headers["x-request-id"]).toBeDefined();
  });
});
