import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

import {
  getCurrentPedagogicalRun,
  requireCurrentPedagogicalRunId,
} from "../pedagogical-run/run-context.js";

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

function mapSubmission(row: {
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
}) {
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
  };
}

export function createCapstoneService(client = getPrismaClient()) {
  return {
    async getSubmission(employeeId: string) {
      const run = getCurrentPedagogicalRun();
      if (!run) {
        return {
          id: "",
          status: "draft",
          diagnose: "",
          prioritize: "",
          execute: "",
          analyze: "",
          recommend: "",
          executiveSummary: null,
          submittedAt: null,
          reviewStatus: null,
        };
      }
      const row = await client.capstoneSubmission.findUnique({
        where: {
          employeeId_pedagogicalCourseRunId: {
            employeeId,
            pedagogicalCourseRunId: run.id,
          },
        },
      });
      if (!row) {
        return {
          id: "",
          status: "draft",
          diagnose: "",
          prioritize: "",
          execute: "",
          analyze: "",
          recommend: "",
          executiveSummary: null,
          submittedAt: null,
          reviewStatus: null,
        };
      }
      return mapSubmission(row);
    },

    async submit(
      employeeId: string,
      input: CapstoneSubmitInput,
    ): Promise<ResultType<ReturnType<typeof mapSubmission>>> {
      const pedagogicalCourseRunId = requireCurrentPedagogicalRunId();
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
          DomainError.validation("Chaque section du dossier capstone doit contenir au moins 20 caracteres."),
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
          diagnose: input.diagnose.trim(),
          prioritize: input.prioritize.trim(),
          execute: input.execute.trim(),
          analyze: input.analyze.trim(),
          recommend: input.recommend.trim(),
          executiveSummary: input.executiveSummary.trim(),
          submittedAt: now,
          reviewStatus: "pending",
        },
        update: {
          status: "submitted",
          diagnose: input.diagnose.trim(),
          prioritize: input.prioritize.trim(),
          execute: input.execute.trim(),
          analyze: input.analyze.trim(),
          recommend: input.recommend.trim(),
          executiveSummary: input.executiveSummary.trim(),
          submittedAt: now,
          reviewStatus: "pending",
        },
      });

      await client.capstoneEvidence.create({
        data: {
          submissionId: row.id,
          kind: "executive_pack",
          payloadJson: toInputJson(input),
        },
      });

      return Result.ok(mapSubmission(row));
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
        include: { employee: true },
        orderBy: { submittedAt: "desc" },
      });
      return rows.map((row) => ({
        ...mapSubmission(row),
        employeeId: row.employeeId,
        studentName: row.employee.displayName,
        professorApproved: row.professorApproved,
      }));
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
