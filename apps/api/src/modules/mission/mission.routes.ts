import { Router } from "express";

import { createMissionHandlers } from "./mission.handlers.js";
import type { MissionService } from "./mission.service.js";

/**
 * RC01 Slice D — employee-scoped mission routes mounted under /api/v1/me.
 */
export function createMissionMeRouter(service: MissionService): Router {
  const router = Router();
  const handlers = createMissionHandlers(service);

  router.get("/missions", (req, res, next) => {
    void handlers.listMissions(req, res, next);
  });

  router.get("/missions/:missionKey", (req, res, next) => {
    void handlers.getMission(req, res, next);
  });

  router.post("/missions/:missionKey/start", (req, res, next) => {
    void handlers.startMission(req, res, next);
  });

  router.post("/missions/:missionKey/submit", (req, res, next) => {
    void handlers.submitMission(req, res, next);
  });

  return router;
}
