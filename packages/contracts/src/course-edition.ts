import { z } from "zod";

export const CourseEditionSurfaceIdSchema = z.enum([
  "apprendre",
  "connecter",
  "missions",
  "bilan",
]);
export type CourseEditionSurfaceId = z.infer<typeof CourseEditionSurfaceIdSchema>;

/** Thin Course Edition packaging progress — not a Wave 7 learning-record model. */
export const CourseEditionProgressRecordSchema = z.object({
  moduleCode: z.string().min(1).max(8),
  completedSurfaces: z.array(CourseEditionSurfaceIdSchema).max(4),
  connectionLabPassed: z.boolean(),
  connectionLabScorePercent: z.number().min(0).max(100).nullable(),
  quizPassed: z.boolean(),
  quizPercent: z.number().min(0).max(100).nullable(),
  framesViewed: z.array(z.string().min(1).max(80)).max(40),
  documentsOpened: z.array(z.string().min(1).max(80)).max(40),
  progressPercent: z.number().int().min(0).max(100),
  moduleComplete: z.boolean(),
  updatedAt: z.string().datetime(),
});
export type CourseEditionProgressRecord = z.infer<typeof CourseEditionProgressRecordSchema>;

export const UpsertCourseEditionProgressRequestSchema = CourseEditionProgressRecordSchema.omit({
  progressPercent: true,
  moduleComplete: true,
  updatedAt: true,
}).extend({
  progressPercent: z.number().int().min(0).max(100).optional(),
  moduleComplete: z.boolean().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type UpsertCourseEditionProgressRequest = z.infer<
  typeof UpsertCourseEditionProgressRequestSchema
>;

export const CourseEditionMissionStatusSchema = z.object({
  missionCode: z.string().min(1),
  missionKey: z.string().min(1),
  status: z.string().min(1),
  scorePercent: z.number().nullable(),
  needsReview: z.boolean(),
});
export type CourseEditionMissionStatus = z.infer<typeof CourseEditionMissionStatusSchema>;

/** Professor-facing thin M1 Course Edition visibility row. */
export const CourseEditionProfessorVisibilitySchema = z.object({
  moduleCode: z.literal("M1"),
  studentName: z.string().min(1),
  employeeId: z.string().min(1),
  courseEditionStatus: z.enum(["not_started", "in_progress", "completed"]),
  surfaceApprendre: z.enum(["not_started", "viewed", "completed"]),
  connectionLabStatus: z.enum(["not_started", "in_progress", "passed", "failed"]),
  connectionLabScorePercent: z.number().min(0).max(100).nullable(),
  missions: z.array(CourseEditionMissionStatusSchema),
  missionsComplete: z.boolean(),
  bilanStatus: z.enum(["not_started", "viewed", "completed"]),
  quizStatus: z.enum(["not_started", "passed", "failed"]),
  quizPercent: z.number().min(0).max(100).nullable(),
  openResponsesNeedingReview: z.number().int().nonnegative(),
  overallComplete: z.boolean(),
  progressPercent: z.number().int().min(0).max(100),
  updatedAt: z.string().datetime().nullable(),
  pedagogicalCourseRunId: z.string().nullable(),
});
export type CourseEditionProfessorVisibility = z.infer<
  typeof CourseEditionProfessorVisibilitySchema
>;
