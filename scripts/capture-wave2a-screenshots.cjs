const { chromium } = require("playwright");
const path = require("path");
const out = path.join("engineering", "v2", "playbacks", "wave-2a-portal", "screenshots");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const base = "http://127.0.0.1:5175";
  async function shot(name, url, prep) {
    await page.goto(url, { waitUntil: "networkidle" });
    if (prep) await prep();
    await page.screenshot({ path: path.join(out, name), fullPage: false });
  }
  await shot("01-portal-desktop-light.png", base + "/playback/v2/portal");
  await page.click('[data-testid="playback-controls-open"]');
  await page.selectOption('[data-testid="playback-theme"]', "dark");
  await page.screenshot({ path: path.join(out, "02-portal-desktop-dark.png") });
  await page.selectOption('[data-testid="playback-theme"]', "projector");
  await page.screenshot({ path: path.join(out, "03-portal-projector.png") });
  await page.selectOption('[data-testid="playback-theme"]', "light");
  await page.click('a[href="#entreprise"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, "04-living-enterprise.png") });
  await page.click('a[href="#parcours"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, "05-m1-m10-journey.png") });
  await page.click('a[href="#bi-ia"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, "06-visible-ambient-ai.png") });
  await page.goto(base + "/playback/v2/login", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(out, "07-login.png") });
  await page.goto(base + "/playback/v2/orientation", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(out, "08-orientation.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/playback/v2/portal", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(out, "09-mobile-portal.png") });
  await browser.close();
  console.log("screenshots ok");
})().catch((e) => { console.error(e); process.exit(1); });

