import { Router } from "express";

import { createFirstDayHandlers } from "./first-day.handlers.js";
import type { FirstDayService } from "./first-day.service.js";

/**
 * RC01 Slice C1 — employee-scoped first-day state routes mounted under /api/v1/me.
 */
export function createMeRouter(service: FirstDayService): Router {
  const router = Router();
  const handlers = createFirstDayHandlers(service);

  router.get("/inbox", (req, res, next) => {
    void handlers.getInbox(req, res, next);
  });

  router.post("/inbox/:messageKey/read", (req, res, next) => {
    void handlers.markMessageRead(req, res, next);
  });

  router.get("/tasks", (req, res, next) => {
    void handlers.getTasks(req, res, next);
  });

  router.post("/tasks/:taskKey/complete", (req, res, next) => {
    void handlers.completeTask(req, res, next);
  });

  return router;
}
