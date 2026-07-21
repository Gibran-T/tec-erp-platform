import { z } from "zod";

export const InteractionTypeSchema = z.enum([
  "SINGLE_CHOICE",
  "MULTI_CHOICE",
  "ORDERING",
  "NUMERIC_INPUT",
  "TEXT_ANALYSIS",
  "DIAGNOSIS_RECOMMENDATION",
  "PROCESS_MAP_ACKNOWLEDGEMENT",
]);
export type InteractionType = z.infer<typeof InteractionTypeSchema>;

export const ChoiceOptionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1).optional(),
});
export type ChoiceOption = z.infer<typeof ChoiceOptionSchema>;

export const ScoringRuleSchema = z.object({
  maxPoints: z.number().positive(),
  correctKeys: z.array(z.string().min(1)).optional(),
  correctOrder: z.array(z.string().min(1)).optional(),
  numericTarget: z.number().optional(),
  numericTolerance: z.number().nonnegative().optional(),
  requiredConcepts: z.array(z.string().min(1)).optional(),
  allowedPairs: z
    .array(
      z.object({
        leftKey: z.string().min(1),
        rightKey: z.string().min(1),
      }),
    )
    .optional(),
  minimumSelections: z.number().int().positive().optional(),
});
export type ScoringRule = z.infer<typeof ScoringRuleSchema>;

export const MissionInteractionSchema = z.object({
  id: z.string().min(1),
  type: InteractionTypeSchema,
  prompt: z.string().min(1),
  options: z.array(ChoiceOptionSchema).optional(),
  scoring: ScoringRuleSchema,
});
export type MissionInteraction = z.infer<typeof MissionInteractionSchema>;

export const MissionContextItemSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  required: z.boolean(),
});
export type MissionContextItem = z.infer<typeof MissionContextItemSchema>;

export const MissionDefinitionDocumentSchema = z.object({
  missionKey: z.string().min(1),
  missionCode: z.string().min(1),
  moduleCode: z.string().min(1),
  title: z.string().min(1),
  preview: z.string().min(1),
  briefing: z.string().min(1),
  unlockExplanation: z.string().min(1),
  sequence: z.number().int().positive(),
  maxAttempts: z.number().int().positive().default(2),
  passThresholdPercent: z.number().int().min(0).max(100).default(70),
  estimatedMinutes: z.number().int().positive().optional(),
  difficulty: z.string().min(1).optional(),
  competencyCodes: z.array(z.string().min(1)).min(1),
  contextItems: z.array(MissionContextItemSchema).default([]),
  interactions: z.array(MissionInteractionSchema).min(1),
  completionFeedback: z.string().min(1),
});
export type MissionDefinitionDocument = z.infer<typeof MissionDefinitionDocumentSchema>;

export const ModuleCatalogEntrySchema = z.object({
  moduleCode: z.string().min(1),
  title: z.string().min(1),
  sequence: z.number().int().positive(),
  missionKeys: z.array(z.string().min(1)).min(1),
});
export type ModuleCatalogEntry = z.infer<typeof ModuleCatalogEntrySchema>;
