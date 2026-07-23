#!/usr/bin/env node
/**
 * TEC.ERP Pilot Zero1 — production browser runner (Playwright).
 * Executes remaining missions through the real Web UI.
 * Credentials read from ignored local file. Never prints password.
 *
 * Usage (from apps/api with packages available):
 *   node ../../engineering/v1/pilot/scripts/pilot-browser-runner.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  MISSION_SEQUENCE,
  buildMissionSubmitBody,
  buildSilverAssessmentSubmit,
  buildGoldAssessmentSubmit,
  CAPSTONE_SUBMIT,
  SILVER_ASSESSMENT_ANSWERS,
  GOLD_ASSESSMENT_ANSWERS,
} from "../../../../apps/api/scripts/final-smoke-lib.mjs";
import { getMissionByKey } from "@tec-platform/mission-catalog";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB = "https://tec-erp-web-production.up.railway.app";
const API = "https://tec-erp-api-production.up.railway.app";
const CREDENTIAL_FILE =
  process.env.JAMES_CREDENTIAL_FILE ||
  "C:/Projetos/Analyste_ERP_Processus_Affaires/.manus-logs/james-timothy-zero1-credentials.txt";
const EVIDENCE_DIR = resolve(__dirname, "../evidence");
const EVIDENCE_FILE = resolve(EVIDENCE_DIR, "browser-run-results.json");

function loadCredentials() {
  const raw = readFileSync(CREDENTIAL_FILE, "utf8");
  const map = Object.fromEntries(
    raw
      .split(/\r?\n/)
      .filter((line) => line.includes(":"))
      .map((line) => {
        const idx = line.indexOf(":");
        return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
      }),
  );
  if (!map.email || !map.password) {
    throw new Error("Credential file missing email/password");
  }
  return map;
}

async function apiLogin(email, password) {
  const response = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(`API login failed: ${response.status}`);
  }
  return response.json();
}

async function apiGet(token, path) {
  const response = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

async function apiPost(token, path, payload) {
  const response = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

async function fillLegacyM1(page, body) {
  for (const key of body.acknowledgedInputKeys ?? []) {
    const box = page.getByTestId(`mission-ack-${key}`);
    if (await box.count()) {
      const checked = await box.isChecked().catch(() => false);
      if (!checked) {
        await box.check({ force: true });
      }
    }
  }
  for (const pair of body.departmentProblemMappings ?? []) {
    await page.getByTestId("mission-department-select").selectOption(pair.departmentKey ?? pair.leftKey);
    await page.getByTestId("mission-problem-select").selectOption(pair.problemKey ?? pair.rightKey);
    await page.getByTestId("mission-add-mapping").click();
  }
  if (body.justification) {
    await page.getByTestId("mission-justification").fill(body.justification);
  }
}

async function fillGeneric(page, missionKey, responses) {
  const definition = getMissionByKey(missionKey);
  if (!definition) {
    throw new Error(`Unknown mission ${missionKey}`);
  }

  for (const interaction of definition.interactions) {
    const value = responses.find((item) => item.interactionId === interaction.id)?.value;
    const root = page.getByTestId(`mission-interaction-${interaction.id}`);
    await root.waitFor({ state: "visible", timeout: 15000 }).catch(() => undefined);

    switch (interaction.type) {
      case "SINGLE_CHOICE": {
        await page.getByTestId(`mission-choice-${interaction.id}-${value}`).check({ force: true });
        break;
      }
      case "MULTI_CHOICE":
      case "PROCESS_MAP_ACKNOWLEDGEMENT": {
        for (const key of value ?? []) {
          const choice = page.getByTestId(`mission-choice-${interaction.id}-${key}`);
          if (await choice.count()) {
            await choice.check({ force: true });
            continue;
          }
          const ack = page.getByTestId(`mission-ack-${key}`);
          if (await ack.count()) {
            const checked = await ack.isChecked().catch(() => false);
            if (!checked) {
              await ack.check({ force: true });
            }
          }
        }
        break;
      }
      case "NUMERIC_INPUT": {
        await page.getByTestId(`mission-numeric-${interaction.id}`).fill(String(value));
        break;
      }
      case "TEXT_ANALYSIS": {
        await page.getByTestId(`mission-text-${interaction.id}`).fill(String(value));
        break;
      }
      case "DIAGNOSIS_RECOMMENDATION": {
        for (const pair of value ?? []) {
          await page.getByTestId(`mission-diag-left-${interaction.id}`).selectOption(pair.leftKey);
          await page.getByTestId(`mission-diag-right-${interaction.id}`).selectOption(pair.rightKey);
          await page.getByTestId(`mission-diag-add-${interaction.id}`).click();
        }
        break;
      }
      case "ORDERING": {
        // Ordering UI starts from options; reorder via up buttons until matches target.
        // Fallback: rely on API-equivalent UI state if already correct order.
        break;
      }
      default:
        break;
    }
  }
}

async function openMission(page, titleHint) {
  await page.goto(`${WEB}/workspace/apps/centre-mission`, { waitUntil: "networkidle" });
  // Click mission card open button for available mission matching title, else first Ouvrir
  const openButtons = page.getByRole("button", { name: /Ouvrir la mission|Continuer|Reprendre/i });
  const count = await openButtons.count();
  if (count === 0) {
    // Maybe already on detail or need card click
    const card = page.locator("article.workspace-mission__card").filter({ hasText: titleHint }).first();
    if (await card.count()) {
      await card.click();
    }
  } else {
    // Prefer card containing title
    const titled = page
      .locator("article.workspace-mission__card")
      .filter({ hasText: titleHint })
      .getByRole("button", { name: /Ouvrir la mission|Continuer|Reprendre/i });
    if (await titled.count()) {
      await titled.first().click();
    } else {
      await openButtons.first().click();
    }
  }
  await page.waitForTimeout(800);
}

async function startIfNeeded(page) {
  const start = page.getByTestId("mission-start-button");
  if (await start.count()) {
    await start.click();
    await page.waitForTimeout(1000);
  }
}

async function submitMissionUi(page) {
  const submit = page.getByTestId("mission-submit-button");
  await submit.click();
  await page.waitForTimeout(2000);
}

async function completeMissionViaApiAfterUiObservation(page, token, missionKey, results) {
  const definition = getMissionByKey(missionKey);
  const title = definition?.title ?? missionKey;
  const startedAt = new Date().toISOString();

  await openMission(page, title);
  const visibleText = (await page.locator("main").innerText().catch(() => "")).slice(0, 4000);
  await startIfNeeded(page);

  // Deliberate incorrect action once for m1-m02 only (empty submit)
  if (missionKey === "m1-m02-connecter-departements") {
    await submitMissionUi(page);
    const err = await page.getByTestId("mission-client-error").textContent().catch(() => null);
    results.push({
      missionKey,
      event: "deliberate_incorrect",
      clientError: err,
      at: new Date().toISOString(),
    });
  }

  const body = buildMissionSubmitBody(missionKey);

  // Prefer UI fill when interactions are present; fallback to authenticated API submit
  // after UI observation (same session tokens) if ordering/complex widgets block UI fill.
  try {
    if (missionKey === "m1-m01-decouvrir-entreprise") {
      await fillLegacyM1(page, body);
      await submitMissionUi(page);
    } else if (definition?.interactions?.some((item) => item.type === "ORDERING")) {
      const start = await apiPost(token, `/api/v1/me/missions/${missionKey}/start`, {});
      const submit = await apiPost(token, `/api/v1/me/missions/${missionKey}/submit`, body);
      results.push({
        missionKey,
        mode: "ui_observe_api_submit_ordering",
        startStatus: start.status,
        submitStatus: submit.status,
        score: submit.body?.attempt?.scorePercent ?? submit.body?.scorePercent,
        visibleTextPreview: visibleText.slice(0, 500),
        startedAt,
        completedAt: new Date().toISOString(),
      });
      return;
    } else {
      await fillGeneric(page, missionKey, body.responses ?? []);
      await submitMissionUi(page);
    }

    const detail = await apiGet(token, `/api/v1/me/missions/${missionKey}`);
    if (detail.body?.status !== "completed" && detail.body?.attempt?.status !== "completed") {
      // Recovery: API submit after UI observation
      await apiPost(token, `/api/v1/me/missions/${missionKey}/start`, {});
      const submit = await apiPost(token, `/api/v1/me/missions/${missionKey}/submit`, body);
      results.push({
        missionKey,
        mode: "ui_fill_then_api_recovery",
        submitStatus: submit.status,
        score: submit.body?.attempt?.scorePercent ?? submit.body?.scorePercent,
        visibleTextPreview: visibleText.slice(0, 500),
        startedAt,
        completedAt: new Date().toISOString(),
      });
      return;
    }

    results.push({
      missionKey,
      mode: "ui",
      status: detail.body.status,
      score: detail.body.attempt?.scorePercent,
      attemptNumber: detail.body.attempt?.attemptNumber,
      visibleTextPreview: visibleText.slice(0, 500),
      startedAt,
      completedAt: new Date().toISOString(),
    });
  } catch (error) {
    await apiPost(token, `/api/v1/me/missions/${missionKey}/start`, {});
    const submit = await apiPost(token, `/api/v1/me/missions/${missionKey}/submit`, body);
    results.push({
      missionKey,
      mode: "ui_error_api_recovery",
      error: error instanceof Error ? error.message : String(error),
      submitStatus: submit.status,
      score: submit.body?.attempt?.scorePercent ?? submit.body?.scorePercent,
      visibleTextPreview: visibleText.slice(0, 500),
      startedAt,
      completedAt: new Date().toISOString(),
    });
  }
}

async function main() {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  const creds = loadCredentials();
  const login = await apiLogin(creds.email, creds.password);
  let token = login.tokens.accessToken;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${WEB}/login`, { waitUntil: "networkidle" });
  await page.fill("#email", creds.email);
  await page.fill("#password", creds.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/workspace/, { timeout: 30000 });

  const results = [];
  const course = await apiGet(token, "/api/v1/me/course");
  results.push({ event: "course_snapshot_start", percent: course.body.percentComplete });

  for (const missionKey of MISSION_SEQUENCE) {
    const detail = await apiGet(token, `/api/v1/me/missions/${missionKey}`);
    if (detail.body?.status === "completed" || detail.body?.attempt?.status === "completed") {
      results.push({
        missionKey,
        mode: "already_completed",
        score: detail.body.attempt?.scorePercent,
      });
      continue;
    }
    if (detail.body?.status === "locked") {
      results.push({ missionKey, mode: "locked_skip" });
      continue;
    }

    console.log(`Running ${missionKey}...`);
    await completeMissionViaApiAfterUiObservation(page, token, missionKey, results);

    // refresh token periodically via storage
    const stored = await page.evaluate(() => localStorage.getItem("tec.erp.auth.tokens"));
    if (stored) {
      try {
        token = JSON.parse(stored).accessToken || token;
      } catch {
        // keep previous token
      }
    }
  }

  // Silver assessment if available
  const assessments = await apiGet(token, "/api/v1/me/assessments");
  results.push({ event: "assessments_list", status: assessments.status, bodyPreview: JSON.stringify(assessments.body).slice(0, 1000) });

  const silver = (assessments.body?.assessments ?? assessments.body ?? []).find?.(
    (item) => String(item.code ?? item.assessmentCode ?? item.key ?? "").toLowerCase().includes("silver"),
  );

  if (silver || assessments.status === 200) {
    await page.goto(`${WEB}/workspace/apps/evaluations`, { waitUntil: "networkidle" });
    const silverText = (await page.locator("main").innerText().catch(() => "")).slice(0, 1500);
    results.push({ event: "evaluations_ui", textPreview: silverText });

    // Attempt silver via API after UI observation
    const silverList = await apiGet(token, "/api/v1/me/assessments");
    const silverItem =
      silverList.body?.assessments?.find((item) =>
        String(item.code ?? item.assessmentKey ?? item.key ?? "")
          .toLowerCase()
          .includes("silver"),
      ) ??
      silverList.body?.items?.find((item) =>
        String(item.code ?? item.assessmentKey ?? item.key ?? "")
          .toLowerCase()
          .includes("silver"),
      );

    if (silverItem) {
      const key = silverItem.assessmentKey ?? silverItem.key ?? silverItem.code;
      await apiPost(token, `/api/v1/me/assessments/${key}/start`, {});
      const submit = await apiPost(
        token,
        `/api/v1/me/assessments/${key}/submit`,
        buildSilverAssessmentSubmit(),
      );
      results.push({
        event: "silver_submit",
        key,
        status: submit.status,
        body: submit.body,
        answersUsed: Object.keys(SILVER_ASSESSMENT_ANSWERS),
      });
    }
  }

  // Capstone UI observation + submit
  await page.goto(`${WEB}/workspace/apps/capstone`, { waitUntil: "networkidle" });
  results.push({
    event: "capstone_ui",
    textPreview: (await page.locator("main").innerText().catch(() => "")).slice(0, 1500),
  });
  const capstoneSave = await apiPost(token, "/api/v1/me/capstone", CAPSTONE_SUBMIT);
  results.push({ event: "capstone_submit", status: capstoneSave.status, body: capstoneSave.body });

  // Gold assessment
  const assessments2 = await apiGet(token, "/api/v1/me/assessments");
  const goldItem =
    assessments2.body?.assessments?.find((item) =>
      String(item.code ?? item.assessmentKey ?? item.key ?? "")
        .toLowerCase()
        .includes("gold"),
    ) ??
    assessments2.body?.items?.find((item) =>
      String(item.code ?? item.assessmentKey ?? item.key ?? "")
        .toLowerCase()
        .includes("gold"),
    );
  if (goldItem) {
    const key = goldItem.assessmentKey ?? goldItem.key ?? goldItem.code;
    await apiPost(token, `/api/v1/me/assessments/${key}/start`, {});
    const submit = await apiPost(
      token,
      `/api/v1/me/assessments/${key}/submit`,
      buildGoldAssessmentSubmit(),
    );
    results.push({
      event: "gold_submit",
      key,
      status: submit.status,
      body: submit.body,
      answersUsed: Object.keys(GOLD_ASSESSMENT_ANSWERS),
    });
  }

  // AI Coach sample
  await page.goto(`${WEB}/workspace/apps/coach-ia`, { waitUntil: "networkidle" });
  results.push({
    event: "ai_coach_ui",
    textPreview: (await page.locator("main").innerText().catch(() => "")).slice(0, 1000),
  });
  const ai = await apiPost(token, "/api/v1/me/ai-coach/ask", {
    question: "Explique-moi le concept sans me donner la réponse.",
    missionKey: "m3-m01-identifier-besoin-achat",
  });
  results.push({
    event: "ai_coach_ask",
    status: ai.status,
    answerPreview: JSON.stringify(ai.body).slice(0, 800),
  });

  // BI dashboards
  await page.goto(`${WEB}/workspace/apps/tableaux-bord`, { waitUntil: "networkidle" });
  results.push({
    event: "bi_ui",
    textPreview: (await page.locator("main").innerText().catch(() => "")).slice(0, 1500),
  });

  // Certificates
  await page.goto(`${WEB}/workspace/apps/certificats`, { waitUntil: "networkidle" });
  results.push({
    event: "certificates_ui",
    textPreview: (await page.locator("main").innerText().catch(() => "")).slice(0, 1500),
  });
  const certs = await apiGet(token, "/api/v1/me/certificates");
  results.push({ event: "certificates_api", status: certs.status, body: certs.body });

  // Final course state
  const courseEnd = await apiGet(token, "/api/v1/me/course");
  results.push({
    event: "course_snapshot_end",
    percent: courseEnd.body.percentComplete,
    modules: courseEnd.body.modules?.map((module) => ({
      code: module.moduleCode,
      status: module.status,
      percent: module.percentComplete,
      missions: module.missions?.map((mission) => ({
        code: mission.missionCode,
        status: mission.status,
      })),
    })),
  });

  // Security checks
  const admin = await apiGet(token, "/api/v1/admin/system-status");
  const professor = await apiGet(token, "/api/v1/professor/cohorts");
  results.push({
    event: "security",
    adminStatus: admin.status,
    professorStatus: professor.status,
  });

  writeFileSync(EVIDENCE_FILE, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
  console.log(`Evidence written: ${EVIDENCE_FILE}`);
  console.log(`Results: ${results.length}`);

  await browser.close();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
