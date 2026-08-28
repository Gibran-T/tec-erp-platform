import { z } from "zod";

export const SAP_IEE2E_UNIT_COUNT = 9 as const;
export const SAP_IEE2E_SESSION_COUNT = 10 as const;
export const SAP_IEE2E_STALE_AFTER_DAYS = 14 as const;
export const SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS = 21 as const;

export const SAP_IEE2E_ACHIEVEMENT_DISCLAIMER =
  "TEC.ERP n’émet pas et ne valide pas le SAP Achievement." as const;

export const SapIee2eUnitStatusSchema = z.enum([
  "a_decouvrir",
  "en_cours",
  "a_reprendre",
  "terminee_declaree",
  "accompagnement_requis",
]);
export type SapIee2eUnitStatus = z.infer<typeof SapIee2eUnitStatusSchema>;

export const SapIee2eAchievementSchema = z.enum(["non_declare", "en_cours", "obtenu_declare"]);
export type SapIee2eAchievement = z.infer<typeof SapIee2eAchievementSchema>;

export const SapIee2eAccessSchema = z.enum(["non_confirme", "confirme", "commence"]);
export type SapIee2eAccess = z.infer<typeof SapIee2eAccessSchema>;

export const SapIee2eSemaineZeroChecklistSchema = z.object({
  universalId: z.boolean(),
  learningHub: z.boolean(),
  iee2eOpened: z.boolean(),
  noSharedAccount: z.boolean(),
  contingencyAck: z.boolean(),
});
export type SapIee2eSemaineZeroChecklist = z.infer<typeof SapIee2eSemaineZeroChecklistSchema>;

export const EMPTY_SAP_IEE2E_SEMAINE_ZERO: SapIee2eSemaineZeroChecklist = {
  universalId: false,
  learningHub: false,
  iee2eOpened: false,
  noSharedAccount: false,
  contingencyAck: false,
};

export const SapIee2eCalendarViewSchema = z.object({
  session1Date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  session1At: z.string().datetime().nullable(),
  semaineZeroOpensAt: z.string().datetime().nullable(),
  daysUntilSession1: z.number().int().nullable(),
  windowLabel: z.string().min(1),
});
export type SapIee2eCalendarView = z.infer<typeof SapIee2eCalendarViewSchema>;

export const UpdateSapIee2eCalendarRequestSchema = z.object({
  session1Date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type UpdateSapIee2eCalendarRequest = z.infer<typeof UpdateSapIee2eCalendarRequestSchema>;

export const SapIee2eDeclaredUnitSchema = z.object({
  unitNumber: z.number().int().min(1).max(SAP_IEE2E_UNIT_COUNT),
  status: SapIee2eUnitStatusSchema,
});
export type SapIee2eDeclaredUnit = z.infer<typeof SapIee2eDeclaredUnitSchema>;

export const SapIee2eSelfReportSchema = z.object({
  currentUnit: z.number().int().min(1).max(SAP_IEE2E_UNIT_COUNT),
  sessionNumber: z.number().int().min(1).max(SAP_IEE2E_SESSION_COUNT),
  sapAccess: SapIee2eAccessSchema,
  difficulty: z.string().max(500),
  needsSupport: z.boolean(),
  note: z.string().max(2000),
  achievement: SapIee2eAchievementSchema,
  lastDeclaredAt: z.string().datetime().nullable(),
  lastUpdateLabel: z.string().min(1),
  progressionLabel: z.string().min(1),
  persisted: z.boolean(),
  units: z.array(SapIee2eDeclaredUnitSchema).length(SAP_IEE2E_UNIT_COUNT),
  semaineZero: SapIee2eSemaineZeroChecklistSchema,
  semaineZeroReady: z.boolean(),
  calendar: SapIee2eCalendarViewSchema,
});
export type SapIee2eSelfReport = z.infer<typeof SapIee2eSelfReportSchema>;

export const UpdateSapIee2eSelfReportRequestSchema = z.object({
  currentUnit: z.number().int().min(1).max(SAP_IEE2E_UNIT_COUNT),
  sessionNumber: z.number().int().min(1).max(SAP_IEE2E_SESSION_COUNT),
  sapAccess: SapIee2eAccessSchema,
  difficulty: z.string().max(500),
  needsSupport: z.boolean(),
  note: z.string().max(2000),
  achievement: SapIee2eAchievementSchema,
  units: z.array(SapIee2eDeclaredUnitSchema).min(1).max(SAP_IEE2E_UNIT_COUNT),
  semaineZero: SapIee2eSemaineZeroChecklistSchema,
});
export type UpdateSapIee2eSelfReportRequest = z.infer<typeof UpdateSapIee2eSelfReportRequestSchema>;

export const SapIee2eCohortStudentSchema = z.object({
  employeeId: z.string().min(1),
  displayName: z.string().min(1),
  sapAccess: SapIee2eAccessSchema,
  declaredUnit: z.number().int().min(1).max(SAP_IEE2E_UNIT_COUNT).nullable(),
  progressionLabel: z.string().min(1),
  lastUpdateLabel: z.string().min(1),
  difficulty: z.string(),
  needsSupport: z.boolean(),
  achievement: SapIee2eAchievementSchema,
  staleUpdate: z.boolean(),
  notStarted: z.boolean(),
  semaineZeroReady: z.boolean(),
});
export type SapIee2eCohortStudent = z.infer<typeof SapIee2eCohortStudentSchema>;

export const SapIee2eCohortResponseSchema = z.object({
  students: z.array(SapIee2eCohortStudentSchema),
  disclaimer: z.literal(SAP_IEE2E_ACHIEVEMENT_DISCLAIMER),
  calendar: SapIee2eCalendarViewSchema,
  semaineZero: z.object({
    readyCount: z.number().int().nonnegative(),
    pendingCount: z.number().int().nonnegative(),
    totalCount: z.number().int().nonnegative(),
  }),
});
export type SapIee2eCohortResponse = z.infer<typeof SapIee2eCohortResponseSchema>;
