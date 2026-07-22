/**
 * Local isolated smoke for versioned pedagogical runs (Prisma-only).
 * DATABASE_URL default: postgresql://tec:tec@localhost:5435/tec_vr_populated
 * Never targets production. Cleans temporary records (QA residue = 0).
 */
import { createHash, randomUUID } from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client") as {
  PrismaClient: new (args?: { datasources?: { db?: { url: string } } }) => {
    company: {
      createMany: (args: unknown) => Promise<unknown>;
      deleteMany: (args: unknown) => Promise<unknown>;
    };
    employee: {
      createMany: (args: unknown) => Promise<unknown>;
      deleteMany: (args: unknown) => Promise<unknown>;
    };
    cohort: {
      createMany: (args: unknown) => Promise<unknown>;
      deleteMany: (args: unknown) => Promise<unknown>;
    };
    cohortMembership: {
      createMany: (args: unknown) => Promise<unknown>;
      deleteMany: (args: unknown) => Promise<unknown>;
    };
    course: { findUnique: (args: unknown) => Promise<{ id: string } | null> };
    pedagogicalCourseRun: {
      create: (args: unknown) => Promise<unknown>;
      findUniqueOrThrow: (args: unknown) => Promise<{
        runCode: string;
        completionPercent: number;
        sourceRunId: string | null;
      }>;
      findMany: (args: unknown) => Promise<
        Array<{ employeeId: string; status: string; runSequence: number }>
      >;
      count: (args: unknown) => Promise<number>;
      deleteMany: (args: unknown) => Promise<unknown>;
    };
    missionDefinition: { findFirst: (args: unknown) => Promise<{ id: string } | null> };
    missionAttempt: {
      create: (args: unknown) => Promise<unknown>;
      deleteMany: (args: unknown) => Promise<unknown>;
    };
    employeeCourseProgress: {
      create: (args: unknown) => Promise<unknown>;
      deleteMany: (args: unknown) => Promise<unknown>;
    };
    certificate: {
      create: (args: unknown) => Promise<unknown>;
      deleteMany: (args: unknown) => Promise<unknown>;
    };
    professorIntervention: {
      create: (args: unknown) => Promise<unknown>;
      deleteMany: (args: unknown) => Promise<unknown>;
    };
    pedagogicalCourseRunAudit: { deleteMany: (args: unknown) => Promise<unknown> };
    $disconnect: () => Promise<void>;
  };
};

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://tec:tec@localhost:5435/tec_vr_populated";
const prisma = new PrismaClient({ datasources: { db: { url: DATABASE_URL } } });

async function main(): Promise<void> {
  const suffix = createHash("sha1").update(randomUUID()).digest("hex").slice(0, 8);
  const ids = {
    companyA: `vr_co_a_${suffix}`,
    companyB: `vr_co_b_${suffix}`,
    adminA: `vr_adm_a_${suffix}`,
    professorA: `vr_prof_a_${suffix}`,
    professorB: `vr_prof_b_${suffix}`,
    studentA: `vr_stu_a_${suffix}`,
    studentB: `vr_stu_b_${suffix}`,
    cohortA: `vr_coh_a_${suffix}`,
    cohortB: `vr_coh_b_${suffix}`,
    run1: `vr_run1_${suffix}`,
    run2: `vr_run2_${suffix}`,
  };

  try {
    await prisma.company.createMany({
      data: [
        { id: ids.companyA, code: `VR-A-${suffix}`, name: "Company A" },
        { id: ids.companyB, code: `VR-B-${suffix}`, name: "Company B" },
      ],
    });
    await prisma.employee.createMany({
      data: [
        {
          id: ids.adminA,
          employeeNumber: `ADM-A-${suffix}`,
          email: `adm-a-${suffix}@vr.test`,
          displayName: "Admin A",
          passwordHash: "x",
          role: "ADMIN",
          companyId: ids.companyA,
        },
        {
          id: ids.professorA,
          employeeNumber: `PROF-A-${suffix}`,
          email: `prof-a-${suffix}@vr.test`,
          displayName: "Professor A",
          passwordHash: "x",
          role: "PROFESSOR",
          companyId: ids.companyA,
        },
        {
          id: ids.professorB,
          employeeNumber: `PROF-B-${suffix}`,
          email: `prof-b-${suffix}@vr.test`,
          displayName: "Professor B",
          passwordHash: "x",
          role: "PROFESSOR",
          companyId: ids.companyB,
        },
        {
          id: ids.studentA,
          employeeNumber: `STU-A-${suffix}`,
          email: `stu-a-${suffix}@vr.test`,
          displayName: "Student A",
          passwordHash: "x",
          role: "JR_BUSINESS_ANALYST",
          companyId: ids.companyA,
        },
        {
          id: ids.studentB,
          employeeNumber: `STU-B-${suffix}`,
          email: `stu-b-${suffix}@vr.test`,
          displayName: "Student B",
          passwordHash: "x",
          role: "JR_BUSINESS_ANALYST",
          companyId: ids.companyB,
        },
      ],
    });
    await prisma.cohort.createMany({
      data: [
        { id: ids.cohortA, code: `VR-COH-A-${suffix}`, name: "Cohort A", companyId: ids.companyA },
        { id: ids.cohortB, code: `VR-COH-B-${suffix}`, name: "Cohort B", companyId: ids.companyB },
      ],
    });
    await prisma.cohortMembership.createMany({
      data: [
        {
          id: `cm_pa_${suffix}`,
          cohortId: ids.cohortA,
          employeeId: ids.professorA,
          roleInCohort: "professor",
        },
        {
          id: `cm_sa_${suffix}`,
          cohortId: ids.cohortA,
          employeeId: ids.studentA,
          roleInCohort: "student",
        },
        {
          id: `cm_pb_${suffix}`,
          cohortId: ids.cohortB,
          employeeId: ids.professorB,
          roleInCohort: "professor",
        },
        {
          id: `cm_sb_${suffix}`,
          cohortId: ids.cohortB,
          employeeId: ids.studentB,
          roleInCohort: "student",
        },
      ],
    });

    const course = await prisma.course.findUnique({ where: { code: "TEC_ERP_V1" } });
    if (!course) throw new Error("TEC_ERP_V1 missing");

    await prisma.pedagogicalCourseRun.create({
      data: {
        id: ids.run1,
        companyId: ids.companyA,
        cohortId: ids.cohortA,
        employeeId: ids.studentA,
        courseId: course.id,
        runCode: `VR-${suffix}-RUN1`,
        runSequence: 1,
        runType: "AUTONOMOUS",
        runLabel: "Student A — Run 1 — Autonomous",
        language: "fr",
        status: "COMPLETED",
        createdById: ids.adminA,
        completionPercent: 100,
        completedAt: new Date(),
        startedAt: new Date(),
      },
    });

    const mission = await prisma.missionDefinition.findFirst({ orderBy: { id: "asc" } });
    if (!mission) throw new Error("No mission");
    await prisma.missionAttempt.create({
      data: {
        id: `ma_r1_${suffix}`,
        employeeId: ids.studentA,
        missionDefinitionId: mission.id,
        pedagogicalCourseRunId: ids.run1,
        attemptNumber: 1,
        status: "completed",
        startedAt: new Date(),
        scorePercent: 90,
        responsesJson: {},
      },
    });
    await prisma.employeeCourseProgress.create({
      data: {
        id: `ecp_r1_${suffix}`,
        employeeId: ids.studentA,
        courseId: course.id,
        pedagogicalCourseRunId: ids.run1,
        percentComplete: 100,
        status: "completed",
      },
    });
    await prisma.certificate.create({
      data: {
        id: `cert_r1_${suffix}`,
        employeeId: ids.studentA,
        cohortId: ids.cohortA,
        certificateType: "GOLD",
        certificateNumber: `CERT-VR-${suffix}`,
        issuedAt: new Date(),
        status: "issued",
        competencySummaryJson: {},
        verificationStatus: "valid",
        sourceRunId: ids.run1,
        achievementType: "GOLD",
      },
    });

    await prisma.pedagogicalCourseRun.create({
      data: {
        id: ids.run2,
        companyId: ids.companyA,
        cohortId: ids.cohortA,
        employeeId: ids.studentA,
        professorId: ids.professorA,
        courseId: course.id,
        runCode: `VR-${suffix}-RUN2`,
        runSequence: 2,
        runType: "INSTRUCTOR_LED",
        runLabel: "Student A — Run 2 — Instructor-Led",
        language: "fr",
        status: "ACTIVE",
        sourceRunId: ids.run1,
        createdById: ids.adminA,
        completionPercent: 0,
        startedAt: new Date(),
      },
    });

    const run1 = await prisma.pedagogicalCourseRun.findUniqueOrThrow({ where: { id: ids.run1 } });
    const run2 = await prisma.pedagogicalCourseRun.findUniqueOrThrow({ where: { id: ids.run2 } });
    if (run1.completionPercent !== 100) throw new Error("Run1 mutated");
    if (run2.completionPercent !== 0) throw new Error("Run2 not independent");
    if (run2.sourceRunId !== ids.run1) throw new Error("Lineage missing");

    const crossCompany = await prisma.pedagogicalCourseRun.count({
      where: { companyId: ids.companyB, employeeId: ids.studentA },
    });
    if (crossCompany !== 0) throw new Error("Cross-company leakage");

    // Unique-student institutional metric (ACTIVE preferred)
    const runs = await prisma.pedagogicalCourseRun.findMany({
      where: { companyId: ids.companyA, status: { not: "CANCELLED" } },
      select: { employeeId: true, status: true, runSequence: true },
    });
    const chosen = new Map<string, { status: string; runSequence: number }>();
    for (const run of runs) {
      const prev = chosen.get(run.employeeId);
      if (!prev || run.status === "ACTIVE" || (prev.status !== "ACTIVE" && run.runSequence > prev.runSequence)) {
        if (!prev || run.status === "ACTIVE" || prev.status !== "ACTIVE") {
          chosen.set(run.employeeId, run);
        }
      }
    }
    if (chosen.size !== 1) throw new Error(`unique students expected 1 got ${chosen.size}`);

    await prisma.professorIntervention.create({
      data: {
        id: `pi_${suffix}`,
        runId: ids.run2,
        professorId: ids.professorA,
        interventionType: "CLARIFICATION",
        reason: "smoke",
        content: "clarified process",
      },
    });

    // Invalid: cannot have two ACTIVE
    let dualActiveBlocked = false;
    try {
      await prisma.pedagogicalCourseRun.create({
        data: {
          id: `vr_run_bad_${suffix}`,
          companyId: ids.companyA,
          employeeId: ids.studentA,
          courseId: course.id,
          runCode: `VR-${suffix}-BAD`,
          runSequence: 3,
          runType: "DEMONSTRATION",
          runLabel: "bad dual active",
          language: "fr",
          status: "ACTIVE",
          createdById: ids.adminA,
          completionPercent: 0,
        },
      });
    } catch {
      dualActiveBlocked = true;
    }
    if (!dualActiveBlocked) throw new Error("Dual ACTIVE should be blocked by partial unique index");

    console.log(
      JSON.stringify({
        ok: true,
        suffix,
        run1: run1.runCode,
        run2: run2.runCode,
        uniqueStudents: chosen.size,
        dualActiveBlocked,
      }),
    );
  } finally {
    await prisma.professorIntervention.deleteMany({
      where: { run: { companyId: { in: [ids.companyA, ids.companyB] } } },
    });
    await prisma.certificate.deleteMany({
      where: { employeeId: { in: [ids.studentA, ids.studentB] } },
    });
    await prisma.missionAttempt.deleteMany({
      where: { employeeId: { in: [ids.studentA, ids.studentB] } },
    });
    await prisma.employeeCourseProgress.deleteMany({
      where: { employeeId: { in: [ids.studentA, ids.studentB] } },
    });
    await prisma.pedagogicalCourseRunAudit.deleteMany({
      where: { run: { companyId: { in: [ids.companyA, ids.companyB] } } },
    });
    await prisma.pedagogicalCourseRun.deleteMany({
      where: { companyId: { in: [ids.companyA, ids.companyB] } },
    });
    await prisma.cohortMembership.deleteMany({
      where: { cohortId: { in: [ids.cohortA, ids.cohortB] } },
    });
    await prisma.cohort.deleteMany({ where: { id: { in: [ids.cohortA, ids.cohortB] } } });
    await prisma.employee.deleteMany({
      where: {
        id: { in: [ids.adminA, ids.professorA, ids.professorB, ids.studentA, ids.studentB] },
      },
    });
    await prisma.company.deleteMany({ where: { id: { in: [ids.companyA, ids.companyB] } } });
    const residue = await prisma.pedagogicalCourseRun.count({
      where: { companyId: { in: [ids.companyA, ids.companyB] } },
    });
    console.log(JSON.stringify({ qaResidue: residue }));
    if (residue !== 0) process.exitCode = 1;
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
