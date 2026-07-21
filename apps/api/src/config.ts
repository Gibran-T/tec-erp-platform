import { z } from "zod";

const LogLevelSchema = z.enum(["debug", "info", "warn", "error"]);

/**
 * Development-only fallback secrets. Fail-fast rejects these in production so a
 * deploy can never run on committed placeholder secrets (ADR-PLATFORM-001 §13).
 */
const DEV_ACCESS_SECRET = "dev-access-secret-not-for-production";
const DEV_REFRESH_SECRET = "dev-refresh-secret-not-for-production";

/**
 * Minimum entropy for HS256 signing secrets in production. A 256-bit key is the
 * HMAC-SHA256 block size; 32 characters is the smallest length that keeps the
 * key from being trivially brute-forceable. Enforced only in production so the
 * developer/test fallbacks stay ergonomic.
 */
const MIN_PRODUCTION_SECRET_LENGTH = 32;

/** Raised when configuration is missing or unsafe. Message never echoes secret values. */
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

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

    const secretRules = [
      {
        path: "jwtAccessSecret",
        envName: "JWT_ACCESS_SECRET",
        value: config.jwtAccessSecret,
        devFallback: DEV_ACCESS_SECRET,
      },
      {
        path: "jwtRefreshSecret",
        envName: "JWT_REFRESH_SECRET",
        value: config.jwtRefreshSecret,
        devFallback: DEV_REFRESH_SECRET,
      },
    ] as const;

    for (const rule of secretRules) {
      if (rule.value === rule.devFallback) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [rule.path],
          message: `${rule.envName} must be set to a real secret in production.`,
        });
        continue;
      }

      if (rule.value.length < MIN_PRODUCTION_SECRET_LENGTH) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [rule.path],
          message: `${rule.envName} must be at least ${MIN_PRODUCTION_SECRET_LENGTH} characters in production.`,
        });
      }
    }

    if (config.jwtAccessSecret === config.jwtRefreshSecret) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["jwtRefreshSecret"],
        message: "JWT_REFRESH_SECRET must differ from JWT_ACCESS_SECRET in production.",
      });
    }
  });

export type AppConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = ConfigSchema.safeParse({
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

  if (!result.success) {
    // Fail closed with a controlled message: report which variables are invalid
    // without ever echoing the offending values (secrets stay out of logs).
    const details = result.error.issues
      .map((issue) => {
        const field = issue.path.join(".") || "config";
        return `${field}: ${issue.message}`;
      })
      .join("; ");

    throw new ConfigurationError(`Invalid API configuration: ${details}`);
  }

  return result.data;
}
