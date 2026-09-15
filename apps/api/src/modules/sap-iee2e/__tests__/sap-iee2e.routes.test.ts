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
import { createInMemorySapIee2eSelfReportRepository } from "../sap-iee2e.fixtures.js";
import { createDefaultUnits } from "../sap-iee2e.catalog.js";

const testConfig = loadConfig({
  NODE_ENV: "test",
  PORT: "3000",
  CORS_ORIGIN: "http://localhost:5173",
  LOG_LEVEL: "error",
});

function buildProfessorRecord(): EmployeeRecord {
  const demo = buildDemoEmployeeRecord();
  return {
    ...demo,
    id: "emp_prof",
    employeeNumber: "#NHE-PROF",
    email: "professeur.demo@nordhabitat.ca",
    displayName: "Professeur Démo",
    role: "PROFESSOR",
  };
}

function createTestApp() {
  const student = buildDemoEmployeeRecord();
  const professor = buildProfessorRecord();
  return createApp(testConfig, {
    probeDatabaseReadiness: async () => ({ isReady: true, detail: "up" }),
    employeeRepository: createInMemoryEmployeeRepository([student, professor]),
    sapIee2eSelfReportRepository: createInMemorySapIee2eSelfReportRepository({
      visibleStudents: {
        emp_prof: [{ employeeId: student.id, displayName: student.displayName }],
      },
      visibleCohorts: {
        emp_prof: [{ cohortId: "coh_demo", cohortCode: "SAP-A", cohortName: "Cohorte SAP A" }],
      },
      studentProfessor: {
        emp_demo: "emp_prof",
      },
    }),
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

describe("sap-iee2e self-report routes", () => {
  it("returns a default undeclared report without persisting Achievement", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const response = await request(app)
      .get("/api/v1/me/sap-iee2e-self-report")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.persisted).toBe(false);
    expect(response.body.achievement).toBe("non_declare");
    expect(response.body.units).toHaveLength(9);
    expect(response.body.stages).toHaveLength(10);
    expect(response.body.currentStageCode).toBe("S1");
    expect(response.body.institutionalStatus).toBe("not_started");
    expect(response.body.sapResultOfficial).toBe(false);
    expect(response.body.lastDeclaredAt).toBeNull();
    expect(response.body.semaineZeroReady).toBe(false);
    expect(response.body.calendar.windowLabel).toMatch(/Semaine Zéro/i);
  });

  it("exposes the configurable SAP Suite End to End catalog with official outbound link only", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    const response = await request(app)
      .get("/api/v1/me/sap-iee2e/program")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.programCode).toBe("SAP_SUITE_E2E");
    expect(response.body.stages).toHaveLength(10);
    expect(response.body.stages[0].code).toBe("S1");
    expect(response.body.stages[0].titleStatus).toBe("institutionally_confirmed");
    expect(response.body.stages[4].officialPathHint).toMatch(/Unité publique SAP 4/);
    expect(response.body.officialPathUnits).toHaveLength(9);
    expect(response.body.officialUrlOpensInNewTab).toBe(true);
    expect(response.body.officialUrl).toBe(
      "https://learning.sap.com/courses/exploring-end-to-end-business-processes-in-sap-business-suite-fr",
    );
    expect(response.body.officialUrl).not.toMatch(/\/null/);
    expect(response.body.iframeForbidden).toBe(true);
    expect(response.body.emitsSapAchievement).toBe(false);
    expect(response.body.emitsSapCertification).toBe(false);
  });

  it("persists a student declaration and exposes it to the professor cohort", async () => {
    const app = createTestApp();
    const studentToken = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");
    const units = createDefaultUnits().map((unit) =>
      unit.unitNumber === 1 ? { ...unit, status: "en_cours" as const } : unit,
    );

    const saved = await request(app)
      .put("/api/v1/me/sap-iee2e-self-report")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        currentUnit: 1,
        sessionNumber: 1,
        sapAccess: "commence",
        difficulty: "Accès SAP Learning",
        needsSupport: true,
        note: "Compte créé, parcours commencé.",
        achievement: "non_declare",
        units,
        semaineZero: {
          universalId: true,
          learningHub: true,
          iee2eOpened: true,
          noSharedAccount: false,
          contingencyAck: false,
        },
      })
      .expect(200);

    expect(saved.body.persisted).toBe(true);
    expect(saved.body.needsSupport).toBe(true);
    expect(saved.body.sapAccess).toBe("commence");
    expect(saved.body.semaineZeroReady).toBe(false);

    const reread = await request(app)
      .get("/api/v1/me/sap-iee2e-self-report")
      .set("Authorization", `Bearer ${studentToken}`)
      .expect(200);
    expect(reread.body.difficulty).toBe("Accès SAP Learning");

    const professorToken = await loginAccessToken(app, "professeur.demo@nordhabitat.ca");
    const cohort = await request(app)
      .get("/api/v1/professor/sap-iee2e/cohort")
      .set("Authorization", `Bearer ${professorToken}`)
      .expect(200);

    expect(cohort.body.disclaimer).toMatch(/n’émet pas/i);
    expect(cohort.body.students).toHaveLength(1);
    expect(cohort.body.students[0]).toMatchObject({
      displayName: "Analyste Démo",
      needsSupport: true,
      sapAccess: "commence",
      notStarted: false,
      semaineZeroReady: false,
      currentStageCode: "S1",
      sapResultOfficial: false,
    });
    expect(cohort.body.semaineZero).toMatchObject({
      readyCount: 0,
      pendingCount: 1,
      totalCount: 1,
    });
  });

  it("publishes the séance 1 date so Semaine Zéro has a window", async () => {
    const app = createTestApp();
    const professorToken = await loginAccessToken(app, "professeur.demo@nordhabitat.ca");

    const saved = await request(app)
      .put("/api/v1/professor/sap-iee2e/calendar")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ session1Date: "2026-09-08" })
      .expect(200);

    expect(saved.body.session1Date).toBe("2026-09-08");
    expect(saved.body.daysUntilSession1).toEqual(expect.any(Number));

    const studentToken = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");
    const report = await request(app)
      .get("/api/v1/me/sap-iee2e-self-report")
      .set("Authorization", `Bearer ${studentToken}`)
      .expect(200);

    expect(report.body.calendar.session1Date).toBe("2026-09-08");

    const cohort = await request(app)
      .get("/api/v1/professor/sap-iee2e/cohort")
      .set("Authorization", `Bearer ${professorToken}`)
      .expect(200);
    expect(cohort.body.calendar.session1Date).toBe("2026-09-08");
  });

  it("keeps professor notes private to the cohort perimeter", async () => {
    const app = createTestApp();
    const professorToken = await loginAccessToken(app, "professeur.demo@nordhabitat.ca");
    const studentToken = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    await request(app)
      .put("/api/v1/me/sap-iee2e-self-report")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        currentUnit: 1,
        sessionNumber: 1,
        sapAccess: "commence",
        difficulty: "",
        needsSupport: false,
        note: "",
        achievement: "non_declare",
        units: createDefaultUnits(),
        semaineZero: {
          universalId: true,
          learningHub: true,
          iee2eOpened: true,
          noSharedAccount: true,
          contingencyAck: true,
        },
      })
      .expect(200);

    const note = await request(app)
      .put("/api/v1/professor/sap-iee2e/students/emp_demo/notes")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({ stageCode: "S1", note: "Relancer l’accès individuel." })
      .expect(200);
    expect(note.body.note).toMatch(/Relancer/);

    await request(app)
      .get("/api/v1/professor/sap-iee2e/students/emp_demo")
      .set("Authorization", `Bearer ${studentToken}`)
      .expect(403);

    const accompaniment = await request(app)
      .get("/api/v1/professor/sap-iee2e/students/emp_demo")
      .set("Authorization", `Bearer ${professorToken}`)
      .expect(200);
    expect(accompaniment.body.notes).toHaveLength(1);
    expect(accompaniment.body.sapResultOfficial).toBe(false);
  });

  it("associates an existing cohort to the SAP Suite End to End program", async () => {
    const app = createTestApp();
    const professorToken = await loginAccessToken(app, "professeur.demo@nordhabitat.ca");

    const saved = await request(app)
      .put("/api/v1/professor/sap-iee2e/assignments")
      .set("Authorization", `Bearer ${professorToken}`)
      .send({
        cohortId: "coh_demo",
        language: "fr",
        institutionalStatus: "active",
        assigned: true,
      })
      .expect(200);

    expect(saved.body.assignments[0]).toMatchObject({
      cohortCode: "SAP-A",
      assigned: true,
      programCode: "SAP_SUITE_E2E",
    });
  });

  it("forbids students from the professor cohort endpoint", async () => {
    const app = createTestApp();
    const token = await loginAccessToken(app, "demo.analyste@nordhabitat.ca");

    await request(app)
      .put("/api/v1/professor/sap-iee2e/calendar")
      .set("Authorization", `Bearer ${token}`)
      .send({ session1Date: "2026-09-08" })
      .expect(403);
  });
});
