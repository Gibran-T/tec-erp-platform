import { describe, expect, it } from "vitest";

import { DomainError } from "../domain-error.js";

describe("DomainError", () => {
  it("creates typed not found errors", () => {
    const error = DomainError.notFound("Entity missing", { id: "123" });

    expect(error).toBeInstanceOf(DomainError);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("Entity missing");
    expect(error.context).toEqual({ id: "123" });
  });

  it("creates typed validation errors", () => {
    const error = DomainError.validation("Rule violated");

    expect(error.code).toBe("VALIDATION");
    expect(error.message).toBe("Rule violated");
  });

  it("creates typed forbidden errors", () => {
    const error = DomainError.forbidden("Access denied");

    expect(error.code).toBe("FORBIDDEN");
  });

  it("creates typed conflict errors", () => {
    const error = DomainError.conflict("State conflict");

    expect(error.code).toBe("CONFLICT");
  });

  it("creates typed internal errors", () => {
    const error = DomainError.internal("Unexpected failure");

    expect(error.code).toBe("INTERNAL");
  });
});
