import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../../../app.js";
import { loadConfig } from "../../../config.js";
import {
  buildDemoEmployeeRecord,
  createInMemoryEmployeeRepository,
  DEMO_PASSWORD,
} from "./auth.fixtures.js";

const testConfig = loadConfig({
  NODE_ENV: "test",
  PORT: "3000",
  CORS_ORIGIN: "http://localhost:5173",
  LOG_LEVEL: "error",
});

function createTestApp() {
  return createApp(testConfig, {
    probeDatabaseReadiness: async () => ({ isReady: true, detail: "up" }),
    employeeRepository: createInMemoryEmployeeRepository([buildDemoEmployeeRecord()]),
  });
}

const DEMO_EMAIL = "demo.analyste@nordhabitat.ca";

describe("auth routes — login", () => {
  const app = createTestApp();

  it("authenticates the demo employee with valid credentials", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
      .expect(200);

    expect(response.body.employee).toMatchObject({
      employeeNumber: "#NHE-DEMO",
      email: DEMO_EMAIL,
      role: "JR_BUSINESS_ANALYST",
      companyName: "NordHabitat",
    });
    expect(typeof response.body.tokens.accessToken).toBe("string");
    expect(typeof response.body.tokens.refreshToken).toBe("string");
    expect(response.body.employee.passwordHash).toBeUndefined();
  });

  it("rejects a wrong password with 401", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: DEMO_EMAIL, password: "wrong-password" })
      .expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects an unknown email with 401 (no user enumeration)", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "unknown@nordhabitat.ca", password: DEMO_PASSWORD })
      .expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects a malformed request body with 400", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "not-an-email" })
      .expect(400);

    expect(response.body.error.code).toBe("VALIDATION");
  });
});

describe("auth routes — session", () => {
  const app = createTestApp();

  async function loginTokens() {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
      .expect(200);

    return response.body.tokens as {
      accessToken: string;
      refreshToken: string;
    };
  }

  it("returns the employee for a valid access token", async () => {
    const tokens = await loginTokens();

    const response = await request(app)
      .get("/api/v1/auth/session")
      .set("Authorization", `Bearer ${tokens.accessToken}`)
      .expect(200);

    expect(response.body.employee.employeeNumber).toBe("#NHE-DEMO");
  });

  it("rejects a request without a bearer token", async () => {
    const response = await request(app).get("/api/v1/auth/session").expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects an invalid bearer token", async () => {
    const response = await request(app)
      .get("/api/v1/auth/session")
      .set("Authorization", "Bearer not-a-real-token")
      .expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});

describe("auth routes — refresh and logout", () => {
  const app = createTestApp();

  async function loginTokens() {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
      .expect(200);

    return response.body.tokens as {
      accessToken: string;
      refreshToken: string;
    };
  }

  it("issues new tokens for a valid refresh token", async () => {
    const tokens = await loginTokens();

    const response = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: tokens.refreshToken })
      .expect(200);

    expect(typeof response.body.tokens.accessToken).toBe("string");
    expect(typeof response.body.tokens.refreshToken).toBe("string");
  });

  it("rejects an access token used as a refresh token", async () => {
    const tokens = await loginTokens();

    const response = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken: tokens.accessToken })
      .expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("acknowledges logout", async () => {
    const response = await request(app).post("/api/v1/auth/logout").expect(200);

    expect(response.body).toEqual({ success: true });
  });
});
