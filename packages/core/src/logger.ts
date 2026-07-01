export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogMeta {
  readonly [key: string]: unknown;
}

export interface Logger {
  debug(message: string, meta?: LogMeta): void;
  info(message: string, meta?: LogMeta): void;
  warn(message: string, meta?: LogMeta): void;
  error(message: string, meta?: LogMeta): void;
}

export interface LoggerFactory {
  create(scope: string): Logger;
}
