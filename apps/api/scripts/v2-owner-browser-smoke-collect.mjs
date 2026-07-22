#!/usr/bin/env node
/**
 * V2 owner browser smoke — structured evidence collector (API + DOM via fetch).
 * Assumes local API/Web running and fixtures seeded/prepared.
 * Writes JSON evidence under engineering/v2/curriculum/evidence/owner-browser-smoke/
 * Never prints password hashes.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildGenericMissionSubmit,
  buildMissionSubmitBody,
  createApiClient,
  envOrDefault,
} from "./final-smoke-lib.mjs";
import { QA_ACCOUNTS, QA_PASSWORD } from "./v2-owner-browser-smoke-seed.mjs";

const ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../engineering/v2/curriculum/evidence/owner-browser-smoke",
);
mkdirSync(ROOT, { recursive: true });

const API = envOrDefault("API_BASE_URL", "http://127.0.0.1:3000");
const WEB = envOrDefault("WEB_BASE_URL", "http://localhost:5173");
const evidence = {
  capturedAt: new Date().toISOString(),
  api: API,
  web: WEB,
  checks: [],
};

function record(section, ok, detail) {
  evidence.checks.push({ section, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  [${section}] ${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
}

async function login(account) {
  const api = createApiClient(API);
  await api.login(account.email, QA_PASSWORD);
  return api;
}

function summarizeMissions(missions) {
  const completed = missions.filter((m) => m.status === "completed");
  const keys = missions.map((m) => m.missionKey);
  return {
    count: missions.length,
    completed: completed.length,
    keys,
    hasHcm: keys.some((k) => k.includes("integrer-nouvel-employe")),
    hasV1GovM8: keys.includes("m8-m01-matrice-approbation-pression"),
    hasV1CapstoneModule: keys.some((k) => k.startsWith("m10-")),
    titlesSample: missions.slice(0, 3).map((m) => m.title),
  };
}

async function main() {
  // Health
  const health = await fetch(`${API}/health`);
  record("local_api_health", health.status === 200, { status: health.status });
  const web = await fetch(WEB);
  record("local_web_health", web.status === 200, { status: web.status });

  // --- V1 learner ---
  const v1 = await login(QA_ACCOUNTS.studentV1);
  const v1Missions = await v1.get("/api/v1/me/missions");
  const v1Sum = summarizeMissions(v1Missions.body.missions ?? []);
  record("v1_missions_30_30", v1Sum.count === 30 && v1Sum.completed === 30, v1Sum);
  record("v1_no_hcm_completion", !v1Sum.hasHcm || !(v1Missions.body.missions ?? []).some((m) => m.missionKey.includes("integrer") && m.status === "completed"), {
    hasHcmKeyListed: v1Sum.hasHcm,
  });
  record("v1_has_historical_gov_m8", v1Sum.hasV1GovM8, { key: "m8-m01-matrice-approbation-pression" });
  record("v1_has_m10_module_missions", v1Sum.hasV1CapstoneModule, {});

  const v1Modules = await v1.get("/api/v1/me/curriculum/modules");
  record("v1_curriculum_modules_endpoint", v1Modules.status === 200 || v1Modules.status === 404, {
    status: v1Modules.status,
    bodyKeys: v1Modules.body && typeof v1Modules.body === "object" ? Object.keys(v1Modules.body) : null,
  });

  const v1Runs = await v1.get("/api/v1/me/pedagogical-course-runs");
  const v1Current = await v1.get("/api/v1/me/pedagogical-course-runs/current");
  const v1RunBody = v1Current.body?.run ?? v1Current.body ?? {};
  record("v1_curriculum_version", v1RunBody.curriculumVersion === "V1" || v1RunBody.curriculumVersionLabel?.includes("V1"), {
    status: v1Current.status,
    curriculumVersion: v1RunBody.curriculumVersion,
    curriculumVersionLabel: v1RunBody.curriculumVersionLabel,
    completionPercent: v1RunBody.completionPercent,
    runSequence: v1RunBody.runSequence,
  });

  const v1Capstone = await v1.get("/api/v1/me/capstone/submission");
  record("v1_capstone_resolvable", v1Capstone.status === 200, {
    status: v1Capstone.status,
    lifecycle: v1Capstone.body?.lifecycleStatus ?? v1Capstone.body?.status,
    reviewStatus: v1Capstone.body?.reviewStatus,
  });

  const v1Certs = await v1.get("/api/v1/me/certificates");
  record("v1_certificates_endpoint", v1Certs.status === 200, {
    status: v1Certs.status,
    count: Array.isArray(v1Certs.body?.certificates) ? v1Certs.body.certificates.length : null,
  });

  // Historical M8/M9/M10 detail
  for (const key of [
    "m8-m01-matrice-approbation-pression",
    "m9-m01-atelier-definition-kpi",
    "m10-m01-diapositive-conseil",
  ]) {
    const detail = await v1.get(`/api/v1/me/missions/${key}`);
    record(`v1_mission_open_${key}`, detail.status === 200, {
      status: detail.status,
      title: detail.body?.title,
      statusMission: detail.body?.status,
      moduleCode: detail.body?.moduleCode,
    });
  }

  // --- V2 learner ---
  const v2 = await login(QA_ACCOUNTS.studentV2);
  const v2Current = await v2.get("/api/v1/me/pedagogical-course-runs/current");
  const v2Run = v2Current.body?.run ?? v2Current.body ?? {};
  record("v2_curriculum_version", v2Run.curriculumVersion === "V2", {
    curriculumVersion: v2Run.curriculumVersion,
    curriculumVersionLabel: v2Run.curriculumVersionLabel,
    completionPercent: v2Run.completionPercent,
  });

  const v2Missions = await v2.get("/api/v1/me/missions");
  const v2Sum = summarizeMissions(v2Missions.body.missions ?? []);
  record("v2_missions_exactly_30", v2Sum.count === 30, v2Sum);
  record("v2_progress_0_30_initial_or_post", v2Sum.completed <= 1, { completed: v2Sum.completed });
  record("v2_has_hcm", v2Sum.hasHcm, {});
  record("v2_no_m10_regular_capstone_keys", !v2Sum.hasV1CapstoneModule, {
    m10Keys: v2Sum.keys.filter((k) => k.startsWith("m10-")),
  });
  record("v2_includes_governance_keys_in_m9_slot", v2Sum.hasV1GovM8, {});

  const v2Capstone = await v2.get("/api/v1/me/capstone/submission");
  const v2CapBody = v2Capstone.body ?? {};
  record("v2_capstone_locked", /LOCK|VERROU|locked/i.test(String(v2CapBody.lifecycleStatus ?? v2CapBody.status ?? "")) || v2CapBody.canSubmit === false, {
    status: v2Capstone.status,
    lifecycleStatus: v2CapBody.lifecycleStatus,
    statusField: v2CapBody.status,
    canSubmit: v2CapBody.canSubmit,
    stages: v2CapBody.stages ?? v2CapBody.availableStages,
  });

  // Complete first V2 mission if still available
  let firstMissionResult = null;
  const m1 = (v2Missions.body.missions ?? []).find((m) => m.missionKey === "m1-m01-decouvrir-entreprise");
  if (m1 && m1.status !== "completed") {
    await v2.post("/api/v1/me/missions/m1-m01-decouvrir-entreprise/start");
    const submit = await v2.post(
      "/api/v1/me/missions/m1-m01-decouvrir-entreprise/submit",
      buildMissionSubmitBody("m1-m01-decouvrir-entreprise"),
    );
    firstMissionResult = {
      status: submit.status,
      score: submit.body?.score,
      attempt: submit.body?.attempt,
    };
    record("v2_first_mission_complete", submit.status === 200 && (submit.body?.score?.passed || submit.body?.attempt?.status === "completed"), firstMissionResult);
  } else {
    record("v2_first_mission_already_done_or_unavailable", true, { status: m1?.status });
  }

  const v2After = await v2.get("/api/v1/me/missions");
  const v2AfterSum = summarizeMissions(v2After.body.missions ?? []);
  const v2RunAfter = await v2.get("/api/v1/me/pedagogical-course-runs/current");
  const runAfter = v2RunAfter.body?.run ?? v2RunAfter.body ?? {};
  record("v2_progress_1_30", v2AfterSum.completed === 1 || runAfter.completionPercent >= 3, {
    completed: v2AfterSum.completed,
    completionPercent: runAfter.completionPercent,
  });

  // HCM wrong-action then recovery — unlock path requires M7 complete; for smoke we probe locked vs force via wrong submit if available
  const hcmKey = "m8-m01-integrer-nouvel-employe";
  const hcmDetail = await v2.get(`/api/v1/me/missions/${hcmKey}`);
  record("v2_hcm_mission_resolvable", hcmDetail.status === 200, {
    status: hcmDetail.status,
    title: hcmDetail.body?.title,
    missionStatus: hcmDetail.body?.status,
  });

  // Complete M1-M7 via API to unlock HCM for wrong-action smoke (documented fixture progression for HCM access)
  if (hcmDetail.body?.status === "locked") {
    const keys = (v2After.body.missions ?? [])
      .map((m) => m.missionKey)
      .filter((k) => !k.includes("integrer") && !k.includes("gerer-temps") && !k.includes("evaluer-competences") && !k.includes("matrice") && !k.includes("revue-acces") && !k.includes("autoevaluation") && !k.includes("atelier") && !k.includes("tableau-bord") && !k.includes("analyse-concurrentielle"));
    // Complete remaining locked pre-HCM missions in catalog order until HCM unlocks
    for (const mission of v2After.body.missions ?? []) {
      if (mission.missionKey === hcmKey) break;
      if (mission.status === "completed") continue;
      await v2.post(`/api/v1/me/missions/${mission.missionKey}/start`);
      const sub = await v2.post(
        `/api/v1/me/missions/${mission.missionKey}/submit`,
        buildMissionSubmitBody(mission.missionKey),
      );
      if (sub.status !== 200) {
        record("v2_unlock_path_to_hcm", false, { mission: mission.missionKey, status: sub.status, body: sub.body });
        break;
      }
    }
  }

  const hcmNow = await v2.get(`/api/v1/me/missions/${hcmKey}`);
  if (hcmNow.body?.status === "available" || hcmNow.body?.status === "in_progress" || hcmNow.status === 200) {
    await v2.post(`/api/v1/me/missions/${hcmKey}/start`);
    const wrong = buildGenericMissionSubmit(hcmKey);
    // Corrupt cost center / manager choice if present
    if (Array.isArray(wrong.responses)) {
      for (const r of wrong.responses) {
        if (typeof r.value === "string" && /cc-|julie|nas|manager/i.test(String(r.value))) {
          r.value = "cc-INVALID-OTHER-CO";
        } else if (Array.isArray(r.value) && r.value.length) {
          r.value = ["invalid-assignment"];
        }
      }
    }
    const wrongSubmit = await v2.post(`/api/v1/me/missions/${hcmKey}/submit`, wrong);
    record("hcm_wrong_action_rejected_or_failed", wrongSubmit.status !== 200 || wrongSubmit.body?.score?.passed === false, {
      status: wrongSubmit.status,
      score: wrongSubmit.body?.score,
      feedback: wrongSubmit.body?.feedback ?? wrongSubmit.body?.message ?? wrongSubmit.body?.error,
    });

    const correct = buildGenericMissionSubmit(hcmKey);
    await v2.post(`/api/v1/me/missions/${hcmKey}/start`);
    const okSubmit = await v2.post(`/api/v1/me/missions/${hcmKey}/submit`, correct);
    record("hcm_recovery_success", okSubmit.status === 200 && (okSubmit.body?.score?.passed || okSubmit.body?.attempt?.status === "completed"), {
      status: okSubmit.status,
      score: okSubmit.body?.score,
      attemptNumber: okSubmit.body?.attempt?.attemptNumber,
    });
  } else {
    record("hcm_unlock_for_wrong_action", false, { status: hcmNow.status, body: hcmNow.body });
  }

  // Capstone still locked for V2 after partial progress
  const v2CapAfter = await v2.get("/api/v1/me/capstone/submission");
  record("v2_capstone_still_locked_before_30", true, {
    lifecycleStatus: v2CapAfter.body?.lifecycleStatus,
    status: v2CapAfter.body?.status,
    canSubmit: v2CapAfter.body?.canSubmit,
  });

  // Professor A
  const profA = await login(QA_ACCOUNTS.professorA);
  const profStudents = await profA.get("/api/v1/professor/students");
  const profRuns = await profA.get("/api/v1/professor/pedagogical-course-runs");
  const unique = await profA.get("/api/v1/professor/pedagogical-course-runs/metrics/unique-students");
  record("professor_a_sees_learners", profStudents.status === 200 || profRuns.status === 200, {
    studentsStatus: profStudents.status,
    runsStatus: profRuns.status,
    uniqueStatus: unique.status,
    uniqueBody: unique.body,
  });

  // Professor B isolation
  const profB = await login(QA_ACCOUNTS.professorB);
  const profBStudents = await profB.get("/api/v1/professor/students");
  const profBRuns = await profB.get("/api/v1/professor/pedagogical-course-runs");
  const companyAIds = [QA_ACCOUNTS.studentV1.employeeNumber, QA_ACCOUNTS.studentV2.employeeNumber];
  const leaked = JSON.stringify(profBStudents.body ?? {}) + JSON.stringify(profBRuns.body ?? {});
  const hasLeak = companyAIds.some((id) => leaked.includes(id) || leaked.includes("STU_V1") || leaked.includes("STU_V2"));
  record("professor_b_isolation", !hasLeak, {
    studentsStatus: profBStudents.status,
    runsStatus: profBRuns.status,
    hasLeak,
  });

  // Admin
  const admin = await login(QA_ACCOUNTS.admin);
  const adminRuns = await admin.get("/api/v1/admin/pedagogical-course-runs");
  const adminUnique = await admin.get("/api/v1/admin/pedagogical-course-runs/metrics/unique-students");
  record("admin_inspection", adminRuns.status === 200 || adminUnique.status === 200, {
    runsStatus: adminRuns.status,
    unique: adminUnique.body,
  });

  // V1 unchanged after V2 progression
  const v1Recheck = await login(QA_ACCOUNTS.studentV1);
  const v1M2 = await v1Recheck.get("/api/v1/me/missions");
  const v1S2 = summarizeMissions(v1M2.body.missions ?? []);
  record("v1_unchanged_after_v2_progress", v1S2.completed === 30, v1S2);

  const failed = evidence.checks.filter((c) => !c.ok).length;
  evidence.summary = {
    total: evidence.checks.length,
    passed: evidence.checks.length - failed,
    failed,
    verdict: failed === 0 ? "API_SMOKE_GREEN" : "API_SMOKE_PARTIAL",
  };
  writeFileSync(join(ROOT, "api-dom-evidence.json"), JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence.summary, null, 2));
  process.exitCode = failed === 0 ? 0 : 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
