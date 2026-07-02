import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import type { AppConfig } from "./config.js";
import { createLogger } from "./logger.js";
import { probeDatabaseReadiness } from "./infrastructure/database-readiness.js";
import { createErrorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { createApiV1Router } from "./routes/api-v1.js";
import { createOperationalRouter } from "./routes/operational.js";

export interface AppDependencies {
  readonly probeDatabaseReadiness: () => Promise<{
    readonly isReady: boolean;
    readonly detail: "up" | "down";
  }>;
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

  app.use(createOperationalRouter(dependencies));
  app.use("/api/v1", createApiV1Router());

  app.use(notFoundHandler);
  app.use(createErrorHandler(logger));

  return app;
}
