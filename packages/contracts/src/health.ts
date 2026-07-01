import { z } from "zod";

import { API_VERSION, PLATFORM_VERSION } from "./version.js";

export const HealthStatusSchema = z.enum(["ok", "degraded", "down"]);

export const HealthResponseSchema = z.object({
  status: HealthStatusSchema,
  timestamp: z.string().datetime(),
  version: z.string(),
  apiVersion: z.literal(API_VERSION),
  platformVersion: z.string(),
});

export type HealthStatus = z.infer<typeof HealthStatusSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export function createHealthResponse(
  status: HealthStatus,
  timestamp: string,
): HealthResponse {
  return {
    status,
    timestamp,
    version: PLATFORM_VERSION,
    apiVersion: API_VERSION,
    platformVersion: PLATFORM_VERSION,
  };
}
