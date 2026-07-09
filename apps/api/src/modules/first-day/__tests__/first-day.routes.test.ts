import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../../../app.js";
import { loadConfig } from "../../../config.js";
import type { EmployeeRecord } from "../../auth/auth.types.js";
import {
  buildDemoEmployeeRecord,
  createInMemoryEmployeeRepository,
  DEMO_PASSWORD,
} from "../../auth/__tests__/auth.fixtures.js";
import { FIRST_TASK_KEY, MANAGER_MESSAGE_KEY } from "../first-day.catalog.js";
import { createInMemoryFirstDayStateRepository } from "./first-day.fixtures.js";

const testConfig = loadConfig({
  NODE_ENV: "test",
  PORT: "3000",
  CORS_ORIGIN: "http://localhost:5173",
  LOG_LEVEL: "error",
});

function buildSecondEmployeeRecord(): EmployeeRecord {
  const demo = buildDemoEmployeeRecord();

  return {
    ...demo,
    id: "emp_other",
    employeeNumber: "#NHE-2001",
    email: "collegue.analyste@nordhabitat.ca",
    displayName: "Collègue Analyste",
  };
}

function createTestApp(
  employees: EmployeeRecord[] = [buildDemoEmployeeRecord()],
  stateRepository = createInMemoryFirstDayStateRepository(),
) {
  return createApp(testConfig, {
    probeDatabaseReadiness: async () => ({ isReady: true, detail: "up" }),
    employeeRepository: createInMemoryEmployeeRepository(employees),
    firstDayStateRepository: stateRepository,
  });
}

async function loginAccessToken(
  app: ReturnType<typeof createTestApp>,
  email: string,
): Promise<string> {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password: DEMO_PASSWORD })
    .expect(200);

  return response.body.tokens.accessToken as string;
}

describe("me inbox routes", () => {
  it("returns the manager message as unread initially", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const response = await request(app)
      .get("/api/v1/me/inbox")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.unreadCount).toBe(1);
    expect(response.body.messages).toHaveLength(1);
    expect(response.body.messages[0]).toMatchObject({
      messageKey: MANAGER_MESSAGE_KEY,
      fromName: "Claire Fontaine",
      readAt: null,
    });
  });

  it("marks a message as read and is idempotent", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const first = await request(app)
      .post(`/api/v1/me/inbox/${MANAGER_MESSAGE_KEY}/read`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const second = await request(app)
      .post(`/api/v1/me/inbox/${MANAGER_MESSAGE_KEY}/read`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(second.body.readAt).toBe(first.body.readAt);

    const inbox = await request(app)
      .get("/api/v1/me/inbox")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(inbox.body.unreadCount).toBe(0);
    expect(inbox.body.messages[0].readAt).toBe(first.body.readAt);
  });

  it("returns 404 for an unknown message key", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const response = await request(app)
      .post("/api/v1/me/inbox/unknown-message/read")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});

describe("me task routes", () => {
  it("returns an empty task list before the manager message is read", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const response = await request(app)
      .get("/api/v1/me/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.tasks).toEqual([]);
  });

  it("returns the first task after the manager message is read", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    await request(app)
      .post(`/api/v1/me/inbox/${MANAGER_MESSAGE_KEY}/read`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const response = await request(app)
      .get("/api/v1/me/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.tasks).toHaveLength(1);
    expect(response.body.tasks[0]).toMatchObject({
      taskKey: FIRST_TASK_KEY,
      title: "Découvrir NordHabitat",
      status: "a_faire",
    });
  });

  it("blocks task completion before the manager message is read", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const response = await request(app)
      .post(`/api/v1/me/tasks/${FIRST_TASK_KEY}/complete`)
      .set("Authorization", `Bearer ${token}`)
      .expect(409);

    expect(response.body.error.code).toBe("CONFLICT");
  });

  it("completes a task and is idempotent", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    await request(app)
      .post(`/api/v1/me/inbox/${MANAGER_MESSAGE_KEY}/read`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const first = await request(app)
      .post(`/api/v1/me/tasks/${FIRST_TASK_KEY}/complete`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const second = await request(app)
      .post(`/api/v1/me/tasks/${FIRST_TASK_KEY}/complete`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(second.body.completedAt).toBe(first.body.completedAt);

    const tasks = await request(app)
      .get("/api/v1/me/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(tasks.body.tasks[0].status).toBe("terminee");
  });

  it("returns 404 for an unknown task key", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    await request(app)
      .post(`/api/v1/me/inbox/${MANAGER_MESSAGE_KEY}/read`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const response = await request(app)
      .post("/api/v1/me/tasks/unknown-task/complete")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});

describe("me route authentication", () => {
  it("returns 401 for unauthenticated inbox access", async () => {
    const app = createTestApp();

    const response = await request(app).get("/api/v1/me/inbox").expect(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 for unauthenticated task completion", async () => {
    const app = createTestApp();

    const response = await request(app)
      .post(`/api/v1/me/tasks/${FIRST_TASK_KEY}/complete`)
      .expect(401);

    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});

describe("employee scoping", () => {
  it("keeps inbox and task state isolated per employee", async () => {
    const demo = buildDemoEmployeeRecord();
    const other = buildSecondEmployeeRecord();
    const app = createTestApp([demo, other]);

    const demoToken = await loginAccessToken(app, demo.email);
    const otherToken = await loginAccessToken(app, other.email);

    await request(app)
      .post(`/api/v1/me/inbox/${MANAGER_MESSAGE_KEY}/read`)
      .set("Authorization", `Bearer ${demoToken}`)
      .expect(200);

    const otherInbox = await request(app)
      .get("/api/v1/me/inbox")
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(200);

    expect(otherInbox.body.unreadCount).toBe(1);

    const blocked = await request(app)
      .post(`/api/v1/me/tasks/${FIRST_TASK_KEY}/complete`)
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(409);

    expect(blocked.body.error.code).toBe("CONFLICT");

    const demoTasks = await request(app)
      .get("/api/v1/me/tasks")
      .set("Authorization", `Bearer ${demoToken}`)
      .expect(200);

    expect(demoTasks.body.tasks).toHaveLength(1);
  });
});

describe("GET endpoints do not create state", () => {
  it("leaves inbox unread after a GET inbox call", async () => {
    const stateRepository = createInMemoryFirstDayStateRepository();
    const app = createTestApp([buildDemoEmployeeRecord()], stateRepository);
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    await request(app)
      .get("/api/v1/me/inbox")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const states = await stateRepository.findMessageStates("emp_demo");
    expect(states).toHaveLength(0);
  });

  it("leaves tasks hidden after a GET tasks call before read", async () => {
    const stateRepository = createInMemoryFirstDayStateRepository();
    const app = createTestApp([buildDemoEmployeeRecord()], stateRepository);
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    await request(app)
      .get("/api/v1/me/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const taskStates = await stateRepository.findTaskStates("emp_demo");
    expect(taskStates).toHaveLength(0);
  });
});
