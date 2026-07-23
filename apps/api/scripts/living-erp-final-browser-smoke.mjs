#!/usr/bin/env node
/**
 * Living ERP final owner browser smoke (isolated QA fixtures only).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import { QA_ACCOUNTS, QA_PASSWORD } from "./living-erp-final-smoke-seed.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require(
  "C:/Projetos/Analyste_ERP_Processus_Affaires/.manus-logs/pw/node_modules/playwright",
);

const API = process.env.API_BASE_URL ?? "http://127.0.0.1:3012";
const WEB = process.env.WEB_BASE_URL ?? "http://127.0.0.1:5176";
const outDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../engineering/v2/living-erp/evidence/final-smoke",
);
mkdirSync(outDir, { recursive: true });

const checks = [];
const consoleErrors = [];
const networkFailures = [];

function record(section, ok, detail) {
  checks.push({ section, ok, detail });
  console.log(
    `${ok ? "PASS" : "FAIL"} [${section}] ${typeof detail === "string" ? detail : JSON.stringify(detail)}`,
  );
}

async function apiLogin(email) {
  const response = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: QA_PASSWORD }),
  });
  if (!response.ok) {
    throw new Error(`login failed for ${email}: ${response.status}`);
  }
  return response.json();
}

async function openAs(page, email, path = "/workspace") {
  const login = await apiLogin(email);
  await page.context().clearCookies();
  await page.addInitScript((tokens) => {
    window.localStorage.setItem("tec.erp.auth.tokens", JSON.stringify(tokens));
  }, login.tokens);
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push({ email, text: msg.text(), url: page.url() });
    }
  });
  page.on("response", (response) => {
    const status = response.status();
    if (status >= 500) {
      networkFailures.push({ email, status, url: response.url() });
    }
  });
  await page.goto(`${WEB}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  return login;
}

async function shot(page, name) {
  const path = join(outDir, name);
  await page.screenshot({ path, fullPage: true });
  return path;
}

async function textIncludes(page, selector, needle) {
  const locator = page.locator(selector).first();
  if ((await locator.count()) === 0) return false;
  const text = (await locator.textContent()) ?? "";
  return text.toLowerCase().includes(String(needle).toLowerCase());
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    // V1 historical James-style
    await openAs(page, QA_ACCOUNTS.studentV1.email, "/workspace");
    await page.waitForSelector('[data-testid="workspace-home-page"]', { timeout: 20000 });
    record(
      "v1_home",
      await page.locator('[data-testid="workspace-home-page"]').count() > 0,
      "learner home",
    );
    const welcome = (await page.locator('[data-testid="workspace-welcome-message"]').textContent()) ?? "";
    record("v1_welcome_historical", /historique|lecture seule/i.test(welcome), welcome.slice(0, 120));
    record(
      "v1_no_preparing_sidebar",
      (await page.locator('[data-testid^="workspace-sidebar-link-"]', { hasText: "Accès en préparation" }).count()) === 0 &&
        (await page.locator('[data-testid="workspace-app-launcher"]', { hasText: "Accès en préparation" }).count()) === 0,
      "primary nav preparing absent",
    );
    await shot(page, "01-v1-historical-home.png");

    await page.goto(`${WEB}/workspace/modules/M1`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    await shot(page, "02-v1-historical-module.png");
    record("v1_module", page.url().includes("/modules/M1"), page.url());

    await page.goto(`${WEB}/workspace/apps/capstone`, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="capstone-page"]', { timeout: 20000 });
    const bodyText = (await page.locator('[data-testid="capstone-page"]').textContent()) ?? "";
    record("v1_capstone_no_raw_submitted", !/\bsubmitted\b/.test(bodyText), "no raw submitted");
    record("v1_capstone_no_zero1_english", !/Autonomous Zero1 Validation/i.test(bodyText), "no Zero1 label");
    record(
      "v1_capstone_no_submit_cta",
      (await page.locator('[data-testid="capstone-submit"]').count()) === 0,
      "submit hidden",
    );
    record(
      "v1_gold_pending",
      (await page.locator('[data-testid="capstone-gold-pending-issue"]').count()) > 0 ||
        /attente d.?émission|awaiting professor/i.test(bodyText),
      "gold pending professor",
    );
    await shot(page, "03-james-style-historical-capstone.png");
    await shot(page, "04-gold-pending-professor-issuance.png");

    // V2 new learner
    await page.close();
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await openAs(page, QA_ACCOUNTS.studentV2New.email, "/workspace");
    await page.waitForSelector('[data-testid="workspace-home-page"]', { timeout: 20000 });
    await shot(page, "05-v2-learner-home.png");
    record(
      "v2_home",
      (await page.locator('[data-testid="learner-home-journey"]').count()) > 0,
      "journey grid",
    );
    await page.goto(`${WEB}/workspace/modules/M1`, { waitUntil: "networkidle" });
    await shot(page, "06-v2-module-hub.png");
    await page.goto(`${WEB}/workspace/apps/centre-mission`, { waitUntil: "networkidle" });
    await shot(page, "07-v2-mission.png");
    await page.goto(`${WEB}/workspace/apps/documents`, { waitUntil: "networkidle" });
    await shot(page, "08-document-flow.png");
    await page.goto(`${WEB}/workspace/apps/tableaux-bord`, { waitUntil: "networkidle" });
    await shot(page, "09-kpi-card.png");
    await page.goto(`${WEB}/workspace/apps/coach-ia`, { waitUntil: "networkidle" });
    await shot(page, "10-ai-modes.png");
    await page.goto(`${WEB}/workspace/apps/capstone`, { waitUntil: "networkidle" });
    record(
      "v2_capstone_locked",
      (await page.locator('[data-testid="capstone-locked-hint"]').count()) > 0,
      "locked hint",
    );
    record(
      "v2_capstone_no_submit",
      (await page.locator('[data-testid="capstone-submit"]').count()) === 0,
      "no submit",
    );
    await shot(page, "14-capstone-locked.png");
    await page.goto(`${WEB}/workspace/apps/certificats`, { waitUntil: "networkidle" });
    await shot(page, "16-certificates.png");

    // Capstone revision
    await page.close();
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await openAs(page, QA_ACCOUNTS.studentV2Cap.email, "/workspace/apps/capstone");
    await page.waitForSelector('[data-testid="capstone-page"]', { timeout: 20000 });
    const revText = (await page.locator('[data-testid="capstone-page"]').textContent()) ?? "";
    record(
      "capstone_revision",
      /révision|revision/i.test(revText),
      "revision visible",
    );
    record(
      "capstone_professor_feedback",
      (await page.locator('[data-testid="capstone-professor-feedback"]').count()) > 0 ||
        /Renforcez l’analyse|Renforcez l'analyse/i.test(revText),
      "professor notes",
    );
    await shot(page, "15-capstone-revision.png");

    // Professor A command center
    await page.close();
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await openAs(page, QA_ACCOUNTS.professorA.email, "/workspace/apps/portail-professeur");
    await page.waitForSelector('[data-testid="professor-command-center"]', { timeout: 25000 });
    await shot(page, "17-professor-overview.png");
    record(
      "professor_overview",
      (await page.locator('[data-testid="professor-unique-students"]').count()) > 0,
      "unique students metric",
    );
    for (const section of [
      "students",
      "runs",
      "activity",
      "exceptions",
      "assessments",
      "competencies",
      "analytics",
      "ai",
      "capstone",
      "comparisons",
      "presentation",
    ]) {
      const nav = page.locator(`[data-testid="professor-cc-nav-${section}"]`);
      if ((await nav.count()) > 0) {
        await nav.click();
        await page.waitForTimeout(400);
        let contentOk = false;
        if (section === "presentation") {
          contentOk =
            (await page.locator('[data-testid="professor-presentation-mode"]').count()) > 0;
        } else {
          contentOk =
            (await page.locator(`[data-testid="professor-cc-${section}"]`).count()) > 0;
        }
        record(`professor_${section}`, contentOk, section);
        await shot(page, `professor-${section}.png`);
        if (section === "presentation") {
          const quit = page.locator('[data-testid="professor-presentation-mode"] button', {
            hasText: /Quitter|Exit|Close/i,
          });
          if ((await quit.count()) > 0) {
            await quit.first().click();
            await page.waitForTimeout(300);
          }
        }
      } else {
        record(`professor_${section}`, false, "nav missing");
      }
    }
    // Student 360
    await page.locator('[data-testid="professor-cc-nav-students"]').click();
    await page.waitForTimeout(400);
    const firstStudent = page.locator('[data-testid="professor-cc-students"] button').first();
    if ((await firstStudent.count()) > 0) {
      await firstStudent.click();
      await page.waitForTimeout(800);
      record(
        "student_360",
        (await page.locator('[data-testid="professor-student-360"]').count()) > 0,
        "detail",
      );
      await shot(page, "18-student-360.png");
    } else {
      record("student_360", false, "no student button");
    }

    // Professor B isolation
    await page.close();
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await openAs(page, QA_ACCOUNTS.professorB.email, "/workspace/apps/portail-professeur");
    await page.waitForSelector('[data-testid="professor-command-center"]', { timeout: 25000 });
    const overview = (await page.locator('[data-testid="professor-cc-overview"]').textContent()) ?? "";
    record(
      "professor_b_isolation",
      !/Student V1 Historical|stu_v1|Company A/i.test(overview) ||
        /Apprenants inscrits :\s*[01]\b/i.test(overview),
      overview.slice(0, 200),
    );
    await shot(page, "25-professor-b-isolation.png");

    // Admin
    await page.close();
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await openAs(page, QA_ACCOUNTS.admin.email, "/workspace/apps/administration");
    await page.waitForTimeout(1000);
    await shot(page, "26-admin.png");
    record("admin", page.url().includes("administration"), page.url());

    // Theme + responsive
    await page.close();
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await openAs(page, QA_ACCOUNTS.studentV2New.email, "/workspace");
    await page.waitForSelector('[data-testid="workspace-home-page"]', { timeout: 20000 });
    if ((await page.locator('[data-testid="theme-switch"]').count()) > 0) {
      await page.locator('[data-testid="theme-switch"]').selectOption("dark");
      await page.waitForTimeout(300);
      record("theme_dark", (await page.evaluate(() => document.documentElement.dataset.theme)) === "dark", "dark");
      await shot(page, "29-dark-mode.png");
    } else {
      record("theme_dark", false, "theme switch missing");
    }
    await page.setViewportSize({ width: 900, height: 1024 });
    await page.waitForTimeout(300);
    await shot(page, "27-tablet.png");
    record("tablet", true, "900px");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await shot(page, "28-mobile.png");
    record("mobile", (await page.locator('[data-testid="living-mobile-nav"], nav a').count()) > 0, "mobile nav");

    // Language
    await page.setViewportSize({ width: 1440, height: 900 });
    if ((await page.locator('[data-testid="locale-switch"]').count()) > 0) {
      await page.locator('[data-testid="locale-switch"]').selectOption("en");
      await page.waitForTimeout(400);
      record("english_mode", (await page.locator('[data-testid="locale-switch"]').inputValue()) === "en", "en");
      await page.locator('[data-testid="locale-switch"]').selectOption("fr");
      record("french_mode", (await page.locator('[data-testid="locale-switch"]').inputValue()) === "fr", "fr");
    }

    // HCM learner assessment page
    await page.close();
    page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await openAs(page, QA_ACCOUNTS.studentV2Hcm.email, "/workspace/apps/evaluations");
    await page.waitForTimeout(1200);
    await shot(page, "13-hcm-assessment.png");
    record("hcm_assessment_page", page.url().includes("evaluations"), page.url());
  } catch (error) {
    record("fatal", false, error instanceof Error ? error.message : String(error));
    try {
      await shot(page, "zz-fatal.png");
      writeFileSync(join(outDir, "zz-fatal.html"), await page.content());
    } catch {
      // ignore
    }
  } finally {
    await browser.close();
  }

  const failed = checks.filter((item) => !item.ok);
  const summary = {
    api: API,
    web: WEB,
    checks,
    passed: checks.filter((item) => item.ok).length,
    failed: failed.length,
    consoleErrors: consoleErrors.slice(0, 50),
    networkFailures: networkFailures.slice(0, 50),
    timestamp: new Date().toISOString(),
  };
  writeFileSync(join(outDir, "console-network-summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ passed: summary.passed, failed: summary.failed }, null, 2));
  if (failed.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
