/**
 * Runs Prisma migrate deploy for @tec-platform/database-erp.
 * Used in Railway pre-start and CI integration jobs (RAIL-003).
 */

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const PACKAGE_DIR = resolve(import.meta.dirname, "../packages/database-erp");

function main(): void {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required for migrate deploy.");
    process.exit(1);
  }

  const outcome = spawnSync("pnpm", ["exec", "prisma", "migrate", "deploy"], {
    cwd: PACKAGE_DIR,
    shell: true,
    stdio: "inherit",
    env: process.env,
  });

  if (outcome.status !== 0) {
    process.exit(outcome.status ?? 1);
  }

  console.log("Prisma migrate deploy completed successfully.");
}

main();
