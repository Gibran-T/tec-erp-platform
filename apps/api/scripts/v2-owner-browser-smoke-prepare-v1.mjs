#!/usr/bin/env node
/**
 * Prepare V1 learner historical state for TEC.ERP V2 owner browser smoke.
 *
 * Logs in as the seeded V1 student, completes first-day onboarding, all 30 V1
 * missions, and optionally submits Capstone when unlocked. Does not create Run 2
 * or issue Gold certificates.
 *
 * Prerequisites:
 *   - API listening at API_BASE_URL (default http://127.0.0.1:3000)
 *   - v2-owner-browser-smoke-seed.mjs applied to the same database
 *
 * Env:
 *   API_BASE_URL
 *   QA_V2_OWNER_SMOKE_STU_V1_EMAIL (default from seed)
 *   QA_V2_OWNER_SMOKE_PASSWORD (default QaV2OwnerSmoke!2026)
 *
 * Usage:
 *   node scripts/v2-owner-browser-smoke-prepare-v1.mjs
 */

import { fileURLToPath } from "node:url";

import {
  CAPSTONE_SUBMIT,
  MISSION_SEQUENCE,
  completeAllMissions,
  completeFirstDay,
  createApiClient,
  envOrDefault,
} from "./final-smoke-lib.mjs";
import { QA_ACCOUNTS, QA_PASSWORD } from "./v2-owner-browser-smoke-seed.mjs";

class PrepareChecklist {
  /** @param {string} label */
  pass(label) {
    this.results.push({ label, ok: true });
    console.log(`  PASS  ${label}`);
  }

  /** @param {string} label @param {string} [detail] */
  fail(label, detail) {
    this.results.push({ label, ok: false, detail });
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }

  constructor() {
    this.results = [];
  }

  get passedCount() {
    return this.results.filter((item) => item.ok).length;
  }

  get failedCount() {
    return this.results.length - this.passedCount;
  }

  printSummary() {
    console.log("\n=== V2 Owner Smoke — V1 Prepare Summary ===");
    console.log(
      `Total: ${this.results.length}  Passed: ${this.passedCount}  Failed: ${this.failedCount}`,
    );
    console.log(`Missions in sequence: ${MISSION_SEQUENCE.length}`);
    if (this.failedCount > 0) {
      console.log("\nFailures:");
      for (const item of this.results.filter((entry) => !entry.ok)) {
        console.log(`  - ${item.label}${item.detail ? `: ${item.detail}` : ""}`);
      }
    }
    console.log(this.failedCount === 0 ? "\nRESULT: PASS" : "\nRESULT: FAIL");
    return this.failedCount === 0;
  }
}

/**
 * @param {ReturnType<typeof createApiClient>} api
 * @param {PrepareChecklist} checklist
 */
async function maybeSubmitCapstone(api, checklist) {
  const current = await api.get("/api/v1/me/capstone/submission");
  if (current.status !== 200) {
    checklist.fail("Capstone: read status", `status ${current.status}`);
    return false;
  }

  const lifecycleStatus = current.body.lifecycleStatus;
  if (lifecycleStatus === "LOCKED") {
    checklist.pass("Capstone: skipped (locked)");
    return true;
  }

  if (current.body.status === "submitted" || lifecycleStatus === "SUBMITTED") {
    checklist.pass("Capstone: already submitted");
    return true;
  }

  const submit = await api.post("/api/v1/me/capstone/submission", CAPSTONE_SUBMIT);
  if (submit.status !== 200 || submit.body.status !== "submitted") {
    checklist.fail(
      "Capstone: submit",
      `status ${submit.status} lifecycle ${submit.body.lifecycleStatus ?? lifecycleStatus}`,
    );
    return false;
  }

  checklist.pass("Capstone: submitted");
  return true;
}

async function main() {
  const apiBaseUrl = envOrDefault("API_BASE_URL", "http://127.0.0.1:3000");
  const email = envOrDefault("QA_V2_OWNER_SMOKE_STU_V1_EMAIL", QA_ACCOUNTS.studentV1.email);
  const password = envOrDefault("QA_V2_OWNER_SMOKE_PASSWORD", QA_PASSWORD);

  console.log("V2 owner browser smoke — prepare V1 learner");
  console.log(`  API_BASE_URL=${apiBaseUrl}`);
  console.log(`  student=${email}`);

  const checklist = new PrepareChecklist();
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

  await api.login(email, password);
  checklist.pass("V1 student: login");

  const firstDayOk = await completeFirstDay(api, checklist, "V1 student");
  if (!firstDayOk) {
    checklist.printSummary();
    process.exitCode = 1;
    return;
  }

  const missionsOk = await completeAllMissions(api, checklist);
  if (!missionsOk) {
    checklist.printSummary();
    process.exitCode = 1;
    return;
  }
  checklist.pass(`V1 student: completed all ${MISSION_SEQUENCE.length} missions`);

  await maybeSubmitCapstone(api, checklist);

  const missions = await api.get("/api/v1/me/missions");
  const completedCount =
    missions.status === 200
      ? (missions.body.missions?.filter((item) => item.status === "completed") ?? []).length
      : 0;
  if (missions.status === 200) {
    checklist.pass(`V1 student: ${completedCount} missions marked completed`);
  } else {
    checklist.fail("V1 student: mission summary", `status ${missions.status}`);
  }

  const passed = checklist.printSummary();
  if (!passed) {
    process.exitCode = 1;
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
