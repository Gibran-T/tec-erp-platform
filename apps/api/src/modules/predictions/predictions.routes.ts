import { Router } from "express";
import { Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { PredictionsService } from "./predictions.service.js";

export function createPredictionsProfessorRouter(service: PredictionsService): Router {
  const router = Router();

  router.get("/predictions/:studentId", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const result = await service.getForStudent(employee.id, req.params.studentId ?? "");
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
