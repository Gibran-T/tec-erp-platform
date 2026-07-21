import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createApp, type AppDependencies } from "../app.js";
import { loadConfig } from "../config.js";
import type { FirstDayStateRepository } from "../modules/first-day/first-day.types.js";
import type { MissionAttemptRepository } from "../modules/mission/mission.types.js";
import { issueToken } from "../modules/auth/auth.tokens.js";
import {
  buildDemoEmployeeRecord,
  createInMemoryEmployeeRepository,
} from "../modules/auth/__tests__/auth.fixtures.js";
import type { EmployeeRepository } from "../modules/auth/auth.types.js";

const testConfig = loadConfig({
  NODE_ENV: "test",
  PORT: "3000",
  CORS_ORIGIN: "http://localhost:5173",
  LOG_LEVEL: "error",
});

const notImplemented = () => {
  throw new Error("repository method should not be reached in this test");
};

const stubFirstDayRepository: FirstDayStateRepository = {
  findMessageState: notImplemented,
  findMessageStates: notImplemented,
  createMessageState: notImplemented,
  findTaskState: notImplemented,
  findTaskStates: notImplemented,
  createTaskState: notImplemented,
};

const stubMissionRepository: MissionAttemptRepository = {
  findAttempt: notImplemented,
  createAttempt: notImplemented,
  completeAttempt: notImplemented,
};

function buildApp(employeeRepository: EmployeeRepository) {
  const dependencies: AppDependencies = {
    probeDatabaseReadiness: async () => ({ isReady: true, detail: "up" }),
    employeeRepository,
    firstDayStateRepository: stubFirstDayRepository,
    missionAttemptRepository: stubMissionRepository,
  };

  return createApp(testConfig, dependencies);
}

function validAccessToken(sub: string): string {
  return issueToken(
    { sub, typ: "access" },
    testConfig.jwtAccessSecret,
    testConfig.accessTokenTtlSeconds,
  ).token;
}

describe("protected route access control", () => {
  const demo = buildDemoEmployeeRecord();
  const app = buildApp(createInMemoryEmployeeRepository([demo]));

  it("rejects a missing token with a controlled 401 envelope", async () => {
    const response = await request(app).get("/api/v1/me/organization").expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
    expect(response.body.error.requestId).toBeDefined();
  });

  it("rejects an invalid token with a controlled 401", async () => {
    const response = await request(app)
      .get("/api/v1/me/organization")
      .set("Authorization", "Bearer not-a-real-token")
      .expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects an expired token with a controlled 401", async () => {
    const expired = issueToken(
      { sub: demo.id, typ: "access" },
      testConfig.jwtAccessSecret,
      -60,
      Date.now() - 120_000,
    ).token;

    const response = await request(app)
      .get("/api/v1/me/organization")
      .set("Authorization", `Bearer ${expired}`)
      .expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});

describe("safe error normalization", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("never leaks internal error details (SQL, secrets, stack) in the response", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const leakyMessage =
      "SELECT * FROM employees WHERE id=$1 failed: postgres://user:hunter2@db:5432/erp";
    const throwingRepository: EmployeeRepository = {
      findByEmail: async () => null,
      findById: async () => {
        throw new Error(leakyMessage);
      },
    };
    const app = buildApp(throwingRepository);
    const token = validAccessToken("emp_demo");

    const response = await request(app)
      .get("/api/v1/me/organization")
      .set("Authorization", `Bearer ${token}`)
      .expect(500);

    expect(response.body).toEqual({
      error: {
        code: "INTERNAL",
        message: "An unexpected error occurred.",
        requestId: expect.any(String),
      },
    });

    const serialized = JSON.stringify(response.body);
    expect(serialized).not.toContain("postgres://");
    expect(serialized).not.toContain("SELECT");
    expect(serialized).not.toContain("hunter2");
    expect(serialized).not.toContain("stack");
  });
});

describe("organization endpoint is GET-only", () => {
  const demo = buildDemoEmployeeRecord();
  const app = buildApp(createInMemoryEmployeeRepository([demo]));

  it.each(["post", "put", "patch", "delete"] as const)(
    "does not expose %s on the organization resource",
    async (method) => {
      const token = validAccessToken(demo.id);

      const response = await request(app)[method]("/api/v1/me/organization")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.error.code).toBe("NOT_FOUND");
    },
  );
});
