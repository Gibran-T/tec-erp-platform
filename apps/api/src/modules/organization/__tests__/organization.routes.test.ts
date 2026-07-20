import { OrganizationResponseSchema } from "@tec-platform/contracts";
import { Result } from "@tec-platform/core";
import express, { type Express } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { loadConfig } from "../../../config.js";
import { createLogger } from "../../../logger.js";
import { createErrorHandler, notFoundHandler } from "../../../middleware/error-handler.js";
import {
  createRequireEmployee,
} from "../../../middleware/require-employee.js";
import { requestIdMiddleware } from "../../../middleware/request-id.js";
import {
  buildDemoEmployeeRecord,
  createInMemoryEmployeeRepository,
  DEMO_PASSWORD,
} from "../../auth/__tests__/auth.fixtures.js";
import { createAuthService, type AuthService } from "../../auth/auth.service.js";
import { FIRST_TASK_KEY, MANAGER_MESSAGE_KEY } from "../../first-day/first-day.catalog.js";
import type {
  MessageStateRecord,
  TaskStateRecord,
} from "../../first-day/first-day.types.js";
import {
  createOrganizationAccessReader,
  type OrganizationFirstDayStateReader,
} from "../organization.access.js";
import { createOrganizationMeRouter } from "../organization.routes.js";
import { createOrganizationService } from "../organization.service.js";

const testConfig = loadConfig({
  NODE_ENV: "test",
  PORT: "3000",
  CORS_ORIGIN: "http://localhost:5173",
  LOG_LEVEL: "error",
});

interface ReadLog {
  readonly messageQueries: string[];
  readonly taskQueries: string[];
}

interface StateFixture {
  readonly messages?: readonly MessageStateRecord[];
  readonly tasks?: readonly TaskStateRecord[];
}

function createStateReader(fixture: StateFixture = {}): {
  readonly stateReader: OrganizationFirstDayStateReader;
  readonly readLog: ReadLog;
} {
  const messages = [...(fixture.messages ?? [])];
  const tasks = [...(fixture.tasks ?? [])];
  const readLog: ReadLog = {
    messageQueries: [],
    taskQueries: [],
  };

  return {
    readLog,
    stateReader: {
      findMessageState(employeeId, messageKey) {
        readLog.messageQueries.push(`${employeeId}:${messageKey}`);
        return Promise.resolve(
          messages.find(
            (state) =>
              state.employeeId === employeeId && state.messageKey === messageKey,
          ) ?? null,
        );
      },
      findTaskState(employeeId, taskKey) {
        readLog.taskQueries.push(`${employeeId}:${taskKey}`);
        return Promise.resolve(
          tasks.find(
            (state) => state.employeeId === employeeId && state.taskKey === taskKey,
          ) ?? null,
        );
      },
    },
  };
}

function completedFirstDayFixture(employeeId: string): StateFixture {
  return {
    messages: [
      {
        employeeId,
        messageKey: MANAGER_MESSAGE_KEY,
        readAt: new Date("2026-07-10T10:00:00.000Z"),
      },
    ],
    tasks: [
      {
        employeeId,
        taskKey: FIRST_TASK_KEY,
        completedAt: new Date("2026-07-10T11:00:00.000Z"),
      },
    ],
  };
}

function createTestApp(fixture: StateFixture = {}): {
  readonly app: Express;
  readonly authService: AuthService;
  readonly readLog: ReadLog;
} {
  const employee = buildDemoEmployeeRecord();
  const authService = createAuthService({
    employeeRepository: createInMemoryEmployeeRepository([employee]),
    config: {
      jwtAccessSecret: testConfig.jwtAccessSecret,
      jwtRefreshSecret: testConfig.jwtRefreshSecret,
      accessTokenTtlSeconds: testConfig.accessTokenTtlSeconds,
      refreshTokenTtlSeconds: testConfig.refreshTokenTtlSeconds,
    },
  });
  const { stateReader, readLog } = createStateReader(fixture);
  const service = createOrganizationService({
    accessReader: createOrganizationAccessReader(stateReader),
  });
  const app = express();

  app.use(express.json());
  app.use(requestIdMiddleware);
  app.use(
    "/api/v1/me",
    createRequireEmployee(authService),
    createOrganizationMeRouter(service),
  );
  app.use(notFoundHandler);
  app.use(createErrorHandler(createLogger(testConfig, "organization-route-test")));

  return { app, authService, readLog };
}

async function accessToken(authService: AuthService): Promise<string> {
  const outcome = await authService.login({
    email: buildDemoEmployeeRecord().email,
    password: DEMO_PASSWORD,
  });

  if (Result.isFail(outcome)) {
    throw outcome.error;
  }

  return outcome.value.tokens.accessToken;
}

describe("GET /api/v1/me/organization", () => {
  it("rejects unauthenticated access using the canonical auth behavior", async () => {
    const { app } = createTestApp();

    const response = await request(app).get("/api/v1/me/organization").expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns the schema-valid locked contract without exposing the catalog", async () => {
    const { app, authService } = createTestApp();
    const token = await accessToken(authService);

    const response = await request(app)
      .get("/api/v1/me/organization")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      access: "locked",
      unlockExplanation: {
        code: "premiere-journee-requise",
      },
      organization: null,
    });
    expect(OrganizationResponseSchema.safeParse(response.body).success).toBe(true);
    expect(JSON.stringify(response.body)).not.toContain('"companyProfile"');
    expect(JSON.stringify(response.body)).not.toContain('"departments"');
  });

  it("requires both canonical First-Day records before making organization available", async () => {
    const employee = buildDemoEmployeeRecord();
    const complete = completedFirstDayFixture(employee.id);
    const incompleteFixtures: readonly StateFixture[] = [
      { messages: complete.messages },
      { tasks: complete.tasks },
    ];

    for (const fixture of incompleteFixtures) {
      const { app, authService } = createTestApp(fixture);
      const token = await accessToken(authService);
      const response = await request(app)
        .get("/api/v1/me/organization")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.access).toBe("locked");
      expect(response.body.organization).toBeNull();
    }
  });

  it("returns the schema-valid seven-department catalog after First Day completion", async () => {
    const employee = buildDemoEmployeeRecord();
    const { app, authService } = createTestApp(
      completedFirstDayFixture(employee.id),
    );
    const token = await accessToken(authService);

    const response = await request(app)
      .get("/api/v1/me/organization")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.access).toBe("available");
    expect(response.body.unlockExplanation).toBeNull();
    expect(response.body.organization.companyProfile.name).toBe("NordHabitat");
    expect(response.body.organization.departments).toHaveLength(7);
    expect(OrganizationResponseSchema.safeParse(response.body).success).toBe(true);
  });

  it("is deterministic and performs only employee-scoped First-Day reads", async () => {
    const employee = buildDemoEmployeeRecord();
    const fixture = completedFirstDayFixture(employee.id);
    const fixtureBefore = JSON.stringify(fixture);
    const { app, authService, readLog } = createTestApp(fixture);
    const token = await accessToken(authService);

    const first = await request(app)
      .get("/api/v1/me/organization")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const second = await request(app)
      .get("/api/v1/me/organization")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(second.body).toEqual(first.body);
    expect(JSON.stringify(fixture)).toBe(fixtureBefore);
    expect(readLog.messageQueries).toEqual([
      `${employee.id}:${MANAGER_MESSAGE_KEY}`,
      `${employee.id}:${MANAGER_MESSAGE_KEY}`,
    ]);
    expect(readLog.taskQueries).toEqual([
      `${employee.id}:${FIRST_TASK_KEY}`,
      `${employee.id}:${FIRST_TASK_KEY}`,
    ]);
  });

  it.each(["post", "put", "patch", "delete"] as const)(
    "does not define %s organization access",
    async (method) => {
      const employee = buildDemoEmployeeRecord();
      const { app, authService, readLog } = createTestApp(
        completedFirstDayFixture(employee.id),
      );
      const token = await accessToken(authService);

      const response = await request(app)[method]("/api/v1/me/organization")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.error.code).toBe("NOT_FOUND");
      expect(readLog.messageQueries).toEqual([]);
      expect(readLog.taskQueries).toEqual([]);
    },
  );
});
