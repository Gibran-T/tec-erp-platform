/**
 * Post-deploy smoke tests for TEC.ERP RC00.
 * Validates API health/readiness/version and web availability.
 */

interface SmokeCheck {
  readonly name: string;
  readonly url: string;
  readonly expectedStatus: number;
  readonly validateJson?: (payload: unknown) => boolean;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

const API_BASE_URL = getRequiredEnv("SMOKE_API_BASE_URL");
const WEB_BASE_URL = getRequiredEnv("SMOKE_WEB_BASE_URL");

const checks: SmokeCheck[] = [
  {
    name: "api-health",
    url: `${API_BASE_URL}/health`,
    expectedStatus: 200,
    validateJson: (payload) =>
      typeof payload === "object" &&
      payload !== null &&
      "status" in payload &&
      (payload as { status: string }).status === "ok",
  },
  {
    name: "api-ready",
    url: `${API_BASE_URL}/ready`,
    expectedStatus: 200,
    validateJson: (payload) =>
      typeof payload === "object" &&
      payload !== null &&
      "status" in payload &&
      (payload as { status: string }).status === "ready",
  },
  {
    name: "api-version",
    url: `${API_BASE_URL}/version`,
    expectedStatus: 200,
    validateJson: (payload) =>
      typeof payload === "object" &&
      payload !== null &&
      "name" in payload &&
      (payload as { name: string }).name === "erp-api",
  },
  {
    name: "web-load",
    url: WEB_BASE_URL,
    expectedStatus: 200,
  },
];

async function runCheck(check: SmokeCheck): Promise<boolean> {
  try {
    const response = await fetch(check.url, { signal: AbortSignal.timeout(15000) });

    if (response.status !== check.expectedStatus) {
      console.error(`[FAIL] ${check.name}: expected ${check.expectedStatus}, got ${response.status}`);
      return false;
    }

    if (check.validateJson) {
      const payload: unknown = await response.json();
      if (!check.validateJson(payload)) {
        console.error(`[FAIL] ${check.name}: response body validation failed`);
        return false;
      }
    }

    console.log(`[PASS] ${check.name}: ${check.url}`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[FAIL] ${check.name}: ${message}`);
    return false;
  }
}

async function main(): Promise<void> {
  console.log("TEC.ERP Smoke Test Suite (RC00)\n");

  const outcomes = await Promise.all(checks.map((check) => runCheck(check)));
  const passed = outcomes.filter(Boolean).length;

  console.log(`\nResult: ${passed}/${checks.length} checks passed.`);

  if (passed !== checks.length) {
    process.exit(1);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
