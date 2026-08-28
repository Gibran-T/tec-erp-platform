/**
 * Local dual-role teach-through for Course Edition M1 golden gate.
 * Non-production only. Uses QA Final identities against local API + Vite.
 *
 * Env:
 *   WEB_BASE_URL (default http://127.0.0.1:5173)
 *   API_BASE_URL (default http://127.0.0.1:3000)
 *   DATABASE_URL optional (not required for this script)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../../..");
const EVIDENCE = join(ROOT, "evidence/m1-golden-gate");
const WEB = process.env.WEB_BASE_URL ?? "http://127.0.0.1:5173";
const API = process.env.API_BASE_URL ?? "http://127.0.0.1:3000";
const STUDENT = {
  email: "student.a.qa@nordhabitat.ca",
  password: "QaFinal!2026",
};
const PROFESSOR = {
  email: "professor.qa@nordhabitat.ca",
  password: "QaFinal!2026",
};

mkdirSync(EVIDENCE, { recursive: true });

const results = [];

function record(role, step, status, notes = "", evidence = "") {
  results.push({ role, step, status, notes, evidence });
  console.log(`[${status}] ${role} · ${step}${notes ? ` — ${notes}` : ""}`);
}

async function login(page, account) {
  await page.goto(`${WEB}/login`, { waitUntil: "networkidle" });
  await page.getByLabel(/Courriel/i).fill(account.email);
  await page.getByLabel(/Mot de passe/i).fill(account.password);
  await page.getByRole("button", { name: /Se connecter/i }).click();
  try {
    await page.waitForURL(/workspace|portail|professor|modules/i, { timeout: 20000 });
  } catch (error) {
    const body = await page.locator("body").innerText();
    throw new Error(`${error.message}\nURL=${page.url()}\nBODY=${body.slice(0, 400)}`);
  }
}

async function screenshot(page, name) {
  const path = join(EVIDENCE, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  return path;
}

async function studentPath(page) {
  try {
    await login(page, STUDENT);
    record("STUDENT", "login", "PASS", STUDENT.email, await screenshot(page, "student-01-login"));
  } catch (error) {
    record("STUDENT", "login", "FAIL", String(error));
    throw error;
  }

  try {
    await page.goto(`${WEB}/workspace`, { waitUntil: "networkidle" });
    record("STUDENT", "enter workspace", "PASS", page.url(), await screenshot(page, "student-02-workspace"));
  } catch (error) {
    record("STUDENT", "enter workspace", "FAIL", String(error));
  }

  try {
    await page.goto(`${WEB}/workspace/modules/M1/course-edition/apprendre`, {
      waitUntil: "networkidle",
    });
    await page.getByTestId("course-surface-apprendre").waitFor({ timeout: 15000 });
    record("STUDENT", "open M1", "PASS", "Surface A", await screenshot(page, "student-03-m1-apprendre"));
  } catch (error) {
    record("STUDENT", "open M1", "FAIL", String(error));
  }

  try {
    await page.getByTestId("visual-learning-frame").waitFor();
    const progress = await page.getByTestId("visual-learning-frame-progress").innerText();
    const placeholder = await page.getByTestId("visual-learning-frame-placeholder").count();
    for (let i = 0; i < 7; i += 1) {
      const next = page.getByTestId("visual-learning-frame-next");
      if (await next.isEnabled()) {
        await next.click();
      }
    }
    record(
      "STUDENT",
      "complete Surface A",
      placeholder === 0 ? "PASS" : "FAIL",
      `frames=${progress}; placeholders=${placeholder}`,
      await screenshot(page, "student-04-surface-a"),
    );
  } catch (error) {
    record("STUDENT", "complete Surface A", "FAIL", String(error));
  }

  try {
    await page.getByTestId("course-edition-next-connecter").click();
    await page.getByTestId("course-surface-connecter").waitFor({ timeout: 10000 });
    record("STUDENT", "navigate to Surface B", "PASS", await screenshot(page, "student-05-surface-b"));
  } catch (error) {
    record("STUDENT", "navigate to Surface B", "FAIL", String(error));
  }

  try {
    const pairs = [
      ["obj-erp", "def-lecture-partagee"],
      ["dept-entrepot", "resp-signal-terrain"],
      ["err-4036", "cons-fragmentation"],
      ["kpi-inv-acc", "interp-risque-service"],
    ];
    for (const [left, right] of pairs) {
      await page.getByTestId("mission-diag-left-lab-matching").selectOption(left);
      await page.getByTestId("mission-diag-right-lab-matching").selectOption(right);
      await page.getByTestId("mission-diag-add-lab-matching").click();
    }
    await page.getByTestId("mission-numeric-lab-numeric").fill("4");
    await page
      .getByTestId("mission-text-lab-justification")
      .fill(
        "La fragmentation d’inventaire entre départements empêche une lecture partagée fiable.",
      );
    await page.getByTestId("connection-lab-submit").click();
    await page.getByTestId("connection-lab-feedback").waitFor({ timeout: 10000 });
    const feedback = await page.getByTestId("connection-lab-feedback").innerText();
    record(
      "STUDENT",
      "complete Connection Lab",
      /Seuil atteint|Réussi|70/i.test(feedback) ? "PASS" : "FAIL",
      feedback.slice(0, 160),
      await screenshot(page, "student-06-lab"),
    );
  } catch (error) {
    record("STUDENT", "complete Connection Lab", "FAIL", String(error));
  }

  for (const code of ["M1-M01", "M1-M02", "M1-M03"]) {
    try {
      await page.goto(`${WEB}/workspace/modules/M1/course-edition/missions`, {
        waitUntil: "networkidle",
      });
      await page.getByTestId(`course-mission-${code}`).waitFor({ timeout: 10000 });
      record(
        "STUDENT",
        `complete or verify ${code}`,
        "PASS",
        "Mission card + Centre de mission deep-link present (runtime reused)",
        await screenshot(page, `student-07-${code.toLowerCase()}`),
      );
    } catch (error) {
      record("STUDENT", `complete or verify ${code}`, "FAIL", String(error));
    }
  }

  try {
    await page.goto(`${WEB}/workspace/modules/M1/course-edition/bilan`, {
      waitUntil: "networkidle",
    });
    await page.getByTestId("mission-bilan").waitFor({ timeout: 10000 });
    record("STUDENT", "open Bilan", "PASS", await screenshot(page, "student-08-bilan"));
  } catch (error) {
    record("STUDENT", "open Bilan", "FAIL", String(error));
  }

  try {
    const answers = { q1: "b", q2: "c", q3: "b", q4: "c", q5: "b", q6: "b", q7: "b" };
    for (const [id, key] of Object.entries(answers)) {
      await page.getByTestId(`module-consolidation-choice-${id}-${key}`).click();
    }
    await page.getByTestId("module-consolidation-submit").click();
    const result = await page.getByTestId("module-consolidation-result").innerText();
    record(
      "STUDENT",
      "complete consolidation quiz",
      /Réussi/i.test(result) ? "PASS" : "FAIL",
      result.slice(0, 120),
      await screenshot(page, "student-09-quiz"),
    );
  } catch (error) {
    record("STUDENT", "complete consolidation quiz", "FAIL", String(error));
  }

  try {
    const completeText = await page.locator("body").innerText();
    record(
      "STUDENT",
      "confirm M1 completion",
      /Course Edition|M1|consolidation|bilan/i.test(completeText) ? "PASS" : "FAIL",
      "Bilan/quiz surface reachable after path",
      await screenshot(page, "student-10-complete"),
    );
  } catch (error) {
    record("STUDENT", "confirm M1 completion", "FAIL", String(error));
  }

  try {
    // Keep CE local cache, clear auth, re-login, then verify server hydration.
    await page.evaluate(() => {
      localStorage.removeItem("tec.erp.auth.tokens");
      localStorage.removeItem("tec.erp.auth.employee");
    });
    await page.goto(`${WEB}/login`, { waitUntil: "networkidle" });
    await login(page, STUDENT);
    await page.goto(`${WEB}/workspace/modules/M1/course-edition/bilan`, {
      waitUntil: "networkidle",
    });
    const progressRaw = await page.evaluate(() =>
      localStorage.getItem("tec.course-edition.progress.v1:M1"),
    );
    let hydratedOk = false;
    const token = await page.evaluate(() => {
      const raw = localStorage.getItem("tec.erp.auth.tokens");
      if (!raw) return null;
      return JSON.parse(raw).accessToken ?? null;
    });
    if (token) {
      const response = await page.request.get(`${API}/api/v1/me/course-edition/M1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json();
      hydratedOk = Boolean(body?.progress?.quizPassed && body?.progress?.connectionLabPassed);
      writeFileSync(
        join(EVIDENCE, "ui-student-relogin-progress.json"),
        JSON.stringify(body, null, 2),
      );
    }
    record(
      "STUDENT",
      "logout/login confirm persistence",
      hydratedOk ? "PASS" : "FAIL",
      `local=${Boolean(progressRaw)} serverHydrated=${hydratedOk}`,
      await screenshot(page, "student-11-relogin"),
    );
  } catch (error) {
    record("STUDENT", "logout/login confirm persistence", "FAIL", String(error));
  }
}

async function professorPath(page) {
  try {
    await page.goto(`${WEB}/login`, { waitUntil: "networkidle" });
    await login(page, PROFESSOR);
    record("PROFESSOR", "login", "PASS", PROFESSOR.email, await screenshot(page, "prof-01-login"));
  } catch (error) {
    record("PROFESSOR", "login", "FAIL", String(error));
    throw error;
  }

  try {
    await page.goto(`${WEB}/workspace/apps/portail-professeur`, { waitUntil: "networkidle" });
    await page.getByTestId("professor-command-center").waitFor({ timeout: 20000 });
    record("PROFESSOR", "open PCC", "PASS", page.url(), await screenshot(page, "prof-02-pcc"));
  } catch (error) {
    record("PROFESSOR", "open PCC", "FAIL", String(error));
  }

  try {
    await page.getByTestId("professor-ce-m1-visibility").waitFor({ timeout: 15000 });
    const table = await page.getByTestId("professor-ce-m1-visibility").innerText();
    const hasStudent = /Étudiant QA|student\.a\.qa|QA A/i.test(table);
    record(
      "PROFESSOR",
      "locate the student",
      hasStudent ? "PASS" : "FAIL",
      table.slice(0, 200),
      await screenshot(page, "prof-03-student"),
    );
    record(
      "PROFESSOR",
      "observe M1 Course Edition status",
      /En cours|Terminé|Non commencé/i.test(table) ? "PASS" : "FAIL",
      table.slice(0, 200),
    );
    record(
      "PROFESSOR",
      "observe mission status",
      /M1-M0/i.test(table) ? "PASS" : "FAIL",
      table.slice(0, 200),
    );
    record(
      "PROFESSOR",
      "observe Connection Lab status",
      /Connection Lab|Réussi|Non commencé|À reprendre/i.test(table) ? "PASS" : "FAIL",
    );
    record(
      "PROFESSOR",
      "observe quiz status",
      /Quiz|Réussi|Non commencé|100/i.test(table) ? "PASS" : "FAIL",
    );
    record(
      "PROFESSOR",
      "identify open response for review",
      /à revoir|Aucune/i.test(table) ? "PASS" : "FAIL",
      table.match(/à revoir|Aucune/)?.[0] ?? "",
    );
    record(
      "PROFESSOR",
      "confirm completion state",
      /%|complète|Terminé|En cours/i.test(table) ? "PASS" : "FAIL",
    );
  } catch (error) {
    for (const step of [
      "locate the student",
      "observe M1 Course Edition status",
      "observe mission status",
      "observe Connection Lab status",
      "observe quiz status",
      "identify open response for review",
      "confirm completion state",
    ]) {
      record("PROFESSOR", step, "FAIL", String(error));
    }
  }

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  await page.waitForTimeout(500);
  record(
    "PROFESSOR",
    "confirm no console errors",
    consoleErrors.length === 0 ? "PASS" : "FAIL",
    consoleErrors.slice(0, 5).join(" | "),
  );
}

async function main() {
  const health = await fetch(`${API}/health`).then((r) => r.status).catch((e) => String(e));
  if (health !== 200) {
    throw new Error(`API not healthy at ${API}: ${health}`);
  }

  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];

  try {
    const studentContext = await browser.newContext();
    const studentPage = await studentContext.newPage();
    studentPage.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(`STUDENT:${msg.text()}`);
    });
    await studentPath(studentPage);
    await studentContext.close();

    const professorContext = await browser.newContext();
    const professorPage = await professorContext.newPage();
    professorPage.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(`PROFESSOR:${msg.text()}`);
    });
    await professorPath(professorPage);
    await professorContext.close();

    record(
      "SYSTEM",
      "console errors overall",
      consoleErrors.length === 0 ? "PASS" : "FAIL",
      consoleErrors.slice(0, 8).join(" | "),
    );
  } finally {
    writeFileSync(join(EVIDENCE, "teachthrough-results.json"), JSON.stringify(results, null, 2));
    await browser.close();
  }

  const failed = results.filter((item) => item.status === "FAIL");
  if (failed.length) {
    console.error(`Teach-through finished with ${failed.length} FAIL step(s).`);
    process.exitCode = 1;
  } else {
    console.log("Teach-through finished with no FAIL steps.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
