import { z } from "zod";

export const PedagogicalRunTypeSchema = z.enum([
  "AUTONOMOUS",
  "INSTRUCTOR_LED",
  "REMEDIATION",
  "DEMONSTRATION",
]);
export type PedagogicalRunType = z.infer<typeof PedagogicalRunTypeSchema>;

export const PedagogicalRunStatusSchema = z.enum([
  "PLANNED",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
  "ARCHIVED",
]);
export type PedagogicalRunStatus = z.infer<typeof PedagogicalRunStatusSchema>;

export const PedagogicalRunTypeLabelFr: Record<PedagogicalRunType, string> = {
  AUTONOMOUS: "Parcours autonome",
  INSTRUCTOR_LED: "Parcours accompagné par le professeur",
  REMEDIATION: "Parcours de remédiation",
  DEMONSTRATION: "Parcours de démonstration",
};

export const PedagogicalRunStatusLabelFr: Record<PedagogicalRunStatus, string> = {
  PLANNED: "Planifié",
  ACTIVE: "En cours",
  PAUSED: "En pause",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
  ARCHIVED: "Archivé",
};

export const PedagogicalCourseRunSchema = z.object({
  id: z.string().min(1),
  companyId: z.string().min(1),
  cohortId: z.string().nullable(),
  employeeId: z.string().min(1),
  professorId: z.string().nullable(),
  courseId: z.string().min(1),
  runCode: z.string().min(1),
  runSequence: z.number().int().positive(),
  runType: PedagogicalRunTypeSchema,
  runLabel: z.string().min(1),
  language: z.string().min(1),
  status: PedagogicalRunStatusSchema,
  sourceRunId: z.string().nullable(),
  startedAt: z.string().datetime().nullable(),
  pausedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  cancelledAt: z.string().datetime().nullable(),
  completionPercent: z.number().min(0).max(100),
  runTypeLabel: z.string().min(1),
  statusLabel: z.string().min(1),
  isWritable: z.boolean(),
  isHistorical: z.boolean(),
});
export type PedagogicalCourseRun = z.infer<typeof PedagogicalCourseRunSchema>;

export const CreatePedagogicalCourseRunRequestSchema = z.object({
  employeeId: z.string().min(1),
  cohortId: z.string().min(1).optional(),
  runType: PedagogicalRunTypeSchema,
  runLabel: z.string().min(1).max(200),
  language: z.string().min(2).max(8).default("fr"),
  professorId: z.string().min(1).optional(),
  sourceRunId: z.string().min(1).optional(),
  reason: z.string().min(1).max(500),
  plannedStartAt: z.string().datetime().optional(),
  runCode: z.string().min(1).max(120).optional(),
});
export type CreatePedagogicalCourseRunRequest = z.infer<
  typeof CreatePedagogicalCourseRunRequestSchema
>;

export const TransitionPedagogicalCourseRunRequestSchema = z.object({
  action: z.enum(["start", "pause", "resume", "complete", "cancel", "archive"]),
  reason: z.string().max(500).optional(),
});
export type TransitionPedagogicalCourseRunRequest = z.infer<
  typeof TransitionPedagogicalCourseRunRequestSchema
>;

export const ProfessorInterventionTypeSchema = z.enum([
  "NONE",
  "CLARIFICATION",
  "CONCEPT_EXPLANATION",
  "PROCESS_DEMONSTRATION",
  "TERMINOLOGY_SUPPORT",
  "DATA_INTERPRETATION",
  "ERROR_RECOVERY",
  "BUSINESS_CONTEXT",
  "KPI_EXPLANATION",
  "AI_GOVERNANCE",
  "FULL_RETEACH",
]);

export const CreateProfessorInterventionRequestSchema = z.object({
  moduleCode: z.string().optional(),
  missionCode: z.string().optional(),
  interventionType: ProfessorInterventionTypeSchema,
  durationMinutes: z.number().int().nonnegative().optional(),
  reason: z.string().min(1).max(500),
  content: z.string().min(1).max(4000),
  outcome: z.string().max(2000).optional(),
  shouldSystemTeach: z.boolean().optional(),
  learningHubCandidate: z.boolean().optional(),
});

export const CreateStudentMissionReflectionRequestSchema = z.object({
  missionKey: z.string().min(1),
  clarity: z.number().int().min(1).max(5),
  confidence: z.number().int().min(1).max(5),
  cognitiveLoad: z.number().int().min(1).max(5),
  realism: z.number().int().min(1).max(5),
  relevance: z.number().int().min(1).max(5),
  navigationQuality: z.number().int().min(1).max(5),
  feedbackQuality: z.number().int().min(1).max(5),
  visualQuality: z.number().int().min(1).max(5),
  aiUsefulness: z.number().int().min(1).max(5).nullable().optional(),
  biUsefulness: z.number().int().min(1).max(5).nullable().optional(),
  externalExplanationRequired: z.boolean(),
  externalSlidesWouldHelp: z.boolean(),
  qualitativeNote: z.string().max(4000).nullable().optional(),
});

export const PedagogicalRunComparisonSchema = z.object({
  left: PedagogicalCourseRunSchema,
  right: PedagogicalCourseRunSchema,
  completedMissionsLeft: z.number().int().nonnegative(),
  completedMissionsRight: z.number().int().nonnegative(),
  totalMissions: z.number().int().nonnegative(),
  averageScoreLeft: z.number().nullable(),
  averageScoreRight: z.number().nullable(),
  attemptCountLeft: z.number().int().nonnegative(),
  attemptCountRight: z.number().int().nonnegative(),
  assessmentSummaryLeft: z.array(z.object({ code: z.string(), status: z.string(), scorePercent: z.number().nullable() })),
  assessmentSummaryRight: z.array(z.object({ code: z.string(), status: z.string(), scorePercent: z.number().nullable() })),
  capstoneStatusLeft: z.string().nullable(),
  capstoneStatusRight: z.string().nullable(),
  certificateProvenanceLeft: z.array(z.object({ type: z.string(), status: z.string(), number: z.string() })),
  certificateProvenanceRight: z.array(z.object({ type: z.string(), status: z.string(), number: z.string() })),
  missionScoreDeltas: z.array(
    z.object({
      missionKey: z.string(),
      scoreLeft: z.number().nullable(),
      scoreRight: z.number().nullable(),
    }),
  ),
  professorInterventionRate: z.null(),
  confidenceGain: z.null(),
  noSlidesScore: z.null(),
});
export type PedagogicalRunComparison = z.infer<typeof PedagogicalRunComparisonSchema>;
