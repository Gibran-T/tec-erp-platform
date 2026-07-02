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
      meta,
    });
  }
}

export function createLogger(config: AppConfig, scope: string): Logger {
  return new StructuredLogger(scope, config.logLevel);
}
