import { z } from "zod";

export const AssessmentSummarySchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  moduleScope: z.string().min(1),
  passThresholdPercent: z.number().int(),
  maxAttempts: z.number().int(),
  timeLimitSeconds: z.number().int().nullable(),
  status: z.enum(["locked", "available", "in_progress", "passed", "failed"]),
  bestScorePercent: z.number().min(0).max(100).nullable(),
  attemptsUsed: z.number().int().nonnegative(),
});
export type AssessmentSummary = z.infer<typeof AssessmentSummarySchema>;

export const AssessmentSubmitRequestSchema = z.object({
  responses: z.array(
    z.object({
      questionKey: z.string().min(1),
      value: z.union([z.string(), z.array(z.string())]),
    }),
  ),
});
export type AssessmentSubmitRequest = z.infer<typeof AssessmentSubmitRequestSchema>;

export const CertificateViewSchema = z.object({
  certificateNumber: z.string().min(1),
  certificateType: z.string().min(1),
  studentName: z.string().min(1),
  cohortName: z.string().nullable(),
  issuedAt: z.string().datetime(),
  status: z.enum(["issued", "revoked"]),
  verificationStatus: z.enum(["valid", "revoked"]),
  competencySummary: z.record(z.string(), z.unknown()),
});
export type CertificateView = z.infer<typeof CertificateViewSchema>;
