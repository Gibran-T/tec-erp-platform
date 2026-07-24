/**
 * Capture Owner Green final-polish evidence screenshots.
 * Requires local Vite: http://127.0.0.1:5173
 */
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(
  __dirname,
  "../../../engineering/v2/playbacks/wave-2a-portal/screenshots",
);
const BASE = "http://127.0.0.1:5173";

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: false });
  console.log("wrote", name);
}

async function openControls(page) {
  const open = page.getByTestId("playback-controls-open");
  if (await open.isVisible().catch(() => false)) {
    await open.click();
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${BASE}/playback/v2/portal`, { waitUntil: "networkidle" });
  await shot(page, "01-portal-hero-light.png");

  await page.locator("[data-testid='enterprise-pulse-map']").scrollIntoViewIfNeeded();
  await shot(page, "02-enterprise-pulse-map.png");
  await page.getByTestId("pulse-node-finance").click();
  await shot(page, "03-enterprise-pulse-selected.png");

  await page.locator("[data-testid='mission-transformation']").scrollIntoViewIfNeeded();
  await shot(page, "04-missions-continuum.png");

  await page.locator("[data-testid='chapter-journey']").scrollIntoViewIfNeeded();
  await shot(page, "05-m1-m10-chapters.png");

  await page.locator("[data-testid='process-teach']").scrollIntoViewIfNeeded();
  await shot(page, "06-end-to-end-process.png");

  await page.locator("[data-testid='executive-impact-bi']").scrollIntoViewIfNeeded();
  await shot(page, "07-executive-impact-bi.png");

  await page.locator("[data-testid='ai-communication']").scrollIntoViewIfNeeded();
  await shot(page, "08-ai-timeline.png");

  await page.locator("[data-testid='professor-orchestration']").scrollIntoViewIfNeeded();
  await shot(page, "09-professor-preview-controls.png");

  await page.locator("[data-testid='capstone-culmination']").scrollIntoViewIfNeeded();
  await shot(page, "10-capstone.png");

  await page.goto(`${BASE}/playback/v2/login`, { waitUntil: "networkidle" });
  await shot(page, "11-login.png");

  await page.goto(`${BASE}/playback/v2/orientation`, { waitUntil: "networkidle" });
  await shot(page, "12-cockpit-light.png");

  await openControls(page);
  await page.getByTestId("playback-theme").selectOption("dark");
  await shot(page, "13-cockpit-dark.png");

  await page.goto(`${BASE}/playback/v2/portal`, { waitUntil: "networkidle" });
  await openControls(page);
  await page.getByTestId("playback-theme").selectOption("projector");
  await shot(page, "14-portal-projector.png");

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.getByTestId("playback-viewport").selectOption("tablet").catch(() => {});
  await shot(page, "15-tablet.png");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByTestId("playback-viewport").selectOption("mobile").catch(() => {});
  await page.goto(`${BASE}/playback/v2/orientation`, { waitUntil: "networkidle" });
  await shot(page, "16-mobile.png");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/playback/v2/portal`, { waitUntil: "networkidle" });
  await page.getByTestId("pulse-node-sales").focus();
  await shot(page, "17-keyboard-focus.png");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("[data-testid='enterprise-pulse-map']").scrollIntoViewIfNeeded();
  await shot(page, "18-reduced-motion.png");

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
