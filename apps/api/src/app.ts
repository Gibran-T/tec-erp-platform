import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import type { AppConfig } from "./config.js";
import { createLogger } from "./logger.js";
import { probeDatabaseReadiness } from "./infrastructure/database-readiness.js";
import { createErrorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { createRequireEmployee } from "./middleware/require-employee.js";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { createPrismaEmployeeRepository } from "./modules/auth/auth.repository.js";
import { createAuthService } from "./modules/auth/auth.service.js";
import type { EmployeeRepository } from "./modules/auth/auth.types.js";
import { createCourseMeRouter } from "./modules/course/course.routes.js";
import { createCourseService } from "./modules/course/course.service.js";
import { createPrismaFirstDayStateRepository } from "./modules/first-day/first-day.repository.js";
import { createMeRouter } from "./modules/first-day/first-day.routes.js";
import { createFirstDayService } from "./modules/first-day/first-day.service.js";
import type { FirstDayStateRepository } from "./modules/first-day/first-day.types.js";
import { createPrismaCourseProgressRepository } from "./modules/mission/course-progress.repository.js";
import { createPrismaMissionAttemptRepository } from "./modules/mission/mission.repository.js";
import { createMissionMeRouter } from "./modules/mission/mission.routes.js";
import { createMissionService } from "./modules/mission/mission.service.js";
import type {
  CourseProgressRepository,
  MissionAttemptRepository,
  UnlockStateRepository,
} from "./modules/mission/mission.types.js";
import { createMissionUnlockStateReader } from "./modules/mission/mission.unlock.js";
import { createPrismaUnlockStateRepository } from "./modules/mission/unlock-state.repository.js";
import { createOrganizationAccessReader } from "./modules/organization/organization.access.js";
import { createOrganizationMeRouter } from "./modules/organization/organization.routes.js";
import { createOrganizationService } from "./modules/organization/organization.service.js";
import { createAssessmentMeRouter } from "./modules/assessment/assessment.routes.js";
import { createAssessmentService } from "./modules/assessment/assessment.service.js";
import { createMasterDataMeRouter } from "./modules/master-data/master-data.routes.js";
import { createMasterDataService } from "./modules/master-data/master-data.service.js";
import { createProfessorRouter } from "./modules/professor/professor.routes.js";
import { createProfessorService } from "./modules/professor/professor.service.js";
import { requireProfessor } from "./middleware/require-professor.js";
import { createApiV1Router } from "./routes/api-v1.js";
import { createOperationalRouter } from "./routes/operational.js";

export interface AppDependencies {
  readonly probeDatabaseReadiness: () => Promise<{
    readonly isReady: boolean;
    readonly detail: "up" | "down";
  }>;
  /** Injectable for tests; defaults to the Prisma-backed repository. */
  readonly employeeRepository?: EmployeeRepository;
  readonly firstDayStateRepository?: FirstDayStateRepository;
  readonly missionAttemptRepository?: MissionAttemptRepository;
  readonly unlockStateRepository?: UnlockStateRepository;
  readonly courseProgressRepository?: CourseProgressRepository;
}

const defaultDependencies: AppDependencies = {
  probeDatabaseReadiness,
};

export function createApp(
  config: AppConfig,
  dependencies: AppDependencies = defaultDependencies,
): Express {
  const logger = createLogger(config, "http");
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
  );
  app.use(express.json());
  app.use(requestIdMiddleware);

  app.use((req, res, next) => {
    const startedAt = Date.now();

    res.on("finish", () => {
      logger.info("request_completed", {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });

    next();
  });

  const employeeRepository =
    dependencies.employeeRepository ?? createPrismaEmployeeRepository();

  const authService = createAuthService({
    employeeRepository,
    config: {
      jwtAccessSecret: config.jwtAccessSecret,
      jwtRefreshSecret: config.jwtRefreshSecret,
      accessTokenTtlSeconds: config.accessTokenTtlSeconds,
      refreshTokenTtlSeconds: config.refreshTokenTtlSeconds,
    },
  });

  const firstDayStateRepository =
    dependencies.firstDayStateRepository ?? createPrismaFirstDayStateRepository();

  const firstDayService = createFirstDayService({ stateRepository: firstDayStateRepository });
  const missionAttemptRepository =
    dependencies.missionAttemptRepository ?? createPrismaMissionAttemptRepository();
  const unlockStateRepository =
    dependencies.unlockStateRepository ?? createPrismaUnlockStateRepository();
  const courseProgressRepository =
    dependencies.courseProgressRepository ?? createPrismaCourseProgressRepository();
  const unlockReader = createMissionUnlockStateReader(firstDayStateRepository);
  const missionService = createMissionService({
    attemptRepository: missionAttemptRepository,
    unlockReader,
    unlockStates: unlockStateRepository,
    courseProgress: courseProgressRepository,
  });
  const courseService = createCourseService({
    attemptRepository: missionAttemptRepository,
    unlockReader,
    unlockStates: unlockStateRepository,
    courseProgress: courseProgressRepository,
  });
  const organizationService = createOrganizationService({
    accessReader: createOrganizationAccessReader(firstDayStateRepository),
  });
  const requireEmployee = createRequireEmployee(authService);
  const assessmentService = createAssessmentService();
  const masterDataService = createMasterDataService();
  const professorService = createProfessorService();

  app.use(createOperationalRouter(dependencies));
  app.use("/api/v1/auth", createAuthRouter(authService));
  app.use("/api/v1/me", requireEmployee, createMeRouter(firstDayService));
  app.use("/api/v1/me", requireEmployee, createMissionMeRouter(missionService));
  app.use("/api/v1/me", requireEmployee, createCourseMeRouter(courseService));
  app.use("/api/v1/me", requireEmployee, createOrganizationMeRouter(organizationService));
  app.use("/api/v1/me/assessments", requireEmployee, createAssessmentMeRouter(assessmentService));
  app.use("/api/v1/me/master-data", requireEmployee, createMasterDataMeRouter(masterDataService));
  app.use(
    "/api/v1/professor",
    requireEmployee,
    requireProfessor,
    createProfessorRouter(professorService),
  );
  app.use("/api/v1", createApiV1Router());

  app.use(notFoundHandler);
  app.use(createErrorHandler(logger));

  return app;
}
