import { Router } from "express";

import { createOrganizationHandlers } from "./organization.handlers.js";
import type { OrganizationService } from "./organization.service.js";

/**
 * RC01 Slice E — employee-scoped organization route mounted under /api/v1/me.
 */
export function createOrganizationMeRouter(service: OrganizationService): Router {
  const router = Router();
  const handlers = createOrganizationHandlers(service);

  router.get("/organization", (req, res, next) => {
    void handlers.getOrganization(req, res, next);
  });

  return router;
}
