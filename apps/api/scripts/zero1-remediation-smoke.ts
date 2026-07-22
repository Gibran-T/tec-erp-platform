/**
 * Zero1 remediation local smoke — isolated company, cleanup residue 0.
 * DATABASE_URL=... pnpm exec tsx scripts/zero1-remediation-smoke.ts
 */
import { Password, Result } from "@tec-platform/core";
import { getPrismaClient } from "@tec-platform/database-erp";
import { getMissionByKey, listModules } from "@tec-platform/mission-catalog";

import { createAdminService } from "../src/modules/admin/admin.service.js";
import { buildDeterministicAiCoachAnswer } from "../src/modules/ai-coach/ai-coach.guards.js";
import { evaluateMissionResponses } from "../src/modules/mission/scoring/evaluator.js";

const TAG = `Z1-SMOKE-${Date.now()}`;
const client = getPrismaClient();

async function main(): Promise<void> {
  const company = await client.company.create({
    data: { code: `${TAG}-CO`, name: `${TAG} Company` },
  });
  await client.companyConfiguration.create({
    data: { companyId: company.id, aiEnabled: true, settingsJson: {} },
  });
  await client.aiPolicy.create({
    data: { companyId: company.id, aiEnabled: true, policyJson: {} },
  });

  const admin = await client.employee.create({
    data: {
      employeeNumber: `${TAG}-ADM`,
      email: `${TAG}-admin@example.test`,
      displayName: "Smoke Admin",
      role: "ADMIN",
      passwordHash: Password.hash("SmokeAdmin12!"),
      companyId: company.id,
    },
  });

  const adminService = createAdminService(client);
  const profA = await adminService.createEmployee(admin.id, {
    employeeNumber: `${TAG}-PA`,
    email: `${TAG}-prof-a@example.test`,
    displayName: "Professor A",
    role: "PROFESSOR",
    password: "SmokeProfA12!",
  });
  const profB = await adminService.createEmployee(admin.id, {
    employeeNumber: `${TAG}-PB`,
    email: `${TAG}-prof-b@example.test`,
    displayName: "Professor B",
    role: "PROFESSOR",
    password: "SmokeProfB12!",
  });
  if (!Result.isOk(profA) || !Result.isOk(profB)) {
    throw new Error("professor create failed");
  }

  const cohort1 = await adminService.createCohort(admin.id, {
    code: `${TAG}-C1`,
    name: "Cohort One",
  });
  if (!Result.isOk(cohort1)) {
    throw new Error("cohort create failed");
  }

  const assignA = await adminService.assignProfessor(admin.id, cohort1.value.id, profA.value.id);
  if (!Result.isOk(assignA)) {
    throw new Error("assign A failed");
  }

  const rejectAdminAsProfessor = await adminService.assignProfessor(
    admin.id,
    cohort1.value.id,
    admin.id,
  );
  if (Result.isOk(rejectAdminAsProfessor)) {
    throw new Error("non-professor assignment should fail");
  }

  const studentA = await adminService.createEmployee(admin.id, {
    employeeNumber: `${TAG}-SA`,
    email: `${TAG}-student-a@example.test`,
    displayName: "Student A",
    role: "JR_BUSINESS_ANALYST",
    password: "SmokeStudentA12!",
  });
  if (!Result.isOk(studentA)) {
    throw new Error("student create failed");
  }
  await adminService.enrollStudent(admin.id, cohort1.value.id, studentA.value.id);

  const membershipsA = await client.cohortMembership.findMany({
    where: { employeeId: profA.value.id, roleInCohort: "professor" },
  });
  const membershipsB = await client.cohortMembership.findMany({
    where: { employeeId: profB.value.id, roleInCohort: "professor" },
  });
  if (membershipsA.length !== 1 || membershipsB.length !== 0) {
    throw new Error("professor isolation failed");
  }

  const reassign = await adminService.assignProfessor(admin.id, cohort1.value.id, profB.value.id);
  const removeA = await adminService.removeProfessor(admin.id, cohort1.value.id, profA.value.id);
  if (!Result.isOk(reassign) || !Result.isOk(removeA)) {
    throw new Error("reassignment failed");
  }

  const audits = await client.auditEvent.findMany({
    where: { companyId: company.id, action: { startsWith: "admin.cohort." } },
  });
  if (audits.length < 3) {
    throw new Error("expected assign/remove audits");
  }

  const modules = listModules();
  if (modules.length !== 10 || new Set(modules.map((row) => row.moduleCode)).size !== 10) {
    throw new Error("catalog must expose 10 unique modules");
  }

  const mission = getMissionByKey("m2-m01-structurer-organisation");
  if (!mission) {
    throw new Error("m2-m01 missing");
  }
  const score = evaluateMissionResponses(
    mission,
    mission.interactions.map((interaction) => ({
      interactionId: interaction.id,
      value: interaction.scoring.correctKeys?.[0] ?? "x",
    })),
  );
  if (!score.gapExplanation || !score.retryGuidance) {
    throw new Error("scoring transparency missing");
  }

  const ai = buildDeterministicAiCoachAnswer("Expliquez le risque financier approfondi", {
    moduleCode: "M6",
  });
  if (!/M6|financier|cash|marge/i.test(ai)) {
    throw new Error("AI context missing");
  }

  await client.auditEvent.deleteMany({ where: { companyId: company.id } });
  await client.cohortMembership.deleteMany({ where: { cohort: { companyId: company.id } } });
  await client.cohort.deleteMany({ where: { companyId: company.id } });
  await client.employee.deleteMany({ where: { companyId: company.id } });
  await client.aiPolicy.deleteMany({ where: { companyId: company.id } });
  await client.companyConfiguration.deleteMany({ where: { companyId: company.id } });
  await client.company.delete({ where: { id: company.id } });

  const residue = await client.company.count({ where: { code: { startsWith: TAG } } });
  if (residue !== 0) {
    throw new Error(`QA residue ${residue}`);
  }

  console.log(
    JSON.stringify({
      ok: true,
      tag: TAG,
      qaResidue: 0,
      checks: [
        "admin-create-professor",
        "assign-isolation",
        "reassign-audit",
        "catalog-10",
        "scoring-transparency",
        "ai-context",
        "residue-0",
      ],
    }),
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.$disconnect();
  });
