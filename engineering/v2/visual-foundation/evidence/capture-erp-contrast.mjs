import { chromium } from "playwright";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "full-app-release");
const WEB = "http://127.0.0.1:5177";
const API = "http://127.0.0.1:3013";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const login = await fetch(`${API}/api/v1/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "james.timothy.local@nordhabitat.local",
    password: "VisualFoundationJames!2026",
  }),
});
const body = await login.json();
await page.goto(`${WEB}/login`);
await page.evaluate((tokens) => {
  localStorage.setItem("tec.erp.auth.tokens", JSON.stringify(tokens));
  localStorage.setItem("tec-erp.theme", "dark");
  localStorage.setItem("tec-erp.locale", "fr");
}, body.tokens);
await page.goto(`${WEB}/workspace/apps/erp`, { waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="organization-erp-page"]');
const contrast = await page.evaluate(() => {
  const card = document.querySelector('[data-testid="organization-company-profile"]');
  if (!card) return { error: "no-card" };
  const cs = getComputedStyle(card);
  const title = card.querySelector("h2");
  const tcs = title ? getComputedStyle(title) : null;
  return {
    bg: cs.backgroundColor,
    color: cs.color,
    titleColor: tcs?.color ?? null,
    theme: document.documentElement.dataset.theme,
  };
});
console.log(JSON.stringify(contrast, null, 2));
await page.screenshot({ path: resolve(out, "08-dark-erp.png"), fullPage: false });
await page.evaluate(() => localStorage.setItem("tec-erp.theme", "light"));
await page.reload({ waitUntil: "networkidle" });
await page.screenshot({ path: resolve(out, "07-light-erp.png"), fullPage: false });
await browser.close();
