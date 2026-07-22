#!/usr/bin/env node
/**
 * Isolated local smoke: Student A Run1/Run2 reflections + official analytics.
 * Requires DATABASE_URL pointing at a disposable local DB (not production).
 * Cleans up all QA residue (qa_residue must be 0).
 */
import { createHash, randomBytes } from "node:crypto";
import { getPrismaClient } from "@tec-platform/database-erp";
import { createPedagogicalRunService } from "../dist/modules/pedagogical-run/pedagogical-run.service.js";
import {
  countUniqueStudentsFromRuns,
  pickOfficialRun,
} from "../dist/modules/analytics/official-run-policy.js";

const TAG = `qa_vr_smoke_${Date.now()}`;
const prisma = getPrismaClient();
const service = createPedagogicalRunService();

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const passwordHash = createHash("sha256").update(randomBytes(16)).digest("hex");

const company = await prisma.company.create({
  data: {
    code: `${TAG}_CO`,
    name: `QA Smoke ${TAG}`,
  },
});

const cohort = await prisma.cohort.create({
  data: {
    code: `${TAG}_CH`,
    name: `Cohort ${TAG}`,
    companyId: company.id,
  },
});

const course =
  (await prisma.course.findFirst({ where: { code: "TEC-ERP-V1" } })) ??
  (await prisma.course.create({
    data: { code: `${TAG}_COURSE`, title: "QA Course", version: "1" },
  }));

const admin = await prisma.employee.create({
  data: {
    employeeNumber: `${TAG}-ADM`,
    email: `${TAG}.admin@qa.local`,
    displayName: "QA Admin",
    role: "ADMIN",
    companyId: company.id,
    passwordHash,
  },
});

const professor = await prisma.employee.create({
  data: {
    employeeNumber: `${TAG}-PRF`,
    email: `${TAG}.prof@qa.local`,
    displayName: "QA Professor",
    role: "PROFESSOR",
    companyId: company.id,
    passwordHash,
  },
});

const professorB = await prisma.employee.create({
  data: {
    employeeNumber: `${TAG}-PRB`,
    email: `${TAG}.profb@other.local`,
    displayName: "QA Professor B",
    role: "PROFESSOR",
    companyId: company.id,
    passwordHash,
  },
});

const studentA = await prisma.employee.create({
  data: {
    employeeNumber: `${TAG}-STA`,
    email: `${TAG}.studenta@qa.local`,
    displayName: "QA Student A",
    role: "JR_BUSINESS_ANALYST",
    companyId: company.id,
    passwordHash,
  },
});

const studentB = await prisma.employee.create({
  data: {
    employeeNumber: `${TAG}-STB`,
    email: `${TAG}.studentb@qa.local`,
    displayName: "QA Student B",
    role: "JR_BUSINESS_ANALYST",
    companyId: company.id,
    passwordHash,
  },
});

await prisma.cohortMembership.createMany({
  data: [
    { cohortId: cohort.id, employeeId: studentA.id, roleInCohort: "student" },
    { cohortId: cohort.id, employeeId: studentB.id, roleInCohort: "student" },
    { cohortId: cohort.id, employeeId: professor.id, roleInCohort: "professor" },
  ],
});

const run1 = await prisma.pedagogicalCourseRun.create({
  data: {
    companyId: company.id,
    cohortId: cohort.id,
    employeeId: studentA.id,
    professorId: professor.id,
    courseId: course.id,
    runCode: `${TAG}-RUN1`,
    runSequence: 1,
    runType: "AUTONOMOUS",
    runLabel: "Parcours 1",
    status: "COMPLETED",
    createdById: admin.id,
    reflectionsEnabled: false,
    startedAt: new Date(),
    completedAt: new Date(),
    completionPercent: 100,
  },
});

const run2 = await prisma.pedagogicalCourseRun.create({
  data: {
    companyId: company.id,
    cohortId: cohort.id,
    employeeId: studentA.id,
    professorId: professor.id,
    courseId: course.id,
    runCode: `${TAG}-RUN2`,
    runSequence: 2,
    runType: "INSTRUCTOR_LED",
    runLabel: "Parcours 2",
    status: "ACTIVE",
    sourceRunId: run1.id,
    createdById: admin.id,
    reflectionsEnabled: true,
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
  aiUsefulness: null,
  biUsefulness: 3,
  externalExplanationRequired: false,
  externalSlidesWouldHelp: true,
  qualitativeNote: "Smoke note FR",
};

// Historical Run 1 rejects write
const rejectRun1 = await service.upsertReflection({
  actorId: studentA.id,
  actorRole: "JR_BUSINESS_ANALYST",
  actorCompanyId: company.id,
  runId: run1.id,
  missionKey: "m1-m01",
  body,
  isUpdate: false,
});
assert(!rejectRun1.ok, "Run1 write must fail");

// Run2 accepts write
const create = await service.upsertReflection({
  actorId: studentA.id,
  actorRole: "JR_BUSINESS_ANALYST",
  actorCompanyId: company.id,
  runId: run2.id,
  missionKey: "m1-m01",
  body,
  isUpdate: false,
});
assert(create.ok, "Run2 write must succeed");

// Persist / restore
const again = await service.getReflection({
  actorId: studentA.id,
  actorRole: "JR_BUSINESS_ANALYST",
  actorCompanyId: company.id,
  runId: run2.id,
  missionKey: "m1-m01",
});
assert(again.ok && again.value.clarity === 4, "persisted clarity");

// Professor can read
const profRead = await service.listReflections({
  actorId: professor.id,
  actorRole: "PROFESSOR",
  actorCompanyId: company.id,
  runId: run2.id,
});
assert(profRead.ok && profRead.value.reflections.length === 1, "professor reads reflection");

// Admin can read
const adminRead = await service.listReflections({
  actorId: admin.id,
  actorRole: "ADMIN",
  actorCompanyId: company.id,
  runId: run2.id,
});
assert(adminRead.ok && adminRead.value.reflections.length === 1, "admin reads reflection");

// Professor B (no assignment) denied — reassign run professor check via list with unauthorized
const deniedProf = await service.listReflections({
  actorId: professorB.id,
  actorRole: "PROFESSOR",
  actorCompanyId: company.id,
  runId: run2.id,
});
assert(!deniedProf.ok, "unrelated professor denied");

// Student B denied
const deniedStudent = await service.getReflection({
  actorId: studentB.id,
  actorRole: "JR_BUSINESS_ANALYST",
  actorCompanyId: company.id,
  runId: run2.id,
  missionKey: "m1-m01",
});
assert(!deniedStudent.ok, "student B denied");

// Official cohort: one student even with two runs
const runs = await prisma.pedagogicalCourseRun.findMany({
  where: { companyId: company.id },
  select: { id: true, employeeId: true, runSequence: true, runType: true, status: true },
});
assert(countUniqueStudentsFromRuns(runs) === 1, "official headcount = 1");
assert(pickOfficialRun(runs.filter((r) => r.employeeId === studentA.id))?.id === run1.id, "official = completed run1");

// Cleanup
await prisma.studentMissionReflection.deleteMany({ where: { runId: { in: [run1.id, run2.id] } } });
await prisma.pedagogicalCourseRun.deleteMany({ where: { id: { in: [run1.id, run2.id] } } });
await prisma.cohortMembership.deleteMany({ where: { cohortId: cohort.id } });
await prisma.cohort.delete({ where: { id: cohort.id } });
await prisma.employee.deleteMany({
  where: { id: { in: [admin.id, professor.id, professorB.id, studentA.id, studentB.id] } },
});
if (course.code.startsWith(TAG)) {
  await prisma.course.delete({ where: { id: course.id } });
}
await prisma.company.delete({ where: { id: company.id } });

const residue = await prisma.employee.count({
  where: { employeeNumber: { startsWith: TAG } },
});
const residueRuns = await prisma.pedagogicalCourseRun.count({
  where: { runCode: { startsWith: TAG } },
});

console.log(
  JSON.stringify(
    {
      ok: true,
      tag: TAG,
      qa_residue: residue + residueRuns,
      checks: [
        "run1_write_rejected",
        "run2_write_ok",
        "persist_ok",
        "professor_read_ok",
        "admin_read_ok",
        "professor_b_denied",
        "student_b_denied",
        "official_count_one",
      ],
    },
    null,
    2,
  ),
);

await prisma.$disconnect();
