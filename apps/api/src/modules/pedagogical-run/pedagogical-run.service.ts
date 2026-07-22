import { DomainError, Result, type ResultType } from "@tec-platform/core";
import {
  PedagogicalRunStatusLabelFr,
  PedagogicalRunTypeLabelFr,
  type CreatePedagogicalCourseRunRequest,
  type PedagogicalCourseRun,
  type PedagogicalRunComparison,
  type PedagogicalRunStatus,
  type TransitionPedagogicalCourseRunRequest,
} from "@tec-platform/contracts";
import { getPrismaClient } from "@tec-platform/database-erp";

type PrismaRun = {
  id: string;
  companyId: string;
  cohortId: string | null;
  employeeId: string;
  professorId: string | null;
  courseId: string;
  runCode: string;
  runSequence: number;
  runType: string;
  runLabel: string;
  language: string;
  status: string;
  sourceRunId: string | null;
  startedAt: Date | null;
  pausedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  completionPercent: number;
};

const DEFAULT_COURSE_CODE = "TEC_ERP_V1";
const TOTAL_MISSIONS = 30;

const TRANSITIONS: Record<string, PedagogicalRunStatus> = {
  "PLANNED:start": "ACTIVE",
  "ACTIVE:pause": "PAUSED",
  "PAUSED:resume": "ACTIVE",
  "ACTIVE:complete": "COMPLETED",
  "PAUSED:cancel": "CANCELLED",
  "PLANNED:cancel": "CANCELLED",
  "COMPLETED:archive": "ARCHIVED",
  "CANCELLED:archive": "ARCHIVED",
};

function mapRun(run: PrismaRun): PedagogicalCourseRun {
  const status = run.status as PedagogicalRunStatus;
  const runType = run.runType as keyof typeof PedagogicalRunTypeLabelFr;
  return {
    id: run.id,
    companyId: run.companyId,
    cohortId: run.cohortId,
    employeeId: run.employeeId,
    professorId: run.professorId,
    courseId: run.courseId,
    runCode: run.runCode,
    runSequence: run.runSequence,
    runType,
    runLabel: run.runLabel,
    language: run.language,
    status,
    sourceRunId: run.sourceRunId,
    startedAt: run.startedAt?.toISOString() ?? null,
    pausedAt: run.pausedAt?.toISOString() ?? null,
    completedAt: run.completedAt?.toISOString() ?? null,
    cancelledAt: run.cancelledAt?.toISOString() ?? null,
    completionPercent: run.completionPercent,
    runTypeLabel: PedagogicalRunTypeLabelFr[runType] ?? run.runType,
    statusLabel: PedagogicalRunStatusLabelFr[status] ?? run.status,
    isWritable: status === "ACTIVE",
    isHistorical: status === "COMPLETED" || status === "ARCHIVED" || status === "CANCELLED",
  };
}

export function createPedagogicalRunService() {
  return {
    async listForEmployee(employeeId: string): Promise<ResultType<readonly PedagogicalCourseRun[]>> {
      const prisma = getPrismaClient();
      const rows = await prisma.pedagogicalCourseRun.findMany({
        where: { employeeId },
        orderBy: [{ runSequence: "asc" }],
      });
      return Result.ok(rows.map(mapRun));
    },

    async listForCompany(companyId: string, filters?: {
      employeeId?: string;
      cohortId?: string;
      professorId?: string;
      status?: string;
      runType?: string;
    }): Promise<ResultType<readonly PedagogicalCourseRun[]>> {
      const prisma = getPrismaClient();
      const rows = await prisma.pedagogicalCourseRun.findMany({
        where: {
          companyId,
          employeeId: filters?.employeeId,
          cohortId: filters?.cohortId,
          professorId: filters?.professorId,
          status: filters?.status,
          runType: filters?.runType,
        },
        orderBy: [{ updatedAt: "desc" }],
        take: 500,
      });
      return Result.ok(rows.map(mapRun));
    },

    async createRun(input: {
      readonly actorId: string;
      readonly actorRole: string;
      readonly actorCompanyId: string;
      readonly request: CreatePedagogicalCourseRunRequest;
    }): Promise<ResultType<PedagogicalCourseRun>> {
      const prisma = getPrismaClient();
      const student = await prisma.employee.findUnique({ where: { id: input.request.employeeId } });
      if (!student || student.companyId !== input.actorCompanyId) {
        return Result.fail(DomainError.forbidden( "Étudiant hors de votre entreprise."));
      }

      const course = await prisma.course.findUnique({ where: { code: DEFAULT_COURSE_CODE } });
      if (!course) {
        return Result.fail(DomainError.notFound( "Cours TEC_ERP_V1 introuvable."));
      }

      let cohortId = input.request.cohortId ?? null;
      if (cohortId) {
        const cohort = await prisma.cohort.findUnique({ where: { id: cohortId } });
        if (!cohort || cohort.companyId !== input.actorCompanyId) {
          return Result.fail(DomainError.forbidden( "Cohorte hors de votre entreprise."));
        }
        const membership = await prisma.cohortMembership.findFirst({
          where: { cohortId, employeeId: student.id, roleInCohort: "student" },
        });
        if (!membership) {
          return Result.fail(DomainError.validation( "L'étudiant n'appartient pas à cette cohorte."));
        }
      } else {
        const membership = await prisma.cohortMembership.findFirst({
          where: { employeeId: student.id, roleInCohort: "student" },
          include: { cohort: true },
          orderBy: { createdAt: "asc" },
        });
        cohortId = membership?.cohortId ?? null;
      }

      if (input.request.professorId) {
        const professor = await prisma.employee.findUnique({ where: { id: input.request.professorId } });
        if (!professor || professor.companyId !== input.actorCompanyId || professor.role !== "PROFESSOR") {
          return Result.fail(DomainError.validation( "Professeur invalide pour cette entreprise."));
        }
        if (input.actorRole === "PROFESSOR" && input.actorId !== professor.id) {
          return Result.fail(DomainError.forbidden( "Un professeur ne peut affecter que lui-même."));
        }
        if (cohortId) {
          const assigned = await prisma.cohortMembership.findFirst({
            where: { cohortId, employeeId: professor.id, roleInCohort: "professor" },
          });
          if (!assigned && input.actorRole !== "ADMIN") {
            return Result.fail(DomainError.forbidden( "Professeur non affecté à la cohorte."));
          }
        }
      }

      const professorId =
        input.request.professorId ??
        (input.actorRole === "PROFESSOR" ? input.actorId : null);

      if (input.request.sourceRunId) {
        const source = await prisma.pedagogicalCourseRun.findUnique({
          where: { id: input.request.sourceRunId },
        });
        if (!source || source.companyId !== input.actorCompanyId) {
          return Result.fail(DomainError.validation( "Parcours source invalide."));
        }
        if (source.employeeId !== student.id) {
          return Result.fail(DomainError.validation( "Le parcours source doit appartenir au même étudiant."));
        }
      }

      const last = await prisma.pedagogicalCourseRun.findFirst({
        where: { employeeId: student.id, courseId: course.id },
        orderBy: { runSequence: "desc" },
      });
      const runSequence = (last?.runSequence ?? 0) + 1;
      if (runSequence < 2 && last) {
        // keep sequential
      }

      const cohort = cohortId
        ? await prisma.cohort.findUnique({ where: { id: cohortId } })
        : null;
      const company = await prisma.company.findUnique({ where: { id: student.companyId } });
      const defaultCode = `${cohort?.code ?? company?.code ?? "RUN"}-${student.employeeNumber}-RUN${runSequence}`;
      const runCode = input.request.runCode?.trim() || defaultCode;

      try {
        const created = await prisma.$transaction(async (tx) => {
          const run = await tx.pedagogicalCourseRun.create({
            data: {
              companyId: student.companyId,
              cohortId,
              employeeId: student.id,
              professorId,
              courseId: course.id,
              runCode,
              runSequence,
              runType: input.request.runType,
              runLabel: input.request.runLabel,
              language: input.request.language ?? "fr",
              status: "PLANNED",
              sourceRunId: input.request.sourceRunId ?? null,
              createdById: input.actorId,
              completionPercent: 0,
              metadataJson: {
                reason: input.request.reason,
                plannedStartAt: input.request.plannedStartAt ?? null,
              },
            },
          });
          await tx.pedagogicalCourseRunAudit.create({
            data: {
              runId: run.id,
              actorId: input.actorId,
              action: "create",
              toStatus: "PLANNED",
              reason: input.request.reason,
              payloadJson: { runCode: run.runCode, runSequence: run.runSequence },
            },
          });
          return run;
        });
        return Result.ok(mapRun(created));
      } catch (error) {
        const message = error instanceof Error ? error.message : "create_failed";
        if (message.includes("Unique constraint") || message.includes("unique")) {
          return Result.fail(DomainError.conflict( "Code de parcours déjà utilisé."));
        }
        throw error;
      }
    },

    async transition(input: {
      readonly actorId: string;
      readonly actorRole: string;
      readonly actorCompanyId: string;
      readonly runId: string;
      readonly request: TransitionPedagogicalCourseRunRequest;
    }): Promise<ResultType<PedagogicalCourseRun>> {
      const prisma = getPrismaClient();
      const run = await prisma.pedagogicalCourseRun.findUnique({ where: { id: input.runId } });
      if (!run || run.companyId !== input.actorCompanyId) {
        return Result.fail(DomainError.notFound( "Parcours introuvable."));
      }
      if (input.actorRole === "PROFESSOR") {
        const ok =
          run.professorId === input.actorId ||
          (run.cohortId
            ? await prisma.cohortMembership.findFirst({
                where: {
                  cohortId: run.cohortId,
                  employeeId: input.actorId,
                  roleInCohort: "professor",
                },
              })
            : null);
        if (!ok) {
          return Result.fail(DomainError.forbidden( "Parcours non assigné à ce professeur."));
        }
      }

      const key = `${run.status}:${input.request.action}`;
      const next = TRANSITIONS[key];
      if (!next) {
        return Result.fail(
          DomainError.validation( `Transition invalide: ${run.status} → ${input.request.action}`),
        );
      }

      if (input.request.action === "start" || input.request.action === "resume") {
        const otherActive = await prisma.pedagogicalCourseRun.findFirst({
          where: {
            employeeId: run.employeeId,
            courseId: run.courseId,
            status: "ACTIVE",
            NOT: { id: run.id },
          },
        });
        if (otherActive) {
          return Result.fail(
            DomainError.conflict(
              `Un parcours ACTIVE existe déjà (${otherActive.runCode}). Mettez-le en pause avant d'activer celui-ci.`,
            ),
          );
        }
      }

      if (input.request.action === "complete") {
        const completed = await prisma.missionAttempt.count({
          where: {
            pedagogicalCourseRunId: run.id,
            status: "completed",
          },
        });
        if (completed < TOTAL_MISSIONS) {
          return Result.fail(
            DomainError.validation(
              `Clôture refusée: ${completed}/${TOTAL_MISSIONS} missions complétées.`,
            ),
          );
        }
      }

      const now = new Date();
      const updated = await prisma.$transaction(async (tx) => {
        const row = await tx.pedagogicalCourseRun.update({
          where: { id: run.id },
          data: {
            status: next,
            startedAt:
              input.request.action === "start" ? now : run.startedAt ?? undefined,
            pausedAt: input.request.action === "pause" ? now : run.pausedAt,
            completedAt: input.request.action === "complete" ? now : run.completedAt,
            cancelledAt: input.request.action === "cancel" ? now : run.cancelledAt,
          },
        });
        await tx.pedagogicalCourseRunAudit.create({
          data: {
            runId: run.id,
            actorId: input.actorId,
            action: input.request.action,
            fromStatus: run.status,
            toStatus: next,
            reason: input.request.reason ?? null,
          },
        });
        return row;
      });
      return Result.ok(mapRun(updated));
    },

    async compare(input: {
      readonly actorCompanyId: string;
      readonly leftRunId: string;
      readonly rightRunId: string;
    }): Promise<ResultType<PedagogicalRunComparison>> {
      const prisma = getPrismaClient();
      const [left, right] = await Promise.all([
        prisma.pedagogicalCourseRun.findUnique({ where: { id: input.leftRunId } }),
        prisma.pedagogicalCourseRun.findUnique({ where: { id: input.rightRunId } }),
      ]);
      if (!left || !right || left.companyId !== input.actorCompanyId || right.companyId !== input.actorCompanyId) {
        return Result.fail(DomainError.forbidden( "Comparaison hors périmètre."));
      }
      if (left.employeeId !== right.employeeId) {
        return Result.fail(DomainError.validation( "Les parcours doivent appartenir au même étudiant."));
      }

      const [leftAttempts, rightAttempts, leftAssess, rightAssess, leftCap, rightCap, leftCerts, rightCerts] =
        await Promise.all([
          prisma.missionAttempt.findMany({ where: { pedagogicalCourseRunId: left.id } }),
          prisma.missionAttempt.findMany({ where: { pedagogicalCourseRunId: right.id } }),
          prisma.assessmentAttempt.findMany({
            where: { pedagogicalCourseRunId: left.id },
            include: { assessment: true },
          }),
          prisma.assessmentAttempt.findMany({
            where: { pedagogicalCourseRunId: right.id },
            include: { assessment: true },
          }),
          prisma.capstoneSubmission.findUnique({
            where: {
              employeeId_pedagogicalCourseRunId: {
                employeeId: left.employeeId,
                pedagogicalCourseRunId: left.id,
              },
            },
          }),
          prisma.capstoneSubmission.findUnique({
            where: {
              employeeId_pedagogicalCourseRunId: {
                employeeId: right.employeeId,
                pedagogicalCourseRunId: right.id,
              },
            },
          }),
          prisma.certificate.findMany({ where: { sourceRunId: left.id } }),
          prisma.certificate.findMany({ where: { sourceRunId: right.id } }),
        ]);

      const scoreMap = (attempts: typeof leftAttempts) => {
        const map = new Map<string, number | null>();
        for (const a of attempts) {
          // best score per mission later keyed externally
          void a;
        }
        return map;
      };
      void scoreMap;

      const leftByMission = new Map<string, number | null>();
      for (const a of leftAttempts) {
        const def = await prisma.missionDefinition.findUnique({ where: { id: a.missionDefinitionId } });
        if (!def) continue;
        const prev = leftByMission.get(def.missionKey);
        if (prev == null || (a.scorePercent ?? -1) > prev) {
          leftByMission.set(def.missionKey, a.scorePercent);
        }
      }
      const rightByMission = new Map<string, number | null>();
      for (const a of rightAttempts) {
        const def = await prisma.missionDefinition.findUnique({ where: { id: a.missionDefinitionId } });
        if (!def) continue;
        const prev = rightByMission.get(def.missionKey);
        if (prev == null || (a.scorePercent ?? -1) > prev) {
          rightByMission.set(def.missionKey, a.scorePercent);
        }
      }
      const keys = new Set([...leftByMission.keys(), ...rightByMission.keys()]);
      const avg = (attempts: typeof leftAttempts) => {
        const scores = attempts
          .filter((a) => a.status === "completed" && a.scorePercent != null)
          .map((a) => a.scorePercent as number);
        if (scores.length === 0) return null;
        return scores.reduce((s, n) => s + n, 0) / scores.length;
      };

      return Result.ok({
        left: mapRun(left),
        right: mapRun(right),
        completedMissionsLeft: leftAttempts.filter((a) => a.status === "completed").length,
        completedMissionsRight: rightAttempts.filter((a) => a.status === "completed").length,
        totalMissions: TOTAL_MISSIONS,
        averageScoreLeft: avg(leftAttempts),
        averageScoreRight: avg(rightAttempts),
        attemptCountLeft: leftAttempts.length,
        attemptCountRight: rightAttempts.length,
        assessmentSummaryLeft: leftAssess.map((a) => ({
          code: a.assessment.code,
          status: a.status,
          scorePercent: a.scorePercent,
        })),
        assessmentSummaryRight: rightAssess.map((a) => ({
          code: a.assessment.code,
          status: a.status,
          scorePercent: a.scorePercent,
        })),
        capstoneStatusLeft: leftCap?.status ?? null,
        capstoneStatusRight: rightCap?.status ?? null,
        certificateProvenanceLeft: leftCerts.map((c) => ({
          type: c.certificateType,
          status: c.status,
          number: c.certificateNumber,
        })),
        certificateProvenanceRight: rightCerts.map((c) => ({
          type: c.certificateType,
          status: c.status,
          number: c.certificateNumber,
        })),
        missionScoreDeltas: [...keys].sort().map((missionKey) => ({
          missionKey,
          scoreLeft: leftByMission.get(missionKey) ?? null,
          scoreRight: rightByMission.get(missionKey) ?? null,
        })),
        professorInterventionRate: null,
        confidenceGain: null,
        noSlidesScore: null,
      });
    },

    async createIntervention(input: {
      readonly professorId: string;
      readonly professorCompanyId: string;
      readonly runId: string;
      readonly body: {
        moduleCode?: string;
        missionCode?: string;
        interventionType: string;
        durationMinutes?: number;
        reason: string;
        content: string;
        outcome?: string;
        shouldSystemTeach?: boolean;
        learningHubCandidate?: boolean;
      };
    }) {
      const prisma = getPrismaClient();
      const run = await prisma.pedagogicalCourseRun.findUnique({ where: { id: input.runId } });
      if (!run || run.companyId !== input.professorCompanyId) {
        return Result.fail(DomainError.notFound( "Parcours introuvable."));
      }
      if (run.professorId && run.professorId !== input.professorId) {
        const membership = run.cohortId
          ? await prisma.cohortMembership.findFirst({
              where: {
                cohortId: run.cohortId,
                employeeId: input.professorId,
                roleInCohort: "professor",
              },
            })
          : null;
        if (!membership) {
          return Result.fail(DomainError.forbidden( "Intervention non autorisée."));
        }
      }
      const row = await prisma.professorIntervention.create({
        data: {
          runId: run.id,
          professorId: input.professorId,
          moduleCode: input.body.moduleCode ?? null,
          missionCode: input.body.missionCode ?? null,
          interventionType: input.body.interventionType,
          durationMinutes: input.body.durationMinutes ?? null,
          reason: input.body.reason,
          content: input.body.content,
          outcome: input.body.outcome ?? null,
          shouldSystemTeach: input.body.shouldSystemTeach ?? null,
          learningHubCandidate: input.body.learningHubCandidate ?? null,
        },
      });
      return Result.ok(row);
    },

    async countDistinctStudentsForInstitutionalMetric(companyId: string): Promise<number> {
      const prisma = getPrismaClient();
      // Default: one count per student using ACTIVE run if present else latest runSequence
      const runs = await prisma.pedagogicalCourseRun.findMany({
        where: { companyId, status: { not: "CANCELLED" } },
        select: { employeeId: true, status: true, runSequence: true },
      });
      const chosen = new Map<string, { status: string; runSequence: number }>();
      for (const run of runs) {
        const prev = chosen.get(run.employeeId);
        if (!prev) {
          chosen.set(run.employeeId, run);
          continue;
        }
        if (run.status === "ACTIVE") {
          chosen.set(run.employeeId, run);
          continue;
        }
        if (prev.status !== "ACTIVE" && run.runSequence > prev.runSequence) {
          chosen.set(run.employeeId, run);
        }
      }
      return chosen.size;
    },
  };
}

export type PedagogicalRunService = ReturnType<typeof createPedagogicalRunService>;

