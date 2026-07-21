import { z } from "zod";

export const ProfessorCohortSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  studentCount: z.number().int().nonnegative(),
});

export const ProfessorStudentSummarySchema = z.object({
  employeeId: z.string().min(1),
  employeeNumber: z.string().min(1),
  displayName: z.string().min(1),
  email: z.string().email(),
  completedMissions: z.number().int().nonnegative(),
  moduleProgress: z.array(
    z.object({
      moduleCode: z.string().min(1),
      status: z.string().min(1),
      percentComplete: z.number(),
    }),
  ),
  silverStatus: z.enum(["not_eligible", "eligible", "issued", "revoked"]),
});

export const ProfessorOverrideRequestSchema = z.object({
  reason: z.string().trim().min(8).max(500),
  action: z.enum([
    "release_mission",
    "reset_attempt",
    "validate_completion",
    "override_score",
    "review_analytical",
  ]),
  missionKey: z.string().min(1).optional(),
  scorePercent: z.number().min(0).max(100).optional(),
  reviewDecision: z.enum(["approved", "rejected", "needs_revision"]).optional(),
});
export type ProfessorOverrideRequest = z.infer<typeof ProfessorOverrideRequestSchema>;

export const ProfessorRevokeCertificateRequestSchema = z.object({
  reason: z.string().trim().min(8).max(500),
  confirm: z.literal(true),
});
export type ProfessorRevokeCertificateRequest = z.infer<
  typeof ProfessorRevokeCertificateRequestSchema
>;
