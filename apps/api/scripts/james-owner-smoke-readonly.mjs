#!/usr/bin/env node
/**
 * Read-only production integrity check for V2 owner browser smoke.
 * Uses raw SQL so the V2 Prisma client can inspect a pre-V2 production schema.
 * Never mutates. Never prints passwords or connection strings.
 *
 * Env: DATABASE_URL (Railway DATABASE_PUBLIC_URL)
 */
import { createHash } from "node:crypto";
import { getPrismaClient } from "@tec-platform/database-erp";

const EXPECTED_HASH =
  "83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4";

const client = getPrismaClient();

/**
 * @param {string} sql
 * @param {...unknown} params
 */
async function q(sql, ...params) {
  return client.$queryRawUnsafe(sql, ...params);
}

try {
  const jamesRows = await q(
    `SELECT e.id, e."employeeNumber", e.email, e.role, e."displayName", e."passwordHash",
            e."companyId", c.code AS "companyCode", c.name AS "companyName"
     FROM employee e
     JOIN company c ON c.id = e."companyId"
     WHERE e."employeeNumber" = $1
     LIMIT 1`,
    "TECERP-2026-PILOT-001",
  );
  const james = jamesRows[0];
  if (!james) {
    throw new Error("James Timothy not found");
  }

  const memberships = await q(
    `SELECT cm."cohortId", co.code AS "cohortCode", co.name AS "cohortName"
     FROM cohort_membership cm
     JOIN cohort co ON co.id = cm."cohortId"
     WHERE cm."employeeId" = $1
     LIMIT 1`,
    james.id,
  );
  const cohort = memberships[0] ?? null;

  const professors = cohort
    ? await q(
        `SELECT e.id, e."employeeNumber", e."displayName", e.email
         FROM cohort_membership cm
         JOIN employee e ON e.id = cm."employeeId"
         WHERE cm."cohortId" = $1 AND cm."roleInCohort" = 'professor'`,
        cohort.cohortId,
      )
    : [];

  const completed = await q(
    `SELECT md."missionKey"
     FROM mission_attempt ma
     JOIN mission_definition md ON md.id = ma."missionDefinitionId"
     WHERE ma."employeeId" = $1 AND ma.status = 'completed'
     ORDER BY md."missionKey"`,
    james.id,
  );

  const assessments = await q(
    `SELECT a.code, aa.status, aa."scorePercent"
     FROM assessment_attempt aa
     JOIN assessment_definition a ON a.id = aa."assessmentId"
     WHERE aa."employeeId" = $1
     ORDER BY aa."submittedAt" ASC NULLS LAST`,
    james.id,
  );

  const certificates = await q(
    `SELECT "certificateType" AS type, "certificateNumber" AS number, status,
            "issuedAt", "revokedAt"
     FROM certificate
     WHERE "employeeId" = $1
     ORDER BY "issuedAt" ASC`,
    james.id,
  );

  const capstoneRows = await q(
    `SELECT status, "reviewStatus", "professorApproved", "submittedAt"
     FROM capstone_submission
     WHERE "employeeId" = $1
     ORDER BY "createdAt" ASC
     LIMIT 1`,
    james.id,
  );
  const capstone = capstoneRows[0] ?? null;

  const aiRows = await q(
    `SELECT COUNT(*)::int AS count FROM ai_interaction WHERE "employeeId" = $1`,
    james.id,
  );
  const courseRows = await q(
    `SELECT "percentComplete" FROM employee_course_progress WHERE "employeeId" = $1 LIMIT 1`,
    james.id,
  );

  const professorCountGlobalRows = await q(
    `SELECT COUNT(*)::int AS count FROM employee WHERE role = 'PROFESSOR'`,
  );

  const qaResidueRows = await q(
    `SELECT COUNT(*)::int AS count FROM employee
     WHERE "employeeNumber" LIKE '__QA_%'
        OR "employeeNumber" LIKE '#QA-%'
        OR "employeeNumber" LIKE 'QA-%'
        OR "displayName" LIKE '__QA_%'
        OR email LIKE '%.qa@%'`,
  );

  let pedagogicalRunCount = 0;
  let runs = [];
  let pedagogicalErr = null;
  try {
    runs = await q(
      `SELECT "runNumber", COALESCE("curriculumVersion", 'V1') AS "curriculumVersion", status
       FROM pedagogical_course_run
       WHERE "employeeId" = $1
       ORDER BY "runNumber" ASC`,
      james.id,
    );
    pedagogicalRunCount = runs.length;
  } catch (error) {
    pedagogicalErr =
      error instanceof Error ? error.message.split("\n")[0] : String(error);
  }

  const v2Migrations = await q(
    `SELECT migration_name FROM _prisma_migrations
     WHERE migration_name LIKE '%v2_curriculum%'
     ORDER BY migration_name`,
  );

  const snapshotCore = {
    employeeId: james.id,
    employeeNumber: james.employeeNumber,
    companyCode: james.companyCode,
    cohortCode: cohort?.cohortCode ?? null,
    role: james.role,
    completed: completed.map((r) => r.missionKey),
    coursePercentComplete: courseRows[0]?.percentComplete ?? null,
    assessments: assessments.map((a) => ({
      code: a.code,
      status: a.status,
      scorePercent: a.scorePercent,
    })),
    certificates: certificates.map((c) => ({
      type: c.type,
      number: c.number,
      status: c.status,
      issuedAt: new Date(c.issuedAt).toISOString(),
      revokedAt: c.revokedAt ? new Date(c.revokedAt).toISOString() : null,
    })),
    capstone: capstone
      ? {
          status: capstone.status,
          reviewStatus: capstone.reviewStatus,
          professorApproved: capstone.professorApproved,
          submittedAt: capstone.submittedAt
            ? new Date(capstone.submittedAt).toISOString()
            : null,
        }
      : null,
    aiInteractionCount: aiRows[0]?.count ?? 0,
    passwordHashFingerprint: createHash("sha256")
      .update(james.passwordHash)
      .digest("hex")
      .slice(0, 16),
    professors: professors.map((p) => ({
      id: p.id,
      employeeNumber: p.employeeNumber,
      displayName: p.displayName,
      email: p.email,
    })),
  };

  const integrityHash = createHash("sha256")
    .update(JSON.stringify(snapshotCore))
    .digest("hex");

  console.log(
    JSON.stringify(
      {
        integrityHash,
        hashMatch: integrityHash === EXPECTED_HASH,
        completedCount: snapshotCore.completed.length,
        coursePercentComplete: snapshotCore.coursePercentComplete,
        pedagogicalRunCount,
        pedagogicalErr,
        runs,
        jamesRun2Count: runs.filter((r) => Number(r.runNumber) === 2).length,
        inferredCurriculumVersion:
          runs.find((r) => Number(r.runNumber) === 1)?.curriculumVersion ?? "V1",
        professorCountGlobal: professorCountGlobalRows[0]?.count ?? null,
        qaResidueEmployees: qaResidueRows[0]?.count ?? null,
        v2Migrations: v2Migrations.map((r) => r.migration_name),
        role: snapshotCore.role,
        companyCode: snapshotCore.companyCode,
        hcmCompletions: snapshotCore.completed.filter((k) =>
          String(k).includes("integrer-nouvel-employe"),
        ).length,
      },
      null,
      2,
    ),
  );
} finally {
  await client.$disconnect();
}
