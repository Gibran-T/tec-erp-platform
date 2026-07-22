/**
 * Institutional analytics run selection policy.
 *
 * Default mode: OFFICIAL_COHORT_RESULT — one official run per learner.
 * Excludes CANCELLED and DEMONSTRATION runs from official metrics.
 *
 * Precedence for official run:
 * 1. latest COMPLETED eligible run (highest runSequence)
 * 2. ACTIVE eligible run
 * 3. latest PAUSED eligible run
 * 4. latest PLANNED eligible run
 * 5. legacy runSequence = 1 when present
 */
import type { AnalyticsMode } from "@tec-platform/contracts";
import { getPrismaClient } from "@tec-platform/database-erp";

export const DEFAULT_ANALYTICS_MODE: AnalyticsMode = "OFFICIAL_COHORT_RESULT";

const EXCLUDED_TYPES = new Set(["DEMONSTRATION"]);
const EXCLUDED_STATUSES = new Set(["CANCELLED"]);

export type RunCandidate = {
  id: string;
  employeeId: string;
  runSequence: number;
  runType: string;
  status: string;
  runCode?: string;
  curriculumVersion?: string | null;
};

export function isEligibleForOfficial(run: Pick<RunCandidate, "runType" | "status">): boolean {
  return !EXCLUDED_TYPES.has(run.runType) && !EXCLUDED_STATUSES.has(run.status);
}

export function pickOfficialRun(runs: readonly RunCandidate[]): RunCandidate | null {
  const eligible = runs.filter(isEligibleForOfficial);
  if (eligible.length === 0) {
    return null;
  }
  const bySeqDesc = [...eligible].sort((a, b) => b.runSequence - a.runSequence);
  const completed = bySeqDesc.find((run) => run.status === "COMPLETED" || run.status === "ARCHIVED");
  if (completed) {
    return completed;
  }
  const active = bySeqDesc.find((run) => run.status === "ACTIVE");
  if (active) {
    return active;
  }
  const paused = bySeqDesc.find((run) => run.status === "PAUSED");
  if (paused) {
    return paused;
  }
  const planned = bySeqDesc.find((run) => run.status === "PLANNED");
  if (planned) {
    return planned;
  }
  return bySeqDesc.find((run) => run.runSequence === 1) ?? bySeqDesc[0] ?? null;
}

export function parseAnalyticsMode(raw: unknown): AnalyticsMode {
  if (
    raw === "OFFICIAL_COHORT_RESULT" ||
    raw === "LEARNER_CURRENT_RUN" ||
    raw === "LEARNER_SELECTED_RUN" ||
    raw === "UNIQUE_STUDENT_LATEST" ||
    raw === "ALL_RUNS"
  ) {
    return raw;
  }
  return DEFAULT_ANALYTICS_MODE;
}

/** Unique students for institutional headcount (never double-count runs). */
export function countUniqueStudentsFromRuns(runs: readonly RunCandidate[]): number {
  const officialEligible = runs.filter(isEligibleForOfficial);
  const byEmployee = new Map<string, RunCandidate[]>();
  for (const run of officialEligible) {
    const list = byEmployee.get(run.employeeId) ?? [];
    list.push(run);
    byEmployee.set(run.employeeId, list);
  }
  let count = 0;
  for (const list of byEmployee.values()) {
    if (pickOfficialRun(list)) {
      count += 1;
    }
  }
  return count;
}

export async function resolveOfficialRunIdForEmployee(
  employeeId: string,
  courseId?: string,
): Promise<string | null> {
  const prisma = getPrismaClient();
  const runs = await prisma.pedagogicalCourseRun.findMany({
    where: {
      employeeId,
      ...(courseId ? { courseId } : {}),
    },
    select: {
      id: true,
      employeeId: true,
      runSequence: true,
      runType: true,
      status: true,
    },
  });
  return pickOfficialRun(runs)?.id ?? null;
}

export async function resolveRunIdsForAnalytics(input: {
  readonly employeeId: string;
  readonly mode: AnalyticsMode;
  readonly selectedRunId?: string | null;
  readonly courseId?: string;
}): Promise<string[] | "ALL"> {
  if (input.mode === "ALL_RUNS") {
    return "ALL";
  }
  const prisma = getPrismaClient();
  if (input.mode === "LEARNER_SELECTED_RUN" && input.selectedRunId) {
    const run = await prisma.pedagogicalCourseRun.findFirst({
      where: { id: input.selectedRunId, employeeId: input.employeeId },
    });
    return run ? [run.id] : [];
  }
  if (input.mode === "LEARNER_CURRENT_RUN") {
    const active = await prisma.pedagogicalCourseRun.findFirst({
      where: {
        employeeId: input.employeeId,
        status: "ACTIVE",
        runType: { not: "DEMONSTRATION" },
      },
      orderBy: { updatedAt: "desc" },
    });
    return active ? [active.id] : [];
  }
  // OFFICIAL_COHORT_RESULT and UNIQUE_STUDENT_LATEST share official pick
  const officialId = await resolveOfficialRunIdForEmployee(input.employeeId, input.courseId);
  return officialId ? [officialId] : [];
}
