#!/usr/bin/env node
/**
 * Read-only V2 production precheck / postcheck.
 * Never prints passwords, connection strings, or full password hashes.
 * Usage: node engineering/v2/deployment/scripts/v2-prod-precheck.mjs <label>
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(
  "C:/Projetos/Analyste_ERP_Processus_Affaires/packages/database-erp/package.json",
);
const { PrismaClient } = require("@prisma/client");

const label = process.argv[2] ?? "pre";
const OUT_DIR = "C:/Projetos/Analyste_ERP_Processus_Affaires/.ops-evidence/v2-prod-deploy";
const client = new PrismaClient();

function sha16(value) {
  return createHash("sha256").update(String(value ?? "")).digest("hex").slice(0, 16);
}

async function tableExists(name) {
  const rows = await client.$queryRawUnsafe(
    `SELECT to_regclass($1)::text AS reg`,
    `public.${name}`,
  );
  return Boolean(rows[0]?.reg);
}

async function columnExists(table, column) {
  const rows = await client.$queryRawUnsafe(
    `SELECT 1 AS ok FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2
     LIMIT 1`,
    table,
    column,
  );
  return rows.length > 0;
}

try {
  const migrations = await client.$queryRawUnsafe(
    `SELECT migration_name, finished_at IS NOT NULL AS finished,
            rolled_back_at IS NOT NULL AS rolled_back, checksum
     FROM _prisma_migrations ORDER BY started_at`,
  );

  const hasRuns = await tableExists("pedagogical_course_run");
  const hasCurriculumVersion = hasRuns
    ? await columnExists("pedagogical_course_run", "curriculumVersion")
    : false;
  const hasLifecycle = await columnExists("capstone_submission", "lifecycleStatus");

  const james = await client.employee.findUnique({
    where: { employeeNumber: "TECERP-2026-PILOT-001" },
    include: {
      company: true,
      cohortMemberships: { include: { cohort: true } },
    },
  });
  if (!james) throw new Error("James Timothy not found");

  const attempts = await client.missionAttempt.findMany({
    where: { employeeId: james.id },
    include: { missionDefinition: true },
  });
  const completed = attempts.filter((a) => a.status === "completed");
  const assessments = await client.assessmentAttempt.findMany({
    where: { employeeId: james.id },
    include: { assessment: true },
    orderBy: { submittedAt: "asc" },
  });
  const certificates = await client.certificate.findMany({
    where: { employeeId: james.id },
    orderBy: { issuedAt: "asc" },
  });
  const capstone = await client.capstoneSubmission.findFirst({
    where: { employeeId: james.id },
    orderBy: { createdAt: "asc" },
  });
  const aiCount = await client.aiInteraction.count({ where: { employeeId: james.id } });
  const course = await client.employeeCourseProgress.findFirst({
    where: { employeeId: james.id },
  });

  const cohort = james.cohortMemberships[0]?.cohort ?? null;
  const professors = cohort
    ? await client.cohortMembership.findMany({
        where: { cohortId: cohort.id, roleInCohort: "professor" },
        include: { employee: true },
      })
    : [];

  let jamesRuns = [];
  if (hasRuns) {
    const select = hasCurriculumVersion
      ? `id, "runCode", "runSequence", "runType", status, "curriculumVersion",
         "completionPercent", "startedAt", "completedAt", "professorId", "metadataJson"`
      : `id, "runCode", "runSequence", "runType", status,
         "completionPercent", "startedAt", "completedAt", "professorId", "metadataJson"`;
    jamesRuns = await client.$queryRawUnsafe(
      `SELECT ${select} FROM pedagogical_course_run
       WHERE "employeeId" = $1 ORDER BY "runSequence"`,
      james.id,
    );
  }

  const professorEmployees = await client.employee.count({
    where: { role: "PROFESSOR" },
  });
  const qaEmployees = await client.employee.count({
    where: {
      OR: [
        { employeeNumber: { startsWith: "__QA_" } },
        { email: { startsWith: "__QA_" } },
        { displayName: { startsWith: "__QA_" } },
      ],
    },
  });

  const runCounts = hasRuns
    ? await client.$queryRawUnsafe(
        `SELECT status, COUNT(*)::int AS count FROM pedagogical_course_run GROUP BY status`,
      )
    : [];
  const certCounts = await client.$queryRawUnsafe(
    `SELECT status, COUNT(*)::int AS count FROM certificate GROUP BY status`,
  );
  const capstoneCounts = await client.$queryRawUnsafe(
    `SELECT status, "reviewStatus", COUNT(*)::int AS count
     FROM capstone_submission GROUP BY status, "reviewStatus"`,
  );
  const assessmentDefs = await client.assessmentDefinition.findMany({
    select: { code: true, passThresholdPercent: true, maxAttempts: true, timeLimitSeconds: true },
    orderBy: { code: "asc" },
  });
  const hcm = await client.assessmentDefinition.findUnique({
    where: { code: "HCM_M8" },
    include: { questions: { select: { questionKey: true, sequence: true, scoringJson: true, optionsJson: true } } },
  });

  const hcmQuestionCount = hcm?.questions?.length ?? 0;
  const hcmTotalPoints = (hcm?.questions ?? []).reduce((sum, q) => {
    const pts = q.scoringJson?.maxPoints ?? 0;
    return sum + Number(pts);
  }, 0);
  const answerDist = { a: 0, b: 0, c: 0, d: 0 };
  for (const q of hcm?.questions ?? []) {
    const key = String(q.scoringJson?.correctKeys?.[0] ?? "").toLowerCase();
    if (key in answerDist) answerDist[key] += 1;
  }
  const hcmAttempts = hcm
    ? await client.assessmentAttempt.count({ where: { assessmentId: hcm.id } })
    : 0;

  const hcmMissionDefs = await client.missionDefinition.findMany({
    where: {
      missionKey: {
        in: [
          "m8-m01-integrer-nouvel-employe",
          "m8-m02-gerer-temps-absences",
          "m8-m03-evaluer-competences-evolution",
        ],
      },
    },
    select: { missionKey: true, missionCode: true },
  });

  const snapshotCore = {
    employeeId: james.id,
    employeeNumber: james.employeeNumber,
    companyCode: james.company.code,
    cohortCode: cohort?.code ?? null,
    role: james.role,
    completed: completed.map((a) => a.missionDefinition.missionKey).sort(),
    coursePercentComplete: course?.percentComplete ?? null,
    assessments: assessments.map((a) => ({
      code: a.assessment.code,
      status: a.status,
      scorePercent: a.scorePercent,
    })),
    certificates: certificates.map((c) => ({
      type: c.certificateType,
      number: c.certificateNumber,
      status: c.status,
      issuedAt: c.issuedAt.toISOString(),
      revokedAt: c.revokedAt?.toISOString() ?? null,
    })),
    capstone: capstone
      ? {
          status: capstone.status,
          reviewStatus: capstone.reviewStatus,
          professorApproved: capstone.professorApproved,
          submittedAt: capstone.submittedAt?.toISOString() ?? null,
        }
      : null,
    aiInteractionCount: aiCount,
    passwordHashFingerprint: sha16(james.passwordHash),
    professors: professors.map((p) => ({
      id: p.employee.id,
      employeeNumber: p.employee.employeeNumber,
      displayName: p.employee.displayName,
      email: p.employee.email,
    })),
  };

  const integrityHash = createHash("sha256")
    .update(JSON.stringify(snapshotCore))
    .digest("hex");

  const report = {
    label,
    capturedAt: new Date().toISOString(),
    james: {
      ...snapshotCore,
      displayName: james.displayName,
      email: james.email,
      companyId: james.companyId,
      companyName: james.company.name,
      cohortId: cohort?.id ?? null,
      cohortName: cohort?.name ?? null,
      missionAttemptsTotal: attempts.length,
      missionAttemptsCompleted: completed.length,
      completedMissionKeys: snapshotCore.completed,
      professorAssignment: snapshotCore.professors,
      integrityHash,
      runs: jamesRuns.map((r) => ({
        runCode: r.runCode,
        runSequence: r.runSequence,
        runType: r.runType,
        status: r.status,
        curriculumVersion: r.curriculumVersion ?? null,
        completionPercent: r.completionPercent,
        professorId: r.professorId,
        historical: String(r.status).toUpperCase() === "COMPLETED" || r.runSequence === 1,
        writable: String(r.status).toUpperCase() === "ACTIVE",
      })),
      run2Count: jamesRuns.filter((r) => Number(r.runSequence) >= 2).length,
    },
    global: {
      professorEmployeeCount: professorEmployees,
      qaPrefixedEmployeeCount: qaEmployees,
      pedagogicalRunCount: runCounts.reduce((s, r) => s + Number(r.count), 0),
      runsByStatus: Object.fromEntries(runCounts.map((r) => [r.status, r.count])),
      certificatesByStatus: Object.fromEntries(certCounts.map((r) => [r.status, r.count])),
      capstoneByLifecycle: capstoneCounts,
      assessmentDefinitionCodes: assessmentDefs.map((a) => a.code),
      hcmM8Present: Boolean(hcm),
      hcmM8QuestionCount: hcmQuestionCount,
      hcmM8TotalPoints: hcmTotalPoints,
      hcmM8TimeLimitSeconds: hcm?.timeLimitSeconds ?? null,
      hcmM8PassThreshold: hcm?.passThresholdPercent ?? null,
      hcmM8MaxAttempts: hcm?.maxAttempts ?? null,
      hcmM8AnswerDistribution: answerDist,
      hcmM8AttemptCount: hcmAttempts,
      hcmMissionDefinitions: hcmMissionDefs,
      curriculumVersionColumnPresent: hasCurriculumVersion,
      capstoneLifecycleColumnPresent: hasLifecycle,
      pedagogicalRunsTablePresent: hasRuns,
    },
    migrations: migrations.map((m) => ({
      name: m.migration_name,
      finished: m.finished,
      rolledBack: m.rolled_back,
      checksumFp: sha16(m.checksum),
    })),
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const path = `${OUT_DIR}/v2-prod-${label}-snapshot.json`;
  writeFileSync(path, JSON.stringify(report, null, 2));

  console.log(
    JSON.stringify(
      {
        ok: true,
        path,
        integrityHash,
        jamesCompleted: report.james.missionAttemptsCompleted,
        jamesRuns: report.james.runs.map((r) => `${r.runCode}:${r.status}:${r.curriculumVersion ?? "n/a"}`),
        run2Count: report.james.run2Count,
        professorEmployeeCount: professorEmployees,
        qaPrefixedEmployeeCount: qaEmployees,
        hcmM8Present: Boolean(hcm),
        hcmM8QuestionCount: hcmQuestionCount,
        curriculumVersionColumnPresent: hasCurriculumVersion,
        migrationCount: migrations.length,
        expectedHashMatch:
          integrityHash ===
          "83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4",
      },
      null,
      2,
    ),
  );
} finally {
  await client.$disconnect();
}
