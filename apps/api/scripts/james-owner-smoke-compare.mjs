#!/usr/bin/env node
/**
 * Compare live James production snapshot core fields to last known-good artifact.
 * Read-only. Uses raw SQL for pre-V2 schema compatibility.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { getPrismaClient } from "@tec-platform/database-erp";

const EXPECTED =
  "83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4";
const BASELINE_PATH =
  "C:/Projetos/Analyste_ERP_Processus_Affaires/.manus-logs/james-zero1-curriculum-final-readonly-snapshot.json";

const client = getPrismaClient();
const q = (sql, ...params) => client.$queryRawUnsafe(sql, ...params);

try {
  const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));

  const james = (
    await q(
      `SELECT e.id, e."employeeNumber", e.role, e."passwordHash", c.code AS "companyCode"
       FROM employee e JOIN company c ON c.id = e."companyId"
       WHERE e."employeeNumber" = $1`,
      "TECERP-2026-PILOT-001",
    )
  )[0];

  const cohort = (
    await q(
      `SELECT co.code AS "cohortCode", cm."cohortId"
       FROM cohort_membership cm JOIN cohort co ON co.id = cm."cohortId"
       WHERE cm."employeeId" = $1 LIMIT 1`,
      james.id,
    )
  )[0];

  const professors = cohort
    ? await q(
        `SELECT e.id, e."employeeNumber", e."displayName", e.email
         FROM cohort_membership cm JOIN employee e ON e.id = cm."employeeId"
         WHERE cm."cohortId" = $1 AND cm."roleInCohort" = 'professor'`,
        cohort.cohortId,
      )
    : [];

  // Sort in JS to match historical james-zero1-snapshot.mjs (Array.sort),
  // not Postgres locale ordering (which places m10 before m1).
  const completed = (
    await q(
      `SELECT md."missionKey" FROM mission_attempt ma
       JOIN mission_definition md ON md.id = ma."missionDefinitionId"
       WHERE ma."employeeId" = $1 AND ma.status = 'completed'`,
      james.id,
    )
  )
    .map((r) => r.missionKey)
    .sort();

  const assessments = (
    await q(
      `SELECT a.code, aa.status, aa."scorePercent"
       FROM assessment_attempt aa
       JOIN assessment_definition a ON a.id = aa."assessmentId"
       WHERE aa."employeeId" = $1
       ORDER BY aa."submittedAt" ASC NULLS LAST`,
      james.id,
    )
  ).map((a) => ({
    code: a.code,
    status: a.status,
    scorePercent: Number(a.scorePercent),
  }));

  const certificates = (
    await q(
      `SELECT "certificateType" AS type, "certificateNumber" AS number, status,
              "issuedAt", "revokedAt"
       FROM certificate WHERE "employeeId" = $1 ORDER BY "issuedAt" ASC`,
      james.id,
    )
  ).map((c) => ({
    type: c.type,
    number: c.number,
    status: c.status,
    issuedAt: new Date(c.issuedAt).toISOString(),
    revokedAt: c.revokedAt ? new Date(c.revokedAt).toISOString() : null,
  }));

  const capstoneRow = (
    await q(
      `SELECT status, "reviewStatus", "professorApproved", "submittedAt"
       FROM capstone_submission WHERE "employeeId" = $1
       ORDER BY "createdAt" ASC LIMIT 1`,
      james.id,
    )
  )[0];

  const aiCount = Number(
    (
      await q(
        `SELECT COUNT(*)::int AS c FROM ai_interaction WHERE "employeeId" = $1`,
        james.id,
      )
    )[0].c,
  );
  const coursePercentComplete = Number(
    (
      await q(
        `SELECT "percentComplete" FROM employee_course_progress
         WHERE "employeeId" = $1 LIMIT 1`,
        james.id,
      )
    )[0]?.percentComplete ?? null,
  );

  const professorCountGlobal = Number(
    (await q(`SELECT COUNT(*)::int AS c FROM employee WHERE role = 'PROFESSOR'`))[0]
      .c,
  );
  const qaResidue = Number(
    (
      await q(
        `SELECT COUNT(*)::int AS c FROM employee
         WHERE "employeeNumber" LIKE '__QA_%'
            OR "employeeNumber" LIKE '#QA-%'
            OR "displayName" LIKE '__QA_%'`,
      )
    )[0].c,
  );

  let pedagogicalRunCount = 0;
  let jamesRun2Count = 0;
  try {
    const runs = await q(
      `SELECT "runSequence", status FROM pedagogical_course_run WHERE "employeeId" = $1`,
      james.id,
    );
    pedagogicalRunCount = runs.length;
    jamesRun2Count = runs.filter((r) => Number(r.runSequence) === 2).length;
  } catch {
    pedagogicalRunCount = 0;
  }

  const v2Migrations = await q(
    `SELECT migration_name FROM _prisma_migrations WHERE migration_name LIKE '%v2_curriculum%'`,
  );

  const core = {
    employeeId: james.id,
    employeeNumber: james.employeeNumber,
    companyCode: james.companyCode,
    cohortCode: cohort?.cohortCode ?? null,
    role: james.role,
    completed,
    coursePercentComplete,
    assessments,
    certificates,
    capstone: capstoneRow
      ? {
          status: capstoneRow.status,
          reviewStatus: capstoneRow.reviewStatus,
          professorApproved: Boolean(capstoneRow.professorApproved),
          submittedAt: capstoneRow.submittedAt
            ? new Date(capstoneRow.submittedAt).toISOString()
            : null,
        }
      : null,
    aiInteractionCount: aiCount,
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
    .update(JSON.stringify(core))
    .digest("hex");

  const baselineCore = {
    employeeId: baseline.employeeId,
    employeeNumber: baseline.employeeNumber,
    companyCode: baseline.companyCode,
    cohortCode: baseline.cohortCode,
    role: baseline.role,
    completed: baseline.completedMissionKeys,
    coursePercentComplete: baseline.coursePercentComplete,
    assessments: baseline.assessments,
    certificates: baseline.certificates,
    capstone: baseline.capstone,
    aiInteractionCount: baseline.aiInteractionCount,
    passwordHashFingerprint: baseline.passwordHashFingerprint,
    professors: baseline.professorAssignment,
  };

  const diffs = [];
  for (const key of Object.keys(baselineCore)) {
    const a = JSON.stringify(baselineCore[key]);
    const b = JSON.stringify(core[key]);
    if (a !== b) {
      diffs.push({ key, baseline: baselineCore[key], live: core[key] });
    }
  }

  console.log(
    JSON.stringify(
      {
        integrityHash,
        hashMatchExpected: integrityHash === EXPECTED,
        hashMatchBaselineArtifact: integrityHash === baseline.integrityHash,
        baselineArtifactHash: baseline.integrityHash,
        completedCount: completed.length,
        coursePercentComplete,
        pedagogicalRunCount,
        jamesRun2Count,
        professorCountGlobal,
        qaResidueEmployees: qaResidue,
        v2Migrations: v2Migrations.map((r) => r.migration_name),
        diffCount: diffs.length,
        diffs: diffs.slice(0, 8),
      },
      null,
      2,
    ),
  );
} finally {
  await client.$disconnect();
}
