import { z } from "zod";

import type { DomainError, DomainErrorCode } from "@tec-platform/core";

export const ApiErrorCodeSchema = z.enum([
  "NOT_FOUND",
  "VALIDATION",
  "FORBIDDEN",
  "CONFLICT",
  "INTERNAL",
]);

export const ApiErrorEnvelopeSchema = z.object({
  error: z.object({
    code: ApiErrorCodeSchema,
    message: z.string(),
    context: z.record(z.unknown()).optional(),
    requestId: z.string().optional(),
  }),
});

export type ApiErrorCode = z.infer<typeof ApiErrorCodeSchema>;
export type ApiErrorEnvelope = z.infer<typeof ApiErrorEnvelopeSchema>;

export function toApiErrorEnvelope(
  error: DomainError,
  requestId?: string,
): ApiErrorEnvelope {
  return {
    error: {
      code: error.code,
      message: error.message,
      context: error.context,
      requestId,
    },
  };
}

export function isDomainErrorCode(code: string): code is DomainErrorCode {
  return ApiErrorCodeSchema.safeParse(code).success;
}
