import type { Logger, LogLevel, LogMeta } from "@tec-platform/core";

import type { AppConfig } from "./config.js";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

interface StructuredLogEntry {
  readonly level: LogLevel;
  readonly scope: string;
  readonly message: string;
  readonly timestamp: string;
  readonly meta?: LogMeta;
}

function shouldLog(configuredLevel: LogLevel, level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[configuredLevel];
}

const REDACTED = "[REDACTED]";

/**
 * Key fragments whose values must never reach the log sink. Matched as a
 * case-insensitive substring so variants (accessToken, Authorization,
 * jwtRefreshSecret, api_key, set-cookie, …) are all redacted.
 */
const SENSITIVE_KEY_FRAGMENTS = [
  "authorization",
  "cookie",
  "password",
  "secret",
  "token",
  "credential",
  "apikey",
  "api_key",
] as const;

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return SENSITIVE_KEY_FRAGMENTS.some((fragment) => lower.includes(fragment));
}

/**
 * Deep-redacts sensitive fields from structured log metadata so credentials and
 * tokens can never be printed, even if a caller passes raw headers or a request
 * body. The original object is never mutated.
 */
function redactMeta(meta: LogMeta): LogMeta {
  const seen = new WeakSet<object>();

  const redactValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(redactValue);
    }

    if (value !== null && typeof value === "object") {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);

      const output: Record<string, unknown> = {};
      for (const [key, nested] of Object.entries(value)) {
        output[key] = isSensitiveKey(key) ? REDACTED : redactValue(nested);
      }
      return output;
    }

    return value;
  };

  return redactValue(meta) as LogMeta;
}

function writeLog(entry: StructuredLogEntry): void {
  const output = JSON.stringify(entry);

  if (entry.level === "error") {
    console.error(output);
    return;
  }

  console.log(output);
}

export class StructuredLogger implements Logger {
  private readonly scope: string;
  private readonly configuredLevel: LogLevel;

  constructor(scope: string, configuredLevel: LogLevel) {
    this.scope = scope;
    this.configuredLevel = configuredLevel;
  }

  debug(message: string, meta?: LogMeta): void {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: LogMeta): void {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: LogMeta): void {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: LogMeta): void {
    this.log("error", message, meta);
  }

  private log(level: LogLevel, message: string, meta?: LogMeta): void {
    if (!shouldLog(this.configuredLevel, level)) {
      return;
    }

    writeLog({
      level,
      scope: this.scope,
      message,
      timestamp: new Date().toISOString(),
      meta: meta ? redactMeta(meta) : undefined,
    });
  }
}

export function createLogger(config: AppConfig, scope: string): Logger {
  return new StructuredLogger(scope, config.logLevel);
}
