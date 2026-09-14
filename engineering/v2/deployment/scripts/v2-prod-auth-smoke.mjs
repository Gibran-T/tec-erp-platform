#!/usr/bin/env node
/**
 * Production-safe authenticated smoke for James + authorization probes.
 * Never prints passwords or tokens.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const API = "https://tec-erp-api-production.up.railway.app";
const WEB = "https://tec-erp-web-production.up.railway.app";
const OUT = "C:/Projetos/Analyste_ERP_Processus_Affaires/.ops-evidence/v2-prod-deploy";
mkdirSync(OUT, { recursive: true });

function fp(value) {
  return createHash("sha256").update(String(value ?? "")).digest("hex").slice(0, 12);
}

function loadCredentials() {
  const credPath =
    "C:/Projetos/Analyste_ERP_Processus_Affaires/.manus-logs/james-timothy-zero1-credentials.txt";
  if (!existsSync(credPath)) throw new Error("credential file missing");
  const text = readFileSync(credPath, "utf8");
  let email = null;
  let password = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(email|user|username|password)\s*[:=]\s*(.+)$/i);
    if (m) {
      const key = m[1].toLowerCase();
      const val = m[2].trim();
      if (key === "password") password = val;
      else email = val;
      continue;
    }
    if (!email && line.includes("@")) email = line;
    else if (email && !password) password = line;
  }
  if (!email || !password) throw new Error("credentials incomplete");
  return { email, password };
}

async function req(path, { method = "GET", token, body, expect } = {}) {
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  const row = {
    path,
    method,
    status: res.status,
    ok: expect ? expect.includes(res.status) : res.ok,
    bodyKeys: json && typeof json === "object" ? Object.keys(json).slice(0, 20) : [],
  };
  return { res, json, text, row };
}

const results = {
  capturedAt: new Date().toISOString(),
  checks: [],
};

const { email, password } = loadCredentials();
results.emailFp = fp(email);

// invalid login
{
  const { row } = await req("/api/v1/auth/login", {
    method: "POST",
    body: { email, password: "definitely-wrong-password" },
    expect: [401],
  });
  results.checks.push({ name: "invalid_login", ...row });
}

// James login
let accessToken = null;
{
  const { row, json } = await req("/api/v1/auth/login", {
    method: "POST",
    body: { email, password },
    expect: [200],
  });
  accessToken = json?.accessToken ?? json?.tokens?.accessToken ?? json?.data?.accessToken ?? null;
  results.checks.push({
    name: "james_login",
    ...row,
    hasAccessToken: Boolean(accessToken),
    tokenFp: accessToken ? fp(accessToken) : null,
  });
  if (!accessToken) {
    writeFileSync(`${OUT}/auth-smoke.json`, JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ ok: false, reason: "no_token", results }, null, 2));
    process.exit(1);
  }
}

const authed = [
  ["/api/v1/auth/session", [200]],
  ["/api/v1/me/course", [200]],
  ["/api/v1/me/missions", [200]],
  ["/api/v1/me/pedagogical-course-runs", [200]],
  ["/api/v1/me/capstone/submission", [200]],
  ["/api/v1/me/certificates", [200]],
  ["/api/v1/me/certificates/gold-eligibility", [200]],
  ["/api/v1/me/assessments", [200]],
];

let course = null;
let runs = null;
let assessments = null;
let gold = null;
let certificates = null;
let capstone = null;

for (const [path, expect] of authed) {
  const { row, json } = await req(path, { token: accessToken, expect });
  results.checks.push({ name: `auth_${path}`, ...row });
  if (path.endsWith("/course")) course = json;
  if (path.endsWith("/pedagogical-course-runs")) runs = json;
  if (path.endsWith("/assessments")) assessments = json;
  if (path.endsWith("/gold-eligibility")) gold = json;
  if (path.endsWith("/certificates")) certificates = json;
  if (path.endsWith("/submission")) capstone = json;
}

// Authorization denials
const denied = [
  ["/api/v1/professor/students", [401, 403]],
  ["/api/v1/professor/unique-students", [401, 403]],
  ["/api/v1/admin/employees", [401, 403]],
  ["/api/v1/admin/assessments/HCM_M8", [401, 403]],
];
for (const [path, expect] of denied) {
  const { row } = await req(path, { token: accessToken, expect });
  results.checks.push({ name: `deny_${path}`, ...row });
}
{
  const { row } = await req("/api/v1/me/course", { expect: [401] });
  results.checks.push({ name: "unauth_course", ...row });
}

// Summaries (no secrets)
const runList = Array.isArray(runs) ? runs : runs?.runs ?? runs?.data ?? [];
const assessmentList = Array.isArray(assessments)
  ? assessments
  : assessments?.assessments ?? assessments?.data ?? [];
const certList = Array.isArray(certificates)
  ? certificates
  : certificates?.certificates ?? certificates?.data ?? [];

results.summary = {
  coursePercent: course?.percentComplete ?? course?.progress?.percentComplete ?? null,
  curriculumVersion: course?.curriculumVersion ?? runList[0]?.curriculumVersion ?? null,
  runCount: runList.length,
  runCodes: runList.map((r) => r.runCode ?? r.code).filter(Boolean),
  runStatuses: runList.map((r) => r.status).filter(Boolean),
  assessmentCodes: assessmentList.map((a) => a.code ?? a.assessmentCode).filter(Boolean),
  hasHcmInLearnerAssessments: assessmentList.some(
    (a) => (a.code ?? a.assessmentCode) === "HCM_M8",
  ),
  certificateCount: certList.length,
  certificateStatuses: certList.map((c) => `${c.certificateType ?? c.type}:${c.status}`),
  capstoneStatus: capstone?.status ?? capstone?.submission?.status ?? null,
  capstoneReview: capstone?.reviewStatus ?? capstone?.submission?.reviewStatus ?? null,
  goldEligible: gold?.eligible ?? gold?.isEligible ?? null,
  goldReasonsSample: (gold?.reasons ?? []).slice(0, 5),
  answerKeyLeak: JSON.stringify(assessments ?? {}).includes("correctKeys"),
};

// Web probes
for (const path of ["/", "/login"]) {
  const res = await fetch(`${WEB}${path}`);
  results.checks.push({ name: `web_${path}`, status: res.status, ok: res.status === 200 });
}

const failed = results.checks.filter((c) => !c.ok);
results.ok = failed.length === 0;
writeFileSync(`${OUT}/auth-smoke.json`, JSON.stringify(results, null, 2));
console.log(
  JSON.stringify(
    {
      ok: results.ok,
      failed: failed.map((f) => f.name),
      summary: results.summary,
      checkCount: results.checks.length,
    },
    null,
    2,
  ),
);
process.exit(results.ok ? 0 : 1);
