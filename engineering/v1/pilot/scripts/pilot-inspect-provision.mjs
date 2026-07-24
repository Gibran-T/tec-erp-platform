#!/usr/bin/env node
/**
 * Operational inspect / provision for TEC.ERP Pilot Student Zero1 (James Timothy).
 * Does not modify product source. Requires DATABASE_URL.
 *
 * Usage:
 *   node engineering/v1/pilot/scripts/pilot-inspect-provision.mjs --inspect
 *   node engineering/v1/pilot/scripts/pilot-inspect-provision.mjs --provision
 *
 * Never prints passwords.
 */

import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Password } from "@tec-platform/core";
import { getPrismaClient } from "@tec-platform/database-erp";

const PILOT_COMPANY = {
  code: "TECERP-PILOT",
  name: "TECERP PILOT",
};

const PILOT_COHORT = {
  code: "TECERP-PILOT-001",
  name: "TECERP-PILOT-001",
};

const JAMES = {
  employeeNumber: "TECERP-2026-PILOT-001",
  email: "james.timothy.pilot001@tec-erp.pilot",
  displayName: "James Timothy",
  role: "JR_BUSINESS_ANALYST",
};

const CREDENTIAL_FILE =
  process.env.JAMES_CREDENTIAL_FILE ||
  "C:/Projetos/Analyste_ERP_Processus_Affaires/.manus-logs/james-timothy-zero1-credentials.txt";

function parseArgs(argv) {
  return {
    inspect: argv.includes("--inspect"),
    provision: argv.includes("--provision"),
  };
}

function generatePassword() {
  return `JT1-${randomBytes(24).toString("base64url")}`;
}

async function inspect(client) {
  const companies = await client.company.findMany({
    where: {
      OR: [
        { code: PILOT_COMPANY.code },
        { code: { contains: "PILOT", mode: "insensitive" } },
        { name: { contains: "PILOT", mode: "insensitive" } },
      ],
    },
    select: { id: true, code: true, name: true, createdAt: true },
  });

  const cohorts = await client.cohort.findMany({
    where: {
      OR: [
        { code: PILOT_COHORT.code },
        { code: { contains: "PILOT", mode: "insensitive" } },
        { name: { contains: "PILOT", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      code: true,
      name: true,
      companyId: true,
      _count: { select: { memberships: true } },
    },
  });

  const jamesCandidates = await client.employee.findMany({
    where: {
      OR: [
        { employeeNumber: JAMES.employeeNumber },
        { email: JAMES.email },
        { displayName: { equals: "James Timothy", mode: "insensitive" } },
        { employeeNumber: { contains: "PILOT-001", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      employeeNumber: true,
      email: true,
      displayName: true,
      role: true,
      companyId: true,
      createdAt: true,
    },
  });

  const thiagoCandidates = await client.employee.findMany({
    where: {
      AND: [
        { role: "PROFESSOR" },
        {
          OR: [
            { displayName: { contains: "Thiago", mode: "insensitive" } },
            { displayName: { contains: "Gibran", mode: "insensitive" } },
            { email: { contains: "gibran", mode: "insensitive" } },
            { email: { contains: "thiago", mode: "insensitive" } },
          ],
        },
      ],
    },
    select: {
      id: true,
      employeeNumber: true,
      email: true,
      displayName: true,
      role: true,
      companyId: true,
    },
  });

  const qaEmployees = await client.employee.findMany({
    where: { employeeNumber: { startsWith: "#QA-" } },
    select: { employeeNumber: true, displayName: true, role: true },
  });

  const qaCohorts = await client.cohort.findMany({
    where: { code: { startsWith: "QA-" } },
    select: { code: true, name: true },
  });

  const equinoxe = await client.company.findUnique({
    where: { code: "EQUINOXE-QA" },
    select: { id: true, code: true, name: true },
  });

  const migrationTable = await client.$queryRawUnsafe(
    `SELECT migration_name, finished_at, rolled_back_at
     FROM "_prisma_migrations"
     ORDER BY finished_at DESC NULLS LAST
     LIMIT 12`,
  );

  return {
    companies,
    cohorts,
    jamesCandidates,
    thiagoCandidates,
    qaEmployees,
    qaCohorts,
    equinoxe,
    migrationTable,
  };
}

async function provision(client) {
  const before = await inspect(client);

  if (before.jamesCandidates.some((e) => e.employeeNumber === JAMES.employeeNumber)) {
    return {
      status: "EXISTING_JAMES",
      message: "James Timothy with student code already exists — no duplicate created.",
      existing: before.jamesCandidates,
      thiagoCandidates: before.thiagoCandidates,
      companies: before.companies,
      cohorts: before.cohorts,
    };
  }

  if (before.cohorts.some((c) => c.code === PILOT_COHORT.code)) {
    return {
      status: "EXISTING_COHORT",
      message: "TECERP-PILOT-001 already exists — inspect before continuing.",
      existing: before,
    };
  }

  if (before.companies.some((c) => c.code === PILOT_COMPANY.code)) {
    return {
      status: "EXISTING_COMPANY",
      message: "TECERP-PILOT already exists — inspect before continuing.",
      existing: before,
    };
  }

  const password = generatePassword();
  const passwordHash = Password.hash(password);

  const company = await client.company.create({
    data: { code: PILOT_COMPANY.code, name: PILOT_COMPANY.name },
  });
  await client.companyConfiguration.create({
    data: { companyId: company.id, aiEnabled: true, settingsJson: { pilot: true, analyticsClass: "pilot" } },
  });
  await client.aiPolicy.create({
    data: { companyId: company.id, aiEnabled: true, policyJson: { pilot: true } },
  });

  const cohort = await client.cohort.create({
    data: {
      code: PILOT_COHORT.code,
      name: PILOT_COHORT.name,
      companyId: company.id,
    },
  });

  const exactThiago = before.thiagoCandidates.find(
    (p) =>
      p.displayName.toLowerCase().includes("thiago") &&
      p.displayName.toLowerCase().includes("gibran"),
  );

  let professorMembership = null;
  if (exactThiago && exactThiago.companyId === company.id) {
    await client.cohortMembership.create({
      data: {
        cohortId: cohort.id,
        employeeId: exactThiago.id,
        roleInCohort: "professor",
      },
    });
    professorMembership = {
      assigned: true,
      professorId: exactThiago.id,
      professorNumber: exactThiago.employeeNumber,
      note: "Exact Thiago Gibran professor in same company assigned.",
    };
  } else if (exactThiago) {
    professorMembership = {
      assigned: false,
      blocker: false,
      note: "Exact Thiago Gibran professor exists but in another company — not cross-assigned (isolation).",
      professorId: exactThiago.id,
      professorCompanyId: exactThiago.companyId,
      professorEmail: exactThiago.email,
    };
  } else {
    professorMembership = {
      assigned: false,
      blocker: false,
      note: "No exact legitimate Thiago Gibran professor account found — cohort created without fabricated professor.",
      thiagoCandidates: before.thiagoCandidates,
    };
  }

  const james = await client.employee.create({
    data: {
      employeeNumber: JAMES.employeeNumber,
      email: JAMES.email,
      displayName: JAMES.displayName,
      passwordHash,
      role: JAMES.role,
      companyId: company.id,
    },
  });

  await client.cohortMembership.create({
    data: {
      cohortId: cohort.id,
      employeeId: james.id,
      roleInCohort: "student",
    },
  });

  mkdirSync(dirname(CREDENTIAL_FILE), { recursive: true });
  const credentialBody = [
    "TEC.ERP Pilot Student Zero1 — credentials (LOCAL ONLY — DO NOT COMMIT)",
    `createdAt: ${new Date().toISOString()}`,
    `displayName: ${JAMES.displayName}`,
    `employeeNumber: ${JAMES.employeeNumber}`,
    `email: ${JAMES.email}`,
    `employeeId: ${james.id}`,
    `companyCode: ${PILOT_COMPANY.code}`,
    `companyId: ${company.id}`,
    `cohortCode: ${PILOT_COHORT.code}`,
    `cohortId: ${cohort.id}`,
    `password: ${password}`,
    "rotation: pending_after_pilot",
    "",
  ].join("\n");
  writeFileSync(CREDENTIAL_FILE, credentialBody, { encoding: "utf8", mode: 0o600 });

  return {
    status: "CREATED",
    company: { id: company.id, code: company.code, name: company.name },
    cohort: { id: cohort.id, code: cohort.code, name: cohort.name },
    james: {
      id: james.id,
      employeeNumber: james.employeeNumber,
      email: james.email,
      displayName: james.displayName,
      role: james.role,
    },
    professorMembership,
    credentialFile: CREDENTIAL_FILE,
    credentialFileExists: existsSync(CREDENTIAL_FILE),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }
  if (!args.inspect && !args.provision) {
    throw new Error("Specify --inspect and/or --provision");
  }

  const client = getPrismaClient();
  try {
    if (args.inspect) {
      const result = await inspect(client);
      console.log(JSON.stringify({ mode: "inspect", result }, null, 2));
    }
    if (args.provision) {
      const result = await provision(client);
      console.log(JSON.stringify({ mode: "provision", result }, null, 2));
    }
  } finally {
    await client.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
