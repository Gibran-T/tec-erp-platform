export const MASTER_DATA_ENTITY_TYPES = [
  "customer",
  "supplier",
  "material",
  "uom",
  "org_unit",
] as const;

export type MasterDataEntityType = (typeof MASTER_DATA_ENTITY_TYPES)[number];

export const MANDATORY_FIELDS: Record<MasterDataEntityType, readonly string[]> = {
  customer: ["name", "address", "paymentTerms", "status"],
  supplier: ["name", "paymentTerms", "bankDetails", "status"],
  material: ["name", "uom", "status"],
  uom: ["code", "name"],
  org_unit: ["name", "orgType"],
};

export interface MasterDataValidationInput {
  readonly entityType: string;
  readonly businessKey: string;
  readonly payloadJson: Record<string, unknown>;
  readonly status?: string;
}

export interface MasterDataValidationResult {
  readonly valid: boolean;
  readonly qualityScore: number;
  readonly missingFields: string[];
  readonly issues: string[];
}

function isPresent(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return true;
}

export function isMasterDataEntityType(value: string): value is MasterDataEntityType {
  return (MASTER_DATA_ENTITY_TYPES as readonly string[]).includes(value);
}

export function normalizeBusinessKey(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizeDuplicateToken(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function duplicateTokenFromPayload(
  entityType: MasterDataEntityType,
  payloadJson: Record<string, unknown>,
): string | null {
  if (entityType === "uom") {
    return normalizeDuplicateToken(payloadJson.code ?? payloadJson.name);
  }
  return normalizeDuplicateToken(payloadJson.name ?? payloadJson.code);
}

export function computeQualityScore(
  entityType: MasterDataEntityType,
  payloadJson: Record<string, unknown>,
): { readonly qualityScore: number; readonly missingFields: string[] } {
  const mandatory = MANDATORY_FIELDS[entityType];
  const missingFields = mandatory.filter((field) => !isPresent(payloadJson[field]));
  if (mandatory.length === 0) {
    return { qualityScore: 100, missingFields };
  }
  const filled = mandatory.length - missingFields.length;
  const qualityScore = Math.round((filled / mandatory.length) * 100);
  return { qualityScore, missingFields };
}

export function validateMasterDataRecord(
  input: MasterDataValidationInput,
): MasterDataValidationResult {
  const issues: string[] = [];

  if (!isMasterDataEntityType(input.entityType)) {
    return {
      valid: false,
      qualityScore: 0,
      missingFields: [],
      issues: ["Type d'entite master data non supporte."],
    };
  }

  if (input.businessKey.trim().length === 0) {
    issues.push("La cle metier est obligatoire.");
  }

  const { qualityScore, missingFields } = computeQualityScore(
    input.entityType,
    input.payloadJson,
  );
  if (missingFields.length > 0) {
    issues.push(`Champs obligatoires manquants: ${missingFields.join(", ")}.`);
  }

  const status = input.status ?? (input.payloadJson.status as string | undefined) ?? "active";
  if (status === "active" && qualityScore < 100) {
    issues.push("Statut actif interdit tant que la fiche n'est pas complete.");
  }

  return {
    valid: issues.length === 0,
    qualityScore,
    missingFields,
    issues,
  };
}

export function detectDuplicateBusinessKey(
  businessKey: string,
  existingKeys: readonly string[],
): boolean {
  const normalized = normalizeBusinessKey(businessKey);
  return existingKeys.some((key) => normalizeBusinessKey(key) === normalized);
}

export function detectSoftDuplicate(
  entityType: MasterDataEntityType,
  payloadJson: Record<string, unknown>,
  existingRecords: readonly {
    readonly businessKey: string;
    readonly payloadJson: Record<string, unknown>;
  }[],
  excludeBusinessKey?: string,
): string | null {
  const token = duplicateTokenFromPayload(entityType, payloadJson);
  if (!token) {
    return null;
  }
  const excluded = excludeBusinessKey ? normalizeBusinessKey(excludeBusinessKey) : null;
  for (const record of existingRecords) {
    if (excluded && normalizeBusinessKey(record.businessKey) === excluded) {
      continue;
    }
    const otherToken = duplicateTokenFromPayload(entityType, record.payloadJson);
    if (otherToken && otherToken === token) {
      return record.businessKey;
    }
  }
  return null;
}

export function assertStatusTransitionAllowed(input: {
  readonly currentStatus: string | null;
  readonly nextStatus: string;
  readonly qualityScore: number;
  readonly missingFields: readonly string[];
}): string | null {
  const { currentStatus, nextStatus, qualityScore, missingFields } = input;

  if (currentStatus === "blocked" && nextStatus === "active") {
    if (missingFields.length > 0 || qualityScore < 70) {
      return "Deblocage refuse: corriger la fiche et atteindre un score qualite suffisant.";
    }
  }

  if (currentStatus === "inactive" && nextStatus === "active" && missingFields.length > 0) {
    return "Reactivation refusee: champs obligatoires incomplets.";
  }

  if (nextStatus === "inactive" && currentStatus === "active") {
    return "Desactivation refusee: utiliser le statut bloque pour preserver l'integrite referentielle.";
  }

  return null;
}
