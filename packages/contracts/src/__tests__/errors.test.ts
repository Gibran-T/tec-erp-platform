import { describe, expect, it } from "vitest";

import { DomainError } from "@tec-platform/core";

import { ApiErrorEnvelopeSchema, isDomainErrorCode, toApiErrorEnvelope } from "../errors.js";

describe("error contracts", () => {
  it("maps domain errors to api envelopes", () => {
    const error = DomainError.notFound("Resource missing", { id: "abc" });
    const envelope = toApiErrorEnvelope(error, "req-1");

    expect(ApiErrorEnvelopeSchema.parse(envelope)).toEqual({
      error: {
        code: "NOT_FOUND",
        message: "Resource missing",
        context: { id: "abc" },
        requestId: "req-1",
      },
    });
  });

  it("validates domain error codes", () => {
    expect(isDomainErrorCode("NOT_FOUND")).toBe(true);
    expect(isDomainErrorCode("UNKNOWN")).toBe(false);
  });
});
