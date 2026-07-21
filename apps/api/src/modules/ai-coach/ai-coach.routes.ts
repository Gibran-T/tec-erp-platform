import { Router } from "express";
import { z } from "zod";
import { DomainError, Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { AiCoachService } from "./ai-coach.service.js";

const AskSchema = z.object({
  question: z.string().min(1),
});

export function createAiCoachMeRouter(service: AiCoachService): Router {
  const router = Router();

  router.post("/ask", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const parsed = AskSchema.safeParse(req.body);
      if (!parsed.success) {
        throw DomainError.validation("Question invalide.");
      }
      const result = await service.ask(employee.id, parsed.data.question);
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

export function createAiCoachProfessorRouter(service: AiCoachService): Router {
  const router = Router();

  router.get("/ai-interactions", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      res.status(200).json({ interactions: await service.listForProfessor(employee.id) });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
