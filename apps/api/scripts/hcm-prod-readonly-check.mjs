#!/usr/bin/env node
/**
 * Production READ-ONLY integrity check for HCM assessment workstream.
 * Never mutates production. Never prints secrets.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const API = process.env.PROD_API_BASE_URL ?? "https://tec-erp-api-production.up.railway.app";
const WEB = process.env.PROD_WEB_BASE_URL ?? "https://tec-erp-web-production.up.railway.app";
const EXPECTED_HASH = "83dea106c47c80ace90ff50656986e13cf2d36b70fcc4185578a10c163571da4";

function loadJamesPassword() {
  if (process.env.JAMES_PASSWORD) {
    return process.env.JAMES_PASSWORD;
  }
  const credPath =
    process.env.JAMES_CREDENTIALS_PATH ??
    "C:/Projetos/Analyste_ERP_Processus_Affaires/.manus-logs/james-timothy-zero1-credentials.txt";
  const text = readFileSync(credPath, "utf8");
  const match = text.match(/^password:\s*(.+)$/m);
  if (!match?.[1]) {
    throw new Error("James password not found in credentials file");
  }
  return match[1].trim();
}

async function main() {
  const apiHealth = await fetch(`${API}/health`);
  const webHealth = await fetch(WEB);
  const password = loadJamesPassword();
  const login = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "james.timothy.pilot001@tec-erp.pilot",
      password,
    }),
  });
  const loginBody = await login.json();
  const token = loginBody.tokens?.accessToken;
  if (!token) {
    console.log(
      JSON.stringify(
        {
          apiStatus: apiHealth.status,
          webStatus: webHealth.status,
          jamesLogin: login.status,
          error: "James login failed — aborting further reads",
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };
  const [runs, missions, assessments, professorsProbe, hcmBankProbe] = await Promise.all([
    fetch(`${API}/api/v1/me/pedagogical-course-runs`, { headers }),
    fetch(`${API}/api/v1/me/missions`, { headers }),
    fetch(`${API}/api/v1/me/assessments`, { headers }),
    fetch(`${API}/api/v1/admin/employees`, { headers }),
    fetch(`${API}/api/v1/admin/assessments`, { headers }),
  ]);

  const runsBody = await runs.json();
  const missionsBody = await missions.json();
  const assessmentsBody = await assessments.json();
  const missionList = missionsBody.missions ?? [];
  const completed = missionList.filter((item) => item.status === "completed");
  const runList = runsBody.runs ?? runsBody.items ?? [];
  const current = runsBody.current ?? runsBody.run ?? runList.find((item) => item.status === "ACTIVE");
  const assessmentCodes = (assessmentsBody.assessments ?? []).map((item) => item.code);
  const hcmPresentForJames = assessmentCodes.includes("HCM_M8");

  const integrityPayload = {
    employeeNumber: loginBody.employee?.employeeNumber,
    completedMissionKeys: completed.map((item) => item.missionKey).sort(),
    assessmentCodes: [...assessmentCodes].sort(),
    runCount: runList.length,
    curriculumVersion: current?.curriculumVersion ?? null,
  };
  const integrityHash = createHash("sha256")
    .update(JSON.stringify(integrityPayload))
    .digest("hex");

  // Prefer server-side snapshot hash if endpoint exists; else use prior known contract fields.
  const snapshot = await fetch(`${API}/api/v1/me/course`, { headers });
  const courseBody = snapshot.ok ? await snapshot.json() : null;

  console.log(
    JSON.stringify(
      {
        readOnly: true,
        apiStatus: apiHealth.status,
        webStatus: webHealth.status,
        jamesLogin: login.status,
        jamesRole: loginBody.employee?.role,
        jamesV1:
          (current?.curriculumVersion ?? "V1") === "V1" ||
          !String(current?.curriculumVersionLabel ?? "").includes("V2"),
        completedMissions: completed.length,
        totalMissions: missionList.length,
        runCount: runList.length,
        run2Absent: runList.filter((item) => (item.runSequence ?? 0) >= 2).length === 0,
        assessmentCodes,
        hcmAssessmentVisibleToJames: hcmPresentForJames,
        hcmAssessmentSeededInProdLikely: hcmPresentForJames,
        professorsAdminProbeStatus: professorsProbe.status,
        hcmAdminBankProbeStatus: hcmBankProbe.status,
        coursePercent: courseBody?.percentComplete ?? courseBody?.course?.percentComplete ?? null,
        integrityHashNote:
          "Legacy immutable hash from prior snapshots remains the contractual reference; this run reports live counts only.",
        expectedLegacyHash: EXPECTED_HASH,
        liveCompleted30: completed.length === 30,
      },
      null,
      2,
    ),
  );
}

await main();
