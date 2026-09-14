import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../../../app.js";
import { loadConfig } from "../../../config.js";
import {
  buildDemoEmployeeRecord,
  createInMemoryEmployeeRepository,
  DEMO_PASSWORD,
} from "../../auth/__tests__/auth.fixtures.js";
import { createInMemorySapIee2eSelfReportRepository } from "../sap-iee2e.fixtures.js";
import { createDefaultUnits } from "../sap-iee2e.catalog.js";

const testConfig = loadConfig({
  NODE_ENV: "test",
  PORT: "3000",
  CORS_ORIGIN: "http://localhost:5173",
  LOG_LEVEL: "error",
});

function createIsolationApp() {
  const student = buildDemoEmployeeRecord();
  return createApp(testConfig, {
    probeDatabaseReadiness: async () => ({ isReady: true, detail: "up" }),
    employeeRepository: createInMemoryEmployeeRepository([student]),
    sapIee2eSelfReportRepository: createInMemorySapIee2eSelfReportRepository(),
  });
}

async function login(app: ReturnType<typeof createIsolationApp>): Promise<string> {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "demo.analyste@nordhabitat.ca", password: DEMO_PASSWORD })
    .expect(200);
  return response.body.tokens.accessToken as string;
}

describe("SAP Suite isolation from Course Edition and PedagogicalCourseRun", () => {
  it("does not expose a course-edition write surface", async () => {
    const app = createIsolationApp();
    const token = await login(app);

    await request(app)
      .get("/api/v1/me/course-edition/M1")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    await request(app)
      .put("/api/v1/me/course-edition/M1")
      .set("Authorization", `Bearer ${token}`)
      .send({ moduleCode: "M1" })
      .expect(404);
  });

  it("reads and writes SAP accompaniment without creating a pedagogical run", async () => {
    const app = createIsolationApp();
    const token = await login(app);

    const unread = await request(app)
      .get("/api/v1/me/sap-iee2e-self-report")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(unread.body.persisted).toBe(false);

    await request(app)
      .put("/api/v1/me/sap-iee2e-self-report")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentUnit: 1,
        sessionNumber: 1,
        sapAccess: "confirme",
        difficulty: "",
        needsSupport: false,
        note: "",
        achievement: "non_declare",
        units: createDefaultUnits(),
        semaineZero: {
          universalId: true,
          learningHub: true,
          iee2eOpened: false,
          noSharedAccount: true,
          contingencyAck: true,
        },
      })
      .expect(200);

    const reread = await request(app)
      .get("/api/v1/me/sap-iee2e-self-report")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(reread.body.persisted).toBe(true);
    expect(reread.body.sapResultOfficial).toBe(false);
  });
});
