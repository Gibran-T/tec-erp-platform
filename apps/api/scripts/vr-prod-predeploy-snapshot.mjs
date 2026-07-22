#!/usr/bin/env node
/**
 * Read-only production pre-deploy counts + James sanitized summary.
 * Requires DATABASE_URL. Never prints secrets.
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { getPrismaClient } from "@tec-platform/database-erp";

const OUT =
  process.env.VR_PREDEPLOY_OUT ||
  "C:/Projetos/tec-erp-wt-vr-prod-gate/engineering/v1/versioned-runs/production-gate/evidence/pre-deploy";
const client = getPrismaClient();

async function count(model, where = {}) {
  try {
    return await client[model].count({ where });
  } catch (error) {
    return { error: error instanceof Error ? error.message.split("\n")[0] : String(error) };
  }
}

const migrations = await client.$queryRawUnsafe(
  `SELECT migration_name, finished_at IS NOT NULL AS finished, rolled_back_at IS NOT NULL AS rolled_back
   FROM _prisma_migrations ORDER BY finished_at NULLS LAST, migration_name`,
);

const pedagogicalPresent = await client.$queryRawUnsafe(
  `SELECT to_regclass('public.pedagogical_course_run') IS NOT NULL AS present`,
);

const counts = {
  company: await count("company"),
  employee: await count("employee"),
  cohort: await count("cohort"),
  cohortMembership: await count("cohortMembership"),
  employeeCourseProgress: await count("employeeCourseProgress"),
  employeeModuleProgress: await count("employeeModuleProgress"),
  missionAttempt: await count("missionAttempt"),
  assessment: await count("assessment"),
  assessmentAttempt: await count("assessmentAttempt"),
  capstoneSubmission: await count("capstoneSubmission"),
  certificate: await count("certificate"),
  aiInteraction: await count("aiInteraction"),
  qaEmployeePrefix: await count("employee", {
    OR: [
      { employeeNumber: { startsWith: "__QA_" } },
      { employeeNumber: { startsWith: "qa_" } },
      { email: { contains: "@qa." } },
    ],
  }),
};

const james = await client.employee.findUnique({
  where: { employeeNumber: "TECERP-2026-PILOT-001" },
  include: {
    company: true,
    cohortMemberships: { include: { cohort: true } },
  },
});
if (!james) throw new Error("James not found");

const attempts = await client.missionAttempt.findMany({
  where: { employeeId: james.id },
  include: { missionDefinition: true },
  orderBy: { startedAt: "asc" },
});
const completed = attempts.filter((a) => a.status === "completed");
const progress = await client.employeeCourseProgress.findFirst({
  where: { employeeId: james.id },
});
const assessments = await client.assessmentAttempt.findMany({
  where: { employeeId: james.id },
  include: { assessment: true },
  orderBy: { submittedAt: "asc" },
});
const certificates = await client.certificate.findMany({
  where: { employeeId: james.id },
  orderBy: { issuedAt: "asc" },
});
const capstone = await client.capstoneSubmission.findUnique({
  where: { employeeId: james.id },
});
const aiCount = await client.aiInteraction.count({ where: { employeeId: james.id } });
// Prefer authoritative snapshot script hash when available on disk.
const manusPath =
  "C:/Projetos/Analyste_ERP_Processus_Affaires/.manus-logs/james-zero1-pre-vr-prod-gate-snapshot.json";
let legacyIntegrityHash = null;
let professors = 0;
if (existsSync(manusPath)) {
  const manus = JSON.parse(readFileSync(manusPath, "utf8"));
  legacyIntegrityHash = manus.integrityHash;
  professors = Array.isArray(manus.professorAssignment)
    ? manus.professorAssignment.length
    : 0;
}

// Impact forecast: employees who would receive Run 1
const impact = await client.$queryRawUnsafe(`
  SELECT COUNT(DISTINCT e.id)::int AS employees_with_learning
  FROM employee e
  WHERE EXISTS (SELECT 1 FROM employee_course_progress p WHERE p."employeeId" = e.id)
     OR EXISTS (SELECT 1 FROM employee_module_progress p WHERE p."employeeId" = e.id)
     OR EXISTS (SELECT 1 FROM mission_attempt a WHERE a."employeeId" = e.id)
     OR EXISTS (SELECT 1 FROM assessment_attempt a WHERE a."employeeId" = e.id)
     OR EXISTS (SELECT 1 FROM unlock_state u WHERE u."employeeId" = e.id)
     OR EXISTS (SELECT 1 FROM capstone_submission c WHERE c."employeeId" = e.id)
     OR EXISTS (SELECT 1 FROM certificate c WHERE c."employeeId" = e.id)
     OR EXISTS (SELECT 1 FROM ai_interaction a WHERE a."employeeId" = e.id)
`);

const forecast = {
  pedagogicalCourseRunRowsExpected: impact[0]?.employees_with_learning ?? null,
  missionAttemptToLink: counts.missionAttempt,
  employeeCourseProgressToLink: counts.employeeCourseProgress,
  employeeModuleProgressToLink: counts.employeeModuleProgress,
  assessmentAttemptToLink: counts.assessmentAttempt,
  capstoneToLink: counts.capstoneSubmission,
  certificateProvenanceExpected: counts.certificate,
  aiInteractionToLink: counts.aiInteraction,
};

mkdirSync(OUT, { recursive: true });
const evidence = {
  capturedAtUtc: new Date().toISOString(),
  environment: "production",
  pedagogicalTablePresent: pedagogicalPresent[0]?.present === true,
  counts,
  migrations: migrations.map((m) => ({
    migration_name: m.migration_name,
    finished: m.finished,
    rolled_back: m.rolled_back,
  })),
  james: {
    employeeId: james.id,
    employeeNumber: james.employeeNumber,
    email: james.email,
    role: james.role,
    companyCode: james.company.code,
    cohortCode: james.cohortMemberships[0]?.cohort?.code ?? null,
    professorAssignments: professors,
    completedMissions: completed.length,
    missionAttempts: attempts.length,
    missionScores: completed.map((a) => ({
      missionKey: a.missionDefinition.missionKey,
      scorePercent: a.scorePercent,
      attemptNumber: a.attemptNumber,
      status: a.status,
    })),
    coursePercentComplete: progress?.percentComplete ?? 0,
    assessments: assessments.map((a) => ({
      code: a.assessment.code,
      scorePercent: a.scorePercent,
      status: a.status,
    })),
    certificates: certificates.map((c) => ({
      type: c.type,
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
    legacyIntegrityHash,
  },
  migrationImpactForecast: forecast,
};

writeFileSync(`${OUT}/pre-deploy-counts.json`, JSON.stringify(evidence, null, 2));

if (existsSync(manusPath)) {
  const raw = JSON.parse(readFileSync(manusPath, "utf8"));
  delete raw.passwordHash;
  delete raw.passwordHashFingerprint;
  writeFileSync(`${OUT}/james-legacy-snapshot-sanitized.json`, JSON.stringify(raw, null, 2));
}

console.log(
  JSON.stringify(
    {
      ok: true,
      out: OUT,
      legacyIntegrityHash,
      expectedHash: "83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4",
      hashMatch:
        legacyIntegrityHash ===
        "83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4",
      pedagogicalTablePresent: evidence.pedagogicalTablePresent,
      forecast,
      qaEmployeePrefix: counts.qaEmployeePrefix,
    },
    null,
    2,
  ),
);

await client.$disconnect();
