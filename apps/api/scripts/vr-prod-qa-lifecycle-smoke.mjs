#!/usr/bin/env node
/**
 * Minimal production QA lifecycle smoke with full cleanup.
 * Prefix: __QA_VR_PROD_
 * Requires DATABASE_URL. Never prints secrets.
 */
import { createHash, randomBytes } from "node:crypto";
import { getPrismaClient } from "@tec-platform/database-erp";
import { createPedagogicalRunService } from "../dist/modules/pedagogical-run/pedagogical-run.service.js";
import { countUniqueStudentsFromRuns } from "../dist/modules/analytics/official-run-policy.js";

const TAG = "__QA_VR_PROD_";
const stamp = Date.now();
const prisma = getPrismaClient();
const service = createPedagogicalRunService();
const passwordHash = createHash("sha256").update(randomBytes(16)).digest("hex");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const company = await prisma.company.create({
  data: { code: `${TAG}CO_${stamp}`, name: `QA VR Prod ${stamp}` },
});
const course =
  (await prisma.course.findFirst({ where: { code: "TEC-ERP-V1" } })) ??
  (await prisma.course.create({
    data: { code: `${TAG}COURSE_${stamp}`, title: "QA Course", version: "1" },
  }));

const admin = await prisma.employee.create({
  data: {
    employeeNumber: `${TAG}ADM_${stamp}`,
    email: `${TAG.toLowerCase()}adm_${stamp}@qa.local`,
    displayName: "QA Admin",
    role: "ADMIN",
    companyId: company.id,
    passwordHash,
  },
});
const professor = await prisma.employee.create({
  data: {
    employeeNumber: `${TAG}PRF_${stamp}`,
    email: `${TAG.toLowerCase()}prf_${stamp}@qa.local`,
    displayName: "QA Professor",
    role: "PROFESSOR",
    companyId: company.id,
    passwordHash,
  },
});
const professorB = await prisma.employee.create({
  data: {
    employeeNumber: `${TAG}PRB_${stamp}`,
    email: `${TAG.toLowerCase()}prb_${stamp}@qa.local`,
    displayName: "QA Professor B",
    role: "PROFESSOR",
    companyId: company.id,
    passwordHash,
  },
});
const student = await prisma.employee.create({
  data: {
    employeeNumber: `${TAG}STU_${stamp}`,
    email: `${TAG.toLowerCase()}stu_${stamp}@qa.local`,
    displayName: "QA Student",
    role: "JR_BUSINESS_ANALYST",
    companyId: company.id,
    passwordHash,
  },
});
const cohort = await prisma.cohort.create({
  data: {
    code: `${TAG}CH_${stamp}`,
    name: `QA Cohort ${stamp}`,
    companyId: company.id,
  },
});
await prisma.cohortMembership.createMany({
  data: [
    { cohortId: cohort.id, employeeId: student.id, roleInCohort: "student" },
    { cohortId: cohort.id, employeeId: professor.id, roleInCohort: "professor" },
  ],
});

const run1 = await prisma.pedagogicalCourseRun.create({
  data: {
    companyId: company.id,
    cohortId: cohort.id,
    employeeId: student.id,
    professorId: professor.id,
    courseId: course.id,
    runCode: `${TAG}RUN1_${stamp}`,
    runSequence: 1,
    runType: "AUTONOMOUS",
    runLabel: "QA Run 1",
    status: "COMPLETED",
    createdById: admin.id,
    reflectionsEnabled: false,
    completionPercent: 100,
    startedAt: new Date(),
    completedAt: new Date(),
  },
});
const run2 = await prisma.pedagogicalCourseRun.create({
  data: {
    companyId: company.id,
    cohortId: cohort.id,
    employeeId: student.id,
    professorId: professor.id,
    courseId: course.id,
    runCode: `${TAG}RUN2_${stamp}`,
    runSequence: 2,
    runType: "INSTRUCTOR_LED",
    runLabel: "QA Run 2",
    status: "ACTIVE",
    sourceRunId: run1.id,
    createdById: admin.id,
    reflectionsEnabled: true,
    completionPercent: 0,
    startedAt: new Date(),
  },
});

const body = {
  clarity: 4,
  confidence: 4,
  cognitiveLoad: 2,
  realism: 5,
  relevance: 5,
  navigationQuality: 4,
  feedbackQuality: 4,
  visualQuality: 3,
  externalExplanationRequired: false,
  externalSlidesWouldHelp: true,
  qualitativeNote: "QA prod smoke",
};

const reject = await service.upsertReflection({
  actorId: student.id,
  actorRole: "JR_BUSINESS_ANALYST",
  actorCompanyId: company.id,
  runId: run1.id,
  missionKey: "m1-m01",
  body,
  isUpdate: false,
});
assert(!reject.ok, "Run1 reflection must fail");

const create = await service.upsertReflection({
  actorId: student.id,
  actorRole: "JR_BUSINESS_ANALYST",
  actorCompanyId: company.id,
  runId: run2.id,
  missionKey: "m1-m01",
  body,
  isUpdate: false,
});
assert(create.ok, "Run2 reflection must succeed");

const profOk = await service.listReflections({
  actorId: professor.id,
  actorRole: "PROFESSOR",
  actorCompanyId: company.id,
  runId: run2.id,
});
assert(profOk.ok && profOk.value.reflections.length === 1, "professor read");

const profDenied = await service.listReflections({
  actorId: professorB.id,
  actorRole: "PROFESSOR",
  actorCompanyId: company.id,
  runId: run2.id,
});
assert(!profDenied.ok, "professor B denied");

await prisma.professorIntervention.create({
  data: {
    runId: run2.id,
    professorId: professor.id,
    interventionType: "CLARIFICATION",
    reason: "QA smoke",
    content: "QA intervention",
  },
});

const pause = await service.transition({
  actorId: professor.id,
  actorRole: "PROFESSOR",
  actorCompanyId: company.id,
  runId: run2.id,
  request: { action: "pause", reason: "QA pause" },
});
assert(pause.ok && pause.value.status === "PAUSED", "pause");

const resume = await service.transition({
  actorId: professor.id,
  actorRole: "PROFESSOR",
  actorCompanyId: company.id,
  runId: run2.id,
  request: { action: "resume", reason: "QA resume" },
});
assert(resume.ok && resume.value.status === "ACTIVE", "resume");

const runs = await prisma.pedagogicalCourseRun.findMany({
  where: { companyId: company.id },
  select: { id: true, employeeId: true, runSequence: true, runType: true, status: true },
});
assert(countUniqueStudentsFromRuns(runs) === 1, "official count once");
assert(runs.length === 2, "exploratory sees two runs");

// Cleanup
await prisma.professorIntervention.deleteMany({ where: { runId: { in: [run1.id, run2.id] } } });
await prisma.studentMissionReflection.deleteMany({ where: { runId: { in: [run1.id, run2.id] } } });
await prisma.pedagogicalCourseRunAudit.deleteMany({ where: { runId: { in: [run1.id, run2.id] } } });
await prisma.pedagogicalCourseRun.deleteMany({ where: { id: { in: [run1.id, run2.id] } } });
await prisma.cohortMembership.deleteMany({ where: { cohortId: cohort.id } });
await prisma.cohort.delete({ where: { id: cohort.id } });
await prisma.employee.deleteMany({
  where: { id: { in: [admin.id, professor.id, professorB.id, student.id] } },
});
if (course.code.startsWith(TAG)) {
  await prisma.course.delete({ where: { id: course.id } }).catch(() => undefined);
}
await prisma.company.delete({ where: { id: company.id } });

const residue = await prisma.employee.count({
  where: { employeeNumber: { startsWith: TAG } },
});
const residueRuns = await prisma.pedagogicalCourseRun.count({
  where: { runCode: { startsWith: TAG } },
});
const residueCo = await prisma.company.count({
  where: { code: { startsWith: TAG } },
});

console.log(
  JSON.stringify(
    {
      ok: true,
      qa_residue: residue + residueRuns + residueCo,
      checks: [
        "run1_reflection_rejected",
        "run2_reflection_ok",
        "professor_read_ok",
        "professor_b_denied",
        "intervention_ok",
        "pause_resume_ok",
        "official_count_one",
        "two_runs_present_before_cleanup",
      ],
    },
    null,
    2,
  ),
);
await prisma.$disconnect();
