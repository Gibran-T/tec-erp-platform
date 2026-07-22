#!/usr/bin/env node
/**
 * Local Playwright UI smoke for HCM assessment (disposable QA accounts).
 * Logs in via API then injects tokens to avoid UI flakiness.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require(
  "C:/Projetos/Analyste_ERP_Processus_Affaires/.manus-logs/pw/node_modules/playwright",
);

const API = process.env.API_BASE_URL ?? "http://127.0.0.1:3010";
const WEB = process.env.WEB_BASE_URL ?? "http://127.0.0.1:5174";
const PASSWORD = "QaV2HcmAssess!2026";
const outDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../engineering/v2/hcm-assessment/evidence",
);
mkdirSync(outDir, { recursive: true });

async function apiLogin(email) {
  const response = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: PASSWORD }),
  });
  if (!response.ok) {
    throw new Error(`login failed for ${email}: ${response.status}`);
  }
  return response.json();
}

async function openAs(page, email) {
  const login = await apiLogin(email);
  await page.context().clearCookies();
  await page.addInitScript((tokens) => {
    window.localStorage.setItem("tec.erp.auth.tokens", JSON.stringify(tokens));
  }, login.tokens);
  await page.goto(`${WEB}/workspace/apps/evaluations`);
  await page.waitForTimeout(1200);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  let page = await browser.newPage();
  const checks = [];
  const record = (section, ok, detail) => {
    checks.push({ section, ok, detail });
    console.log(`${ok ? "PASS" : "FAIL"} [${section}] ${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
  };

  try {
    await openAs(page, "__qa_v2_hcm_assess_locked@nordhabitat.local");
    try {
      await page.waitForSelector('[data-testid="assessment-center-page"]', { timeout: 20000 });
    } catch (error) {
      const debugPath = join(outDir, "debug-locked.png");
      await page.screenshot({ path: debugPath, fullPage: true });
      writeFileSync(
        join(outDir, "debug-locked.html"),
        `URL=${page.url()}\n\n${await page.content()}`,
      );
      throw error;
    }
    const lockedReason = page.locator('[data-testid="assessment-lock-reason-HCM_M8"]');
    record("ui_locked_reason", (await lockedReason.count()) > 0, await lockedReason.first().textContent());
    record("ui_locked_no_start", (await page.locator('[data-testid="assessment-start-HCM_M8"]').count()) === 0, {});
    await page.screenshot({ path: join(outDir, "01-locked-learner.png"), fullPage: true });

    // New page context so init script tokens apply cleanly per persona.
    await page.close();
    page = await browser.newPage();
    await openAs(page, "__qa_v2_hcm_assess_eligible@nordhabitat.local");
    await page.waitForSelector('[data-testid="assessment-center-page"]', { timeout: 20000 });
    const startBtn = page.locator('[data-testid="assessment-start-HCM_M8"]');
    record("ui_eligible_start_visible", (await startBtn.count()) > 0, { count: await startBtn.count() });
    if ((await startBtn.count()) > 0) {
      await startBtn.click();
      await page.waitForSelector('[data-testid="assessment-question-panel"]', { timeout: 20000 });
      record("ui_question_panel", true, {});
      const options = page.locator('[data-testid^="assessment-option-"]');
      record("ui_options_render", (await options.count()) >= 4, { count: await options.count() });
      await options.first().click();
      await page.screenshot({ path: join(outDir, "02-eligible-questions.png"), fullPage: true });
    }

    await page.close();
    page = await browser.newPage();
    const profLogin = await apiLogin("__qa_v2_hcm_assess_prof_a@nordhabitat.local");
    await page.addInitScript((tokens) => {
      window.localStorage.setItem("tec.erp.auth.tokens", JSON.stringify(tokens));
    }, profLogin.tokens);
    await page.goto(`${WEB}/workspace/apps/portail-professeur`);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: join(outDir, "03-professor.png"), fullPage: true });
    record(
      "ui_professor_loaded",
      page.url().includes("portail-professeur") ||
        (await page.content()).toLowerCase().includes("professeur") ||
        (await page.content()).toLowerCase().includes("étudiant") ||
        (await page.content()).toLowerCase().includes("etudiant"),
      { url: page.url() },
    );

    await page.close();
    page = await browser.newPage();
    const adminLogin = await apiLogin("__qa_v2_hcm_assess_admin@nordhabitat.local");
    await page.addInitScript((tokens) => {
      window.localStorage.setItem("tec.erp.auth.tokens", JSON.stringify(tokens));
    }, adminLogin.tokens);
    await page.goto(`${WEB}/workspace/apps/administration`);
    await page.waitForSelector('[data-testid="admin-portal-page"]', { timeout: 20000 });
    const tab = page.locator('[data-testid="admin-tab-assessments"]');
    record("ui_admin_tab", (await tab.count()) > 0, { count: await tab.count() });
    if ((await tab.count()) > 0) {
      await tab.click();
      await page.waitForSelector('[data-testid="admin-assessments"]', { timeout: 10000 });
    }
    record("ui_admin_assessments", (await page.locator('[data-testid="admin-assessments"]').count()) > 0, {});
    await page.screenshot({ path: join(outDir, "04-admin-assessments.png"), fullPage: true });
  } finally {
    await browser.close();
  }

  const failed = checks.filter((item) => !item.ok).length;
  writeFileSync(join(outDir, "hcm-assessment-browser-smoke.json"), JSON.stringify({ checks, failed }, null, 2));
  console.log(JSON.stringify({ failed }, null, 2));
  if (failed > 0) process.exitCode = 1;
}

await main();
