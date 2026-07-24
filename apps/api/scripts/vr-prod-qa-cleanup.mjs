#!/usr/bin/env node
/** Cleanup __QA_VR_PROD_ residue from production. */
import { getPrismaClient } from "@tec-platform/database-erp";

const TAG = "__QA_VR_PROD_";
const prisma = getPrismaClient();

const runs = await prisma.pedagogicalCourseRun.findMany({
  where: { runCode: { startsWith: TAG } },
  select: { id: true },
});
const runIds = runs.map((r) => r.id);
if (runIds.length) {
  await prisma.professorIntervention.deleteMany({ where: { runId: { in: runIds } } });
  await prisma.studentMissionReflection.deleteMany({ where: { runId: { in: runIds } } });
  await prisma.pedagogicalCourseRunAudit.deleteMany({ where: { runId: { in: runIds } } });
  await prisma.pedagogicalCourseRun.deleteMany({ where: { id: { in: runIds } } });
}

const cohorts = await prisma.cohort.findMany({
  where: { code: { startsWith: TAG } },
  select: { id: true },
});
for (const c of cohorts) {
  await prisma.cohortMembership.deleteMany({ where: { cohortId: c.id } });
  await prisma.cohort.delete({ where: { id: c.id } });
}

await prisma.employee.deleteMany({ where: { employeeNumber: { startsWith: TAG } } });
await prisma.company.deleteMany({ where: { code: { startsWith: TAG } } });
await prisma.course.deleteMany({ where: { code: { startsWith: TAG } } }).catch(() => undefined);

const residue = {
  emp: await prisma.employee.count({ where: { employeeNumber: { startsWith: TAG } } }),
  co: await prisma.company.count({ where: { code: { startsWith: TAG } } }),
  runs: await prisma.pedagogicalCourseRun.count({ where: { runCode: { startsWith: TAG } } }),
  employeesTotal: await prisma.employee.count(),
};
console.log(JSON.stringify({ ok: true, qa_residue: residue.emp + residue.co + residue.runs, ...residue }, null, 2));
await prisma.$disconnect();
