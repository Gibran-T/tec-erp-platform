import { createHash } from "node:crypto";

import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { createApp } from "../../../app.js";
import { loadConfig } from "../../../config.js";
import {
  buildDemoEmployeeRecord,
  createInMemoryEmployeeRepository,
  DEMO_PASSWORD,
} from "../../auth/__tests__/auth.fixtures.js";
import { createInMemoryCourseEditionProgressRepository } from "../course-edition-progress.fixtures.js";
import { createPedagogicalRunService } from "../pedagogical-run.service.js";
import { buildCourseEditionM1Visibility } from "../../professor/professor.service.js";

const { pedagogicalCourseRun } = vi.hoisted(() => ({
  pedagogicalCourseRun: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock("@tec-platform/database-erp", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    getPrismaClient: () => ({
      pedagogicalCourseRun,
      courseEditionProgress: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        upsert: vi.fn(),
      },
    }),
  };
});

const testConfig = loadConfig({
  NODE_ENV: "test",
  PORT: "3000",
  CORS_ORIGIN: "http://localhost:5173",
  LOG_LEVEL: "error",
});

function fingerprint(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function cloneRun<T extends object>(run: T): T {
  return JSON.parse(JSON.stringify(run)) as T;
}

function buildJamesRun1(status: "ACTIVE" | "PLANNED") {
  return {
    id: "pcr_james_run1",
    companyId: "co_nordhabitat",
    employeeId: "emp_james",
    runCode: "JAMES-RUN1",
    runSequence: 1,
    runType: "AUTONOMOUS",
    runLabel: "James Timothy — Run 1 — Autonomous",
    status,
    metadataJson: {
      official: true,
      seed: "james-zero1",
      mustRemainUntouched: "byte-for-byte",
    },
    completionPercent: 42,
    curriculumVersion: "V1",
    reflectionsEnabled: false,
  };
}

const CE_BODY = {
  moduleCode: "M1",
  completedSurfaces: ["apprendre", "connecter"],
  connectionLabPassed: true,
  connectionLabScorePercent: 80,
  quizPassed: false,
  quizPercent: null,
  framesViewed: ["frame-01-enterprise-integrated"],
  documentsOpened: ["doc-inventory-signal"],
};

function createIsolationApp(courseEdition = createInMemoryCourseEditionProgressRepository()) {
  const student = buildDemoEmployeeRecord();
  const app = createApp(testConfig, {
    probeDatabaseReadiness: async () => ({ isReady: true, detail: "up" }),
    employeeRepository: createInMemoryEmployeeRepository([student]),
    courseEditionProgressRepository: courseEdition,
  });
  return { app, student, courseEdition };
}

async function login(app: ReturnType<typeof createApp>, email: string): Promise<string> {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password: DEMO_PASSWORD })
    .expect(200);
  return response.body.tokens.accessToken as string;
}

function resetPedagogicalRunMutationSpies(): void {
  pedagogicalCourseRun.create.mockClear();
  pedagogicalCourseRun.update.mockClear();
  pedagogicalCourseRun.delete.mockClear();
}

function expectNoPedagogicalRunMutation(): void {
  expect(pedagogicalCourseRun.create).not.toHaveBeenCalled();
  expect(pedagogicalCourseRun.update).not.toHaveBeenCalled();
  expect(pedagogicalCourseRun.delete).not.toHaveBeenCalled();
}

describe("Course Edition persistence isolation from PedagogicalCourseRun", () => {
  it("GET without a run does not create, update, or delete a pedagogical run", async () => {
    resetPedagogicalRunMutationSpies();
    const { app } = createIsolationApp();
    const token = await login(app, "demo.analyste@nordhabitat.ca");

    const response = await request(app)
      .get("/api/v1/me/course-edition/M1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.progress).toBeNull();
    expectNoPedagogicalRunMutation();
  });

  it("PUT without a run persists Course Edition and does not create, update, or delete a pedagogical run", async () => {
    resetPedagogicalRunMutationSpies();
    const { app, student, courseEdition } = createIsolationApp();
    const token = await login(app, "demo.analyste@nordhabitat.ca");

    const saved = await request(app)
      .put("/api/v1/me/course-edition/M1")
      .set("Authorization", `Bearer ${token}`)
      .send(CE_BODY)
      .expect(200);

    expect(saved.body.moduleCode).toBe("M1");
    expect(saved.body.completedSurfaces).toEqual(["apprendre", "connecter"]);
    expect(saved.body.progressPercent).toBe(50);

    const hydrated = await request(app)
      .get("/api/v1/me/course-edition/M1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(hydrated.body.progress.connectionLabPassed).toBe(true);
    expect(hydrated.body.progress.progressPercent).toBe(50);

    const stored = await courseEdition.findByEmployeeAndModule(student.id, "M1");
    expect(stored?.connectionLabPassed).toBe(true);

    expectNoPedagogicalRunMutation();
  });

  it.each(["ACTIVE", "PLANNED"] as const)(
    "GET/PUT with official %s James Run 1 leave the run byte-for-byte identical",
    async (status) => {
      resetPedagogicalRunMutationSpies();

      const jamesRun = buildJamesRun1(status);
      const before = fingerprint(jamesRun);
      const held = cloneRun(jamesRun);

      const courseEdition = createInMemoryCourseEditionProgressRepository();
      const service = createPedagogicalRunService({
        courseEditionProgressRepository: courseEdition,
      });

      const getBefore = await service.getCourseEditionProgress("emp_james", "M1");
      expect(getBefore.ok && getBefore.value).toBeNull();

      const put = await service.upsertCourseEditionProgress({
        employeeId: "emp_james",
        moduleCode: "M1",
        body: CE_BODY,
      });
      expect(put.ok).toBe(true);
      if (put.ok) {
        expect(put.value.moduleCode).toBe("M1");
        expect(put.value.progressPercent).toBe(50);
      }

      const getAfter = await service.getCourseEditionProgress("emp_james", "M1");
      expect(getAfter.ok && getAfter.value?.completedSurfaces).toEqual(["apprendre", "connecter"]);

      expect(fingerprint(held)).toBe(before);
      expect(fingerprint(jamesRun)).toBe(before);
      expectNoPedagogicalRunMutation();
    },
  );

  it("professor visibility hydrates from the isolated Course Edition record, not run metadata", async () => {
    const courseEdition = createInMemoryCourseEditionProgressRepository();
    const service = createPedagogicalRunService({
      courseEditionProgressRepository: courseEdition,
    });
    await service.upsertCourseEditionProgress({
      employeeId: "emp_demo",
      moduleCode: "M1",
      body: CE_BODY,
    });
    const progress = await courseEdition.findByEmployeeAndModule("emp_demo", "M1");

    const visibility = buildCourseEditionM1Visibility({
      employeeId: "emp_demo",
      studentName: "Analyste Démo",
      officialRunId: "pcr_james_run1",
      progress,
      missionAttempts: [],
    });

    expect(visibility.courseEditionStatus).toBe("in_progress");
    expect(visibility.surfaceApprendre).toBe("completed");
    expect(visibility.connectionLabStatus).toBe("passed");
    expect(visibility.progressPercent).toBe(50);
    expect(visibility.pedagogicalCourseRunId).toBe("pcr_james_run1");
  });
});

describe("Course Edition isolation is structural, not a lab-run name filter", () => {
  it("stores progress by employeeId + moduleCode without creating any pedagogical run", async () => {
    resetPedagogicalRunMutationSpies();
    const repo = createInMemoryCourseEditionProgressRepository();
    const service = createPedagogicalRunService({ courseEditionProgressRepository: repo });
    await service.upsertCourseEditionProgress({
      employeeId: "emp_any_student",
      moduleCode: "M3",
      body: { ...CE_BODY, moduleCode: "M3" },
    });
    const stored = await repo.findByEmployeeAndModule("emp_any_student", "M3");
    expect(stored?.moduleCode).toBe("M3");
    expectNoPedagogicalRunMutation();
  });
});
