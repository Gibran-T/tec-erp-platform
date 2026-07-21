import { z } from "zod";

/**
 * Mission Center contracts — Wave 1 + Wave 2 + Wave 3 mission keys.
 * Mission content is code-owned; per-employee attempt state crosses the boundary.
 */

export const MissionKeySchema = z.enum([
  "m1-m01-decouvrir-entreprise",
  "m1-m02-connecter-departements",
  "m1-m03-diagnostiquer-preparation",
  "m2-m01-structurer-organisation",
  "m2-m02-creer-donnees-reference",
  "m2-m03-corriger-qualite-donnees",
  "m3-m01-identifier-besoin-achat",
  "m3-m02-creer-traiter-commande-achat",
  "m3-m03-receptionner-analyser-fournisseur",
  "m4-m01-saisir-commande-institutionnelle",
  "m4-m02-allocation-inter-entrepots",
  "m4-m03-confirmer-livraison-cloture",
  "m5-m01-analyser-stock-reappro",
  "m5-m02-decision-transfert-inter-dc",
  "m5-m03-presentation-sop",
  "m6-m01-reception-facture",
  "m6-m02-exception-rapprochement-trois-voies",
  "m6-m03-expliquer-ecart-finance",
  "m7-m01-ouvrir-dossier-client",
  "m7-m02-coordonner-escalade",
  "m7-m03-cloturer-cas-nps",
  "m8-m01-matrice-approbation-pression",
  "m8-m02-revue-acces-sod",
  "m8-m03-autoevaluation-probation",
  "m9-m01-atelier-definition-kpi",
  "m9-m02-tableau-bord-comite",
  "m9-m03-analyse-concurrentielle-ia",
  "m10-m01-diapositive-conseil",
  "m10-m02-defi-final-equinoxe",
  "m10-m03-presentation-capstone-or",
]);
export type MissionKey = z.infer<typeof MissionKeySchema>;

export const MissionStatusSchema = z.enum([
  "locked",
  "available",
  "in_progress",
  "completed",
]);
export type MissionStatus = z.infer<typeof MissionStatusSchema>;

export const DepartmentProblemMappingSchema = z.object({
  departmentKey: z.string().min(1),
  problemKey: z.string().min(1),
});
export type DepartmentProblemMapping = z.infer<typeof DepartmentProblemMappingSchema>;

export const MissionSummarySchema = z.object({
  missionKey: MissionKeySchema,
  title: z.string().min(1),
  status: MissionStatusSchema,
  preview: z.string().min(1),
  unlockExplanation: z.string().min(1).nullable(),
});
export type MissionSummary = z.infer<typeof MissionSummarySchema>;

export const MissionsResponseSchema = z.object({
  missions: z.array(MissionSummarySchema),
});
export type MissionsResponse = z.infer<typeof MissionsResponseSchema>;

export const DiscoveryContextItemSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  required: z.boolean(),
});
export type DiscoveryContextItem = z.infer<typeof DiscoveryContextItemSchema>;

export const DepartmentOptionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
});
export type DepartmentOption = z.infer<typeof DepartmentOptionSchema>;

export const ProblemOptionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
});
export type ProblemOption = z.infer<typeof ProblemOptionSchema>;

export const MissionAttemptStateSchema = z.object({
  status: z.enum(["in_progress", "completed", "submitted", "failed", "needs_review"]),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  acknowledgedInputKeys: z.array(z.string().min(1)),
  departmentProblemMappings: z.array(DepartmentProblemMappingSchema),
  justification: z.string().nullable(),
  feedbackKey: z.string().nullable(),
  feedbackBody: z.string().nullable(),
  scorePercent: z.number().min(0).max(100).nullable().optional(),
  attemptNumber: z.number().int().positive().optional(),
});
export type MissionAttemptState = z.infer<typeof MissionAttemptStateSchema>;

export const MissionDetailSchema = z.object({
  missionKey: MissionKeySchema,
  title: z.string().min(1),
  status: MissionStatusSchema,
  preview: z.string().min(1),
  unlockExplanation: z.string().min(1).nullable(),
  briefing: z.string().nullable(),
  contextItems: z.array(DiscoveryContextItemSchema).nullable(),
  departments: z.array(DepartmentOptionSchema).nullable(),
  problems: z.array(ProblemOptionSchema).nullable(),
  attempt: MissionAttemptStateSchema.nullable(),
  interactions: z
    .array(
      z.object({
        id: z.string().min(1),
        type: z.string().min(1),
        prompt: z.string().min(1),
        options: z
          .array(
            z.object({
              key: z.string().min(1),
              label: z.string().min(1),
              description: z.string().min(1).optional(),
            }),
          )
          .optional(),
      }),
    )
    .nullable()
    .optional(),
});
export type MissionDetail = z.infer<typeof MissionDetailSchema>;

export const MissionSubmitRequestSchema = z.object({
  acknowledgedInputKeys: z.array(z.string().trim().min(1)).min(1),
  departmentProblemMappings: z.array(DepartmentProblemMappingSchema).min(2),
  justification: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.string().min(40).max(1000)),
});
export type MissionSubmitRequest = z.infer<typeof MissionSubmitRequestSchema>;

export const MissionSubmitResponseSchema = z.object({
  missionKey: MissionKeySchema,
  attempt: MissionAttemptStateSchema,
  score: z
    .object({
      scorePercent: z.number().min(0).max(100),
      earnedPoints: z.number(),
      maxPoints: z.number(),
      passed: z.boolean(),
      feedback: z.string().min(1),
    })
    .optional(),
});
export type MissionSubmitResponse = z.infer<typeof MissionSubmitResponseSchema>;

export const MissionStartResponseSchema = z.object({
  missionKey: MissionKeySchema,
  attempt: MissionAttemptStateSchema,
  created: z.boolean(),
});
export type MissionStartResponse = z.infer<typeof MissionStartResponseSchema>;
