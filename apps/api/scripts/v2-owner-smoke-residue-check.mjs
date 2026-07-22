#!/usr/bin/env node
import { getPrismaClient } from "@tec-platform/database-erp";

const PREFIX = "__QA_V2_OWNER_SMOKE_";
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
  console.log(JSON.stringify({ emp, co, ch, runs, residue: emp + co + ch + runs }, null, 2));
} finally {
  await client.$disconnect();
}
