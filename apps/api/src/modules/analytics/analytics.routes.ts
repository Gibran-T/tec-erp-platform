import { Router } from "express";
import { Result } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { AnalyticsService } from "./analytics.service.js";

export function createAnalyticsMeRouter(service: AnalyticsService): Router {
  const router = Router();

  router.get("/dashboards", async (req, res, next) => {
    try {
      getAuthenticatedEmployee(req);
      res.status(200).json(await service.listDashboards());
    } catch (error) {
      next(error);
    }
  });

  router.get("/kpis", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const companyId = typeof req.query.companyId === "string" ? req.query.companyId : undefined;
      const dashboardId =
        typeof req.query.dashboardId === "string" ? req.query.dashboardId : undefined;
      const result = await service.getKpis(employee.id, { companyId, dashboardId });
      if (Result.isFail(result)) {
        throw result.error;
      }
      res.status(200).json(result.value);
    } catch (error) {
      next(error);
    }
  });

  router.get("/exceptions", async (req, res, next) => {
    try {
      const employee = getAuthenticatedEmployee(req);
      const companyId = typeof req.query.companyId === "string" ? req.query.companyId : undefined;
      const result = await service.listExceptions(employee.id, companyId);
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
