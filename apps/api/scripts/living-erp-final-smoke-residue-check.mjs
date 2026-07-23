#!/usr/bin/env node
import { getPrismaClient } from "@tec-platform/database-erp";

const PREFIX = "__QA_V2_LIVING_ERP_FINAL_";
const client = getPrismaClient();

try {
  const emp = await client.employee.count({
    where: {
      OR: [
        { employeeNumber: { startsWith: PREFIX } },
        { displayName: { startsWith: PREFIX } },
      ],
    },
  });
  const co = await client.company.count({ where: { code: { startsWith: PREFIX } } });
  const ch = await client.cohort.count({ where: { code: { startsWith: PREFIX } } });
  const runs = await client.pedagogicalCourseRun.count({
    where: { runCode: { startsWith: PREFIX } },
  });
  const residue = emp + co + ch + runs;
  console.log(JSON.stringify({ emp, co, ch, runs, residue }, null, 2));
  if (residue > 0) {
    process.exitCode = 1;
  }
} finally {
  await client.$disconnect();
}
