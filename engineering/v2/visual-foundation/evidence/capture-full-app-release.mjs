#!/usr/bin/env node
/**
 * Real full-app visual evidence capture for PR #32.
 * Targets the running local React app — not static fixture HTML.
 */
import { chromium, devices } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "full-app-release");
const WEB = process.env.VISUAL_WEB_URL ?? "http://127.0.0.1:5177";
const API = process.env.VISUAL_API_URL ?? "http://127.0.0.1:3013";
const EMAIL = process.env.VISUAL_JAMES_EMAIL ?? "james.timothy.local@nordhabitat.local";
const PASSWORD = process.env.VISUAL_JAMES_PASSWORD ?? "VisualFoundationJames!2026";

async function shot(page, name) {
  await page.screenshot({ path: resolve(outDir, name), fullPage: false });
}

async function setTheme(page, preference) {
  await page.evaluate((pref) => {
    localStorage.setItem("tec-erp.theme", pref);
  }, preference);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="workspace-shell"]', { timeout: 20000 });
}

async function setContext(page, open) {
  const collapsed = await page.evaluate(() => {
    const shell = document.querySelector(".tec-app-shell");
    return shell?.classList.contains("tec-app-shell--context-collapsed") ?? true;
  });
  if (open === collapsed) {
    const toggle = page.locator('[data-testid="context-panel-toggle"], button[aria-controls*="context"], button:has-text("Contexte"), button:has-text("Context")').first();
    if (await toggle.count()) {
      await toggle.click();
      await page.waitForTimeout(300);
    }
  }
}

async function loginViaApi(page) {
  const login = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  if (!login.ok) {
    throw new Error(`Login failed: ${login.status}`);
  }
  const body = await login.json();
  await page.goto(`${WEB}/login`, { waitUntil: "domcontentloaded" });
  await page.evaluate((tokens) => {
    localStorage.setItem("tec.erp.auth.tokens", JSON.stringify(tokens));
    localStorage.setItem("tec-erp.locale", "fr");
    localStorage.setItem("tec-erp.theme", "light");
  }, body.tokens);
  await page.goto(`${WEB}/workspace`, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="workspace-shell"]', { timeout: 20000 });
  return body;
}

async function collectFindings(page) {
  return page.evaluate(() => {
    const text = document.body.innerText;
    const theme = document.documentElement.dataset.theme ?? "";
    const header = document.querySelector(".workspace-topbar, [data-testid='workspace-topbar']");
    const headerH = header ? header.getBoundingClientRect().height : null;
    const style = getComputedStyle(document.documentElement);
    const fg = style.getPropertyValue("--tec-fg").trim() || style.color;
    const bg = style.getPropertyValue("--tec-bg").trim() || style.backgroundColor;
    const cards = [...document.querySelectorAll(".living-card, .tec-card, [class*='living-card']")];
    const blueOutlines = cards.filter((el) => {
      const cs = getComputedStyle(el);
      return /rgb\(.*(0,\s*11[0-9]|.*59,\s*130)|#3b82f6|#60a5fa/i.test(cs.borderColor);
    }).length;
    const whiteOnWhite = [...document.querySelectorAll("h1,h2,h3,.living-card,.tec-card")].filter((el) => {
      const cs = getComputedStyle(el);
      const c = cs.color;
      const b = cs.backgroundColor;
      return c.includes("255, 255, 255") && b.includes("255, 255, 255");
    }).length;
    const darkOnDark = [...document.querySelectorAll("h1,h2,h3,p,span")].slice(0, 80).filter((el) => {
      const cs = getComputedStyle(el);
      const c = cs.color;
      return theme === "dark" && /rgb\(\s*(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]),/.test(c);
    }).length;
    return {
      theme,
      headerHeightPx: headerH,
      fg,
      bg,
      hasAccesActif: /Accès actif/i.test(text),
      hasAutonomousZero1: /Autonomous Zero1 Validation/i.test(text),
      hasRawSubmitted: /\bsubmitted\b/.test(text),
      hasRawApproved: /\bapproved\b/.test(text) && !/approuvé/i.test(text),
      hasPreparingAccess: /préparation|preparing.?access|accès en préparation/i.test(text),
      hasLearnerCardClass: Boolean(document.querySelector(".learner-card, .large-learner-card")),
      blueOutlineCards: blueOutlines,
      whiteOnWhiteCount: whiteOnWhite,
      suspiciousDarkTextCount: darkOnDark,
      summaryBeforeLauncher: (() => {
        const summary = document.querySelector(".living-home-section--primary, [data-testid='learning-summary']");
        const launcher = document.querySelector(".app-launcher, [data-testid='app-launcher'], .living-home-section--launcher");
        if (!summary || !launcher) return null;
        return summary.getBoundingClientRect().top <= launcher.getBoundingClientRect().top;
      })(),
      bodySnippet: text.slice(0, 500),
    };
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const findings = {};

  await loginViaApi(desktop);

  // 1-2 Light home context
  await setTheme(desktop, "light");
  await setContext(desktop, false);
  findings.lightHomeClosed = await collectFindings(desktop);
  await shot(desktop, "01-light-home-context-closed.png");
  await setContext(desktop, true);
  findings.lightHomeOpen = await collectFindings(desktop);
  await shot(desktop, "02-light-home-context-open.png");

  // 3-4 Dark home
  await setTheme(desktop, "dark");
  await setContext(desktop, false);
  findings.darkHomeClosed = await collectFindings(desktop);
  await shot(desktop, "03-dark-home-context-closed.png");
  await setContext(desktop, true);
  findings.darkHomeOpen = await collectFindings(desktop);
  await shot(desktop, "04-dark-home-context-open.png");

  // 5-6 System resolved
  await desktop.emulateMedia({ colorScheme: "light" });
  await setTheme(desktop, "system");
  findings.systemLight = await collectFindings(desktop);
  await shot(desktop, "05-system-resolved-light.png");
  await desktop.emulateMedia({ colorScheme: "dark" });
  await desktop.reload({ waitUntil: "networkidle" });
  await desktop.waitForSelector('[data-testid="workspace-shell"]');
  findings.systemDark = await collectFindings(desktop);
  await shot(desktop, "06-system-resolved-dark.png");

  // 7-8 ERP
  await setTheme(desktop, "light");
  await desktop.goto(`${WEB}/workspace/apps/erp`, { waitUntil: "networkidle" });
  findings.erpLight = await collectFindings(desktop);
  await shot(desktop, "07-light-erp.png");
  await setTheme(desktop, "dark");
  await desktop.goto(`${WEB}/workspace/apps/erp`, { waitUntil: "networkidle" });
  findings.erpDark = await collectFindings(desktop);
  await shot(desktop, "08-dark-erp.png");

  // 9 Historical module
  await setTheme(desktop, "light");
  await desktop.goto(`${WEB}/workspace/modules/M1`, { waitUntil: "networkidle" });
  findings.module = await collectFindings(desktop);
  await shot(desktop, "09-historical-module.png");

  // 10 Historical mission — open first mission from center
  await desktop.goto(`${WEB}/workspace/apps/centre-mission`, { waitUntil: "networkidle" });
  const missionLink = desktop.locator('a[href*="/workspace/apps/centre-mission"], a[href*="mission"], [data-testid*="mission"]').first();
  if (await missionLink.count()) {
    await missionLink.click().catch(() => undefined);
    await desktop.waitForTimeout(800);
  }
  // Prefer a known mission deep-link pattern if present
  const firstMission = desktop.locator("a").filter({ hasText: /Découvrir|M1|mission/i }).first();
  if (await firstMission.count()) {
    await firstMission.click().catch(() => undefined);
    await desktop.waitForTimeout(1000);
  }
  findings.mission = await collectFindings(desktop);
  await shot(desktop, "10-historical-mission.png");

  // 11 Capstone
  await desktop.goto(`${WEB}/workspace/apps/capstone`, { waitUntil: "networkidle" });
  findings.capstone = await collectFindings(desktop);
  await shot(desktop, "11-capstone.png");

  // 12 Certificates
  await desktop.goto(`${WEB}/workspace/apps/certificats`, { waitUntil: "networkidle" });
  findings.certificates = await collectFindings(desktop);
  await shot(desktop, "12-certificates.png");

  // 13 Profile menu
  await desktop.goto(`${WEB}/workspace`, { waitUntil: "networkidle" });
  await setTheme(desktop, "light");
  const profileBtn = desktop.locator('[data-testid="employee-badge-menu"], button:has-text("James"), [aria-haspopup="menu"]').first();
  if (await profileBtn.count()) {
    await profileBtn.click();
    await desktop.waitForTimeout(400);
  }
  findings.profileMenu = await collectFindings(desktop);
  await shot(desktop, "13-profile-menu-open.png");

  // 14 Signals
  await desktop.goto(`${WEB}/workspace`, { waitUntil: "networkidle" });
  await desktop.evaluate(() => window.scrollTo(0, 0));
  findings.signals = await collectFindings(desktop);
  await shot(desktop, "14-signals-home.png");

  // Tablet
  await desktop.setViewportSize({ width: 900, height: 700 });
  await desktop.goto(`${WEB}/workspace`, { waitUntil: "networkidle" });
  findings.tabletHome = await collectFindings(desktop);
  await shot(desktop, "15-tablet-home.png");
  await desktop.goto(`${WEB}/workspace/apps/erp`, { waitUntil: "networkidle" });
  findings.tabletErp = await collectFindings(desktop);
  await shot(desktop, "16-tablet-erp.png");

  // Mobile
  const mobile = await browser.newPage({ ...devices["iPhone 12"] });
  await mobile.goto(`${WEB}/login`, { waitUntil: "domcontentloaded" });
  const tokensRaw = await desktop.evaluate(() => localStorage.getItem("tec.erp.auth.tokens"));
  await mobile.evaluate((raw) => {
    localStorage.setItem("tec.erp.auth.tokens", raw);
    localStorage.setItem("tec-erp.locale", "fr");
    localStorage.setItem("tec-erp.theme", "light");
  }, tokensRaw);
  await mobile.goto(`${WEB}/workspace`, { waitUntil: "networkidle" });
  findings.mobileHome = await collectFindings(mobile);
  await shot(mobile, "17-mobile-home.png");
  const menuBtn = mobile.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], [data-testid="sidebar-toggle"], .living-bottom-nav').first();
  if (await menuBtn.count()) {
    await menuBtn.click().catch(() => undefined);
    await mobile.waitForTimeout(400);
  }
  findings.mobileNav = await collectFindings(mobile);
  await shot(mobile, "18-mobile-navigation.png");
  await mobile.goto(`${WEB}/workspace/apps/centre-mission`, { waitUntil: "networkidle" });
  findings.mobileMission = await collectFindings(mobile);
  await shot(mobile, "19-mobile-historical-mission.png");

  // Additional routes spot-check (Documents, Evaluations, Dashboard, Coach, Profile)
  await desktop.setViewportSize({ width: 1440, height: 900 });
  for (const [name, path] of [
    ["documents", "/workspace/apps/documents"],
    ["evaluations", "/workspace/apps/evaluations"],
    ["dashboard", "/workspace/apps/tableaux-bord"],
    ["coach", "/workspace/apps/coach-ia"],
    ["profile", "/workspace/apps/profil"],
  ]) {
    await desktop.goto(`${WEB}${path}`, { waitUntil: "networkidle" });
    findings[name] = await collectFindings(desktop);
    await shot(desktop, `extra-${name}.png`);
  }

  await writeFile(resolve(outDir, "findings.json"), JSON.stringify(findings, null, 2), "utf8");
  await browser.close();
  console.log(JSON.stringify({ ok: true, outDir, keys: Object.keys(findings) }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
