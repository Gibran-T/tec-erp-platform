#!/usr/bin/env node
/**
 * Wave 2 local runtime smoke — expects API already running.
 *
 * Prerequisites:
 *   - PostgreSQL with migrations + demo seed (DATABASE_URL)
 *   - API listening at API_BASE_URL (default http://127.0.0.1:3000)
 *
 * Usage:
 *   node scripts/wave2-smoke-seed.mjs
 *   DATABASE_URL=... API_BASE_URL=... node scripts/wave2-runtime-smoke.mjs
 *   node scripts/wave2-runtime-smoke.mjs --cleanup
 *
 * Does NOT start the API server.
 */

import { getPrismaClient, NORDHABITAT_COMPANY } from "@tec-platform/database-erp";

import {
  QA_ACCOUNTS,
  QA_COHORT_CODE,
  SmokeChecklist,
  buildSilverAssessmentSubmit,
  completeAllMissions,
  completeFirstDay,
  createApiClient,
  envOrDefault,
  parseArgs,
} from "./wave2-smoke-lib.mjs";
import { cleanupQaWave2, seedQaWave2 } from "./wave2-smoke-seed.mjs";

const SIMULATION_MISSION_KEYS = [
  "m3-m03-receptionner-analyser-fournisseur",
  "m4-m03-confirmer-livraison-cloture",
  "m6-m02-exception-rapprochement-trois-voies",
];

async function verifySimulationPostings(client, companyId, studentAId, checklist) {
  const attempts = await client.missionAttempt.findMany({
    where: {
      employeeId: studentAId,
      status: "completed",
      missionDefinition: { missionKey: { in: SIMULATION_MISSION_KEYS } },
    },
    include: { missionDefinition: true },
  });

  if (attempts.length < SIMULATION_MISSION_KEYS.length) {
    checklist.fail(
      "Simulation: completed M3/M4/M6 missions",
      `found ${attempts.length}/${SIMULATION_MISSION_KEYS.length}`,
    );
    return;
  }
  checklist.pass("Simulation: completed M3/M4/M6 missions");

  const attemptIds = attempts.map((item) => item.id);

  const inventoryCount = await client.inventoryMovement.count({
    where: { companyId, missionAttemptId: { in: attemptIds } },
  });
  if (inventoryCount >= 2) {
    checklist.pass(`Simulation: inventory movements (${inventoryCount})`);
  } else {
    checklist.fail("Simulation: inventory movements", `expected >= 2, got ${inventoryCount}`);
  }

  const financialCount = await client.financialPosting.count({
    where: { companyId, missionAttemptId: { in: attemptIds } },
  });
  if (financialCount >= 2) {
    checklist.pass(`Simulation: financial postings (${financialCount})`);
  } else {
    checklist.fail("Simulation: financial postings", `expected >= 2, got ${financialCount}`);
  }
}

async function runStudentAFlow(api, checklist) {
  await api.login(QA_ACCOUNTS.studentA.email, QA_ACCOUNTS.studentA.password);
  checklist.pass("Student A: login");

  const firstDayOk = await completeFirstDay(api, checklist, "Student A");
  if (!firstDayOk) {
    return false;
  }

  const missionsOk = await completeAllMissions(api, checklist);
  if (!missionsOk) {
    return false;
  }

  const assessments = await api.get("/api/v1/me/assessments");
  if (assessments.status !== 200) {
    checklist.fail("Student A: list assessments", `status ${assessments.status}`);
    return false;
  }
  const silverSummary = assessments.body.assessments?.find((item) => item.code === "SILVER_M1_M2");
  if (!silverSummary || silverSummary.status === "locked") {
    checklist.fail("Student A: Silver assessment available", JSON.stringify(silverSummary));
    return false;
  }
  checklist.pass("Student A: Silver assessment available");

  const startSilver = await api.post("/api/v1/me/assessments/SILVER_M1_M2/start");
  if (startSilver.status !== 201) {
    checklist.fail("Student A: start Silver", `status ${startSilver.status}`);
    return false;
  }
  checklist.pass("Student A: start Silver assessment");

  const submitSilver = await api.post(
    "/api/v1/me/assessments/SILVER_M1_M2/submit",
    buildSilverAssessmentSubmit(),
  );
  if (submitSilver.status !== 200 || !submitSilver.body.passed) {
    checklist.fail(
      "Student A: submit Silver",
      `status ${submitSilver.status} score ${submitSilver.body.scorePercent ?? "n/a"}`,
    );
    return false;
  }
  checklist.pass(`Student A: Silver passed (${submitSilver.body.scorePercent}%)`);

  const issue = await api.post("/api/v1/me/assessments/silver/issue");
  if (issue.status !== 201) {
    checklist.fail("Student A: issue Silver certificate", `status ${issue.status}`);
    return false;
  }
  checklist.pass(`Student A: Silver certificate ${issue.body.certificateNumber}`);
  return true;
}

async function runStudentBIsolation(api, checklist, studentACompletedMissions) {
  await api.login(QA_ACCOUNTS.studentB.email, QA_ACCOUNTS.studentB.password);
  checklist.pass("Student B: login");

  await completeFirstDay(api, checklist, "Student B");

  const startM1 = await api.post("/api/v1/me/missions/m1-m01-decouvrir-entreprise/start");
  if (startM1.status !== 200 && startM1.status !== 201) {
    checklist.fail("Student B: start M1-M01 (in progress for professor reset)", `status ${startM1.status}`);
    return false;
  }
  checklist.pass("Student B: start M1-M01 (in progress)");

  const lockedStart = await api.post("/api/v1/me/missions/m3-m01-identifier-besoin-achat/start");
  if (lockedStart.status !== 409) {
    checklist.fail("Student B: locked M3 start returns 409", `status ${lockedStart.status}`);
  } else {
    checklist.pass("Student B: locked M3 start returns 409");
  }

  const missions = await api.get("/api/v1/me/missions");
  const m3 = missions.body.missions?.find(
    (item) => item.missionKey === "m3-m01-identifier-besoin-achat",
  );
  if (!m3 || m3.status !== "locked") {
    checklist.fail("Student B: M3 remains locked", JSON.stringify(m3));
  } else {
    checklist.pass("Student B: M3 remains locked");
  }

  const studentAView = missions.body.missions?.filter((item) => item.status === "completed") ?? [];
  if (studentAView.length >= studentACompletedMissions) {
    checklist.fail(
      "Student B: isolation from Student A attempts",
      `Student B shows ${studentAView.length} completed missions`,
    );
  } else {
    checklist.pass("Student B: cannot see Student A completed attempts");
  }

  const professorProbe = await api.get("/api/v1/professor/students");
  if (professorProbe.status !== 403) {
    checklist.fail("Student B: professor endpoint forbidden", `status ${professorProbe.status}`);
  } else {
    checklist.pass("Student B: professor endpoint forbidden (403)");
  }

  return true;
}

async function runProfessorFlow(api, checklist, studentBId) {
  await api.login(QA_ACCOUNTS.professor.email, QA_ACCOUNTS.professor.password);
  checklist.pass("Professor: login");

  const cohorts = await api.get("/api/v1/professor/cohorts");
  if (cohorts.status !== 200) {
    checklist.fail("Professor: list cohorts", `status ${cohorts.status}`);
    return false;
  }
  const qaCohort = cohorts.body.cohorts?.find((item) => item.code === QA_COHORT_CODE);
  if (!qaCohort) {
    checklist.fail("Professor: QA-WAVE2 cohort visible");
    return false;
  }
  checklist.pass(`Professor: cohort ${QA_COHORT_CODE} (${qaCohort.studentCount} students)`);

  const students = await api.get("/api/v1/professor/students");
  if (students.status !== 200) {
    checklist.fail("Professor: list students", `status ${students.status}`);
    return false;
  }
  const studentA = students.body.students?.find(
    (item) => item.employeeNumber === QA_ACCOUNTS.studentA.employeeNumber,
  );
  const studentB = students.body.students?.find(
    (item) => item.employeeNumber === QA_ACCOUNTS.studentB.employeeNumber,
  );
  if (!studentA || !studentB) {
    checklist.fail("Professor: QA students listed");
    return false;
  }
  checklist.pass(
    `Professor: students listed (A completed=${studentA.completedMissions}, B completed=${studentB.completedMissions})`,
  );

  if (studentA.completedMissions < 18) {
    checklist.fail(
      "Professor: Student A mission count",
      `expected >= 18, got ${studentA.completedMissions}`,
    );
  } else {
    checklist.pass(`Professor: Student A completed ${studentA.completedMissions} missions`);
  }

  const release = await api.post(`/api/v1/professor/students/${studentBId}/override`, {
    action: "release_mission",
    missionKey: "m3-m01-identifier-besoin-achat",
    reason: "Smoke test — release mission for QA validation",
  });
  if (release.status !== 200) {
    checklist.fail("Professor: release mission override", `status ${release.status}`);
  } else {
    checklist.pass("Professor: release mission override");
  }

  const reset = await api.post(`/api/v1/professor/students/${studentBId}/override`, {
    action: "reset_attempt",
    missionKey: "m1-m01-decouvrir-entreprise",
    reason: "Smoke test — reset in-progress attempt for QA validation",
  });
  if (reset.status !== 200) {
    checklist.fail("Professor: reset attempt override", `status ${reset.status}`);
  } else {
    checklist.pass("Professor: reset attempt override");
  }

  const csv = await api.get("/api/v1/professor/export.csv");
  if (csv.status !== 200 || typeof csv.body !== "string") {
    checklist.fail("Professor: export CSV", `status ${csv.status}`);
  } else if (!csv.body.includes(QA_ACCOUNTS.studentA.employeeNumber)) {
    checklist.fail("Professor: export CSV contains Student A");
  } else {
    checklist.pass("Professor: export CSV");
  }

  if (studentA.silverStatus === "issued" || studentA.silverStatus === "eligible") {
    checklist.pass(`Professor: Student A silverStatus=${studentA.silverStatus}`);
  } else {
    checklist.fail("Professor: Student A silver status", studentA.silverStatus);
  }

  return true;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const databaseUrl = envOrDefault(
    "DATABASE_URL",
    "postgresql://tec:tec@127.0.0.1:5435/tec_erp_wave2",
  );
  const apiBaseUrl = envOrDefault("API_BASE_URL", "http://127.0.0.1:3000");
  process.env.DATABASE_URL = databaseUrl;

  console.log("Wave 2 runtime smoke");
  console.log(`  DATABASE_URL=${databaseUrl.replace(/:[^:@/]+@/, ":***@")}`);
  console.log(`  API_BASE_URL=${apiBaseUrl}`);

  const checklist = new SmokeChecklist();
  const client = getPrismaClient();
  const api = createApiClient(apiBaseUrl);

  try {
    const health = await fetch(`${apiBaseUrl}/health`);
    if (!health.ok) {
      checklist.fail("API health", `status ${health.status}`);
      checklist.printSummary();
      process.exitCode = 1;
      return;
    }
    checklist.pass("API health");
  } catch (error) {
    checklist.fail("API health", error instanceof Error ? error.message : String(error));
    checklist.printSummary();
    process.exitCode = 1;
    return;
  }

  await cleanupQaWave2(client);
  const seeded = await seedQaWave2(client);
  checklist.pass("QA seed (fresh)");

  const company = await client.company.findUnique({
    where: { code: NORDHABITAT_COMPANY.code },
  });
  if (!company) {
    checklist.fail("Company lookup", NORDHABITAT_COMPANY.code);
    checklist.printSummary();
    process.exitCode = 1;
    return;
  }

  const studentAOk = await runStudentAFlow(api, checklist);
  if (studentAOk) {
    await verifySimulationPostings(client, company.id, seeded.studentAId, checklist);
  }

  await runStudentBIsolation(api, checklist, 18);
  await runProfessorFlow(api, checklist, seeded.studentBId);

  const passed = checklist.printSummary();

  if (args.cleanup) {
    const cleanup = await cleanupQaWave2(client);
    console.log("\nCleanup complete.");
    console.log(`  employees: ${cleanup.deletedEmployees.join(", ") || "(none)"}`);
    console.log(`  cohorts: ${cleanup.deletedCohorts.join(", ") || "(none)"}`);
  }

  if (!passed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
