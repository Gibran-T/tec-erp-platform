import { z } from "zod";

const LogLevelSchema = z.enum(["debug", "info", "warn", "error"]);

/**
 * Development-only fallback secrets. Fail-fast rejects these in production so a
 * deploy can never run on committed placeholder secrets (ADR-PLATFORM-001 §13).
 */
const DEV_ACCESS_SECRET = "dev-access-secret-not-for-production";
const DEV_REFRESH_SECRET = "dev-refresh-secret-not-for-production";

const ConfigSchema = z
  .object({
    nodeEnv: z.enum(["development", "test", "production"]).default("development"),
    port: z.coerce.number().int().positive().default(3000),
    corsOrigin: z.string().url().default("http://localhost:5173"),
    logLevel: LogLevelSchema.default("info"),
    databaseUrl: z.string().min(1).optional(),
    jwtAccessSecret: z.string().min(1).default(DEV_ACCESS_SECRET),
    jwtRefreshSecret: z.string().min(1).default(DEV_REFRESH_SECRET),
    accessTokenTtlSeconds: z.coerce.number().int().positive().default(900),
    refreshTokenTtlSeconds: z.coerce.number().int().positive().default(1_209_600),
  })
  .superRefine((config, ctx) => {
    if (config.nodeEnv !== "production") {
      return;
    }

    if (config.jwtAccessSecret === DEV_ACCESS_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jwtAccessSecret"],
        message: "JWT_ACCESS_SECRET must be set to a real secret in production.",
      });
    }

    if (config.jwtRefreshSecret === DEV_REFRESH_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jwtRefreshSecret"],
        message: "JWT_REFRESH_SECRET must be set to a real secret in production.",
      });
    }
  });

export type AppConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return ConfigSchema.parse({
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    corsOrigin: env.CORS_ORIGIN,
    logLevel: env.LOG_LEVEL,
    databaseUrl: env.DATABASE_URL,
    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    accessTokenTtlSeconds: env.JWT_ACCESS_TTL_SECONDS,
    refreshTokenTtlSeconds: env.JWT_REFRESH_TTL_SECONDS,
  });
}
