#!/usr/bin/env node
/**
 * Local HCM assessment smoke (API authoritative) on disposable DB.
 * Creates DB objects for locked/eligible/V1/professor/admin flows, then cleans QA residue.
 *
 * Env:
 *   DATABASE_URL (required, local)
 *   API_BASE_URL (default http://127.0.0.1:3000)
 *   WEB_BASE_URL (default http://127.0.0.1:5173)
 *
 * Modes:
 *   node scripts/hcm-assessment-smoke.mjs --prepare
 *   node scripts/hcm-assessment-smoke.mjs --collect
 *   node scripts/hcm-assessment-smoke.mjs --cleanup
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Password } from "@tec-platform/core";
import { getPrismaClient } from "@tec-platform/database-erp";
import { HCM_MISSION_KEYS, listRegularMissionKeys } from "@tec-platform/mission-catalog";

import { createApiClient, envOrDefault } from "./final-smoke-lib.mjs";
import {
  HCM_M8_QUESTIONS,
} from "../src/modules/assessment/hcm/hcm-m8-question-bank.ts";
import { seedHcmM8AssessmentBank } from "../src/modules/assessment/hcm/hcm-m8.seed.ts";

const QA_PREFIX = "__QA_V2_HCM_ASSESS_";
const QA_PASSWORD = "QaV2HcmAssess!2026";
const COURSE_CODE = "TEC_ERP_V1";

const accounts = {
  admin: {
    employeeNumber: `${QA_PREFIX}ADMIN`,
    email: "__qa_v2_hcm_assess_admin@nordhabitat.local",
    role: "ADMIN",
    displayName: `${QA_PREFIX} Admin`,
    password: QA_PASSWORD,
  },
  professorA: {
    employeeNumber: `${QA_PREFIX}PROF_A`,
    email: "__qa_v2_hcm_assess_prof_a@nordhabitat.local",
    role: "PROFESSOR",
    displayName: `${QA_PREFIX} Professor A`,
    password: QA_PASSWORD,
  },
  professorB: {
    employeeNumber: `${QA_PREFIX}PROF_B`,
    email: "__qa_v2_hcm_assess_prof_b@nordhabitat.local",
    role: "PROFESSOR",
    displayName: `${QA_PREFIX} Professor B`,
    password: QA_PASSWORD,
  },
  locked: {
    employeeNumber: `${QA_PREFIX}STU_LOCKED`,
    email: "__qa_v2_hcm_assess_locked@nordhabitat.local",
    role: "JR_BUSINESS_ANALYST",
    displayName: `${QA_PREFIX} Locked V2`,
    password: QA_PASSWORD,
  },
  eligible: {
    employeeNumber: `${QA_PREFIX}STU_ELIGIBLE`,
    email: "__qa_v2_hcm_assess_eligible@nordhabitat.local",
    role: "JR_BUSINESS_ANALYST",
    displayName: `${QA_PREFIX} Eligible V2`,
    password: QA_PASSWORD,
  },
  v1: {
    employeeNumber: `${QA_PREFIX}STU_V1`,
    email: "__qa_v2_hcm_assess_v1@nordhabitat.local",
    role: "JR_BUSINESS_ANALYST",
    displayName: `${QA_PREFIX} Historical V1`,
    password: QA_PASSWORD,
  },
};

async function cleanup(client) {
  const employees = await client.employee.findMany({
    where: { employeeNumber: { startsWith: QA_PREFIX } },
    select: { id: true },
  });
  const employeeIds = employees.map((row) => row.id);
  const companies = await client.company.findMany({
    where: { code: { startsWith: QA_PREFIX } },
    select: { id: true },
  });
  const companyIds = companies.map((row) => row.id);

  if (employeeIds.length > 0) {
    const attempts = await client.missionAttempt.findMany({
      where: { employeeId: { in: employeeIds } },
      select: { id: true },
    });
    const attemptIds = attempts.map((row) => row.id);
    if (attemptIds.length > 0) {
      await client.feedbackRecord.deleteMany({ where: { attemptId: { in: attemptIds } } });
      await client.missionEvidence.deleteMany({ where: { attemptId: { in: attemptIds } } });
      await client.missionAttempt.deleteMany({ where: { id: { in: attemptIds } } });
    }
    await client.assessmentAttempt.deleteMany({ where: { employeeId: { in: employeeIds } } });
    await client.capstoneSubmission.deleteMany({ where: { employeeId: { in: employeeIds } } });
    await client.certificate.deleteMany({ where: { employeeId: { in: employeeIds } } });
    await client.cohortMembership.deleteMany({ where: { employeeId: { in: employeeIds } } });
    await client.pedagogicalCourseRun.deleteMany({ where: { employeeId: { in: employeeIds } } });
    await client.employee.deleteMany({ where: { id: { in: employeeIds } } });
  }

  await client.cohort.deleteMany({ where: { code: { startsWith: QA_PREFIX } } });
  for (const companyId of companyIds) {
    await client.companyConfiguration.deleteMany({ where: { companyId } });
    await client.aiPolicy.deleteMany({ where: { companyId } });
    await client.company.delete({ where: { id: companyId } });
  }

  const residue = await client.employee.count({
    where: { employeeNumber: { startsWith: QA_PREFIX } },
  });
  return { qaResidue: residue };
}

async function upsertEmployee(client, account, companyId) {
  return client.employee.upsert({
    where: { employeeNumber: account.employeeNumber },
    update: {
      email: account.email,
      displayName: account.displayName,
      passwordHash: Password.hash(account.password),
      role: account.role,
      companyId,
    },
    create: {
      employeeNumber: account.employeeNumber,
      email: account.email,
      displayName: account.displayName,
      passwordHash: Password.hash(account.password),
      role: account.role,
      companyId,
    },
  });
}

async function completeKeys(client, employeeId, runId, keys) {
  const definitions = await client.missionDefinition.findMany({
    where: { missionKey: { in: [...keys] } },
  });
  for (const definition of definitions) {
    await client.missionAttempt.upsert({
      where: {
        employeeId_missionDefinitionId_pedagogicalCourseRunId_attemptNumber: {
          employeeId,
          missionDefinitionId: definition.id,
          pedagogicalCourseRunId: runId,
          attemptNumber: 1,
        },
      },
      create: {
        employeeId,
        missionDefinitionId: definition.id,
        pedagogicalCourseRunId: runId,
        attemptNumber: 1,
        status: "completed",
        scorePercent: 100,
        startedAt: new Date(),
        submittedAt: new Date(),
        completedAt: new Date(),
        responsesJson: {},
        feedbackJson: { source: "hcm-assessment-smoke" },
      },
      update: {
        status: "completed",
        scorePercent: 100,
        submittedAt: new Date(),
        completedAt: new Date(),
      },
    });
  }
}

async function prepare() {
  const client = getPrismaClient();
  try {
    await cleanup(client);
    await seedHcmM8AssessmentBank(client);

    const course = await client.course.findUnique({ where: { code: COURSE_CODE } });
    if (!course) {
      throw new Error(`${COURSE_CODE} missing — migrate/seed base catalog first.`);
    }

    const companyA = await client.company.create({
      data: {
        code: `${QA_PREFIX}CO_A`,
        name: `${QA_PREFIX} Company A`,
        configuration: { create: { aiEnabled: true, settingsJson: {} } },
        aiPolicy: { create: { aiEnabled: true, policyJson: {} } },
      },
    });
    const companyB = await client.company.create({
      data: {
        code: `${QA_PREFIX}CO_B`,
        name: `${QA_PREFIX} Company B`,
        configuration: { create: { aiEnabled: true, settingsJson: {} } },
        aiPolicy: { create: { aiEnabled: true, policyJson: {} } },
      },
    });

    const admin = await upsertEmployee(client, accounts.admin, companyA.id);
    const professorA = await upsertEmployee(client, accounts.professorA, companyA.id);
    const professorB = await upsertEmployee(client, accounts.professorB, companyB.id);
    const locked = await upsertEmployee(client, accounts.locked, companyA.id);
    const eligible = await upsertEmployee(client, accounts.eligible, companyA.id);
    const v1 = await upsertEmployee(client, accounts.v1, companyA.id);

    const cohortA = await client.cohort.create({
      data: { code: `${QA_PREFIX}COH_A`, name: `${QA_PREFIX} Cohort A`, companyId: companyA.id },
    });
    const cohortB = await client.cohort.create({
      data: { code: `${QA_PREFIX}COH_B`, name: `${QA_PREFIX} Cohort B`, companyId: companyB.id },
    });

    for (const [employeeId, role] of [
      [professorA.id, "professor"],
      [locked.id, "student"],
      [eligible.id, "student"],
      [v1.id, "student"],
    ]) {
      await client.cohortMembership.create({ data: { cohortId: cohortA.id, employeeId, roleInCohort: role } });
    }
    await client.cohortMembership.create({
      data: { cohortId: cohortB.id, employeeId: professorB.id, roleInCohort: "professor" },
    });

    const startedAt = new Date();
    const mkRun = (input) =>
      client.pedagogicalCourseRun.create({
        data: {
          companyId: input.companyId,
          cohortId: input.cohortId,
          employeeId: input.employeeId,
          professorId: professorA.id,
          courseId: course.id,
          runCode: input.runCode,
          runSequence: 1,
          runType: "AUTONOMOUS",
          runLabel: input.runLabel,
          status: "ACTIVE",
          createdById: admin.id,
          reflectionsEnabled: true,
          curriculumVersion: input.curriculumVersion,
          startedAt,
          completionPercent: 0,
        },
      });

    const lockedRun = await mkRun({
      companyId: companyA.id,
      cohortId: cohortA.id,
      employeeId: locked.id,
      runCode: `${QA_PREFIX}RUN_LOCKED`,
      runLabel: "HCM locked learner",
      curriculumVersion: "V2",
    });
    const eligibleRun = await mkRun({
      companyId: companyA.id,
      cohortId: cohortA.id,
      employeeId: eligible.id,
      runCode: `${QA_PREFIX}RUN_ELIGIBLE`,
      runLabel: "HCM eligible learner",
      curriculumVersion: "V2",
    });
    const v1Run = await mkRun({
      companyId: companyA.id,
      cohortId: cohortA.id,
      employeeId: v1.id,
      runCode: `${QA_PREFIX}RUN_V1`,
      runLabel: "HCM V1 historical",
      curriculumVersion: "V1",
    });

    await completeKeys(client, eligible.id, eligibleRun.id, HCM_MISSION_KEYS);
    await completeKeys(client, v1.id, v1Run.id, listRegularMissionKeys("V1"));

    console.log(
      JSON.stringify(
        {
          prepared: true,
          lockedRunId: lockedRun.id,
          eligibleRunId: eligibleRun.id,
          v1RunId: v1Run.id,
          accounts: Object.fromEntries(
            Object.entries(accounts).map(([key, value]) => [key, value.email]),
          ),
        },
        null,
        2,
      ),
    );
  } finally {
    await client.$disconnect();
  }
}

async function collect() {
  const API = envOrDefault("API_BASE_URL", "http://127.0.0.1:3000");
  const WEB = envOrDefault("WEB_BASE_URL", "http://127.0.0.1:5173");
  const evidence = { capturedAt: new Date().toISOString(), api: API, web: WEB, checks: [] };
  const record = (section, ok, detail) => {
    evidence.checks.push({ section, ok, detail });
    console.log(`${ok ? "PASS" : "FAIL"} [${section}] ${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
  };

  const apiHealth = await fetch(`${API}/health`);
  record("api_health", apiHealth.status === 200, { status: apiHealth.status });
  const webHealth = await fetch(WEB).catch(() => ({ status: 0 }));
  record("web_health", webHealth.status === 200, { status: webHealth.status });

  async function login(account) {
    const api = createApiClient(API);
    await api.login(account.email, account.password);
    return api;
  }

  const lockedApi = await login(accounts.locked);
  const lockedList = await lockedApi.get("/api/v1/me/assessments");
  const hcmLocked = (lockedList.body.assessments ?? []).find((item) => item.code === "HCM_M8");
  record("locked_visible", Boolean(hcmLocked), { found: Boolean(hcmLocked), status: hcmLocked?.status });
  record("locked_status", hcmLocked?.status === "locked", { status: hcmLocked?.status, lockReason: hcmLocked?.lockReason });
  record(
    "locked_reason_fr",
    typeof hcmLocked?.lockReason === "string" && hcmLocked.lockReason.includes("M8-M01"),
    { lockReason: hcmLocked?.lockReason },
  );
  const lockedStart = await lockedApi.post("/api/v1/me/assessments/HCM_M8/start");
  record("locked_cannot_start", lockedStart.status >= 400, { status: lockedStart.status, body: lockedStart.body });

  const eligibleApi = await login(accounts.eligible);
  const eligibleList = await eligibleApi.get("/api/v1/me/assessments");
  const hcmEligible = (eligibleList.body.assessments ?? []).find((item) => item.code === "HCM_M8");
  record("eligible_available", hcmEligible?.status === "available", { status: hcmEligible?.status });
  const start = await eligibleApi.post("/api/v1/me/assessments/HCM_M8/start");
  record("eligible_start", start.status === 201, { status: start.status, questions: start.body?.questions?.length });
  record("eligible_20_questions", start.body?.questions?.length === 20, {
    count: start.body?.questions?.length,
  });
  record("timer_present", start.body?.timeLimitSeconds === 2400, {
    timeLimitSeconds: start.body?.timeLimitSeconds,
  });

  const responses = (start.body?.questions ?? []).map((question) => {
    const bank = HCM_M8_QUESTIONS.find((item) => item.questionKey === question.questionKey);
    return { questionKey: question.questionKey, value: bank?.correctKey ?? question.options[0]?.key };
  });
  const draft = await eligibleApi.put("/api/v1/me/assessments/HCM_M8/draft", { responses: responses.slice(0, 5) });
  record("draft_persist", draft.status === 200, { status: draft.status });
  const resume = await eligibleApi.get("/api/v1/me/assessments/HCM_M8/attempt");
  record("resume_after_draft", resume.status === 200 && (resume.body?.draftResponses?.length ?? 0) >= 1, {
    status: resume.status,
    draftCount: resume.body?.draftResponses?.length,
  });
  const submit = await eligibleApi.post("/api/v1/me/assessments/HCM_M8/submit", {
    responses,
    confirmFinalSubmission: true,
  });
  record("submit_pass", submit.status === 200 && submit.body?.passed === true && submit.body?.scorePercent === 100, {
    status: submit.status,
    scorePercent: submit.body?.scorePercent,
    passed: submit.body?.passed,
    hasFeedback: Boolean(submit.body?.feedback),
  });
  record(
    "feedback_mission_aligned",
    typeof submit.body?.feedback === "string" && submit.body.feedback.includes("HCM"),
    { feedbackPreview: String(submit.body?.feedback ?? "").slice(0, 120) },
  );

  const v1Api = await login(accounts.v1);
  const v1List = await v1Api.get("/api/v1/me/assessments");
  const hcmV1 = (v1List.body.assessments ?? []).find((item) => item.code === "HCM_M8");
  record("v1_hcm_excluded", hcmV1 == null, {
    codes: (v1List.body.assessments ?? []).map((item) => item.code),
  });

  const profA = await login(accounts.professorA);
  const students = await profA.get("/api/v1/professor/students");
  const eligibleStudent = (students.body?.students ?? []).find((item) =>
    String(item.employeeNumber ?? item.displayName ?? "").includes("ELIGIBLE"),
  );
  let professorSeesAttempt = false;
  if (eligibleStudent?.employeeId) {
    const detail = await profA.get(`/api/v1/professor/students/${eligibleStudent.employeeId}`);
    const hcmAttempts = (detail.body?.assessments ?? []).filter((item) => item.code === "HCM_M8");
    professorSeesAttempt = hcmAttempts.length > 0;
    record("professor_sees_hcm_attempt", professorSeesAttempt, {
      attempts: hcmAttempts.map((item) => ({
        status: item.status,
        scorePercent: item.scorePercent,
        missionBreakdown: item.missionBreakdown,
      })),
    });
  } else {
    record("professor_sees_hcm_attempt", false, { reason: "eligible student not found" });
  }

  const profB = await login(accounts.professorB);
  const studentsB = await profB.get("/api/v1/professor/students");
  record("professor_b_isolation", (studentsB.body?.students ?? []).length === 0, {
    count: (studentsB.body?.students ?? []).length,
  });

  const adminApi = await login(accounts.admin);
  const banks = await adminApi.get("/api/v1/admin/assessments");
  const hcmBank = (banks.body?.assessments ?? []).find((item) => item.code === "HCM_M8");
  record("admin_bank_listed", Boolean(hcmBank) && hcmBank.questionCount === 20, hcmBank);
  const bankDetail = await adminApi.get("/api/v1/admin/assessments/HCM_M8?includeAnswerKey=true");
  const firstQuestion = bankDetail.body?.questions?.[0];
  record(
    "admin_answer_key",
    Array.isArray(firstQuestion?.correctKeys) && firstQuestion.correctKeys.length === 1,
    { sampleKey: firstQuestion?.questionKey, correctKeys: firstQuestion?.correctKeys },
  );

  const learnerLeak = JSON.stringify(start.body ?? {});
  record("learner_no_answer_key_leak", !learnerLeak.includes("correctKeys") && !learnerLeak.includes("explanation"), {
    leakedCorrectKeys: learnerLeak.includes("correctKeys"),
  });

  const failed = evidence.checks.filter((item) => !item.ok).length;
  const outDir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../../../engineering/v2/hcm-assessment/evidence",
  );
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "hcm-assessment-smoke.json");
  writeFileSync(outPath, JSON.stringify({ ...evidence, failed }, null, 2));
  console.log(JSON.stringify({ failed, outPath }, null, 2));
  if (failed > 0) {
    process.exitCode = 1;
  }
}

const mode = process.argv.includes("--cleanup")
  ? "cleanup"
  : process.argv.includes("--collect")
    ? "collect"
    : process.argv.includes("--prepare")
      ? "prepare"
      : null;

if (!mode) {
  console.error("Usage: --prepare | --collect | --cleanup");
  process.exit(1);
}

if (mode === "cleanup") {
  const client = getPrismaClient();
  const result = await cleanup(client);
  await client.$disconnect();
  console.log(JSON.stringify({ cleanup: true, ...result }, null, 2));
} else if (mode === "prepare") {
  await prepare();
} else {
  await collect();
}
