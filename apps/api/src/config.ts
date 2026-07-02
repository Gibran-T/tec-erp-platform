import { z } from "zod";

const LogLevelSchema = z.enum(["debug", "info", "warn", "error"]);

const ConfigSchema = z.object({
  nodeEnv: z.enum(["development", "test", "production"]).default("development"),
  port: z.coerce.number().int().positive().default(3000),
  corsOrigin: z.string().url().default("http://localhost:5173"),
  logLevel: LogLevelSchema.default("info"),
  databaseUrl: z.string().min(1).optional(),
});

export type AppConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return ConfigSchema.parse({
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    corsOrigin: env.CORS_ORIGIN,
    logLevel: env.LOG_LEVEL,
    databaseUrl: env.DATABASE_URL,
  });
}
