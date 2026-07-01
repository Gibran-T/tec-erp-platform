import type { DomainError } from "./domain-error.js";

export interface Success<T> {
  readonly ok: true;
  readonly value: T;
}

export interface Failure {
  readonly ok: false;
  readonly error: DomainError;
}

export type Result<T> = Success<T> | Failure;

export const Result = {
  ok<T>(value: T): Success<T> {
    return { ok: true, value };
  },

  fail(error: DomainError): Failure {
    return { ok: false, error };
  },

  isOk<T>(result: Result<T>): result is Success<T> {
    return result.ok;
  },

  isFail<T>(result: Result<T>): result is Failure {
    return !result.ok;
  },
};
