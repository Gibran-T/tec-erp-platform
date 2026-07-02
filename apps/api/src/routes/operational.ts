import {
  API_VERSION,
  PLATFORM_VERSION,
  createHealthResponse,
  HealthResponseSchema,
} from "@tec-platform/contracts";
import { Router } from "express";
import { z } from "zod";

import type { DatabaseReadinessResult } from "../infrastructure/database-readiness.js";

const VersionResponseSchema = z.object({
  name: z.literal("erp-api"),
  version: z.string(),
  apiVersion: z.literal(API_VERSION),
  platformVersion: z.string(),
});

const ReadinessStatusSchema = z.enum(["ready", "not_ready"]);

const ReadinessResponseSchema = z.object({
  status: ReadinessStatusSchema,
  timestamp: z.string().datetime(),
  checks: z.object({
    database: z.enum(["up", "down"]),
  }),
});

export type VersionResponse = z.infer<typeof VersionResponseSchema>;
export type ReadinessResponse = z.infer<typeof ReadinessResponseSchema>;

export interface OperationalRouteDependencies {
  readonly probeDatabaseReadiness: () => Promise<DatabaseReadinessResult>;
}

export function createOperationalRouter(
  dependencies: OperationalRouteDependencies,
): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    const payload = createHealthResponse("ok", new Date().toISOString());
    const validated = HealthResponseSchema.parse(payload);

    res.status(200).json(validated);
  });

  router.get("/ready", async (_req, res) => {
    const database = await dependencies.probeDatabaseReadiness();
    const payload: ReadinessResponse = {
      status: database.isReady ? "ready" : "not_ready",
      timestamp: new Date().toISOString(),
      checks: {
        database: database.detail,
      },
    };

    const validated = ReadinessResponseSchema.parse(payload);
    const statusCode = validated.status === "ready" ? 200 : 503;

    res.status(statusCode).json(validated);
  });

  router.get("/version", (_req, res) => {
    const payload: VersionResponse = {
      name: "erp-api",
      version: PLATFORM_VERSION,
      apiVersion: API_VERSION,
      platformVersion: PLATFORM_VERSION,
    };

    res.status(200).json(VersionResponseSchema.parse(payload));
  });

  return router;
}
