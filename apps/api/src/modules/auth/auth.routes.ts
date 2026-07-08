import { Router } from "express";

import { createAuthHandlers } from "./auth.handlers.js";
import type { AuthService } from "./auth.service.js";

/**
 * RC01 authentication routes — business-intent endpoints (docs/18 API-001)
 * mounted under /api/v1/auth.
 */
export function createAuthRouter(service: AuthService): Router {
  const router = Router();
  const handlers = createAuthHandlers(service);

  router.post("/login", (req, res, next) => {
    void handlers.login(req, res, next);
  });

  router.post("/refresh", (req, res, next) => {
    void handlers.refresh(req, res, next);
  });

  router.post("/logout", (req, res, next) => {
    void handlers.logout(req, res, next);
  });

  router.get("/session", (req, res, next) => {
    void handlers.session(req, res, next);
  });

  return router;
}
