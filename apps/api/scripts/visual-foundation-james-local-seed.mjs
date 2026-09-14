#!/usr/bin/env node
/**
 * LOCAL-ONLY James Timothy historical fixture for PR #32 visual validation.
 * Never point DATABASE_URL at production.
 *
 * Creates:
 * - James Timothy / TECERP-2026-PILOT-001 / JR_BUSINESS_ANALYST / NordHabitat
 * - curriculum V1 · Run 1 · AUTONOMOUS · COMPLETED · historical · read-only
 * - 30/30 · 100% · Capstone submitted+approved · representative certificates
 * - no Professor · no Run 2
 *
 * Usage:
 *   DATABASE_URL=postgresql://tec:tec@127.0.0.1:5438/tec_erp_visual \
 *     node apps/api/scripts/visual-foundation-james-local-seed.mjs
 */
import { Password } from "@tec-platform/core";
import { getPrismaClient, disconnectPrismaClient } from "@tec-platform/database-erp";

const COURSE_CODE = "TEC_ERP_V1";
const LOCAL_PASSWORD = "VisualFoundationJames!2026";
const JAMES = {
  employeeNumber: "TECERP-2026-PILOT-001",
  email: "james.timothy.local@nordhabitat.local",
  displayName: "James Timothy",
  role: "JR_BUSINESS_ANALYST",
  password: LOCAL_PASSWORD,
};
const ADMIN = {
  employeeNumber: "TECERP-VISUAL-LOCAL-ADMIN",
  email: "visual.local.admin@nordhabitat.local",
  displayName: "Visual Local Admin",
  role: "ADMIN",
  password: LOCAL_PASSWORD,
};
const COHORT_CODE = "TECERP-VISUAL-LOCAL-COHORT";
const RUN_CODE = "TECERP-PILOT-001-RUN1";

async function seedCompletedMissions(client, input) {
  const { listRegularMissionsForCurriculum } = await import("@tec-platform/mission-catalog");
  const missions = listRegularMissionsForCurriculum(input.curriculumVersion);
  const definitions = await client.missionDefinition.findMany({
    where: { missionKey: { in: missions.map((mission) => mission.missionKey) } },
    select: { id: true, missionKey: true },
  });
  const byKey = new Map(definitions.map((row) => [row.missionKey, row.id]));
  const now = new Date("2026-03-10T15:00:00.000Z");
  let created = 0;
  for (const mission of missions) {
    const missionDefinitionId = byKey.get(mission.missionKey);
    if (!missionDefinitionId) continue;
    await client.missionAttempt.upsert({
      where: {
        employeeId_missionDefinitionId_pedagogicalCourseRunId_attemptNumber: {
          employeeId: input.employeeId,
          missionDefinitionId,
          pedagogicalCourseRunId: input.runId,
          attemptNumber: 1,
        },
      },
      update: {
        status: "completed",
        startedAt: now,
        submittedAt: now,
        completedAt: now,
        scorePercent: 100,
        earnedPoints: 100,
        maxPoints: 100,
        responsesJson: { seeded: true, localVisual: true },
      },
      create: {
        employeeId: input.employeeId,
        missionDefinitionId,
        pedagogicalCourseRunId: input.runId,
        attemptNumber: 1,
        status: "completed",
        startedAt: now,
        submittedAt: now,
        completedAt: now,
        scorePercent: 100,
        earnedPoints: 100,
        maxPoints: 100,
        responsesJson: { seeded: true, localVisual: true },
      },
    });
    created += 1;
  }
  return created;
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

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required (local only)");
  }
  if (/railway|rlwy|prod/i.test(process.env.DATABASE_URL)) {
    throw new Error("Refusing to seed non-local DATABASE_URL");
  }

  const client = getPrismaClient();
  const course = await client.course.findUnique({ where: { code: COURSE_CODE } });
  if (!course) {
    throw new Error(`${COURSE_CODE} missing — run migrations first`);
  }

  const company = await client.company.upsert({
    where: { code: "NORDHABITAT" },
    update: { name: "NordHabitat" },
    create: { code: "NORDHABITAT", name: "NordHabitat" },
  });
  await client.companyConfiguration.upsert({
    where: { companyId: company.id },
    update: { aiEnabled: true },
    create: { companyId: company.id, aiEnabled: true, settingsJson: {} },
  });
  await client.aiPolicy.upsert({
    where: { companyId: company.id },
    update: { aiEnabled: true },
    create: { companyId: company.id, aiEnabled: true, policyJson: {} },
  });

  const admin = await upsertEmployee(client, ADMIN, company.id);
  const james = await upsertEmployee(client, JAMES, company.id);

  const cohort = await client.cohort.upsert({
    where: { code: COHORT_CODE },
    update: { name: "Visual Local Cohort (no professor)", companyId: company.id },
    create: {
      code: COHORT_CODE,
      name: "Visual Local Cohort (no professor)",
      companyId: company.id,
    },
  });
  await client.cohortMembership.upsert({
    where: { cohortId_employeeId: { cohortId: cohort.id, employeeId: james.id } },
    update: { roleInCohort: "student" },
    create: { cohortId: cohort.id, employeeId: james.id, roleInCohort: "student" },
  });

  const startedAt = new Date("2026-01-02T12:00:00.000Z");
  const completedAt = new Date("2026-03-15T18:00:00.000Z");

  const run = await client.pedagogicalCourseRun.upsert({
    where: { runCode: RUN_CODE },
    update: {
      companyId: company.id,
      cohortId: cohort.id,
      employeeId: james.id,
      professorId: null,
      courseId: course.id,
      runSequence: 1,
      runType: "AUTONOMOUS",
      runLabel: "Parcours 1 — Validation autonome historique",
      status: "COMPLETED",
      createdById: admin.id,
      reflectionsEnabled: true,
      curriculumVersion: "V1",
      startedAt,
      completedAt,
      completionPercent: 100,
      cancelledAt: null,
      pausedAt: null,
    },
    create: {
      companyId: company.id,
      cohortId: cohort.id,
      employeeId: james.id,
      professorId: null,
      courseId: course.id,
      runCode: RUN_CODE,
      runSequence: 1,
      runType: "AUTONOMOUS",
      runLabel: "Parcours 1 — Validation autonome historique",
      status: "COMPLETED",
      createdById: admin.id,
      reflectionsEnabled: true,
      curriculumVersion: "V1",
      startedAt,
      completedAt,
      completionPercent: 100,
    },
  });

  const missionCount = await seedCompletedMissions(client, {
    employeeId: james.id,
    runId: run.id,
    curriculumVersion: "V1",
  });

  await client.employeeCourseProgress.upsert({
    where: {
      employeeId_courseId_pedagogicalCourseRunId: {
        employeeId: james.id,
        courseId: course.id,
        pedagogicalCourseRunId: run.id,
      },
    },
    update: { percentComplete: 100, status: "completed" },
    create: {
      employeeId: james.id,
      courseId: course.id,
      pedagogicalCourseRunId: run.id,
      percentComplete: 100,
      status: "completed",
    },
  });

  const modules = await client.courseModule.findMany({
    where: { courseId: course.id },
    select: { id: true },
  });
  for (const module of modules) {
    await client.employeeModuleProgress.upsert({
      where: {
        employeeId_moduleId_pedagogicalCourseRunId: {
          employeeId: james.id,
          moduleId: module.id,
          pedagogicalCourseRunId: run.id,
        },
      },
      update: { percentComplete: 100, status: "completed" },
      create: {
        employeeId: james.id,
        moduleId: module.id,
        pedagogicalCourseRunId: run.id,
        percentComplete: 100,
        status: "completed",
      },
    });
  }

  await client.employeeMessageState.upsert({
    where: {
      employeeId_messageKey: {
        employeeId: james.id,
        messageKey: "premier-message-gestionnaire",
      },
    },
    update: { readAt: startedAt },
    create: {
      employeeId: james.id,
      messageKey: "premier-message-gestionnaire",
      readAt: startedAt,
    },
  });
  await client.employeeTaskState.upsert({
    where: {
      employeeId_taskKey: {
        employeeId: james.id,
        taskKey: "decouvrir-nordhabitat",
      },
    },
    update: { completedAt: startedAt },
    create: {
      employeeId: james.id,
      taskKey: "decouvrir-nordhabitat",
      completedAt: startedAt,
    },
  });

  await client.capstoneSubmission.upsert({
    where: {
      employeeId_pedagogicalCourseRunId: {
        employeeId: james.id,
        pedagogicalCourseRunId: run.id,
      },
    },
    update: {
      status: "submitted",
      lifecycleStatus: "APPROVED",
      currentStage: "S7",
      diagnose: "Diagnostic historique local James",
      prioritize: "Priorisation historique",
      execute: "Exécution historique",
      analyze: "Analyse historique",
      recommend: "Recommandation historique",
      executiveSummary:
        "Résumé exécutif historique suffisamment détaillé pour validation visuelle locale.",
      submittedAt: completedAt,
      reviewStatus: "approved",
      professorApproved: true,
      professorNotes: null,
    },
    create: {
      employeeId: james.id,
      pedagogicalCourseRunId: run.id,
      status: "submitted",
      lifecycleStatus: "APPROVED",
      currentStage: "S7",
      diagnose: "Diagnostic historique local James",
      prioritize: "Priorisation historique",
      execute: "Exécution historique",
      analyze: "Analyse historique",
      recommend: "Recommandation historique",
      executiveSummary:
        "Résumé exécutif historique suffisamment détaillé pour validation visuelle locale.",
      submittedAt: completedAt,
      reviewStatus: "approved",
      professorApproved: true,
    },
  });

  for (const code of ["SILVER_M1_M2", "INTEGRATED_M3_M6", "GOLD_M7_M10"]) {
    const assessment = await client.assessmentDefinition.findFirst({
      where: { code },
      select: { id: true },
    });
    if (!assessment) continue;
    await client.assessmentAttempt.upsert({
      where: {
        employeeId_assessmentId_pedagogicalCourseRunId_attemptNumber: {
          employeeId: james.id,
          assessmentId: assessment.id,
          pedagogicalCourseRunId: run.id,
          attemptNumber: 1,
        },
      },
      update: {
        status: "passed",
        scorePercent: 92,
        startedAt: completedAt,
        submittedAt: completedAt,
        responsesJson: { seeded: true, localVisual: true },
      },
      create: {
        assessmentId: assessment.id,
        employeeId: james.id,
        pedagogicalCourseRunId: run.id,
        attemptNumber: 1,
        status: "passed",
        scorePercent: 92,
        startedAt: completedAt,
        submittedAt: completedAt,
        responsesJson: { seeded: true, localVisual: true },
      },
    });
  }

  const certDefs = [
    {
      certificateType: "silver",
      achievementType: "silver",
      certificateNumber: "LOCAL-VISUAL-SILVER-001",
      status: "issued",
      issuedAt: new Date("2026-02-01T12:00:00.000Z"),
    },
    {
      certificateType: "integrated",
      achievementType: "integrated",
      certificateNumber: "LOCAL-VISUAL-INTEGRATED-001",
      status: "issued",
      issuedAt: new Date("2026-02-20T12:00:00.000Z"),
    },
    {
      certificateType: "gold",
      achievementType: "gold",
      certificateNumber: "LOCAL-VISUAL-GOLD-REVOKED-001",
      status: "revoked",
      issuedAt: new Date("2026-03-01T12:00:00.000Z"),
      revokedAt: new Date("2026-03-02T12:00:00.000Z"),
      revokeReason: "local visual fixture representative revoked row",
    },
  ];
  for (const cert of certDefs) {
    await client.certificate.upsert({
      where: { certificateNumber: cert.certificateNumber },
      update: {
        employeeId: james.id,
        cohortId: cohort.id,
        sourceRunId: run.id,
        achievementType: cert.achievementType,
        certificateType: cert.certificateType,
        issuedAt: cert.issuedAt,
        status: cert.status,
        competencySummaryJson: { localVisual: true },
        verificationStatus: cert.status === "revoked" ? "revoked" : "valid",
        revokedAt: cert.revokedAt ?? null,
        revokeReason: cert.revokeReason ?? null,
      },
      create: {
        employeeId: james.id,
        cohortId: cohort.id,
        sourceRunId: run.id,
        achievementType: cert.achievementType,
        certificateType: cert.certificateType,
        certificateNumber: cert.certificateNumber,
        issuedAt: cert.issuedAt,
        status: cert.status,
        competencySummaryJson: { localVisual: true },
        verificationStatus: cert.status === "revoked" ? "revoked" : "valid",
        revokedAt: cert.revokedAt ?? null,
        revokeReason: cert.revokeReason ?? null,
      },
    });
  }

  const professorCount = await client.employee.count({ where: { role: "PROFESSOR" } });
  const run2Count = await client.pedagogicalCourseRun.count({
    where: { employeeId: james.id, runSequence: 2 },
  });
  const completed = await client.missionAttempt.count({
    where: { employeeId: james.id, status: "completed" },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        localOnly: true,
        james: {
          employeeNumber: JAMES.employeeNumber,
          email: JAMES.email,
          displayName: JAMES.displayName,
          role: JAMES.role,
        },
        passwordEnvHint: "LOCAL_PASSWORD hardcoded in seed script (local fixture only)",
        run: {
          runCode: run.runCode,
          status: run.status,
          curriculumVersion: run.curriculumVersion,
          runType: run.runType,
          completionPercent: run.completionPercent,
          professorId: run.professorId,
        },
        missionCount,
        completed,
        professorCount,
        run2Count,
        certificates: certDefs.map((c) => ({
          number: c.certificateNumber,
          type: c.certificateType,
          status: c.status,
        })),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => {
    void disconnectPrismaClient();
  });
