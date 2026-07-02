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

describe("api v1 scaffold", () => {
  const app = createApp(testConfig, {
    probeDatabaseReadiness: async () => ({
      isReady: true,
      detail: "up",
    }),
  });

  it("exposes the versioned API root scaffold", async () => {
    const response = await request(app).get("/api/v1").expect(200);

    expect(response.body).toEqual({
      message: "TEC.ERP API scaffold",
      apiVersion: "v1",
    });
  });
});
