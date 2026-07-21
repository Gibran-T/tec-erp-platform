#!/usr/bin/env node
/**
 * Final Wave QA seed / cleanup for local runtime smoke.
 *
 * Creates QA admin, professor, cohort QA-FINAL, students A/B, EQUINOXE-QA company,
 * and cohort memberships.
 * Cleanup mode removes QA-* employees, QA cohorts, EQUINOXE-QA company, and related residue.
 *
 * Env: DATABASE_URL (required)
 *
 * Usage:
 *   node scripts/final-smoke-seed.mjs
 *   node scripts/final-smoke-seed.mjs --cleanup
 */

import { fileURLToPath } from "node:url";
import { Password } from "@tec-platform/core";
import { getPrismaClient, NORDHABITAT_COMPANY } from "@tec-platform/database-erp";

import {
  EQUINOXE_QA_COMPANY,
  QA_ACCOUNTS,
  QA_COHORT_CODE,
  QA_EQUINOXE_COHORT_CODE,
  envOrDefault,
  parseArgs,
} from "./final-smoke-lib.mjs";

const QA_EMPLOYEE_NUMBER_PREFIX = "#QA-";
const QA_COHORT_PREFIX = "QA-";
const QA_INTEGRATION_NAME_PREFIX = "QA Smoke Integration";

async function resolveNordhabitatId(client) {
  const company = await client.company.findUnique({
    where: { code: NORDHABITAT_COMPANY.code },
  });
  if (!company) {
    throw new Error(
      `Company ${NORDHABITAT_COMPANY.code} not found. Run demo seed / migrations first.`,
    );
  }
  return company.id;
}

/** @param {import('@prisma/client').PrismaClient} client @param {string[]} employeeIds */
async function deleteEmployeeResidue(client, employeeIds) {
  if (employeeIds.length === 0) {
    return;
  }

  const certificates = await client.certificate.findMany({
    where: { employeeId: { in: employeeIds } },
    select: { id: true },
  });
  const certificateIds = certificates.map((item) => item.id);

  if (certificateIds.length > 0) {
    await client.publicVerificationToken.deleteMany({
      where: { certificateId: { in: certificateIds } },
    });
    await client.certificateAudit.deleteMany({
      where: { certificateId: { in: certificateIds } },
    });
    await client.certificate.deleteMany({ where: { id: { in: certificateIds } } });
  }

  await client.assessmentAttempt.deleteMany({ where: { employeeId: { in: employeeIds } } });

  const capstoneRows = await client.capstoneSubmission.findMany({
    where: { employeeId: { in: employeeIds } },
    select: { id: true },
  });
  const capstoneIds = capstoneRows.map((item) => item.id);
  if (capstoneIds.length > 0) {
    await client.capstoneEvidence.deleteMany({ where: { submissionId: { in: capstoneIds } } });
    await client.capstoneSubmission.deleteMany({ where: { id: { in: capstoneIds } } });
  }

  await client.aiInteraction.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.predictionRecord.deleteMany({
    where: {
      OR: [{ studentId: { in: employeeIds } }, { professorId: { in: employeeIds } }],
    },
  });
  await client.automationExecution.deleteMany({ where: { employeeId: { in: employeeIds } } });

  const drafts = await client.missionDraft.findMany({
    where: { authorEmployeeId: { in: employeeIds } },
    select: { id: true },
  });
  const draftIds = drafts.map((item) => item.id);

  const versions = await client.missionVersion.findMany({
    where: {
      OR: [{ draftId: { in: draftIds } }, { publishedByEmployeeId: { in: employeeIds } }],
    },
    select: { id: true },
  });
  const versionIds = versions.map((item) => item.id);
  if (versionIds.length > 0) {
    await client.scenarioPublication.deleteMany({
      where: { missionVersionId: { in: versionIds } },
    });
    await client.missionVersion.deleteMany({ where: { id: { in: versionIds } } });
  }
  if (draftIds.length > 0) {
    await client.missionDraft.deleteMany({ where: { id: { in: draftIds } } });
  }

  await client.auditEvent.deleteMany({
    where: {
      OR: [
        { actorEmployeeId: { in: employeeIds } },
        { resourceType: "employee", resourceKey: { in: employeeIds } },
      ],
    },
  });

  const missionAttempts = await client.missionAttempt.findMany({
    where: { employeeId: { in: employeeIds } },
    select: { id: true },
  });
  const attemptIds = missionAttempts.map((item) => item.id);

  if (attemptIds.length > 0) {
    await client.feedbackRecord.deleteMany({ where: { attemptId: { in: attemptIds } } });
    await client.inventoryMovement.deleteMany({
      where: { missionAttemptId: { in: attemptIds } },
    });
    await client.financialPosting.deleteMany({
      where: { missionAttemptId: { in: attemptIds } },
    });
    await client.missionAttempt.deleteMany({ where: { id: { in: attemptIds } } });
  }

  await client.employeeMissionAttempt.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.employeeMessageState.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.employeeTaskState.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.employeeCourseProgress.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.employeeModuleProgress.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.unlockState.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.masterDataAudit.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.approvalDecision.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.cohortMembership.deleteMany({ where: { employeeId: { in: employeeIds } } });
  await client.certificateAudit.deleteMany({ where: { actorEmployeeId: { in: employeeIds } } });
}

/** @param {import('@prisma/client').PrismaClient} client @param {string} companyId */
async function deleteCompanyResidue(client, companyId) {
  const connections = await client.integrationConnection.findMany({
    where: { companyId },
    select: { id: true },
  });
  const connectionIds = connections.map((item) => item.id);

  if (connectionIds.length > 0) {
    const runs = await client.integrationRun.findMany({
      where: { connectionId: { in: connectionIds } },
      select: { id: true },
    });
    const runIds = runs.map((item) => item.id);
    if (runIds.length > 0) {
      await client.integrationEvent.deleteMany({ where: { runId: { in: runIds } } });
      await client.integrationRun.deleteMany({ where: { id: { in: runIds } } });
    }
    await client.integrationConnection.deleteMany({ where: { id: { in: connectionIds } } });
  }

  await client.kpiRecord.deleteMany({ where: { companyId } });
  await client.aiInteraction.deleteMany({ where: { companyId } });
  await client.aiPolicy.deleteMany({ where: { companyId } });
  await client.companyConfiguration.deleteMany({ where: { companyId } });
  await client.featureFlag.deleteMany({ where: { companyId } });
  await client.auditEvent.deleteMany({ where: { companyId } });
  await client.automationExecution.deleteMany({ where: { companyId } });

  const cohorts = await client.cohort.findMany({
    where: { companyId },
    select: { id: true },
  });
  for (const cohort of cohorts) {
    await client.cohortMembership.deleteMany({ where: { cohortId: cohort.id } });
    await client.certificate.updateMany({
      where: { cohortId: cohort.id },
      data: { cohortId: null },
    });
    await client.cohort.delete({ where: { id: cohort.id } });
  }

  await client.employee.deleteMany({ where: { companyId } });
  await client.company.delete({ where: { id: companyId } });
}

async function cleanupQaIntegrationConnections(client, companyId) {
  const connections = await client.integrationConnection.findMany({
    where: { companyId, name: { startsWith: QA_INTEGRATION_NAME_PREFIX } },
    select: { id: true },
  });
  const connectionIds = connections.map((item) => item.id);
  if (connectionIds.length === 0) {
    return;
  }

  const runs = await client.integrationRun.findMany({
    where: { connectionId: { in: connectionIds } },
    select: { id: true },
  });
  const runIds = runs.map((item) => item.id);
  if (runIds.length > 0) {
    await client.integrationEvent.deleteMany({ where: { runId: { in: runIds } } });
    await client.integrationRun.deleteMany({ where: { id: { in: runIds } } });
  }
  await client.integrationConnection.deleteMany({ where: { id: { in: connectionIds } } });
}

export async function cleanupQaFinal(client = getPrismaClient()) {
  const qaEmployees = await client.employee.findMany({
    where: { employeeNumber: { startsWith: QA_EMPLOYEE_NUMBER_PREFIX } },
    select: { id: true, employeeNumber: true, companyId: true },
  });
  const employeeIds = qaEmployees.map((item) => item.id);

  await deleteEmployeeResidue(client, employeeIds);

  if (employeeIds.length > 0) {
    await client.employee.deleteMany({ where: { id: { in: employeeIds } } });
  }

  const qaCohorts = await client.cohort.findMany({
    where: { code: { startsWith: QA_COHORT_PREFIX } },
    select: { id: true, code: true },
  });
  for (const cohort of qaCohorts) {
    await client.cohortMembership.deleteMany({ where: { cohortId: cohort.id } });
    await client.certificate.updateMany({
      where: { cohortId: cohort.id },
      data: { cohortId: null },
    });
    await client.cohort.delete({ where: { id: cohort.id } });
  }

  const nordhabitat = await client.company.findUnique({
    where: { code: NORDHABITAT_COMPANY.code },
    select: { id: true },
  });
  if (nordhabitat) {
    await cleanupQaIntegrationConnections(client, nordhabitat.id);
  }

  const equinoxe = await client.company.findUnique({
    where: { code: EQUINOXE_QA_COMPANY.code },
    select: { id: true },
  });
  if (equinoxe) {
    await deleteCompanyResidue(client, equinoxe.id);
  }

  return {
    deletedEmployees: qaEmployees.map((item) => item.employeeNumber),
    deletedCohorts: qaCohorts.map((item) => item.code),
    deletedEquinoxe: equinoxe !== null,
  };
}

async function upsertEquinoxeCompany(client) {
  const existing = await client.company.findUnique({
    where: { code: EQUINOXE_QA_COMPANY.code },
  });
  if (existing) {
    await client.companyConfiguration.upsert({
      where: { companyId: existing.id },
      update: { aiEnabled: true },
      create: { companyId: existing.id, aiEnabled: true, settingsJson: {} },
    });
    await client.aiPolicy.upsert({
      where: { companyId: existing.id },
      update: { aiEnabled: true },
      create: { companyId: existing.id, aiEnabled: true, policyJson: {} },
    });
    return existing;
  }

  const created = await client.company.create({
    data: { code: EQUINOXE_QA_COMPANY.code, name: EQUINOXE_QA_COMPANY.name },
  });
  await client.companyConfiguration.create({
    data: { companyId: created.id, aiEnabled: true, settingsJson: {} },
  });
  await client.aiPolicy.create({
    data: { companyId: created.id, aiEnabled: true, policyJson: {} },
  });
  return created;
}

export async function seedQaFinal(client = getPrismaClient()) {
  const nordhabitatId = await resolveNordhabitatId(client);
  const equinoxeCompany = await upsertEquinoxeCompany(client);

  const upsertEmployee = async (account, companyId) => {
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
  };

  const admin = await upsertEmployee(QA_ACCOUNTS.admin, nordhabitatId);
  const professor = await upsertEmployee(QA_ACCOUNTS.professor, nordhabitatId);
  const studentA = await upsertEmployee(QA_ACCOUNTS.studentA, nordhabitatId);
  const studentB = await upsertEmployee(QA_ACCOUNTS.studentB, nordhabitatId);

  const cohort = await client.cohort.upsert({
    where: { code: QA_COHORT_CODE },
    update: { name: "QA Final Wave Cohort", companyId: nordhabitatId },
    create: {
      code: QA_COHORT_CODE,
      name: "QA Final Wave Cohort",
      companyId: nordhabitatId,
    },
  });

  const equinoxeCohort = await client.cohort.upsert({
    where: { code: QA_EQUINOXE_COHORT_CODE },
    update: { name: "QA Equinoxe Cohort", companyId: equinoxeCompany.id },
    create: {
      code: QA_EQUINOXE_COHORT_CODE,
      name: "QA Equinoxe Cohort",
      companyId: equinoxeCompany.id,
    },
  });

  const membershipData = [
    { cohortId: cohort.id, employeeId: professor.id, roleInCohort: "professor" },
    { cohortId: cohort.id, employeeId: studentA.id, roleInCohort: "student" },
    { cohortId: cohort.id, employeeId: studentB.id, roleInCohort: "student" },
  ];

  for (const membership of membershipData) {
    await client.cohortMembership.upsert({
      where: {
        cohortId_employeeId: {
          cohortId: membership.cohortId,
          employeeId: membership.employeeId,
        },
      },
      update: { roleInCohort: membership.roleInCohort },
      create: membership,
    });
  }

  return {
    nordhabitatId,
    equinoxeCompanyId: equinoxeCompany.id,
    equinoxeCohortId: equinoxeCohort.id,
    cohortCode: cohort.code,
    adminId: admin.id,
    professorId: professor.id,
    studentAId: studentA.id,
    studentBId: studentB.id,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const databaseUrl = envOrDefault(
    "DATABASE_URL",
    "postgresql://tec:tec@127.0.0.1:5435/tec_erp_final",
  );
  process.env.DATABASE_URL = databaseUrl;

  const client = getPrismaClient();

  if (args.cleanup) {
    const result = await cleanupQaFinal(client);
    console.log("QA Final cleanup complete.");
    console.log(`  employees removed: ${result.deletedEmployees.join(", ") || "(none)"}`);
    console.log(`  cohorts removed: ${result.deletedCohorts.join(", ") || "(none)"}`);
    console.log(`  EQUINOXE-QA removed: ${result.deletedEquinoxe ? "yes" : "no"}`);
    return;
  }

  const seeded = await seedQaFinal(client);
  console.log("QA Final seed complete.");
  console.log(`  nordhabitatId: ${seeded.nordhabitatId}`);
  console.log(`  equinoxeCompanyId: ${seeded.equinoxeCompanyId}`);
  console.log(`  cohort: ${seeded.cohortCode}`);
  console.log(`  admin: ${QA_ACCOUNTS.admin.email}`);
  console.log(`  professor: ${QA_ACCOUNTS.professor.email}`);
  console.log(`  student A: ${QA_ACCOUNTS.studentA.email}`);
  console.log(`  student B: ${QA_ACCOUNTS.studentB.email}`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
