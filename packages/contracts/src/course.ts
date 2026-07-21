import { z } from "zod";

import { MissionKeySchema, MissionStatusSchema } from "./mission.js";

export const ProgressStatusSchema = z.enum([
  "locked",
  "available",
  "in_progress",
  "completed",
]);
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>;

export const CourseMissionSummarySchema = z.object({
  missionKey: MissionKeySchema,
  missionCode: z.string().min(1),
  title: z.string().min(1),
  sequence: z.number().int().positive(),
  status: MissionStatusSchema,
  unlockExplanation: z.string().min(1).nullable(),
});
export type CourseMissionSummary = z.infer<typeof CourseMissionSummarySchema>;

export const CourseModuleSummarySchema = z.object({
  moduleCode: z.string().min(1),
  title: z.string().min(1),
  sequence: z.number().int().positive(),
  status: ProgressStatusSchema,
  percentComplete: z.number().min(0).max(100),
  missions: z.array(CourseMissionSummarySchema),
});
export type CourseModuleSummary = z.infer<typeof CourseModuleSummarySchema>;

export const CourseOverviewResponseSchema = z.object({
  courseCode: z.string().min(1),
  title: z.string().min(1),
  version: z.string().min(1),
  status: ProgressStatusSchema,
  percentComplete: z.number().min(0).max(100),
  modules: z.array(CourseModuleSummarySchema),
});
export type CourseOverviewResponse = z.infer<typeof CourseOverviewResponseSchema>;

export const ModuleDetailResponseSchema = CourseModuleSummarySchema.extend({
  courseCode: z.string().min(1),
});
export type ModuleDetailResponse = z.infer<typeof ModuleDetailResponseSchema>;

/** Generic mission submit payload used by M1-M02 / M1-M03. */
export const GenericMissionResponseItemSchema = z.object({
  interactionId: z.string().min(1),
  value: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
    z.array(
      z.object({
        leftKey: z.string().min(1),
        rightKey: z.string().min(1),
      }),
    ),
  ]),
});
export type GenericMissionResponseItem = z.infer<typeof GenericMissionResponseItemSchema>;

export const GenericMissionSubmitRequestSchema = z.object({
  responses: z.array(GenericMissionResponseItemSchema).min(1),
});
export type GenericMissionSubmitRequest = z.infer<typeof GenericMissionSubmitRequestSchema>;

export const MissionScoreSummarySchema = z.object({
  scorePercent: z.number().min(0).max(100),
  earnedPoints: z.number(),
  maxPoints: z.number(),
  passed: z.boolean(),
  feedback: z.string().min(1),
});
export type MissionScoreSummary = z.infer<typeof MissionScoreSummarySchema>;
