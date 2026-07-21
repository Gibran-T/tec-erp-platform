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
import { FIRST_TASK_KEY, MANAGER_MESSAGE_KEY } from "../../first-day/first-day.catalog.js";
import { createInMemoryFirstDayStateRepository } from "../../first-day/__tests__/first-day.fixtures.js";
import {
  ENTERPRISE_DISCOVERY_MISSION_KEY,
  MISSION_FEEDBACK_COMPLETE_KEY,
  REQUIRED_ACKNOWLEDGED_INPUT_KEYS,
} from "../mission.catalog.js";
import {
  createInMemoryCourseProgressRepository,
  createInMemoryMissionAttemptRepository,
  createInMemoryUnlockStateRepository,
} from "./mission.fixtures.js";

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

function createUnlockedState(employeeId: string) {
  return createInMemoryFirstDayStateRepository({
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
  });
}

function createTestApp(
  employees: EmployeeRecord[] = [buildDemoEmployeeRecord()],
  firstDayState = createInMemoryFirstDayStateRepository(),
  missionAttempts = createInMemoryMissionAttemptRepository(),
) {
  return createApp(testConfig, {
    probeDatabaseReadiness: async () => ({ isReady: true, detail: "up" }),
    employeeRepository: createInMemoryEmployeeRepository(employees),
    firstDayStateRepository: firstDayState,
    missionAttemptRepository: missionAttempts,
    unlockStateRepository: createInMemoryUnlockStateRepository(),
    courseProgressRepository: createInMemoryCourseProgressRepository(),
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

const validMappings = [
  { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
  { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
];

const validJustification =
  "L’écart 40 versus 36 illustre une fragmentation d’information entre l’entrepôt et les systèmes TI.";

function validSubmitBody() {
  return {
    acknowledgedInputKeys: [...REQUIRED_ACKNOWLEDGED_INPUT_KEYS],
    departmentProblemMappings: validMappings,
    justification: validJustification,
  };
}

describe("me mission routes", () => {
  it("returns 401 without authentication", async () => {
    const app = createTestApp();

    await request(app).get("/api/v1/me/missions").expect(401);
  });

  it("returns a locked summary before Day 1 is complete", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const response = await request(app)
      .get("/api/v1/me/missions")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.missions).toHaveLength(3);
    expect(response.body.missions[0]).toMatchObject({
      missionKey: ENTERPRISE_DISCOVERY_MISSION_KEY,
      status: "locked",
    });
    expect(response.body.missions[0].unlockExplanation).toContain("première journée");
    expect(response.body.missions[1].status).toBe("locked");
    expect(response.body.missions[2].status).toBe("locked");
  });

  it("hides briefing and mapping tools while locked", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const response = await request(app)
      .get(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.status).toBe("locked");
    expect(response.body.briefing).toBeNull();
    expect(response.body.contextItems).toBeNull();
    expect(response.body.departments).toBeNull();
    expect(response.body.problems).toBeNull();
    expect(response.body.attempt).toBeNull();
    expect(response.body.allowedMappingHints).toBeUndefined();
    expect(response.body.allowedMappings).toBeUndefined();
  });

  it("returns available status after Day 1 is complete", async () => {
    const demo = buildDemoEmployeeRecord();
    const app = createTestApp([demo], createUnlockedState(demo.id));
    const token = await loginAccessToken(app, demo.email);

    const response = await request(app)
      .get("/api/v1/me/missions")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.missions[0].status).toBe("available");
    expect(response.body.missions[0].unlockExplanation).toBeNull();
    expect(response.body.missions[1].status).toBe("locked");
    expect(response.body.missions[2].status).toBe("locked");
  });

  it("creates an attempt on start and is idempotent", async () => {
    const demo = buildDemoEmployeeRecord();
    const app = createTestApp([demo], createUnlockedState(demo.id));
    const token = await loginAccessToken(app, demo.email);

    const first = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/start`)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    expect(first.body.created).toBe(true);
    expect(first.body.attempt.status).toBe("in_progress");
    expect(first.body.attempt.startedAt).toBeTruthy();

    const second = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/start`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(second.body.created).toBe(false);
    expect(second.body.attempt.startedAt).toBe(first.body.attempt.startedAt);
  });

  it("returns 409 when submit is called before start", async () => {
    const demo = buildDemoEmployeeRecord();
    const app = createTestApp([demo], createUnlockedState(demo.id));
    const token = await loginAccessToken(app, demo.email);

    const response = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send(validSubmitBody())
      .expect(409);

    expect(response.body.error.code).toBe("CONFLICT");
  });

  it("returns 409 for locked start and submit", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const start = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/start`)
      .set("Authorization", `Bearer ${token}`)
      .expect(409);

    expect(start.body.error.code).toBe("CONFLICT");

    const submit = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send(validSubmitBody())
      .expect(409);

    expect(submit.body.error.code).toBe("CONFLICT");
  });

  it("returns 404 for an unknown mission key", async () => {
    const demo = buildDemoEmployeeRecord();
    const app = createTestApp([demo], createUnlockedState(demo.id));
    const token = await loginAccessToken(app, demo.email);

    const response = await request(app)
      .get("/api/v1/me/missions/m1-m02-unknown")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  it("rejects invalid acknowledged inputs, mappings, and justification lengths", async () => {
    const demo = buildDemoEmployeeRecord();
    const app = createTestApp([demo], createUnlockedState(demo.id));
    const token = await loginAccessToken(app, demo.email);

    await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/start`)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const missingAck = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        acknowledgedInputKeys: ["ctx-nordhabitat-overview"],
        departmentProblemMappings: validMappings,
        justification: validJustification,
      })
      .expect(400);

    expect(missingAck.body.error.code).toBe("VALIDATION");

    const invalidMapping = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        acknowledgedInputKeys: [...REQUIRED_ACKNOWLEDGED_INPUT_KEYS],
        departmentProblemMappings: [
          { departmentKey: "dept-entrepot", problemKey: "prob-plaintes-clients" },
          { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
        ],
        justification: validJustification,
      })
      .expect(400);

    expect(invalidMapping.body.error.code).toBe("VALIDATION");

    const duplicate = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        acknowledgedInputKeys: [...REQUIRED_ACKNOWLEDGED_INPUT_KEYS],
        departmentProblemMappings: [validMappings[0], validMappings[0]],
        justification: validJustification,
      })
      .expect(400);

    expect(duplicate.body.error.code).toBe("VALIDATION");

    const short = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        acknowledgedInputKeys: [...REQUIRED_ACKNOWLEDGED_INPUT_KEYS],
        departmentProblemMappings: validMappings,
        justification: "trop court",
      })
      .expect(400);

    expect(short.body.error.code).toBe("VALIDATION");

    const long = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        acknowledgedInputKeys: [...REQUIRED_ACKNOWLEDGED_INPUT_KEYS],
        departmentProblemMappings: validMappings,
        justification: "x".repeat(1001),
      })
      .expect(400);

    expect(long.body.error.code).toBe("VALIDATION");
  });

  it("rejects schema-invalid submit bodies before business evaluation", async () => {
    const demo = buildDemoEmployeeRecord();
    const app = createTestApp([demo], createUnlockedState(demo.id));
    const token = await loginAccessToken(app, demo.email);

    await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/start`)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const malformed = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({ acknowledgedInputKeys: "not-an-array" })
      .expect(400);

    expect(malformed.body.error.code).toBe("VALIDATION");

    const oneMapping = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        acknowledgedInputKeys: [...REQUIRED_ACKNOWLEDGED_INPUT_KEYS],
        departmentProblemMappings: [validMappings[0]],
        justification: validJustification,
      })
      .expect(400);

    expect(oneMapping.body.error.code).toBe("VALIDATION");

    const shortAfterTrim = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        acknowledgedInputKeys: [...REQUIRED_ACKNOWLEDGED_INPUT_KEYS],
        departmentProblemMappings: validMappings,
        justification: `   ${"x".repeat(39)}   `,
      })
      .expect(400);

    expect(shortAfterTrim.body.error.code).toBe("VALIDATION");
  });

  it("submits evidence, returns feedback, and is idempotent without replacing evidence", async () => {
    const demo = buildDemoEmployeeRecord();
    const app = createTestApp([demo], createUnlockedState(demo.id));
    const token = await loginAccessToken(app, demo.email);

    await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/start`)
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const first = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send(validSubmitBody())
      .expect(200);

    expect(first.body.attempt.status).toBe("completed");
    expect(first.body.attempt.feedbackKey).toBe(MISSION_FEEDBACK_COMPLETE_KEY);
    expect(first.body.attempt.feedbackBody).toContain("Claire Fontaine");
    expect(first.body.attempt.justification).toBe(validJustification);
    expect(first.body.allowedMappings).toBeUndefined();

    const second = await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...validSubmitBody(),
        justification: `${validJustification} modifié pour tenter un remplacement.`,
      })
      .expect(200);

    expect(second.body.attempt.justification).toBe(validJustification);
    expect(second.body.attempt.completedAt).toBe(first.body.attempt.completedAt);

    const detail = await request(app)
      .get(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(detail.body.status).toBe("completed");
    expect(detail.body.attempt.justification).toBe(validJustification);
    expect(JSON.stringify(detail.body)).not.toContain("ALLOWED_DEPARTMENT_PROBLEM_PAIRS");
    expect(detail.body.allowedMappingHints).toBeUndefined();
  });

  it("isolates mission attempts between employees", async () => {
    const demo = buildDemoEmployeeRecord();
    const other = buildSecondEmployeeRecord();
    const firstDay = createInMemoryFirstDayStateRepository({
      messages: [
        {
          employeeId: demo.id,
          messageKey: MANAGER_MESSAGE_KEY,
          readAt: new Date("2026-07-10T10:00:00.000Z"),
        },
        {
          employeeId: other.id,
          messageKey: MANAGER_MESSAGE_KEY,
          readAt: new Date("2026-07-10T10:00:00.000Z"),
        },
      ],
      tasks: [
        {
          employeeId: demo.id,
          taskKey: FIRST_TASK_KEY,
          completedAt: new Date("2026-07-10T11:00:00.000Z"),
        },
        {
          employeeId: other.id,
          taskKey: FIRST_TASK_KEY,
          completedAt: new Date("2026-07-10T11:00:00.000Z"),
        },
      ],
    });
    const app = createTestApp([demo, other], firstDay);
    const demoToken = await loginAccessToken(app, demo.email);
    const otherToken = await loginAccessToken(app, other.email);

    await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/start`)
      .set("Authorization", `Bearer ${demoToken}`)
      .expect(201);

    await request(app)
      .post(`/api/v1/me/missions/${ENTERPRISE_DISCOVERY_MISSION_KEY}/submit`)
      .set("Authorization", `Bearer ${demoToken}`)
      .send(validSubmitBody())
      .expect(200);

    const otherList = await request(app)
      .get("/api/v1/me/missions")
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(200);

    expect(otherList.body.missions[0].status).toBe("available");
  });
});
