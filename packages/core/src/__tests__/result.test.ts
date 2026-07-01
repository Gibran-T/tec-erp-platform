import { describe, expect, it } from "vitest";

import { DomainError } from "../domain-error.js";
import { Result } from "../result.js";

describe("Result", () => {
  it("creates a success result", () => {
    const result = Result.ok(42);

    expect(Result.isOk(result)).toBe(true);
    expect(Result.isFail(result)).toBe(false);
    if (Result.isOk(result)) {
      expect(result.value).toBe(42);
    }
  });

  it("creates a failure result", () => {
    const error = DomainError.validation("Invalid input");
    const result = Result.fail(error);

    expect(Result.isFail(result)).toBe(true);
    expect(Result.isOk(result)).toBe(false);
    if (Result.isFail(result)) {
      expect(result.error.code).toBe("VALIDATION");
      expect(result.error.message).toBe("Invalid input");
    }
  });
});
