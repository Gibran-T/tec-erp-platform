export type DomainErrorCode =
  | "NOT_FOUND"
  | "VALIDATION"
  | "FORBIDDEN"
  | "CONFLICT"
  | "INTERNAL";

export interface DomainErrorContext {
  readonly [key: string]: unknown;
}

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly context?: DomainErrorContext;

  private constructor(
    code: DomainErrorCode,
    message: string,
    context?: DomainErrorContext,
  ) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.context = context;
  }

  static notFound(message: string, context?: DomainErrorContext): DomainError {
    return new DomainError("NOT_FOUND", message, context);
  }

  static validation(message: string, context?: DomainErrorContext): DomainError {
    return new DomainError("VALIDATION", message, context);
  }

  static forbidden(message: string, context?: DomainErrorContext): DomainError {
    return new DomainError("FORBIDDEN", message, context);
  }

  static conflict(message: string, context?: DomainErrorContext): DomainError {
    return new DomainError("CONFLICT", message, context);
  }

  static internal(message: string, context?: DomainErrorContext): DomainError {
    return new DomainError("INTERNAL", message, context);
  }
}
