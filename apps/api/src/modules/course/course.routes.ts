import { Router } from "express";

import { createCourseHandlers } from "./course.handlers.js";
import type { CourseService } from "./course.service.js";

/**
 * V1 course progress routes mounted under /api/v1/me.
 */
export function createCourseMeRouter(service: CourseService): Router {
  const router = Router();
  const handlers = createCourseHandlers(service);

  router.get("/course", (req, res, next) => {
    void handlers.getCourse(req, res, next);
  });

  router.get("/modules/:moduleCode", (req, res, next) => {
    void handlers.getModule(req, res, next);
  });

  return router;
}
