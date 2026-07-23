import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";
import {
  DEFAULT_CURRICULUM_VERSION,
  parseCurriculumVersion,
} from "@tec-platform/mission-catalog";

import {
  getCurrentPedagogicalRun,
  requireCurrentPedagogicalRunId,
} from "../pedagogical-run/run-context.js";
import {
  areRegularMissionsComplete,
  CAPSTONE_LIFECYCLE_LABEL_FR,
  CAPSTONE_STAGES_V2,
  computeCapstoneLifecycle,
  type CapstoneLifecycleStatus,
} from "./capstone.lifecycle.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export interface CapstoneSubmitInput {
  readonly diagnose: string;
  readonly prioritize: string;
  readonly execute: string;
  readonly analyze: string;
  readonly recommend: string;
  readonly executiveSummary: string;
}

function mapSubmission(
  row: {
    id: string;
    status: string;
    diagnose: string | null;
    prioritize: string | null;
    execute: string | null;
    analyze: string | null;
    recommend: string | null;
    executiveSummary: string | null;
    submittedAt: Date | null;
    reviewStatus: string | null;
    professorNotes?: string | null;
    professorApproved?: boolean;
    lifecycleStatus?: string | null;
    currentStage?: string | null;
  },
  lifecycleStatus: CapstoneLifecycleStatus,
) {
  return {
    id: row.id,
    status: row.status,
    diagnose: row.diagnose ?? "",
    prioritize: row.prioritize ?? "",
    execute: row.execute ?? "",
    analyze: row.analyze ?? "",
    recommend: row.recommend ?? "",
    executiveSummary: row.executiveSummary,
    submittedAt: row.submittedAt?.toISOString() ?? null,
    reviewStatus: row.reviewStatus,
    professorNotes: row.professorNotes ?? null,
    lifecycleStatus,
    lifecycleStatusLabel: CAPSTONE_LIFECYCLE_LABEL_FR[lifecycleStatus],
    currentStage: row.currentStage ?? (lifecycleStatus === "LOCKED" ? null : "S1"),
    stages: [...CAPSTONE_STAGES_V2],
    separateFromRegularMissions: true as const,
  };
}

async function loadCompletedMissionKeys(
  client: ReturnType<typeof getPrismaClient>,
  employeeId: string,
  pedagogicalCourseRunId: string,
): Promise<Set<string>> {
  const attempts = await client.missionAttempt.findMany({
    where: {
      employeeId,
      pedagogicalCourseRunId,
      status: "completed",
    },
    include: { missionDefinition: true },
  });
  return new Set(attempts.map((attempt) => attempt.missionDefinition.missionKey));
}

function emptySubmission(lifecycleStatus: CapstoneLifecycleStatus) {
  return mapSubmission(
    {
      id: "",
      status: "draft",
      diagnose: null,
      prioritize: null,
      execute: null,
      analyze: null,
      recommend: null,
      executiveSummary: null,
      submittedAt: null,
      reviewStatus: null,
      professorApproved: false,
      currentStage: null,
    },
    lifecycleStatus,
  );
}

export function createCapstoneService(client = getPrismaClient()) {
  return {
    async getSubmission(employeeId: string) {
      const run = getCurrentPedagogicalRun();
      if (!run) {
        return emptySubmission("LOCKED");
      }
      const curriculumVersion = parseCurriculumVersion(
        run.curriculumVersion,
        DEFAULT_CURRICULUM_VERSION,
      );
      const completed = await loadCompletedMissionKeys(client, employeeId, run.id);
      const regularComplete = areRegularMissionsComplete(curriculumVersion, completed);
      const runEligible = run.status === "ACTIVE" || run.status === "COMPLETED";

      const row = await client.capstoneSubmission.findUnique({
        where: {
          employeeId_pedagogicalCourseRunId: {
            employeeId,
            pedagogicalCourseRunId: run.id,
          },
        },
      });
      if (!row) {
        return emptySubmission(
          computeCapstoneLifecycle({
            regularMissionsComplete: regularComplete,
            runEligible,
            status: null,
            reviewStatus: null,
            professorApproved: false,
            hasDraftContent: false,
          }),
        );
      }
      const lifecycleStatus = computeCapstoneLifecycle({
        regularMissionsComplete: regularComplete,
        runEligible,
        status: row.status,
        reviewStatus: row.reviewStatus,
        professorApproved: row.professorApproved,
        hasDraftContent: Boolean(row.diagnose || row.executiveSummary),
      });
      return mapSubmission(row, lifecycleStatus);
    },

    async submit(
      employeeId: string,
      input: CapstoneSubmitInput,
    ): Promise<ResultType<ReturnType<typeof mapSubmission>>> {
      const pedagogicalCourseRunId = requireCurrentPedagogicalRunId();
      const run = getCurrentPedagogicalRun();
      const curriculumVersion = parseCurriculumVersion(
        run?.curriculumVersion,
        DEFAULT_CURRICULUM_VERSION,
      );
      const completed = await loadCompletedMissionKeys(client, employeeId, pedagogicalCourseRunId);
      if (!areRegularMissionsComplete(curriculumVersion, completed)) {
        return Result.fail(
          DomainError.validation(
            "Le Capstone reste verrouillé tant que les 30 missions régulières du curriculum actif ne sont pas terminées.",
          ),
        );
      }

      const fields = [
        input.diagnose,
        input.prioritize,
        input.execute,
        input.analyze,
        input.recommend,
        input.executiveSummary,
      ];
      if (fields.some((value) => value.trim().length < 20)) {
        return Result.fail(
          DomainError.validation(
            "Chaque section du dossier capstone doit contenir au moins 20 caracteres.",
          ),
        );
      }

      const now = new Date();
      const row = await client.capstoneSubmission.upsert({
        where: {
          employeeId_pedagogicalCourseRunId: {
            employeeId,
            pedagogicalCourseRunId,
          },
        },
        create: {
          employeeId,
          pedagogicalCourseRunId,
          status: "submitted",
          lifecycleStatus: "UNDER_REVIEW",
          currentStage: "S6",
          diagnose: input.diagnose.trim(),
          prioritize: input.prioritize.trim(),
          execute: input.execute.trim(),
          analyze: input.analyze.trim(),
          recommend: input.recommend.trim(),
          executiveSummary: input.executiveSummary.trim(),
          submittedAt: now,
          reviewStatus: "pending",
          professorApproved: false,
        },
        update: {
          status: "submitted",
          lifecycleStatus: "UNDER_REVIEW",
          currentStage: "S6",
          diagnose: input.diagnose.trim(),
          prioritize: input.prioritize.trim(),
          execute: input.execute.trim(),
          analyze: input.analyze.trim(),
          recommend: input.recommend.trim(),
          executiveSummary: input.executiveSummary.trim(),
          submittedAt: now,
          reviewStatus: "pending",
          professorApproved: false,
        },
      });

      await client.capstoneEvidence.create({
        data: {
          submissionId: row.id,
          kind: "executive_pack",
          payloadJson: toInputJson(input),
        },
      });

      return Result.ok(mapSubmission(row, "UNDER_REVIEW"));
    },

    async listForProfessor(professorId: string) {
      const professor = await client.employee.findUnique({ where: { id: professorId } });
      if (!professor || professor.role !== "PROFESSOR") {
        throw DomainError.forbidden("Acces reserve aux professeurs.");
      }
      const rows = await client.capstoneSubmission.findMany({
        where: {
          status: "submitted",
          employee: { companyId: professor.companyId, role: "JR_BUSINESS_ANALYST" },
        },
        include: {
          employee: true,
          pedagogicalCourseRun: true,
        },
        orderBy: { submittedAt: "desc" },
      });
      return rows.map((row) => {
        const lifecycleStatus = computeCapstoneLifecycle({
          regularMissionsComplete: true,
          runEligible: true,
          status: row.status,
          reviewStatus: row.reviewStatus,
          professorApproved: row.professorApproved,
          hasDraftContent: true,
        });
        return {
          ...mapSubmission(row, lifecycleStatus),
          employeeId: row.employeeId,
          studentName: row.employee.displayName,
          professorApproved: row.professorApproved,
          curriculumVersion: parseCurriculumVersion(row.pedagogicalCourseRun.curriculumVersion),
          runCode: row.pedagogicalCourseRun.runCode,
        };
      });
    },

    async review(
      professorId: string,
      submissionId: string,
      approved: boolean,
      notes?: string,
    ): Promise<ResultType<{ ok: true }>> {
      const professor = await client.employee.findUnique({ where: { id: professorId } });
      if (!professor || professor.role !== "PROFESSOR") {
        return Result.fail(DomainError.forbidden("Acces reserve aux professeurs."));
      }
      const submission = await client.capstoneSubmission.findUnique({
        where: { id: submissionId },
        include: { employee: true },
      });
      if (!submission) {
        return Result.fail(DomainError.notFound("Soumission capstone introuvable."));
      }
      if (submission.employee.companyId !== professor.companyId) {
        return Result.fail(DomainError.forbidden("Soumission hors perimetre."));
      }
      await client.capstoneSubmission.update({
        where: { id: submissionId },
        data: {
          reviewStatus: approved ? "approved" : "needs_revision",
          professorApproved: approved,
          professorNotes: notes ?? null,
          lifecycleStatus: approved ? "APPROVED" : "REVISION_REQUESTED",
          currentStage: approved ? "S7" : "S7",
        },
      });
      await client.auditEvent.create({
        data: {
          companyId: professor.companyId,
          actorEmployeeId: professorId,
          action: "capstone.review",
          resourceType: "capstone_submission",
          resourceKey: submissionId,
          reason: approved ? "approved" : "needs_revision",
        },
      });
      return Result.ok({ ok: true });
    },
  };
}

export type CapstoneService = ReturnType<typeof createCapstoneService>;
