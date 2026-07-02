/**
 * Local bootstrap validation — verifies env catalog and optional API/web reachability.
 * Usage: pnpm dev:bootstrap [--check-services]
 */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const CHECK_SERVICES = process.argv.includes("--check-services");

interface BootstrapResult {
  readonly name: string;
  readonly passed: boolean;
  readonly detail: string;
}

const results: BootstrapResult[] = [];

function record(name: string, passed: boolean, detail: string): void {
  results.push({ name, passed, detail });
}

function runValidateEnv(): void {
  const outcome = spawnSync("pnpm", ["env:check"], {
    cwd: ROOT,
    shell: true,
    encoding: "utf8",
  });

  record(
    "env-catalog",
    outcome.status === 0,
    outcome.status === 0 ? "validate-env passed" : (outcome.stderr || outcome.stdout).trim(),
  );
}

function assertLocalEnvFileGuidance(): void {
  try {
    readFileSync(resolve(ROOT, ".env"));
    record("local-env", true, ".env present for local development");
  } catch {
    record(
      "local-env",
      true,
      ".env not found — copy .env.example to .env before running apps",
    );
  }
}

async function checkHttp(name: string, url: string): Promise<void> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    record(name, response.ok, `${url} → HTTP ${response.status}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    record(name, false, `${url} → ${message}`);
  }
}

async function checkServices(): Promise<void> {
  const apiBase = process.env.VITE_API_BASE_URL ?? "http://localhost:3000";
  const webBase = process.env.WEB_BASE_URL ?? "http://localhost:5173";

  await checkHttp("api-health", `${apiBase}/health`);
  await checkHttp("api-ready", `${apiBase}/ready`);
  await checkHttp("web-load", webBase);
}

async function main(): Promise<void> {
  runValidateEnv();
  assertLocalEnvFileGuidance();

  if (CHECK_SERVICES) {
    await checkServices();
  } else {
    record(
      "service-check",
      true,
      "Skipped (run with --check-services when API and web are running)",
    );
  }

  const failed = results.filter((result) => !result.passed);

  console.log("\nTEC.ERP Dev Bootstrap Report\n");
  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";
    console.log(`  [${status}] ${result.name}: ${result.detail}`);
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
