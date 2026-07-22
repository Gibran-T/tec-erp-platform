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
  /** French learner-facing reason when status is locked; null otherwise. */
  lockReason: z.string().nullable().optional(),
  /** Curriculum scope for version-gated assessments (e.g. HCM_M8 = V2). */
  curriculumVersion: z.enum(["V1", "V2"]).nullable().optional(),
});
export type AssessmentSummary = z.infer<typeof AssessmentSummarySchema>;

export const AssessmentSubmitResultSchema = z.object({
  scorePercent: z.number().min(0).max(100),
  passed: z.boolean(),
  feedback: z.string().min(1),
  feedbackDetails: z
    .object({
      strengths: z.array(z.string()),
      revisionAreas: z.array(z.string()),
      missionBreakdown: z.array(
        z.object({
          mission: z.string(),
          earned: z.number(),
          max: z.number(),
          percent: z.number(),
        }),
      ),
      quantitativeNotes: z.array(z.string()),
      privacyGovernanceReminder: z.string().optional(),
      humanAccountabilityReminder: z.string().optional(),
    })
    .optional(),
});
export type AssessmentSubmitResult = z.infer<typeof AssessmentSubmitResultSchema>;

export const AssessmentOptionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
});

export const AssessmentQuestionViewSchema = z.object({
  questionKey: z.string().min(1),
  type: z.enum(["SINGLE_CHOICE", "MULTI_CHOICE"]),
  prompt: z.string().min(1),
  options: z.array(AssessmentOptionSchema).min(1),
});
export type AssessmentQuestionView = z.infer<typeof AssessmentQuestionViewSchema>;

export const AssessmentAttemptViewSchema = z.object({
  attemptId: z.string().min(1),
  assessmentCode: z.string().min(1),
  attemptNumber: z.number().int().positive(),
  status: z.enum(["in_progress", "passed", "failed"]),
  startedAt: z.string().datetime(),
  timeLimitSeconds: z.number().int().nullable(),
  questions: z.array(AssessmentQuestionViewSchema),
  draftResponses: z.array(
    z.object({
      questionKey: z.string().min(1),
      value: z.union([z.string(), z.array(z.string())]),
    }),
  ),
});
export type AssessmentAttemptView = z.infer<typeof AssessmentAttemptViewSchema>;

export const AssessmentSubmitRequestSchema = z.object({
  responses: z.array(
    z.object({
      questionKey: z.string().min(1),
      value: z.union([z.string(), z.array(z.string())]),
    }),
  ),
  confirmFinalSubmission: z.literal(true),
});
export type AssessmentSubmitRequest = z.infer<typeof AssessmentSubmitRequestSchema>;

export const AssessmentDraftRequestSchema = z.object({
  responses: z.array(
    z.object({
      questionKey: z.string().min(1),
      value: z.union([z.string(), z.array(z.string())]),
    }),
  ),
});
export type AssessmentDraftRequest = z.infer<typeof AssessmentDraftRequestSchema>;

export const CertificateViewSchema = z.object({
  certificateNumber: z.string().min(1),
  certificateType: z.string().min(1),
  studentName: z.string().min(1),
  cohortName: z.string().nullable(),
  issuedAt: z.string().datetime(),
  revokedAt: z.string().datetime().nullable().optional(),
  status: z.enum(["issued", "revoked"]),
  verificationStatus: z.enum(["valid", "revoked"]),
  competencySummary: z.record(z.string(), z.unknown()),
});
export type CertificateView = z.infer<typeof CertificateViewSchema>;
