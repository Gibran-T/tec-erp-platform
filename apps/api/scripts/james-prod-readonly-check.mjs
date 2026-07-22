#!/usr/bin/env node
/**
 * Read-only production check: pedagogical run tables / James Run 2 absence.
 * Never mutates data. Requires DATABASE_URL (Railway DATABASE_PUBLIC_URL).
 */
import { getPrismaClient } from "@tec-platform/database-erp";

const client = getPrismaClient();

const james = await client.employee.findUnique({
  where: { employeeNumber: "TECERP-2026-PILOT-001" },
  select: {
    id: true,
    employeeNumber: true,
    email: true,
    role: true,
    companyId: true,
    company: { select: { code: true } },
  },
});

let pedagogicalTablePresent = false;
let pedagogicalRunCount = null;
let pedagogicalRunError = null;
let reflectionTablePresent = false;

try {
  pedagogicalRunCount = await client.pedagogicalCourseRun.count({
    where: { employeeId: james?.id },
  });
  pedagogicalTablePresent = true;
} catch (error) {
  pedagogicalRunError = error instanceof Error ? error.message : String(error);
  pedagogicalTablePresent = !/does not exist|Unknown arg|P2021|table/i.test(pedagogicalRunError);
}

try {
  await client.studentMissionReflection.findFirst({ select: { id: true } });
  reflectionTablePresent = true;
} catch {
  reflectionTablePresent = false;
}

const migrations = await client.$queryRawUnsafe(
  `SELECT migration_name FROM _prisma_migrations
   WHERE migration_name LIKE '%pedagogical%'
      OR migration_name LIKE '%reflection%'
   ORDER BY finished_at NULLS LAST, migration_name`,
);

console.log(
  JSON.stringify(
    {
      james: james
        ? {
            employeeNumber: james.employeeNumber,
            role: james.role,
            companyCode: james.company?.code ?? null,
            companyId: james.companyId,
            email: james.email,
          }
        : null,
      pedagogicalTablePresent,
      reflectionTablePresent,
      pedagogicalRunCount,
      pedagogicalRunError: pedagogicalRunError
        ? pedagogicalRunError.split("\n")[0]
        : null,
      pedagogicalMigrations: migrations.map((row) => row.migration_name),
      productionPedagogicalMigrationApplied: migrations.length > 0,
      jamesRun2Absent: !pedagogicalTablePresent || pedagogicalRunCount === 0,
    },
    null,
    2,
  ),
);

await client.$disconnect();
