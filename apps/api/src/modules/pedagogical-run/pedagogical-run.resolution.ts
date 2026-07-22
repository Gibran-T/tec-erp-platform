import { DomainError } from "@tec-platform/core";
import type { PedagogicalRunStatus } from "@tec-platform/contracts";
import { getPrismaClient } from "@tec-platform/database-erp";

const WRITE_STATUSES: ReadonlySet<PedagogicalRunStatus> = new Set(["ACTIVE"]);
const HISTORICAL_STATUSES: ReadonlySet<PedagogicalRunStatus> = new Set([
  "COMPLETED",
  "ARCHIVED",
  "CANCELLED",
]);

export interface ResolvedPedagogicalRun {
  readonly id: string;
  readonly employeeId: string;
  readonly companyId: string;
  readonly courseId: string;
  readonly status: PedagogicalRunStatus;
  readonly runCode: string;
  readonly runSequence: number;
  readonly isWritable: boolean;
  readonly isHistorical: boolean;
}

export async function resolvePedagogicalRunForEmployee(input: {
  readonly employeeId: string;
  readonly explicitRunId?: string | null;
  readonly forWrite?: boolean;
}): Promise<ResolvedPedagogicalRun | null> {
  const prisma = getPrismaClient();
  const forWrite = input.forWrite === true;

  if (input.explicitRunId) {
    const run = await prisma.pedagogicalCourseRun.findUnique({
      where: { id: input.explicitRunId },
    });
    if (!run || run.employeeId !== input.employeeId) {
      throw DomainError.forbidden( "Parcours pédagogique non autorisé.");
    }
    return toResolved(run, forWrite);
  }

  const active = await prisma.pedagogicalCourseRun.findFirst({
    where: { employeeId: input.employeeId, status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
  });
  if (active) {
    return toResolved(active, forWrite);
  }

  if (forWrite) {
    return null;
  }

  const paused = await prisma.pedagogicalCourseRun.findFirst({
    where: { employeeId: input.employeeId, status: "PAUSED" },
    orderBy: { updatedAt: "desc" },
  });
  if (paused) {
    return toResolved(paused, false);
  }

  const historical = await prisma.pedagogicalCourseRun.findFirst({
    where: {
      employeeId: input.employeeId,
      status: { in: ["COMPLETED", "ARCHIVED", "CANCELLED", "PLANNED"] },
    },
    orderBy: [{ runSequence: "desc" }, { updatedAt: "desc" }],
  });
  if (historical) {
    return toResolved(historical, false);
  }

  return null;
}

export async function requireWritableRun(input: {
  readonly employeeId: string;
  readonly explicitRunId?: string | null;
}): Promise<ResolvedPedagogicalRun> {
  const run = await resolvePedagogicalRunForEmployee({
    employeeId: input.employeeId,
    explicitRunId: input.explicitRunId,
    forWrite: true,
  });
  if (!run) {
    throw DomainError.conflict(
      "Aucun parcours ACTIVE. Demandez à votre professeur ou administrateur d'activer un parcours.",
    );
  }
  if (!run.isWritable) {
    throw DomainError.conflict(
      "Ce parcours est en lecture seule. Les soumissions ne sont pas autorisées.",
    );
  }
  return run;
}

function toResolved(
  run: {
    id: string;
    employeeId: string;
    companyId: string;
    courseId: string;
    status: string;
    runCode: string;
    runSequence: number;
  },
  forWrite: boolean,
): ResolvedPedagogicalRun {
  const status = run.status as PedagogicalRunStatus;
  const isWritable = WRITE_STATUSES.has(status);
  const isHistorical = HISTORICAL_STATUSES.has(status);
  if (forWrite && !isWritable) {
    throw DomainError.conflict(
      "Écriture refusée : le parcours sélectionné n'est pas ACTIVE.",
    );
  }
  return {
    id: run.id,
    employeeId: run.employeeId,
    companyId: run.companyId,
    courseId: run.courseId,
    status,
    runCode: run.runCode,
    runSequence: run.runSequence,
    isWritable,
    isHistorical,
  };
}
