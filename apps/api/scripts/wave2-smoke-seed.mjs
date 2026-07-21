#!/usr/bin/env node
/**
 * Wave 2 QA seed / cleanup for local runtime smoke.
 *
 * Creates QA professor, cohort QA-WAVE2, students A/B, and memberships.
 * Cleanup mode removes QA-* employees, cohort, and related residue.
 *
 * Env: DATABASE_URL (required)
 *
 * Usage:
 *   node scripts/wave2-smoke-seed.mjs
 *   node scripts/wave2-smoke-seed.mjs --cleanup
 */

import { fileURLToPath } from "node:url";
import { Password } from "@tec-platform/core";
import { getPrismaClient, NORDHABITAT_COMPANY } from "@tec-platform/database-erp";

import {
  QA_ACCOUNTS,
  QA_COHORT_CODE,
  envOrDefault,
  parseArgs,
} from "./wave2-smoke-lib.mjs";

const QA_EMPLOYEE_NUMBER_PREFIX = "#QA-";
const QA_COHORT_PREFIX = "QA-";

async function resolveCompanyId(client) {
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
    await client.certificateAudit.deleteMany({
      where: { certificateId: { in: certificateIds } },
    });
    await client.certificate.deleteMany({ where: { id: { in: certificateIds } } });
  }

  await client.assessmentAttempt.deleteMany({ where: { employeeId: { in: employeeIds } } });
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

export async function cleanupQaWave2(client = getPrismaClient()) {
  const qaEmployees = await client.employee.findMany({
    where: { employeeNumber: { startsWith: QA_EMPLOYEE_NUMBER_PREFIX } },
    select: { id: true, employeeNumber: true },
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

  return {
    deletedEmployees: qaEmployees.map((item) => item.employeeNumber),
    deletedCohorts: qaCohorts.map((item) => item.code),
  };
}

export async function seedQaWave2(client = getPrismaClient()) {
  const companyId = await resolveCompanyId(client);

  const upsertEmployee = async (account) => {
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

  const professor = await upsertEmployee(QA_ACCOUNTS.professor);
  const studentA = await upsertEmployee(QA_ACCOUNTS.studentA);
  const studentB = await upsertEmployee(QA_ACCOUNTS.studentB);

  const cohort = await client.cohort.upsert({
    where: { code: QA_COHORT_CODE },
    update: { name: "QA Wave 2 Cohort", companyId },
    create: {
      code: QA_COHORT_CODE,
      name: "QA Wave 2 Cohort",
      companyId,
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
    companyId,
    cohortCode: cohort.code,
    professorId: professor.id,
    studentAId: studentA.id,
    studentBId: studentB.id,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const databaseUrl = envOrDefault(
    "DATABASE_URL",
    "postgresql://tec:tec@127.0.0.1:5435/tec_erp_wave2",
  );
  process.env.DATABASE_URL = databaseUrl;

  const client = getPrismaClient();

  if (args.cleanup) {
    const result = await cleanupQaWave2(client);
    console.log("QA cleanup complete.");
    console.log(`  employees removed: ${result.deletedEmployees.join(", ") || "(none)"}`);
    console.log(`  cohorts removed: ${result.deletedCohorts.join(", ") || "(none)"}`);
    return;
  }

  const seeded = await seedQaWave2(client);
  console.log("QA Wave 2 seed complete.");
  console.log(`  companyId: ${seeded.companyId}`);
  console.log(`  cohort: ${seeded.cohortCode}`);
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
