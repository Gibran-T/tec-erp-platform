import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

import {
  AI_COACH_DISCLAIMER,
  buildDeterministicAiCoachAnswer,
  isRateLimited,
  refusesAnswerKeyRequest,
  sanitizeAiCoachQuestion,
} from "./ai-coach.guards.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function createAiCoachService(client = getPrismaClient()) {
  async function isAiEnabled(companyId: string): Promise<boolean> {
    const policy = await client.aiPolicy.findUnique({ where: { companyId } });
    if (policy) {
      return policy.aiEnabled;
    }
    const config = await client.companyConfiguration.findUnique({ where: { companyId } });
    return config?.aiEnabled ?? true;
  }

  return {
    async ask(
      employeeId: string,
      rawQuestion: string,
      context: { moduleCode?: string; missionKey?: string; department?: string } = {},
    ): Promise<
      ResultType<{
        answer: string;
        disclaimer: string;
        interactionId: string;
        createdAt: string;
      }>
    > {
      const employee = await client.employee.findUnique({ where: { id: employeeId } });
      if (!employee) {
        return Result.fail(DomainError.notFound("Employé introuvable."));
      }

      const enabled = await isAiEnabled(employee.companyId);
      if (!enabled) {
        return Result.fail(DomainError.forbidden("Le coach IA est désactivé pour votre entreprise."));
      }

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentCount = await client.aiInteraction.count({
        where: { employeeId, createdAt: { gte: oneHourAgo } },
      });
      if (isRateLimited(recentCount)) {
        return Result.fail(
          DomainError.conflict("Limite horaire atteinte (30 questions). Réessayez plus tard."),
        );
      }

      const question = sanitizeAiCoachQuestion(rawQuestion);
      if (question.length < 5) {
        return Result.fail(DomainError.validation("Question trop courte ou invalide."));
      }

      const refused = refusesAnswerKeyRequest(question);
      const answer = refused
        ? "Je ne peux pas révéler les clés de réponse ou les solutions attendues. Reformulez votre question en termes de démarche ou de concepts."
        : buildDeterministicAiCoachAnswer(question, context);

      const { getCurrentPedagogicalRun } = await import("../pedagogical-run/run-context.js");
      const run = getCurrentPedagogicalRun();
      const interaction = await client.aiInteraction.create({
        data: {
          employeeId,
          companyId: employee.companyId,
          pedagogicalCourseRunId: run?.id ?? null,
          question,
          answer,
          refused,
          metadataJson: toInputJson({
            source: "deterministic-fallback-v2",
            moduleCode: context.moduleCode ?? null,
            missionKey: context.missionKey ?? null,
            department: context.department ?? null,
            runId: run?.id ?? null,
          }),
        },
      });

      return Result.ok({
        answer,
        disclaimer: AI_COACH_DISCLAIMER,
        interactionId: interaction.id,
        createdAt: interaction.createdAt.toISOString(),
      });
    },

    async listForProfessor(professorId: string) {
      const professor = await client.employee.findUnique({ where: { id: professorId } });
      if (!professor || professor.role !== "PROFESSOR") {
        throw DomainError.forbidden("Accès réservé aux professeurs.");
      }
      const rows = await client.aiInteraction.findMany({
        where: { companyId: professor.companyId },
        orderBy: { createdAt: "desc" },
        take: 200,
        include: { employee: true },
      });
      return rows.map((row) => ({
        id: row.id,
        employeeId: row.employeeId,
        employeeName: row.employee.displayName,
        question: row.question,
        answer: row.answer,
        refused: row.refused,
        createdAt: row.createdAt.toISOString(),
      }));
    },
  };
}

export type AiCoachService = ReturnType<typeof createAiCoachService>;
