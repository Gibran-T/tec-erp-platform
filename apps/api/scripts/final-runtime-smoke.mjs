#!/usr/bin/env node
/**
 * Final Wave (M7–M10 + Gold) local runtime smoke — expects API already running.
 *
 * Prerequisites:
 *   - PostgreSQL with migrations + demo seed (DATABASE_URL)
 *   - API listening at API_BASE_URL (default http://127.0.0.1:3000)
 *
 * Usage:
 *   node scripts/final-smoke-seed.mjs
 *   DATABASE_URL=... API_BASE_URL=... node scripts/final-runtime-smoke.mjs
 *   node scripts/final-runtime-smoke.mjs --cleanup
 *
 * Does NOT start the API server.
 */

import { getMissionByKey } from "@tec-platform/mission-catalog";
import { getPrismaClient } from "@tec-platform/database-erp";

import {
  AI_COACH_QUESTION,
  CAPSTONE_SUBMIT,
  EQUINOXE_QA_COMPANY,
  M1_M2_MISSION_COUNT,
  QA_ACCOUNTS,
  QA_COHORT_CODE,
  SmokeChecklist,
  TOTAL_MISSION_COUNT,
  assertMissionCatalogAlignment,
  completeFirstDay,
  completeMissionRange,
  createApiClient,
  envOrDefault,
  parseArgs,
  runGoldAssessment,
  runSilverAssessment,
} from "./final-smoke-lib.mjs";
import { cleanupQaFinal, seedQaFinal } from "./final-smoke-seed.mjs";

const QA_INTEGRATION_NAME = "QA Smoke Integration Final";

async function runAdminFlow(api, checklist) {
  await api.login(QA_ACCOUNTS.admin.email, QA_ACCOUNTS.admin.password);
  checklist.pass("Admin: login");

  const companies = await api.get("/api/v1/admin/companies");
  if (companies.status !== 200) {
    checklist.fail("Admin: list companies", `status ${companies.status}`);
    return null;
  }
  const codes = companies.body.companies?.map((item) => item.code) ?? [];
  if (!codes.includes("NORDHABITAT") || !codes.includes(EQUINOXE_QA_COMPANY.code)) {
    checklist.fail("Admin: companies include NORDHABITAT + EQUINOXE-QA", codes.join(", "));
    return null;
  }
  checklist.pass(`Admin: companies listed (${codes.length})`);

  const configBefore = await api.get("/api/v1/admin/configuration");
  if (configBefore.status !== 200) {
    checklist.fail("Admin: get configuration", `status ${configBefore.status}`);
    return null;
  }
  checklist.pass("Admin: get configuration");

  const toggleOff = await api.patch("/api/v1/admin/configuration", { aiEnabled: false });
  if (toggleOff.status !== 200 || toggleOff.body.aiEnabled !== false) {
    checklist.fail("Admin: toggle AI off", `status ${toggleOff.status}`);
    return null;
  }
  checklist.pass("Admin: toggle AI off");

  const toggleOn = await api.patch("/api/v1/admin/configuration", { aiEnabled: true });
  if (toggleOn.status !== 200 || toggleOn.body.aiEnabled !== true) {
    checklist.fail("Admin: toggle AI on", `status ${toggleOn.status}`);
    return null;
  }
  checklist.pass("Admin: toggle AI on");

  const missionKey = "m7-m01-ouvrir-dossier-client";
  const catalog = getMissionByKey(missionKey);
  const draft = await api.post("/api/v1/admin/scenarios/drafts", {
    missionKey,
    draftJson: catalog ? { title: `${catalog.title} (QA smoke draft)` } : { source: "smoke-final" },
  });
  if (draft.status !== 201) {
    checklist.fail("Admin: create scenario draft", `status ${draft.status}`);
    return null;
  }
  checklist.pass("Admin: create scenario draft");

  const publish = await api.post(`/api/v1/admin/scenarios/drafts/${draft.body.id}/publish`);
  if (publish.status !== 201) {
    checklist.fail("Admin: publish scenario", `status ${publish.status}`);
    return null;
  }
  checklist.pass(`Admin: publish scenario v${publish.body.versionNumber}`);

  const connection = await api.post("/api/v1/admin/integration/connections", {
    adapterKey: "mock-erp-sync",
    name: QA_INTEGRATION_NAME,
    configJson: { mode: "smoke-final" },
  });
  if (connection.status !== 201) {
    checklist.fail("Admin: create integration connection", `status ${connection.status}`);
    return null;
  }
  checklist.pass("Admin: create integration connection");

  const integrationRun = await api.post("/api/v1/admin/integration/run", {
    connectionId: connection.body.connection.id,
    idempotencyKey: `final-smoke-${Date.now()}`,
  });
  if (integrationRun.status !== 200) {
    checklist.fail("Admin: run integration", `status ${integrationRun.status}`);
    return null;
  }
  checklist.pass(`Admin: integration run ${integrationRun.body.status}`);

  const automation = await api.post("/api/v1/admin/automation/run", {
    ruleKey: "notify_professor_repeated_failure",
  });
  if (automation.status !== 200) {
    checklist.fail("Admin: run automation", `status ${automation.status}`);
    return null;
  }
  checklist.pass("Admin: run automation rule");

  return { draftId: draft.body.id, connectionId: connection.body.connection.id };
}

async function runStudentAFlow(api, checklist) {
  await api.login(QA_ACCOUNTS.studentA.email, QA_ACCOUNTS.studentA.password);
  checklist.pass("Student A: login");

  const firstDayOk = await completeFirstDay(api, checklist, "Student A");
  if (!firstDayOk) {
    return false;
  }

  const m1m2Ok = await completeMissionRange(api, checklist, 0, M1_M2_MISSION_COUNT);
  if (!m1m2Ok) {
    return false;
  }
  checklist.pass(`Student A: completed M1-M2 (${M1_M2_MISSION_COUNT} missions)`);

  const silverOk = await runSilverAssessment(api, checklist, "Student A");
  if (!silverOk) {
    return false;
  }

  const remainingOk = await completeMissionRange(
    api,
    checklist,
    M1_M2_MISSION_COUNT,
    TOTAL_MISSION_COUNT,
  );
  if (!remainingOk) {
    return false;
  }
  checklist.pass(`Student A: completed all ${TOTAL_MISSION_COUNT} missions`);

  const dashboards = await api.get("/api/v1/me/analytics/dashboards");
  if (dashboards.status !== 200 || (dashboards.body.dashboards?.length ?? 0) < 1) {
    checklist.fail("Student A: list dashboards", `status ${dashboards.status}`);
    return false;
  }
  checklist.pass(`Student A: dashboards (${dashboards.body.dashboards.length})`);

  const dashboardId = dashboards.body.dashboards[0]?.id;
  const kpis = await api.get(
    `/api/v1/me/analytics/kpis${dashboardId ? `?dashboardId=${encodeURIComponent(dashboardId)}` : ""}`,
  );
  if (kpis.status !== 200) {
    checklist.fail("Student A: KPI snapshot", `status ${kpis.status}`);
    return false;
  }
  checklist.pass("Student A: KPI snapshot");

  const coach = await api.post("/api/v1/me/ai-coach/ask", { question: AI_COACH_QUESTION });
  if (coach.status !== 200 || !coach.body.answer) {
    checklist.fail("Student A: AI coach ask", `status ${coach.status}`);
    return false;
  }
  checklist.pass("Student A: AI coach response");

  const capstone = await api.post("/api/v1/me/capstone/submission", CAPSTONE_SUBMIT);
  if (capstone.status !== 200 || capstone.body.status !== "submitted") {
    checklist.fail("Student A: capstone submit", `status ${capstone.status}`);
    return false;
  }
  checklist.pass("Student A: capstone submitted");

  const goldOk = await runGoldAssessment(api, checklist, "Student A");
  if (!goldOk) {
    return false;
  }

  return true;
}

async function runStudentBIsolation(api, checklist, equinoxeCompanyId) {
  await api.login(QA_ACCOUNTS.studentB.email, QA_ACCOUNTS.studentB.password);
  checklist.pass("Student B: login");

  await completeFirstDay(api, checklist, "Student B");

  const startM1 = await api.post("/api/v1/me/missions/m1-m01-decouvrir-entreprise/start");
  if (startM1.status !== 200 && startM1.status !== 201) {
    checklist.fail("Student B: start M1-M01", `status ${startM1.status}`);
    return false;
  }
  checklist.pass("Student B: start M1-M01 (in progress)");

  const lockedStart = await api.post("/api/v1/me/missions/m3-m01-identifier-besoin-achat/start");
  if (lockedStart.status !== 409) {
    checklist.fail("Student B: locked M3 start returns 409", `status ${lockedStart.status}`);
  } else {
    checklist.pass("Student B: locked M3 start returns 409");
  }

  const crossCompany = await api.get(
    `/api/v1/me/analytics/kpis?companyId=${encodeURIComponent(equinoxeCompanyId)}`,
  );
  if (crossCompany.status !== 403) {
    checklist.fail("Student B: cross-company KPI forbidden", `status ${crossCompany.status}`);
  } else {
    checklist.pass("Student B: cross-company KPI forbidden (403)");
  }

  const professorProbe = await api.get("/api/v1/professor/students");
  if (professorProbe.status !== 403) {
    checklist.fail("Student B: professor endpoint forbidden", `status ${professorProbe.status}`);
  } else {
    checklist.pass("Student B: professor endpoint forbidden (403)");
  }

  const adminProbe = await api.get("/api/v1/admin/companies");
  if (adminProbe.status !== 403) {
    checklist.fail("Student B: admin endpoint forbidden", `status ${adminProbe.status}`);
  } else {
    checklist.pass("Student B: admin endpoint forbidden (403)");
  }

  const missions = await api.get("/api/v1/me/missions");
  const studentACompleted =
    missions.body.missions?.filter((item) => item.status === "completed") ?? [];
  if (studentACompleted.length >= TOTAL_MISSION_COUNT) {
    checklist.fail(
      "Student B: isolation from Student A attempts",
      `Student B shows ${studentACompleted.length} completed missions`,
    );
  } else {
    checklist.pass("Student B: cannot see Student A completed attempts");
  }

  return true;
}

async function runProfessorFlow(api, apiBaseUrl, checklist, seeded) {
  await api.login(QA_ACCOUNTS.professor.email, QA_ACCOUNTS.professor.password);
  checklist.pass("Professor: login");

  const cohorts = await api.get("/api/v1/professor/cohorts");
  if (cohorts.status !== 200) {
    checklist.fail("Professor: list cohorts", `status ${cohorts.status}`);
    return null;
  }
  const qaCohort = cohorts.body.cohorts?.find((item) => item.code === QA_COHORT_CODE);
  if (!qaCohort) {
    checklist.fail("Professor: QA-FINAL cohort visible");
    return null;
  }
  checklist.pass(`Professor: cohort ${QA_COHORT_CODE} (${qaCohort.studentCount} students)`);

  const students = await api.get("/api/v1/professor/students");
  if (students.status !== 200) {
    checklist.fail("Professor: list students", `status ${students.status}`);
    return null;
  }
  const studentA = students.body.students?.find(
    (item) => item.employeeNumber === QA_ACCOUNTS.studentA.employeeNumber,
  );
  const studentB = students.body.students?.find(
    (item) => item.employeeNumber === QA_ACCOUNTS.studentB.employeeNumber,
  );
  if (!studentA || !studentB) {
    checklist.fail("Professor: QA students listed");
    return null;
  }
  checklist.pass(
    `Professor: students listed (A completed=${studentA.completedMissions}, B completed=${studentB.completedMissions})`,
  );

  if (studentA.completedMissions < TOTAL_MISSION_COUNT) {
    checklist.fail(
      "Professor: Student A mission count",
      `expected >= ${TOTAL_MISSION_COUNT}, got ${studentA.completedMissions}`,
    );
  } else {
    checklist.pass(`Professor: Student A completed ${studentA.completedMissions} missions`);
  }

  const detail = await api.get(`/api/v1/professor/students/${studentA.employeeId}`);
  if (detail.status !== 200) {
    checklist.fail("Professor: student detail", `status ${detail.status}`);
  } else {
    checklist.pass("Professor: student detail workflow");
  }

  const aiInteractions = await api.get("/api/v1/professor/ai-interactions");
  if (aiInteractions.status !== 200) {
    checklist.fail("Professor: AI interactions", `status ${aiInteractions.status}`);
  } else if ((aiInteractions.body.interactions?.length ?? 0) < 1) {
    checklist.fail("Professor: AI interactions visible", "none found");
  } else {
    checklist.pass(`Professor: AI interactions (${aiInteractions.body.interactions.length})`);
  }

  const predictions = await api.get(`/api/v1/professor/predictions/${studentA.employeeId}`);
  if (predictions.status !== 200 || !predictions.body.modelVersion) {
    checklist.fail("Professor: predictions", `status ${predictions.status}`);
  } else {
    checklist.pass(`Professor: predictions (${predictions.body.modelVersion})`);
  }

  const capstoneList = await api.get("/api/v1/professor/capstone/submissions");
  if (capstoneList.status !== 200) {
    checklist.fail("Professor: capstone submissions", `status ${capstoneList.status}`);
    return null;
  }
  const submission = capstoneList.body.submissions?.find(
    (item) => item.employeeId === seeded.studentAId,
  );
  if (!submission) {
    checklist.fail("Professor: Student A capstone submission listed");
    return null;
  }
  checklist.pass("Professor: capstone submission listed");

  const review = await api.post(
    `/api/v1/professor/capstone/submissions/${submission.id}/review`,
    {
      approved: true,
      notes: "Smoke test — capstone approuve pour eligibilite Gold.",
    },
  );
  if (review.status !== 200) {
    checklist.fail("Professor: capstone review", `status ${review.status}`);
    return null;
  }
  checklist.pass("Professor: capstone approved");

  const issueGold = await api.post("/api/v1/professor/certificates/gold/issue", {
    studentId: seeded.studentAId,
    reason: "Smoke test — emission certificat Gold apres parcours complet.",
    confirm: true,
  });
  if (issueGold.status !== 201) {
    checklist.fail("Professor: issue Gold", `status ${issueGold.status}`);
    return null;
  }
  const goldNumber = issueGold.body.certificateNumber;
  checklist.pass(`Professor: Gold issued ${goldNumber}`);

  const verifyValid = await fetch(
    `${apiBaseUrl}/api/v1/public/certificates/verify/${encodeURIComponent(goldNumber)}`,
  );
  const verifyValidBody = await verifyValid.json();
  if (verifyValid.status !== 200 || !verifyValidBody.found) {
    checklist.fail("Public verify: valid Gold certificate", `status ${verifyValid.status}`);
  } else {
    checklist.pass("Public verify: valid Gold certificate");
  }

  const revokeGold = await api.post(
    `/api/v1/professor/certificates/${encodeURIComponent(goldNumber)}/revoke-gold`,
    {
      reason: "Smoke test — revocation pedagogique Gold obligatoire.",
      confirm: true,
    },
  );
  if (revokeGold.status !== 200) {
    checklist.fail("Professor: revoke Gold", `status ${revokeGold.status}`);
  } else {
    checklist.pass("Professor: revoke Gold certificate");
  }

  const verifyRevoked = await fetch(
    `${apiBaseUrl}/api/v1/public/certificates/verify/${encodeURIComponent(goldNumber)}`,
  );
  const verifyRevokedBody = await verifyRevoked.json();
  if (verifyRevoked.status !== 200 || verifyRevokedBody.status !== "revoked") {
    checklist.fail("Public verify: revoked Gold certificate", JSON.stringify(verifyRevokedBody));
  } else {
    checklist.pass("Public verify: revoked Gold certificate");
  }

  const reissueGold = await api.post("/api/v1/professor/certificates/gold/issue", {
    studentId: seeded.studentAId,
    reason: "Smoke test — re-emission Gold apres revocation pedagogique.",
    confirm: true,
  });
  if (reissueGold.status !== 201) {
    checklist.fail("Professor: re-issue Gold", `status ${reissueGold.status}`);
  } else {
    checklist.pass(`Professor: Gold re-issued ${reissueGold.body.certificateNumber}`);
  }

  const csv = await api.get("/api/v1/professor/export.csv");
  if (csv.status !== 200 || typeof csv.body !== "string") {
    checklist.fail("Professor: export CSV", `status ${csv.status}`);
  } else if (!csv.body.includes(QA_ACCOUNTS.studentA.employeeNumber)) {
    checklist.fail("Professor: export CSV contains Student A");
  } else {
    checklist.pass("Professor: export CSV");
  }

  const audit = await api.get("/api/v1/professor/audit");
  if (audit.status === 200 && (audit.body.events?.length ?? 0) > 0) {
    checklist.pass("Professor: audit history visible");
  } else {
    checklist.fail("Professor: audit history");
  }

  return reissueGold.body.certificateNumber;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const databaseUrl = envOrDefault(
    "DATABASE_URL",
    "postgresql://tec:tec@127.0.0.1:5435/tec_erp_final",
  );
  const apiBaseUrl = envOrDefault("API_BASE_URL", "http://127.0.0.1:3000");
  process.env.DATABASE_URL = databaseUrl;

  console.log("Final Wave runtime smoke");
  console.log(`  DATABASE_URL=${databaseUrl.replace(/:[^:@/]+@/, ":***@")}`);
  console.log(`  API_BASE_URL=${apiBaseUrl}`);

  const checklist = new SmokeChecklist();
  const client = getPrismaClient();
  const api = createApiClient(apiBaseUrl);

  assertMissionCatalogAlignment(checklist);

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

  await cleanupQaFinal(client);
  const seeded = await seedQaFinal(client);
  checklist.pass("QA seed (fresh)");

  await runAdminFlow(api, checklist);
  await runStudentAFlow(api, checklist);
  await runStudentBIsolation(api, checklist, seeded.equinoxeCompanyId);

  const badVerify = await fetch(
    `${apiBaseUrl}/api/v1/public/certificates/verify/INVALID-SMOKE-TOKEN-404`,
  );
  if (badVerify.status !== 404) {
    checklist.fail("Public verify: invalid token returns 404", `status ${badVerify.status}`);
  } else {
    checklist.pass("Public verify: invalid token returns 404");
  }

  await runProfessorFlow(api, apiBaseUrl, checklist, seeded);

  const passed = checklist.printSummary();

  if (args.cleanup) {
    const cleanup = await cleanupQaFinal(client);
    console.log("\nCleanup complete.");
    console.log(`  employees: ${cleanup.deletedEmployees.join(", ") || "(none)"}`);
    console.log(`  cohorts: ${cleanup.deletedCohorts.join(", ") || "(none)"}`);
    console.log(`  EQUINOXE-QA removed: ${cleanup.deletedEquinoxe ? "yes" : "no"}`);
  }

  if (!passed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
