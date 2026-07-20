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
import { createPrismaFirstDayStateRepository } from "./modules/first-day/first-day.repository.js";
import { createMeRouter } from "./modules/first-day/first-day.routes.js";
import { createFirstDayService } from "./modules/first-day/first-day.service.js";
import type { FirstDayStateRepository } from "./modules/first-day/first-day.types.js";
import { createPrismaMissionAttemptRepository } from "./modules/mission/mission.repository.js";
import { createMissionMeRouter } from "./modules/mission/mission.routes.js";
import { createMissionService } from "./modules/mission/mission.service.js";
import type { MissionAttemptRepository } from "./modules/mission/mission.types.js";
import { createMissionUnlockStateReader } from "./modules/mission/mission.unlock.js";
import { createOrganizationAccessReader } from "./modules/organization/organization.access.js";
import { createOrganizationMeRouter } from "./modules/organization/organization.routes.js";
import { createOrganizationService } from "./modules/organization/organization.service.js";
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
  const missionService = createMissionService({
    attemptRepository: missionAttemptRepository,
    unlockReader: createMissionUnlockStateReader(firstDayStateRepository),
  });
  const organizationService = createOrganizationService({
    accessReader: createOrganizationAccessReader(firstDayStateRepository),
  });
  const requireEmployee = createRequireEmployee(authService);

  app.use(createOperationalRouter(dependencies));
  app.use("/api/v1/auth", createAuthRouter(authService));
  app.use("/api/v1/me", requireEmployee, createMeRouter(firstDayService));
  app.use("/api/v1/me", requireEmployee, createMissionMeRouter(missionService));
  app.use("/api/v1/me", requireEmployee, createOrganizationMeRouter(organizationService));
  app.use("/api/v1", createApiV1Router());

  app.use(notFoundHandler);
  app.use(createErrorHandler(logger));

  return app;
}
