#!/usr/bin/env node
/**
 * Deterministic local fixture / cleanup for TEC.ERP V2 owner browser smoke.
 *
 * Creates two QA companies (A/B), admin, professors, V1/V2 learners, cohorts,
 * company configuration, AI policy, and pre-created pedagogical runs.
 *
 * IMPORTANT (fixture setup only): curriculumVersion=V1 on the V1 student run is
 * forced here because createRun / login bootstrap assign CURRENT=V2. This script
 * bypasses that path so the V1 learner has a pinned V1 active run before any API
 * login or bootstrap.
 *
 * Env: DATABASE_URL (local only — never production)
 *
 * Usage:
 *   node scripts/v2-owner-browser-smoke-seed.mjs
 *   node scripts/v2-owner-browser-smoke-seed.mjs --cleanup
 */

import { fileURLToPath } from "node:url";
import { Password } from "@tec-platform/core";
import { getPrismaClient } from "@tec-platform/database-erp";

import { envOrDefault, parseArgs } from "./final-smoke-lib.mjs";

export const QA_PREFIX = "__QA_V2_LIVING_ERP_FINAL_";
export const QA_PASSWORD = "QaLivingErpFinal!2026";

export const QA_COMPANIES = {
  companyA: {
    code: `${QA_PREFIX}CO_A`,
    name: `${QA_PREFIX} Company A`,
  },
  companyB: {
    code: `${QA_PREFIX}CO_B`,
    name: `${QA_PREFIX} Company B`,
  },
};

export const QA_COHORTS = {
  cohortV1: {
    code: `${QA_PREFIX}COH_V1`,
    name: `${QA_PREFIX} Cohort V1`,
  },
  cohortV2: {
    code: `${QA_PREFIX}COH_V2`,
    name: `${QA_PREFIX} Cohort V2`,
  },
};

export const QA_RUN_CODES = {
  stuV1Run1: `${QA_PREFIX}RUN_STU_V1_1`,
  stuV2New: `${QA_PREFIX}RUN_STU_V2_NEW`,
  stuV2Partial: `${QA_PREFIX}RUN_STU_V2_PARTIAL`,
  stuV2Hcm: `${QA_PREFIX}RUN_STU_V2_HCM`,
  stuV2Cap: `${QA_PREFIX}RUN_STU_V2_CAP`,
  stuBRun1: `${QA_PREFIX}RUN_STU_B_1`,
};

export const QA_ACCOUNTS = {
  admin: {
    employeeNumber: `${QA_PREFIX}ADMIN`,
    email: "__qa_v2_living_erp_final_admin@nordhabitat.local",
    password: QA_PASSWORD,
    role: "ADMIN",
    displayName: `${QA_PREFIX} Admin`,
  },
  professorA: {
    employeeNumber: `${QA_PREFIX}PROF_A`,
    email: "__qa_v2_living_erp_final_prof_a@nordhabitat.local",
    password: QA_PASSWORD,
    role: "PROFESSOR",
    displayName: `${QA_PREFIX} Professor A`,
  },
  professorB: {
    employeeNumber: `${QA_PREFIX}PROF_B`,
    email: "__qa_v2_living_erp_final_prof_b@nordhabitat.local",
    password: QA_PASSWORD,
    role: "PROFESSOR",
    displayName: `${QA_PREFIX} Professor B`,
  },
  studentV1: {
    employeeNumber: `${QA_PREFIX}STU_V1`,
    email: "__qa_v2_living_erp_final_stu_v1@nordhabitat.local",
    password: QA_PASSWORD,
    role: "JR_BUSINESS_ANALYST",
    displayName: `${QA_PREFIX} Student V1 Historical`,
  },
  studentV2New: {
    employeeNumber: `${QA_PREFIX}STU_V2_NEW`,
    email: "__qa_v2_living_erp_final_stu_v2_new@nordhabitat.local",
    password: QA_PASSWORD,
    role: "JR_BUSINESS_ANALYST",
    displayName: `${QA_PREFIX} Student V2 New`,
  },
  studentV2Partial: {
    employeeNumber: `${QA_PREFIX}STU_V2_PARTIAL`,
    email: "__qa_v2_living_erp_final_stu_v2_partial@nordhabitat.local",
    password: QA_PASSWORD,
    role: "JR_BUSINESS_ANALYST",
    displayName: `${QA_PREFIX} Student V2 Partial`,
  },
  studentV2Hcm: {
    employeeNumber: `${QA_PREFIX}STU_V2_HCM`,
    email: "__qa_v2_living_erp_final_stu_v2_hcm@nordhabitat.local",
    password: QA_PASSWORD,
    role: "JR_BUSINESS_ANALYST",
    displayName: `${QA_PREFIX} Student V2 HCM`,
  },
  studentV2Cap: {
    employeeNumber: `${QA_PREFIX}STU_V2_CAP`,
    email: "__qa_v2_living_erp_final_stu_v2_cap@nordhabitat.local",
    password: QA_PASSWORD,
    role: "JR_BUSINESS_ANALYST",
    displayName: `${QA_PREFIX} Student V2 Capstone Revision`,
  },
  studentB: {
    employeeNumber: `${QA_PREFIX}STU_B`,
    email: "__qa_v2_living_erp_final_stu_b@nordhabitat.local",
    password: QA_PASSWORD,
    role: "JR_BUSINESS_ANALYST",
    displayName: `${QA_PREFIX} Student Company B`,
  },
};

const COURSE_CODE = "TEC_ERP_V1";

/** @param {import('@prisma/client').PrismaClient} client @param {string[]} runIds */
async function deleteRunResidue(client, runIds) {
  if (runIds.length === 0) {
    return;
  }

  await client.studentMissionReflection.deleteMany({ where: { runId: { in: runIds } } });
  await client.professorIntervention.deleteMany({ where: { runId: { in: runIds } } });

  const missionAttempts = await client.missionAttempt.findMany({
    where: { pedagogicalCourseRunId: { in: runIds } },
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

  await client.employeeCourseProgress.deleteMany({
    where: { pedagogicalCourseRunId: { in: runIds } },
  });
  await client.employeeModuleProgress.deleteMany({
    where: { pedagogicalCourseRunId: { in: runIds } },
  });
  await client.unlockState.deleteMany({ where: { pedagogicalCourseRunId: { in: runIds } } });
  await client.assessmentAttempt.deleteMany({ where: { pedagogicalCourseRunId: { in: runIds } } });

  const capstoneRows = await client.capstoneSubmission.findMany({
    where: { pedagogicalCourseRunId: { in: runIds } },
    select: { id: true },
  });
  const capstoneIds = capstoneRows.map((item) => item.id);
  if (capstoneIds.length > 0) {
    await client.capstoneEvidence.deleteMany({ where: { submissionId: { in: capstoneIds } } });
    await client.capstoneSubmission.deleteMany({ where: { id: { in: capstoneIds } } });
  }

  await client.aiInteraction.deleteMany({ where: { pedagogicalCourseRunId: { in: runIds } } });

  const certificates = await client.certificate.findMany({
    where: { sourceRunId: { in: runIds } },
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

  await client.pedagogicalCourseRunAudit.deleteMany({ where: { runId: { in: runIds } } });
  await client.pedagogicalCourseRun.updateMany({
    where: { sourceRunId: { in: runIds } },
    data: { sourceRunId: null },
  });
  await client.pedagogicalCourseRun.deleteMany({ where: { id: { in: runIds } } });
}

/** @param {import('@prisma/client').PrismaClient} client @param {string[]} employeeIds */
async function deleteEmployeeResidue(client, employeeIds) {
  if (employeeIds.length === 0) {
    return;
  }

  const employeeRuns = await client.pedagogicalCourseRun.findMany({
    where: { employeeId: { in: employeeIds } },
    select: { id: true },
  });
  await deleteRunResidue(
    client,
    employeeRuns.map((item) => item.id),
  );

  const createdRuns = await client.pedagogicalCourseRun.findMany({
    where: { createdById: { in: employeeIds } },
    select: { id: true },
  });
  await deleteRunResidue(
    client,
    createdRuns.map((item) => item.id),
  );

  const professorRuns = await client.pedagogicalCourseRun.findMany({
    where: { professorId: { in: employeeIds } },
    select: { id: true },
  });
  await deleteRunResidue(
    client,
    professorRuns.map((item) => item.id),
  );

  await client.pedagogicalCourseRunAudit.deleteMany({
    where: { actorId: { in: employeeIds } },
  });

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
  const runs = await client.pedagogicalCourseRun.findMany({
    where: { companyId },
    select: { id: true },
  });
  await deleteRunResidue(
    client,
    runs.map((item) => item.id),
  );

  const connections = await client.integrationConnection.findMany({
    where: { companyId },
    select: { id: true },
  });
  const connectionIds = connections.map((item) => item.id);

  if (connectionIds.length > 0) {
    const integrationRuns = await client.integrationRun.findMany({
      where: { connectionId: { in: connectionIds } },
      select: { id: true },
    });
    const integrationRunIds = integrationRuns.map((item) => item.id);
    if (integrationRunIds.length > 0) {
      await client.integrationEvent.deleteMany({
        where: { runId: { in: integrationRunIds } },
      });
      await client.integrationRun.deleteMany({ where: { id: { in: integrationRunIds } } });
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
  await client.automationRule.deleteMany({ where: { companyId } }).catch(() => undefined);
  await client.predictionRecord.deleteMany({ where: { companyId } }).catch(() => undefined);
  await client.simulationSnapshot.deleteMany({ where: { companyId } }).catch(() => undefined);
  await client.masterDataRecord.deleteMany({ where: { companyId } }).catch(() => undefined);
  await client.openItem.deleteMany({ where: { companyId } }).catch(() => undefined);
  await client.financialPosting.deleteMany({ where: { companyId } }).catch(() => undefined);
  await client.inventoryMovement.deleteMany({ where: { companyId } }).catch(() => undefined);
  await client.transactionEvent.deleteMany({ where: { companyId } }).catch(() => undefined);
  await client.approvalDecision.deleteMany({ where: { companyId } }).catch(() => undefined);

  const documents = await client.businessDocument.findMany({
    where: { companyId },
    select: { id: true },
  });
  const documentIds = documents.map((item) => item.id);
  if (documentIds.length > 0) {
    await client.documentLine.deleteMany({ where: { documentId: { in: documentIds } } });
    await client.businessDocument.deleteMany({ where: { id: { in: documentIds } } });
  }

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

export async function cleanupQaLivingErpFinal(client = getPrismaClient()) {
  const qaCompanies = await client.company.findMany({
    where: { code: { startsWith: QA_PREFIX } },
    select: { id: true, code: true },
  });
  const companyIds = qaCompanies.map((item) => item.id);

  const qaEmployees = await client.employee.findMany({
    where: { employeeNumber: { startsWith: QA_PREFIX } },
    select: { id: true, employeeNumber: true },
  });
  const employeeIds = qaEmployees.map((item) => item.id);

  const qaCohorts = await client.cohort.findMany({
    where: { code: { startsWith: QA_PREFIX } },
    select: { id: true, code: true },
  });

  const qaRuns = await client.pedagogicalCourseRun.findMany({
    where: {
      OR: [
        { companyId: { in: companyIds } },
        { employeeId: { in: employeeIds } },
        { runCode: { startsWith: QA_PREFIX } },
      ],
    },
    select: { id: true },
  });

  await deleteRunResidue(
    client,
    qaRuns.map((item) => item.id),
  );
  await deleteEmployeeResidue(client, employeeIds);

  if (employeeIds.length > 0) {
    await client.employee.deleteMany({ where: { id: { in: employeeIds } } });
  }

  for (const cohort of qaCohorts) {
    await client.cohortMembership.deleteMany({ where: { cohortId: cohort.id } });
    await client.certificate.updateMany({
      where: { cohortId: cohort.id },
      data: { cohortId: null },
    });
    await client.cohort.delete({ where: { id: cohort.id } });
  }

  for (const company of qaCompanies) {
    await deleteCompanyResidue(client, company.id);
  }

  return {
    deletedEmployees: qaEmployees.map((item) => item.employeeNumber),
    deletedCohorts: qaCohorts.map((item) => item.code),
    deletedCompanies: qaCompanies.map((item) => item.code),
  };
}

async function upsertCompanyWithPolicies(client, companyDef) {
  const company = await client.company.upsert({
    where: { code: companyDef.code },
    update: { name: companyDef.name },
    create: { code: companyDef.code, name: companyDef.name },
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

  return company;
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

async function upsertCohortMembership(client, cohortId, employeeId, roleInCohort) {
  await client.cohortMembership.upsert({
    where: {
      cohortId_employeeId: {
        cohortId,
        employeeId,
      },
    },
    update: { roleInCohort },
    create: { cohortId, employeeId, roleInCohort },
  });
}

async function upsertPedagogicalRun(client, input) {
  return client.pedagogicalCourseRun.upsert({
    where: { runCode: input.runCode },
    update: {
      companyId: input.companyId,
      cohortId: input.cohortId,
      employeeId: input.employeeId,
      professorId: input.professorId ?? null,
      courseId: input.courseId,
      runSequence: input.runSequence,
      runType: input.runType,
      runLabel: input.runLabel,
      status: input.status,
      createdById: input.createdById,
      reflectionsEnabled: input.reflectionsEnabled,
      curriculumVersion: input.curriculumVersion,
      startedAt: input.startedAt,
      completionPercent: input.completionPercent ?? 0,
      completedAt: input.completedAt ?? null,
      cancelledAt: null,
      pausedAt: null,
    },
    create: {
      companyId: input.companyId,
      cohortId: input.cohortId,
      employeeId: input.employeeId,
      professorId: input.professorId ?? null,
      courseId: input.courseId,
      runCode: input.runCode,
      runSequence: input.runSequence,
      runType: input.runType,
      runLabel: input.runLabel,
      status: input.status,
      createdById: input.createdById,
      reflectionsEnabled: input.reflectionsEnabled,
      curriculumVersion: input.curriculumVersion,
      startedAt: input.startedAt,
      completionPercent: input.completionPercent ?? 0,
      completedAt: input.completedAt ?? null,
    },
  });
}

/**
 * @param {import('@prisma/client').PrismaClient} client
 * @param {{ employeeId: string, runId: string, curriculumVersion: 'V1' | 'V2', moduleFilter?: (code: string) => boolean }} input
 */
async function seedCompletedMissions(client, input) {
  const { listRegularMissionsForCurriculum } = await import("@tec-platform/mission-catalog");
  const missions = listRegularMissionsForCurriculum(input.curriculumVersion).filter((mission) =>
    input.moduleFilter ? input.moduleFilter(mission.moduleCode) : true,
  );
  const definitions = await client.missionDefinition.findMany({
    where: { missionKey: { in: missions.map((mission) => mission.missionKey) } },
    select: { id: true, missionKey: true },
  });
  const byKey = new Map(definitions.map((row) => [row.missionKey, row.id]));
  const now = new Date();
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
        responsesJson: { seeded: true },
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
        responsesJson: { seeded: true },
      },
    });
    created += 1;
  }
  return created;
}

export async function seedQaLivingErpFinal(client = getPrismaClient()) {
  const course = await client.course.findUnique({ where: { code: COURSE_CODE } });
  if (!course) {
    throw new Error(`${COURSE_CODE} not found. Run demo seed / migrations first.`);
  }

  const companyA = await upsertCompanyWithPolicies(client, QA_COMPANIES.companyA);
  const companyB = await upsertCompanyWithPolicies(client, QA_COMPANIES.companyB);

  const admin = await upsertEmployee(client, QA_ACCOUNTS.admin, companyA.id);
  const professorA = await upsertEmployee(client, QA_ACCOUNTS.professorA, companyA.id);
  const professorB = await upsertEmployee(client, QA_ACCOUNTS.professorB, companyB.id);
  const studentV1 = await upsertEmployee(client, QA_ACCOUNTS.studentV1, companyA.id);
  const studentV2New = await upsertEmployee(client, QA_ACCOUNTS.studentV2New, companyA.id);
  const studentV2Partial = await upsertEmployee(client, QA_ACCOUNTS.studentV2Partial, companyA.id);
  const studentV2Hcm = await upsertEmployee(client, QA_ACCOUNTS.studentV2Hcm, companyA.id);
  const studentV2Cap = await upsertEmployee(client, QA_ACCOUNTS.studentV2Cap, companyA.id);
  const studentB = await upsertEmployee(client, QA_ACCOUNTS.studentB, companyB.id);

  const cohortV1 = await client.cohort.upsert({
    where: { code: QA_COHORTS.cohortV1.code },
    update: { name: QA_COHORTS.cohortV1.name, companyId: companyA.id },
    create: {
      code: QA_COHORTS.cohortV1.code,
      name: QA_COHORTS.cohortV1.name,
      companyId: companyA.id,
    },
  });

  const cohortV2 = await client.cohort.upsert({
    where: { code: QA_COHORTS.cohortV2.code },
    update: { name: QA_COHORTS.cohortV2.name, companyId: companyA.id },
    create: {
      code: QA_COHORTS.cohortV2.code,
      name: QA_COHORTS.cohortV2.name,
      companyId: companyA.id,
    },
  });

  const cohortB = await client.cohort.upsert({
    where: { code: `${QA_PREFIX}COH_B` },
    update: { name: `${QA_PREFIX} Cohort B`, companyId: companyB.id },
    create: {
      code: `${QA_PREFIX}COH_B`,
      name: `${QA_PREFIX} Cohort B`,
      companyId: companyB.id,
    },
  });

  await upsertCohortMembership(client, cohortV1.id, professorA.id, "professor");
  await upsertCohortMembership(client, cohortV1.id, studentV1.id, "student");
  await upsertCohortMembership(client, cohortV2.id, professorA.id, "professor");
  await upsertCohortMembership(client, cohortV2.id, studentV2New.id, "student");
  await upsertCohortMembership(client, cohortV2.id, studentV2Partial.id, "student");
  await upsertCohortMembership(client, cohortV2.id, studentV2Hcm.id, "student");
  await upsertCohortMembership(client, cohortV2.id, studentV2Cap.id, "student");
  await upsertCohortMembership(client, cohortB.id, professorB.id, "professor");
  await upsertCohortMembership(client, cohortB.id, studentB.id, "student");

  const startedAt = new Date("2026-01-02T12:00:00.000Z");
  const completedAt = new Date("2026-03-15T18:00:00.000Z");

  const runV1 = await upsertPedagogicalRun(client, {
    companyId: companyA.id,
    cohortId: cohortV1.id,
    employeeId: studentV1.id,
    professorId: null,
    courseId: course.id,
    runCode: QA_RUN_CODES.stuV1Run1,
    runSequence: 1,
    runType: "AUTONOMOUS",
    runLabel: `${QA_PREFIX} James-style — Run 1 — Autonomous Zero1 Validation`,
    status: "COMPLETED",
    createdById: admin.id,
    reflectionsEnabled: true,
    startedAt,
    completedAt,
    completionPercent: 100,
    curriculumVersion: "V1",
  });

  const runV2New = await upsertPedagogicalRun(client, {
    companyId: companyA.id,
    cohortId: cohortV2.id,
    employeeId: studentV2New.id,
    professorId: professorA.id,
    courseId: course.id,
    runCode: QA_RUN_CODES.stuV2New,
    runSequence: 1,
    runType: "AUTONOMOUS",
    runLabel: `${QA_PREFIX} V2 New Run 1`,
    status: "ACTIVE",
    createdById: admin.id,
    reflectionsEnabled: true,
    startedAt,
    curriculumVersion: "V2",
  });

  const runV2Partial = await upsertPedagogicalRun(client, {
    companyId: companyA.id,
    cohortId: cohortV2.id,
    employeeId: studentV2Partial.id,
    professorId: professorA.id,
    courseId: course.id,
    runCode: QA_RUN_CODES.stuV2Partial,
    runSequence: 1,
    runType: "AUTONOMOUS",
    runLabel: `${QA_PREFIX} V2 Partial Run 1`,
    status: "ACTIVE",
    createdById: admin.id,
    reflectionsEnabled: true,
    startedAt,
    curriculumVersion: "V2",
  });

  const runV2Hcm = await upsertPedagogicalRun(client, {
    companyId: companyA.id,
    cohortId: cohortV2.id,
    employeeId: studentV2Hcm.id,
    professorId: professorA.id,
    courseId: course.id,
    runCode: QA_RUN_CODES.stuV2Hcm,
    runSequence: 1,
    runType: "AUTONOMOUS",
    runLabel: `${QA_PREFIX} V2 HCM Run 1`,
    status: "ACTIVE",
    createdById: admin.id,
    reflectionsEnabled: true,
    startedAt,
    curriculumVersion: "V2",
    completionPercent: 80,
  });

  const runV2Cap = await upsertPedagogicalRun(client, {
    companyId: companyA.id,
    cohortId: cohortV2.id,
    employeeId: studentV2Cap.id,
    professorId: professorA.id,
    courseId: course.id,
    runCode: QA_RUN_CODES.stuV2Cap,
    runSequence: 1,
    runType: "AUTONOMOUS",
    runLabel: `${QA_PREFIX} V2 Capstone Revision Run 1`,
    status: "ACTIVE",
    createdById: admin.id,
    reflectionsEnabled: true,
    startedAt,
    curriculumVersion: "V2",
    completionPercent: 100,
  });

  const runB = await upsertPedagogicalRun(client, {
    companyId: companyB.id,
    cohortId: cohortB.id,
    employeeId: studentB.id,
    professorId: professorB.id,
    courseId: course.id,
    runCode: QA_RUN_CODES.stuBRun1,
    runSequence: 1,
    runType: "AUTONOMOUS",
    runLabel: `${QA_PREFIX} Company B Run 1`,
    status: "ACTIVE",
    createdById: professorB.id,
    reflectionsEnabled: true,
    startedAt,
    curriculumVersion: "V2",
  });

  const v1Missions = await seedCompletedMissions(client, {
    employeeId: studentV1.id,
    runId: runV1.id,
    curriculumVersion: "V1",
  });
  const hcmMissions = await seedCompletedMissions(client, {
    employeeId: studentV2Hcm.id,
    runId: runV2Hcm.id,
    curriculumVersion: "V2",
    moduleFilter: (code) => ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"].includes(code),
  });
  const capMissions = await seedCompletedMissions(client, {
    employeeId: studentV2Cap.id,
    runId: runV2Cap.id,
    curriculumVersion: "V2",
  });

  await client.employeeMessageState.upsert({
    where: {
      employeeId_messageKey: {
        employeeId: studentV1.id,
        messageKey: "premier-message-gestionnaire",
      },
    },
    update: { readAt: startedAt },
    create: {
      employeeId: studentV1.id,
      messageKey: "premier-message-gestionnaire",
      readAt: startedAt,
    },
  });
  await client.employeeTaskState.upsert({
    where: {
      employeeId_taskKey: {
        employeeId: studentV1.id,
        taskKey: "premiere-responsabilite",
      },
    },
    update: { completedAt: startedAt },
    create: {
      employeeId: studentV1.id,
      taskKey: "premiere-responsabilite",
      completedAt: startedAt,
    },
  });

  await client.capstoneSubmission.upsert({
    where: {
      employeeId_pedagogicalCourseRunId: {
        employeeId: studentV1.id,
        pedagogicalCourseRunId: runV1.id,
      },
    },
    update: {
      status: "submitted",
      lifecycleStatus: "APPROVED",
      currentStage: "S7",
      diagnose: "Diagnostic historique James-style",
      prioritize: "Priorisation historique",
      execute: "Exécution historique",
      analyze: "Analyse historique",
      recommend: "Recommandation historique",
      executiveSummary:
        "Résumé exécutif historique suffisamment détaillé pour lecture seule du parcours V1.",
      submittedAt: completedAt,
      reviewStatus: "approved",
      professorApproved: true,
      professorNotes: null,
    },
    create: {
      employeeId: studentV1.id,
      pedagogicalCourseRunId: runV1.id,
      status: "submitted",
      lifecycleStatus: "APPROVED",
      currentStage: "S7",
      diagnose: "Diagnostic historique James-style",
      prioritize: "Priorisation historique",
      execute: "Exécution historique",
      analyze: "Analyse historique",
      recommend: "Recommandation historique",
      executiveSummary:
        "Résumé exécutif historique suffisamment détaillé pour lecture seule du parcours V1.",
      submittedAt: completedAt,
      reviewStatus: "approved",
      professorApproved: true,
    },
  });

  await client.capstoneSubmission.upsert({
    where: {
      employeeId_pedagogicalCourseRunId: {
        employeeId: studentV2Cap.id,
        pedagogicalCourseRunId: runV2Cap.id,
      },
    },
    update: {
      status: "submitted",
      lifecycleStatus: "REVISION_REQUESTED",
      currentStage: "S7",
      diagnose: "Diagnostic Capstone V2",
      prioritize: "Priorisation Capstone V2",
      execute: "Exécution Capstone V2",
      analyze: "Analyse Capstone V2",
      recommend: "Recommandation Capstone V2",
      executiveSummary:
        "Résumé exécutif Capstone V2 soumis — révision demandée par le professeur.",
      submittedAt: completedAt,
      reviewStatus: "needs_revision",
      professorApproved: false,
      professorNotes: "Renforcez l’analyse financière transversale et les preuves S3–S5.",
    },
    create: {
      employeeId: studentV2Cap.id,
      pedagogicalCourseRunId: runV2Cap.id,
      status: "submitted",
      lifecycleStatus: "REVISION_REQUESTED",
      currentStage: "S7",
      diagnose: "Diagnostic Capstone V2",
      prioritize: "Priorisation Capstone V2",
      execute: "Exécution Capstone V2",
      analyze: "Analyse Capstone V2",
      recommend: "Recommandation Capstone V2",
      executiveSummary:
        "Résumé exécutif Capstone V2 soumis — révision demandée par le professeur.",
      submittedAt: completedAt,
      reviewStatus: "needs_revision",
      professorApproved: false,
      professorNotes: "Renforcez l’analyse financière transversale et les preuves S3–S5.",
    },
  });

  // Gold assessment passed for V1 historical eligibility (no Gold certificate issued).
  const goldAssessment = await client.assessmentDefinition.findFirst({
    where: { code: "GOLD_M7_M10" },
    select: { id: true, code: true },
  });
  if (goldAssessment) {
    await client.assessmentAttempt.upsert({
      where: {
        employeeId_assessmentId_pedagogicalCourseRunId_attemptNumber: {
          employeeId: studentV1.id,
          assessmentId: goldAssessment.id,
          pedagogicalCourseRunId: runV1.id,
          attemptNumber: 1,
        },
      },
      update: {
        status: "passed",
        scorePercent: 90,
        startedAt: completedAt,
        submittedAt: completedAt,
        responsesJson: { seeded: true },
      },
      create: {
        assessmentId: goldAssessment.id,
        employeeId: studentV1.id,
        pedagogicalCourseRunId: runV1.id,
        attemptNumber: 1,
        status: "passed",
        scorePercent: 90,
        startedAt: completedAt,
        submittedAt: completedAt,
        responsesJson: { seeded: true },
      },
    });
  }

  return {
    companies: {
      companyA: { id: companyA.id, code: companyA.code },
      companyB: { id: companyB.id, code: companyB.code },
    },
    cohorts: {
      cohortV1: { id: cohortV1.id, code: cohortV1.code },
      cohortV2: { id: cohortV2.id, code: cohortV2.code },
      cohortB: { id: cohortB.id, code: cohortB.code },
    },
    missionSeedCounts: { v1Missions, hcmMissions, capMissions },
    runs: {
      studentV1Run1: { id: runV1.id, runCode: runV1.runCode, curriculumVersion: "V1" },
      studentV2New: { id: runV2New.id, runCode: runV2New.runCode, curriculumVersion: "V2" },
      studentV2Partial: {
        id: runV2Partial.id,
        runCode: runV2Partial.runCode,
        curriculumVersion: "V2",
      },
      studentV2Hcm: { id: runV2Hcm.id, runCode: runV2Hcm.runCode, curriculumVersion: "V2" },
      studentV2Cap: { id: runV2Cap.id, runCode: runV2Cap.runCode, curriculumVersion: "V2" },
      studentB: { id: runB.id, runCode: runB.runCode, curriculumVersion: "V2" },
    },
    accounts: {
      admin: { email: QA_ACCOUNTS.admin.email, id: admin.id },
      professorA: { email: QA_ACCOUNTS.professorA.email, id: professorA.id },
      professorB: { email: QA_ACCOUNTS.professorB.email, id: professorB.id },
      studentV1: { email: QA_ACCOUNTS.studentV1.email, id: studentV1.id, runId: runV1.id },
      studentV2New: {
        email: QA_ACCOUNTS.studentV2New.email,
        id: studentV2New.id,
        runId: runV2New.id,
      },
      studentV2Partial: {
        email: QA_ACCOUNTS.studentV2Partial.email,
        id: studentV2Partial.id,
        runId: runV2Partial.id,
      },
      studentV2Hcm: {
        email: QA_ACCOUNTS.studentV2Hcm.email,
        id: studentV2Hcm.id,
        runId: runV2Hcm.id,
      },
      studentV2Cap: {
        email: QA_ACCOUNTS.studentV2Cap.email,
        id: studentV2Cap.id,
        runId: runV2Cap.id,
      },
      studentB: { email: QA_ACCOUNTS.studentB.email, id: studentB.id, runId: runB.id },
    },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const databaseUrl = envOrDefault(
    "DATABASE_URL",
    "postgresql://tec:tec@127.0.0.1:5437/tec_erp_living_final",
  );
  process.env.DATABASE_URL = databaseUrl;

  const client = getPrismaClient();

  if (args.cleanup) {
    const result = await cleanupQaLivingErpFinal(client);
    console.log(
      JSON.stringify(
        {
          mode: "cleanup",
          deletedEmployees: result.deletedEmployees,
          deletedCohorts: result.deletedCohorts,
          deletedCompanies: result.deletedCompanies,
        },
        null,
        2,
      ),
    );
    return;
  }

  const seeded = await seedQaLivingErpFinal(client);
  console.log(JSON.stringify({ mode: "seed", password: QA_PASSWORD, ...seeded }, null, 2));
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  main()
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await getPrismaClient().$disconnect();
    });
}
