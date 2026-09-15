import { z } from "zod";

export const SAP_IEE2E_UNIT_COUNT = 9 as const;
export const SAP_IEE2E_SESSION_COUNT = 10 as const;
export const SAP_IEE2E_STALE_AFTER_DAYS = 14 as const;
export const SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS = 21 as const;

export const SAP_SUITE_E2E_PROGRAM_CODE = "SAP_SUITE_E2E" as const;
export const SAP_SUITE_E2E_TITLE = "SAP Suite End to End" as const;
export const SAP_SUITE_E2E_OFFICIAL_URL =
  "https://learning.sap.com/courses/exploring-end-to-end-business-processes-in-sap-business-suite-fr" as const;

export type OfficialSapLearningHref = typeof SAP_SUITE_E2E_OFFICIAL_URL;

const NULLISH_PATH_SEGMENT = /\/(?:null|undefined)(?:\/|$|\?|#)/i;
const NULLISH_QUERY_VALUE = /(?:\?|&|#)[^=]*=(?:null|undefined)(?:&|#|$)/i;

export function sapLearningHrefIsNullish(value: unknown): boolean {
  if (value == null) {
    return true;
  }
  if (typeof value !== "string") {
    return true;
  }
  const trimmed = value.trim();
  if (trimmed === "" || trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "undefined") {
    return true;
  }
  return NULLISH_PATH_SEGMENT.test(trimmed) || NULLISH_QUERY_VALUE.test(trimmed);
}

export function isOfficialSapSuiteCourseUrl(
  value: unknown,
): value is typeof SAP_SUITE_E2E_OFFICIAL_URL {
  return value === SAP_SUITE_E2E_OFFICIAL_URL;
}

/**
 * TEC.ERP never interpolates SAP lesson/unit identifiers into a Learning URL.
 * Missing, dirty, `/null`, or `/undefined` candidates are discarded.
 */
export function safeOfficialSapLearningHref(
  _candidate?: unknown,
): OfficialSapLearningHref {
  return SAP_SUITE_E2E_OFFICIAL_URL;
}

export const SAP_SUITE_E2E_STAGE_CODES = [
  "S1",
  "S2",
  "S3",
  "S4",
  "S5",
  "S6",
  "S7",
  "S8",
  "S9",
  "S10",
] as const;
export type SapSuiteE2eStageCode = (typeof SAP_SUITE_E2E_STAGE_CODES)[number];

export const SAP_IEE2E_ACHIEVEMENT_DISCLAIMER =
  "TEC.ERP n’émet pas et ne valide pas le SAP Achievement." as const;

export const SAP_SUITE_E2E_CERTIFICATION_DISCLAIMER =
  "TEC.ERP n’émet pas de certification SAP et ne promet aucune équivalence professionnelle." as const;

export const SAP_SUITE_E2E_SOURCE_DISCLAIMER =
  "Le contenu, la progression officielle, les évaluations et les achievements demeurent sur SAP Learning. TEC.ERP assure uniquement l’organisation et l’accompagnement institutionnels." as const;

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

export const SapSuiteInstitutionalStatusSchema = z.enum([
  "not_started",
  "in_accompaniment",
  "progress_declared",
  "evidence_submitted",
  "institutional_review",
  "accompaniment_completed",
]);
export type SapSuiteInstitutionalStatus = z.infer<typeof SapSuiteInstitutionalStatusSchema>;

export const STUDENT_WRITABLE_INSTITUTIONAL_STATUSES = [
  "not_started",
  "in_accompaniment",
  "progress_declared",
  "evidence_submitted",
] as const satisfies readonly SapSuiteInstitutionalStatus[];

export const PROFESSOR_ONLY_INSTITUTIONAL_STATUSES = [
  "institutional_review",
  "accompaniment_completed",
] as const satisfies readonly SapSuiteInstitutionalStatus[];

export const SapSuiteStageCodeSchema = z.enum(SAP_SUITE_E2E_STAGE_CODES);
export type { SapSuiteE2eStageCode as SapSuiteStageCode };

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

const httpsReferenceUrlSchema = z
  .string()
  .max(500)
  .refine((value) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:" && parsed.username === "" && parsed.password === "";
    } catch {
      return false;
    }
  }, "Seule une URL https sans identifiants est acceptée.");

export const SapSuiteEvidenceKindSchema = z.enum(["student_declaration", "external_reference"]);
export type SapSuiteEvidenceKind = z.infer<typeof SapSuiteEvidenceKindSchema>;

export const SapSuiteEvidenceSchema = z.object({
  id: z.string().min(1).max(80),
  stageCode: SapSuiteStageCodeSchema.nullable(),
  kind: SapSuiteEvidenceKindSchema,
  label: z.string().min(1).max(200),
  referenceUrl: httpsReferenceUrlSchema.nullable(),
  declaredAt: z.string().datetime(),
});
export type SapSuiteEvidence = z.infer<typeof SapSuiteEvidenceSchema>;

export const UpdateSapSuiteEvidenceRequestSchema = z.object({
  id: z.string().min(1).max(80).optional(),
  stageCode: SapSuiteStageCodeSchema.nullable(),
  kind: SapSuiteEvidenceKindSchema,
  label: z.string().min(1).max(200),
  referenceUrl: httpsReferenceUrlSchema.nullable(),
});
export type UpdateSapSuiteEvidenceRequest = z.infer<typeof UpdateSapSuiteEvidenceRequestSchema>;

export const SapSuiteDeclaredStageSchema = z.object({
  stageCode: SapSuiteStageCodeSchema,
  status: SapSuiteInstitutionalStatusSchema,
});
export type SapSuiteDeclaredStage = z.infer<typeof SapSuiteDeclaredStageSchema>;

export const SapIee2eProfessorNoteSchema = z.object({
  id: z.string().min(1),
  studentEmployeeId: z.string().min(1),
  stageCode: SapSuiteStageCodeSchema.nullable(),
  note: z.string().max(2000),
  updatedAt: z.string().datetime(),
});
export type SapIee2eProfessorNote = z.infer<typeof SapIee2eProfessorNoteSchema>;

export const UpdateSapIee2eProfessorNoteRequestSchema = z.object({
  stageCode: SapSuiteStageCodeSchema.nullable(),
  note: z.string().min(1).max(2000),
});
export type UpdateSapIee2eProfessorNoteRequest = z.infer<
  typeof UpdateSapIee2eProfessorNoteRequestSchema
>;

export const UpdateSapSuiteStageReviewRequestSchema = z.object({
  stageCode: SapSuiteStageCodeSchema,
  status: z.enum(PROFESSOR_ONLY_INSTITUTIONAL_STATUSES),
});
export type UpdateSapSuiteStageReviewRequest = z.infer<
  typeof UpdateSapSuiteStageReviewRequestSchema
>;

export const SapSuiteProgramStageSchema = z.object({
  code: SapSuiteStageCodeSchema,
  sortOrder: z.number().int().min(1).max(SAP_IEE2E_SESSION_COUNT),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  administrativeObjective: z.string().min(1),
  officialPathHint: z.string().min(1),
  titleStatus: z.enum(["placeholder", "institutionally_confirmed"]),
});
export type SapSuiteProgramStage = z.infer<typeof SapSuiteProgramStageSchema>;

export const SapSuiteOfficialPathUnitSchema = z.object({
  unitNumber: z.number().int().min(1).max(SAP_IEE2E_UNIT_COUNT),
  publicTitle: z.string().min(1),
  identificationOnly: z.literal(true),
});
export type SapSuiteOfficialPathUnit = z.infer<typeof SapSuiteOfficialPathUnitSchema>;

export const SapSuiteProgramCatalogSchema = z.object({
  programCode: z.literal(SAP_SUITE_E2E_PROGRAM_CODE),
  title: z.literal(SAP_SUITE_E2E_TITLE),
  subtitle: z.string().min(1),
  officialUrl: z.string().url(),
  officialUrlOpensInNewTab: z.literal(true),
  iframeForbidden: z.literal(true),
  emitsSapAchievement: z.literal(false),
  emitsSapCertification: z.literal(false),
  officialSourceRemainsSap: z.literal(true),
  disclaimer: z.literal(SAP_IEE2E_ACHIEVEMENT_DISCLAIMER),
  certificationDisclaimer: z.literal(SAP_SUITE_E2E_CERTIFICATION_DISCLAIMER),
  sourceDisclaimer: z.literal(SAP_SUITE_E2E_SOURCE_DISCLAIMER),
  stages: z.array(SapSuiteProgramStageSchema).length(SAP_IEE2E_SESSION_COUNT),
  officialPathUnits: z.array(SapSuiteOfficialPathUnitSchema).length(SAP_IEE2E_UNIT_COUNT),
});
export type SapSuiteProgramCatalog = z.infer<typeof SapSuiteProgramCatalogSchema>;

export const SapSuiteProgramAssignmentSchema = z.object({
  cohortId: z.string().min(1),
  cohortCode: z.string().min(1),
  cohortName: z.string().min(1),
  programCode: z.literal(SAP_SUITE_E2E_PROGRAM_CODE),
  language: z.string().min(2).max(16),
  institutionalStatus: z.enum(["planned", "active", "paused", "closed"]),
  assigned: z.boolean(),
});
export type SapSuiteProgramAssignment = z.infer<typeof SapSuiteProgramAssignmentSchema>;

export const SapSuiteProgramAssignmentListSchema = z.object({
  assignments: z.array(SapSuiteProgramAssignmentSchema),
});
export type SapSuiteProgramAssignmentList = z.infer<typeof SapSuiteProgramAssignmentListSchema>;

export const UpdateSapSuiteProgramAssignmentRequestSchema = z.object({
  cohortId: z.string().min(1),
  language: z.string().min(2).max(16).default("fr"),
  institutionalStatus: z.enum(["planned", "active", "paused", "closed"]),
  assigned: z.boolean(),
});
export type UpdateSapSuiteProgramAssignmentRequest = z.infer<
  typeof UpdateSapSuiteProgramAssignmentRequestSchema
>;

export const SapIee2eSelfReportSchema = z.object({
  currentUnit: z.number().int().min(1).max(SAP_IEE2E_UNIT_COUNT),
  sessionNumber: z.number().int().min(1).max(SAP_IEE2E_SESSION_COUNT),
  currentStageCode: SapSuiteStageCodeSchema,
  institutionalStatus: SapSuiteInstitutionalStatusSchema,
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
  stages: z.array(SapSuiteDeclaredStageSchema).length(SAP_IEE2E_SESSION_COUNT),
  evidence: z.array(SapSuiteEvidenceSchema).max(20),
  semaineZero: SapIee2eSemaineZeroChecklistSchema,
  semaineZeroReady: z.boolean(),
  calendar: SapIee2eCalendarViewSchema,
  officialUrl: z.string().url(),
  sapResultOfficial: z.literal(false),
});
export type SapIee2eSelfReport = z.infer<typeof SapIee2eSelfReportSchema>;

export const UpdateSapIee2eSelfReportRequestSchema = z.object({
  currentUnit: z.number().int().min(1).max(SAP_IEE2E_UNIT_COUNT),
  sessionNumber: z.number().int().min(1).max(SAP_IEE2E_SESSION_COUNT),
  currentStageCode: SapSuiteStageCodeSchema.optional(),
  institutionalStatus: z.enum(STUDENT_WRITABLE_INSTITUTIONAL_STATUSES).optional(),
  sapAccess: SapIee2eAccessSchema,
  difficulty: z.string().max(500),
  needsSupport: z.boolean(),
  note: z.string().max(2000),
  achievement: SapIee2eAchievementSchema,
  units: z.array(SapIee2eDeclaredUnitSchema).min(1).max(SAP_IEE2E_UNIT_COUNT),
  stages: z.array(SapSuiteDeclaredStageSchema).min(1).max(SAP_IEE2E_SESSION_COUNT).optional(),
  evidence: z.array(UpdateSapSuiteEvidenceRequestSchema).max(20).optional(),
  semaineZero: SapIee2eSemaineZeroChecklistSchema,
});
export type UpdateSapIee2eSelfReportRequest = z.infer<typeof UpdateSapIee2eSelfReportRequestSchema>;

export const SapIee2eCohortStudentSchema = z.object({
  employeeId: z.string().min(1),
  displayName: z.string().min(1),
  sapAccess: SapIee2eAccessSchema,
  declaredUnit: z.number().int().min(1).max(SAP_IEE2E_UNIT_COUNT).nullable(),
  currentStageCode: SapSuiteStageCodeSchema.nullable(),
  institutionalStatus: SapSuiteInstitutionalStatusSchema,
  progressionLabel: z.string().min(1),
  lastUpdateLabel: z.string().min(1),
  difficulty: z.string(),
  needsSupport: z.boolean(),
  achievement: SapIee2eAchievementSchema,
  staleUpdate: z.boolean(),
  notStarted: z.boolean(),
  semaineZeroReady: z.boolean(),
  evidenceCount: z.number().int().nonnegative(),
  professorNoteCount: z.number().int().nonnegative(),
  sapResultOfficial: z.literal(false),
});
export type SapIee2eCohortStudent = z.infer<typeof SapIee2eCohortStudentSchema>;

export const SapIee2eCohortResponseSchema = z.object({
  students: z.array(SapIee2eCohortStudentSchema),
  disclaimer: z.literal(SAP_IEE2E_ACHIEVEMENT_DISCLAIMER),
  certificationDisclaimer: z.literal(SAP_SUITE_E2E_CERTIFICATION_DISCLAIMER),
  calendar: SapIee2eCalendarViewSchema,
  officialUrl: z.string().url(),
  semaineZero: z.object({
    readyCount: z.number().int().nonnegative(),
    pendingCount: z.number().int().nonnegative(),
    totalCount: z.number().int().nonnegative(),
  }),
});
export type SapIee2eCohortResponse = z.infer<typeof SapIee2eCohortResponseSchema>;

export const SapIee2eStudentAccompanimentSchema = z.object({
  student: SapIee2eCohortStudentSchema,
  stages: z.array(SapSuiteDeclaredStageSchema).length(SAP_IEE2E_SESSION_COUNT),
  evidence: z.array(SapSuiteEvidenceSchema).max(20),
  notes: z.array(SapIee2eProfessorNoteSchema),
  sapResultOfficial: z.literal(false),
});
export type SapIee2eStudentAccompaniment = z.infer<typeof SapIee2eStudentAccompanimentSchema>;

export function stageCodeFromSessionNumber(sessionNumber: number): SapSuiteE2eStageCode {
  const index = Math.min(Math.max(sessionNumber, 1), SAP_IEE2E_SESSION_COUNT) - 1;
  return SAP_SUITE_E2E_STAGE_CODES[index] ?? "S1";
}

export function sessionNumberFromStageCode(stageCode: SapSuiteE2eStageCode): number {
  return SAP_SUITE_E2E_STAGE_CODES.indexOf(stageCode) + 1;
}

export const INSTITUTIONAL_STATUS_LABEL_FR: Record<SapSuiteInstitutionalStatus, string> = {
  not_started: "Non commencé",
  in_accompaniment: "En accompagnement",
  progress_declared: "Progrès déclaré",
  evidence_submitted: "Évidence envoyée",
  institutional_review: "En révision institutionnelle",
  accompaniment_completed: "Accompagnement conclu",
};

const SAP_SUITE_E2E_ADMIN_OBJECTIVE =
  "Accompagner la cohorte Collège et enregistrer le suivi institutionnel. Le contenu, les évaluations, la progression officielle et les achievements demeurent sur SAP Learning.";

function sapPublicUnitHint(
  unitNumber: number,
  publicTitle: string,
  extra?: string,
): string {
  const base = `Unité publique SAP ${unitNumber} — ${publicTitle}. Identification uniquement ; aucune leçon SAP copiée.`;
  return extra ? `${base} ${extra}` : base;
}

/**
 * S1–S10 = séances institutionnelles Collège. Neuf unités publiques SAP Learning
 * (identificationOnly). S4 et S5 partagent l’unité publique 4 ; S10 correspond à
 * l’unité 9 — aucune dixième unité SAP n’est inventée.
 */
export const SAP_SUITE_E2E_STAGES: readonly SapSuiteProgramStage[] = [
  {
    code: "S1",
    sortOrder: 1,
    title:
      "Identifier les processus de gestion de bout en bout et leur défi en matière d'intégration",
    shortDescription:
      "Séance Collège 1. Identification de l’unité publique SAP 1. TEC.ERP n’enseigne pas ce contenu.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(
      1,
      "Identifier les processus de gestion de bout en bout et leur défi en matière d'intégration",
    ),
    titleStatus: "institutionally_confirmed",
  },
  {
    code: "S2",
    sortOrder: 2,
    title: "Description de SAP Business Suite",
    shortDescription:
      "Séance Collège 2. Identification de l’unité publique SAP 2. TEC.ERP n’enseigne pas ce contenu.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(2, "Description de SAP Business Suite"),
    titleStatus: "institutionally_confirmed",
  },
  {
    code: "S3",
    sortOrder: 3,
    title: "Discussion sur les concepts et objets centraux dans SAP Business Suite",
    shortDescription:
      "Séance Collège 3. Identification de l’unité publique SAP 3. TEC.ERP n’enseigne pas ce contenu.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(
      3,
      "Discussion sur les concepts et objets centraux dans SAP Business Suite",
    ),
    titleStatus: "institutionally_confirmed",
  },
  {
    code: "S4",
    sortOrder: 4,
    title:
      "Exécution du processus de l'enregistrement au reporting : accent mis sur la comptabilité financière et le contrôle de gestion",
    shortDescription:
      "Séance Collège 4 (1/2 sur l’unité publique 4). Identification uniquement — pas une unité SAP distincte de S5.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(
      4,
      "Exécution du processus de l'enregistrement au reporting : accent mis sur la comptabilité financière et le contrôle de gestion",
      "Première séance Collège sur cette unité publique.",
    ),
    titleStatus: "institutionally_confirmed",
  },
  {
    code: "S5",
    sortOrder: 5,
    title: "Contrôler les coûts et intégrer (enregistrement au reporting — II)",
    shortDescription:
      "Séance Collège 5 (2/2). Poursuite institutionnelle de la même unité publique SAP 4 — pas une dixième unité SAP.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(
      4,
      "Exécution du processus de l'enregistrement au reporting : accent mis sur la comptabilité financière et le contrôle de gestion",
      "Deuxième séance Collège sur la même unité publique. Titre de séance institutionnel, pas un titre SAP distinct.",
    ),
    titleStatus: "institutionally_confirmed",
  },
  {
    code: "S6",
    sortOrder: 6,
    title:
      "Exécution du processus du recrutement à la retraite : focus sur le pilotage de l'expérience humaine",
    shortDescription:
      "Séance Collège 6. Identification de l’unité publique SAP 5. TEC.ERP n’enseigne pas ce contenu.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(
      5,
      "Exécution du processus du recrutement à la retraite : focus sur le pilotage de l'expérience humaine",
    ),
    titleStatus: "institutionally_confirmed",
  },
  {
    code: "S7",
    sortOrder: 7,
    title: "Exécution du processus d'approvisionnement : focalisation sur l'approvisionnement",
    shortDescription:
      "Séance Collège 7. Identification de l’unité publique SAP 6. TEC.ERP n’enseigne pas ce contenu.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(
      6,
      "Exécution du processus d'approvisionnement : focalisation sur l'approvisionnement",
    ),
    titleStatus: "institutionally_confirmed",
  },
  {
    code: "S8",
    sortOrder: 8,
    title: "Exécution du processus de la conception aux opérations : accent mis sur la production",
    shortDescription:
      "Séance Collège 8. Identification de l’unité publique SAP 7. TEC.ERP n’enseigne pas ce contenu.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(
      7,
      "Exécution du processus de la conception aux opérations : accent mis sur la production",
    ),
    titleStatus: "institutionally_confirmed",
  },
  {
    code: "S9",
    sortOrder: 9,
    title: "Exécution du processus Lead-to-Cash : accent mis sur les ventes",
    shortDescription:
      "Séance Collège 9. Identification de l’unité publique SAP 8. TEC.ERP n’enseigne pas ce contenu.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(
      8,
      "Exécution du processus Lead-to-Cash : accent mis sur les ventes",
    ),
    titleStatus: "institutionally_confirmed",
  },
  {
    code: "S10",
    sortOrder: 10,
    title: "Exécution du processus Lead-to-Cash : focalisation sur le service",
    shortDescription:
      "Séance Collège 10. Identification de l’unité publique SAP 9. Synthèse institutionnelle — pas une dixième unité SAP.",
    administrativeObjective: SAP_SUITE_E2E_ADMIN_OBJECTIVE,
    officialPathHint: sapPublicUnitHint(
      9,
      "Exécution du processus Lead-to-Cash : focalisation sur le service",
      "Clôture Collège / synthèse. Le SAP Achievement n’est pas émis par TEC.ERP.",
    ),
    titleStatus: "institutionally_confirmed",
  },
];

export const SAP_SUITE_E2E_OFFICIAL_PATH_UNITS: readonly SapSuiteOfficialPathUnit[] = [
  {
    unitNumber: 1,
    publicTitle:
      "Identifier les processus de gestion de bout en bout et leur défi en matière d'intégration",
    identificationOnly: true,
  },
  { unitNumber: 2, publicTitle: "Description de SAP Business Suite", identificationOnly: true },
  {
    unitNumber: 3,
    publicTitle: "Discussion sur les concepts et objets centraux dans SAP Business Suite",
    identificationOnly: true,
  },
  {
    unitNumber: 4,
    publicTitle:
      "Exécution du processus de l'enregistrement au reporting : accent mis sur la comptabilité financière et le contrôle de gestion",
    identificationOnly: true,
  },
  {
    unitNumber: 5,
    publicTitle:
      "Exécution du processus du recrutement à la retraite : focus sur le pilotage de l'expérience humaine",
    identificationOnly: true,
  },
  {
    unitNumber: 6,
    publicTitle: "Exécution du processus d'approvisionnement : focalisation sur l'approvisionnement",
    identificationOnly: true,
  },
  {
    unitNumber: 7,
    publicTitle:
      "Exécution du processus de la conception aux opérations : accent mis sur la production",
    identificationOnly: true,
  },
  {
    unitNumber: 8,
    publicTitle: "Exécution du processus Lead-to-Cash : accent mis sur les ventes",
    identificationOnly: true,
  },
  {
    unitNumber: 9,
    publicTitle: "Exécution du processus Lead-to-Cash : focalisation sur le service",
    identificationOnly: true,
  },
];
