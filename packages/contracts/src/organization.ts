import { z } from "zod";

/**
 * RC01 Slice E — Organizational ERP read-only contracts.
 * Catalog content is static in API code; no attempt, score, or persistence metadata.
 */

export const OrganizationAccessSchema = z.enum(["locked", "available"]);
export type OrganizationAccess = z.infer<typeof OrganizationAccessSchema>;

export const ORGANIZATION_UNLOCK_FIRST_DAY_REQUIRED_CODE =
  "premiere-journee-requise" as const;

export const OrganizationUnlockExplanationSchema = z.object({
  code: z.literal(ORGANIZATION_UNLOCK_FIRST_DAY_REQUIRED_CODE),
  title: z.string().min(1),
  description: z.string().min(1),
});
export type OrganizationUnlockExplanation = z.infer<
  typeof OrganizationUnlockExplanationSchema
>;

export const OrganizationCompanyProfileSchema = z.object({
  name: z.string().min(1),
  industry: z.string().min(1),
  operatingContext: z.string().min(1),
  organizationalSummary: z.string().min(1),
  erpLearningContext: z.string().min(1),
});
export type OrganizationCompanyProfile = z.infer<
  typeof OrganizationCompanyProfileSchema
>;

export const OrganizationDepartmentSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  shortDescription: z.string().min(1),
  responsibilities: z.array(z.string().min(1)).min(1),
  processContributions: z.array(z.string().min(1)).min(1),
  informationNeeds: z.array(z.string().min(1)).min(1),
  fragmentationSignals: z.array(z.string().min(1)).min(1),
});
export type OrganizationDepartment = z.infer<typeof OrganizationDepartmentSchema>;

export const OrganizationRelationshipSchema = z.object({
  key: z.string().min(1),
  fromDepartmentKey: z.string().min(1),
  toDepartmentKey: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  exchangedInformation: z.array(z.string().min(1)).min(1),
  coordinationRisk: z.string().min(1),
});
export type OrganizationRelationship = z.infer<typeof OrganizationRelationshipSchema>;

export const OrganizationProcessAwarenessItemSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  participatingDepartmentKeys: z.array(z.string().min(1)).min(1),
  sourceInformation: z.string().min(1),
  expectedControl: z.string().min(1),
  analyticalQuestion: z.string().min(1),
});
export type OrganizationProcessAwarenessItem = z.infer<
  typeof OrganizationProcessAwarenessItemSchema
>;

export const OrganizationFragmentationSignalSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  affectedDepartmentKeys: z.array(z.string().min(1)).min(1),
  businessImpact: z.string().min(1),
  evidence: z.string().min(1),
  analyticalPrompt: z.string().min(1),
});
export type OrganizationFragmentationSignal = z.infer<
  typeof OrganizationFragmentationSignalSchema
>;

export const OrganizationNarrativeContextSchema = z.object({
  title: z.string().min(1),
  observation: z.string().min(1),
  expected: z.literal(40),
  actual: z.literal(36),
  unit: z.string().min(1),
  analyticalQuestion: z.string().min(1),
  interpretationConstraint: z.string().min(1),
});
export type OrganizationNarrativeContext = z.infer<
  typeof OrganizationNarrativeContextSchema
>;

function assertUniqueKeys(
  items: readonly { key: string }[],
  ctx: z.RefinementCtx,
  path: (string | number)[],
): void {
  const seen = new Set<string>();
  for (let index = 0; index < items.length; index += 1) {
    const key = items[index]?.key;
    if (key === undefined) {
      continue;
    }
    if (seen.has(key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate key: ${key}`,
        path: [...path, index, "key"],
      });
    }
    seen.add(key);
  }
}

export const OrganizationPayloadSchema = z
  .object({
    companyProfile: OrganizationCompanyProfileSchema,
    departments: z.array(OrganizationDepartmentSchema).min(1),
    relationships: z.array(OrganizationRelationshipSchema),
    processAwareness: z.array(OrganizationProcessAwarenessItemSchema),
    fragmentationSignals: z.array(OrganizationFragmentationSignalSchema),
    narrativeContext: OrganizationNarrativeContextSchema,
  })
  .superRefine((payload, ctx) => {
    assertUniqueKeys(payload.departments, ctx, ["departments"]);
    assertUniqueKeys(payload.relationships, ctx, ["relationships"]);
    assertUniqueKeys(payload.processAwareness, ctx, ["processAwareness"]);
    assertUniqueKeys(payload.fragmentationSignals, ctx, ["fragmentationSignals"]);

    const departmentKeys = new Set(payload.departments.map((department) => department.key));

    for (let index = 0; index < payload.relationships.length; index += 1) {
      const relationship = payload.relationships[index];
      if (relationship === undefined) {
        continue;
      }
      if (!departmentKeys.has(relationship.fromDepartmentKey)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `unknown fromDepartmentKey: ${relationship.fromDepartmentKey}`,
          path: ["relationships", index, "fromDepartmentKey"],
        });
      }
      if (!departmentKeys.has(relationship.toDepartmentKey)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `unknown toDepartmentKey: ${relationship.toDepartmentKey}`,
          path: ["relationships", index, "toDepartmentKey"],
        });
      }
    }

    for (let index = 0; index < payload.processAwareness.length; index += 1) {
      const item = payload.processAwareness[index];
      if (item === undefined) {
        continue;
      }
      for (
        let deptIndex = 0;
        deptIndex < item.participatingDepartmentKeys.length;
        deptIndex += 1
      ) {
        const departmentKey = item.participatingDepartmentKeys[deptIndex];
        if (departmentKey !== undefined && !departmentKeys.has(departmentKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `unknown participatingDepartmentKey: ${departmentKey}`,
            path: ["processAwareness", index, "participatingDepartmentKeys", deptIndex],
          });
        }
      }
    }

    for (let index = 0; index < payload.fragmentationSignals.length; index += 1) {
      const signal = payload.fragmentationSignals[index];
      if (signal === undefined) {
        continue;
      }
      for (
        let deptIndex = 0;
        deptIndex < signal.affectedDepartmentKeys.length;
        deptIndex += 1
      ) {
        const departmentKey = signal.affectedDepartmentKeys[deptIndex];
        if (departmentKey !== undefined && !departmentKeys.has(departmentKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `unknown affectedDepartmentKey: ${departmentKey}`,
            path: ["fragmentationSignals", index, "affectedDepartmentKeys", deptIndex],
          });
        }
      }
    }
  });
export type OrganizationPayload = z.infer<typeof OrganizationPayloadSchema>;

export const OrganizationLockedResponseSchema = z.object({
  access: z.literal("locked"),
  unlockExplanation: OrganizationUnlockExplanationSchema,
  organization: z.null(),
});
export type OrganizationLockedResponse = z.infer<typeof OrganizationLockedResponseSchema>;

export const OrganizationAvailableResponseSchema = z.object({
  access: z.literal("available"),
  unlockExplanation: z.null(),
  organization: OrganizationPayloadSchema,
});
export type OrganizationAvailableResponse = z.infer<
  typeof OrganizationAvailableResponseSchema
>;

export const OrganizationResponseSchema = z.discriminatedUnion("access", [
  OrganizationLockedResponseSchema,
  OrganizationAvailableResponseSchema,
]);
export type OrganizationResponse = z.infer<typeof OrganizationResponseSchema>;
