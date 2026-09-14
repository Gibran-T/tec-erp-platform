import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "after");
const htmlPath = resolve(__dirname, "visual-smoke.html");
const htmlUrl = pathToFileURL(htmlPath).href;

async function shot(page, name) {
  await page.screenshot({
    path: resolve(outDir, name),
    fullPage: true,
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(htmlUrl);

  await desktop.evaluate(() => {
    document.documentElement.dataset.theme = "light";
    document.getElementById("shell")?.classList.remove("tec-app-shell--context-collapsed");
    const panel = document.getElementById("contextPanel");
    if (panel) panel.hidden = false;
  });
  await shot(desktop, "01-light-context-open.png");

  await desktop.evaluate(() => {
    document.getElementById("shell")?.classList.add("tec-app-shell--context-collapsed");
    const panel = document.getElementById("contextPanel");
    if (panel) panel.hidden = true;
  });
  await shot(desktop, "02-light-context-closed.png");

  await desktop.evaluate(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
    document.getElementById("shell")?.classList.remove("tec-app-shell--context-collapsed");
    const panel = document.getElementById("contextPanel");
    if (panel) panel.hidden = false;
  });
  await shot(desktop, "03-dark-context-open.png");

  await desktop.evaluate(() => {
    document.getElementById("shell")?.classList.add("tec-app-shell--context-collapsed");
    const panel = document.getElementById("contextPanel");
    if (panel) panel.hidden = true;
  });
  await shot(desktop, "04-dark-context-closed.png");

  await desktop.emulateMedia({ colorScheme: "light" });
  await desktop.evaluate(() => {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  });
  await shot(desktop, "05-system-resolved-light.png");

  await desktop.emulateMedia({ colorScheme: "dark" });
  await desktop.evaluate(() => {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  });
  await shot(desktop, "06-system-resolved-dark.png");

  await desktop.setViewportSize({ width: 900, height: 700 });
  await shot(desktop, "07-tablet.png");

  const mobile = await browser.newPage({ ...devices["iPhone 12"] });
  await mobile.goto(htmlUrl);
  await mobile.evaluate(() => {
    document.documentElement.dataset.theme = "light";
  });
  await shot(mobile, "08-mobile.png");

  await desktop.setViewportSize({ width: 1440, height: 900 });
  await desktop.goto(htmlUrl);
  await desktop.evaluate(() => {
    document.documentElement.dataset.theme = "light";
  });
  await desktop.locator(".workspace-topbar").screenshot({
    path: resolve(outDir, "closeup-header.png"),
  });
  await desktop.locator(".tec-app-shell__sidebar").screenshot({
    path: resolve(outDir, "closeup-navigation.png"),
  });
  await desktop.locator(".living-home-section--primary").screenshot({
    path: resolve(outDir, "closeup-primary-summary.png"),
  });
  await desktop.locator(".living-card--l2").first().screenshot({
    path: resolve(outDir, "closeup-signals.png"),
  });
  await desktop.locator(".tec-app-shell__right-panel").screenshot({
    path: resolve(outDir, "closeup-right-panel.png"),
  });

  await browser.close();
  console.log("Visual foundation after screenshots written to", outDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
