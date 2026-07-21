import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

import { computePredictions, PREDICTION_MODEL_VERSION, type PredictionPayload } from "./predictions.engine.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function createPredictionsService(client = getPrismaClient()) {
  return {
    async getForStudent(
      professorId: string,
      studentId: string,
    ): Promise<ResultType<PredictionPayload>> {
      const professor = await client.employee.findUnique({ where: { id: professorId } });
      if (!professor || professor.role !== "PROFESSOR") {
        return Result.fail(DomainError.forbidden("Acces reserve aux professeurs."));
      }

      const student = await client.employee.findUnique({ where: { id: studentId } });
      if (!student) {
        return Result.fail(DomainError.notFound("Etudiant introuvable."));
      }
      if (student.companyId !== professor.companyId) {
        return Result.fail(DomainError.forbidden("Etudiant hors cohorte autorisee."));
      }

      const attempts = await client.missionAttempt.findMany({
        where: { employeeId: studentId },
        include: { missionDefinition: true },
      });

      const payload = computePredictions(
        attempts.map((attempt) => ({
          missionKey: attempt.missionDefinition.missionKey,
          status: attempt.status,
          scorePercent: attempt.scorePercent,
        })),
      );

      await client.predictionRecord.create({
        data: {
          studentId,
          professorId,
          modelVersion: PREDICTION_MODEL_VERSION,
          payloadJson: toInputJson(payload),
        },
      });

      return Result.ok(payload);
    },
  };
}

export type PredictionsService = ReturnType<typeof createPredictionsService>;
