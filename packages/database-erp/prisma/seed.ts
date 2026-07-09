/**
 * RC01 — Identity & First Day, Slice A deterministic seed.
 *
 * Idempotent: safe to run repeatedly (classroom reset / re-provision). Upserts
 * keyed on stable business keys (company.code, employee.employeeNumber).
 * Requires DATABASE_URL. Contains only the demo employee — no real data.
 *
 * Run: pnpm --filter @tec-platform/database-erp exec prisma db seed
 */
import { getPrismaClient, disconnectPrismaClient } from "../src/client.js";
import { buildDemoSeed } from "../src/seed-data.js";

async function main(): Promise<void> {
  const prisma = getPrismaClient();
  const seed = buildDemoSeed();

  const company = await prisma.company.upsert({
    where: { code: seed.company.code },
    update: { name: seed.company.name },
    create: { code: seed.company.code, name: seed.company.name },
  });

  await prisma.employee.upsert({
    where: { employeeNumber: seed.employee.employeeNumber },
    update: {
      email: seed.employee.email,
      displayName: seed.employee.displayName,
      passwordHash: seed.employee.passwordHash,
      role: seed.employee.role,
      companyId: company.id,
    },
    create: {
      employeeNumber: seed.employee.employeeNumber,
      email: seed.employee.email,
      displayName: seed.employee.displayName,
      passwordHash: seed.employee.passwordHash,
      role: seed.employee.role,
      companyId: company.id,
    },
  });

  console.log(
    `Seed complete: company ${seed.company.code}, employee ${seed.employee.employeeNumber}.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => {
    void disconnectPrismaClient();
  });
