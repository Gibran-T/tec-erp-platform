import {
  EMPTY_SAP_IEE2E_SEMAINE_ZERO,
  PROFESSOR_ONLY_INSTITUTIONAL_STATUSES,
  SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS,
  SAP_IEE2E_ACHIEVEMENT_DISCLAIMER,
  SAP_IEE2E_UNIT_COUNT,
  SAP_SUITE_E2E_CERTIFICATION_DISCLAIMER,
  SAP_SUITE_E2E_OFFICIAL_PATH_UNITS,
  SAP_SUITE_E2E_OFFICIAL_URL,
  SAP_SUITE_E2E_PROGRAM_CODE,
  SAP_SUITE_E2E_SOURCE_DISCLAIMER,
  SAP_SUITE_E2E_STAGE_CODES,
  SAP_SUITE_E2E_STAGES,
  SAP_SUITE_E2E_TITLE,
  SapSuiteInstitutionalStatusSchema,
  SapSuiteStageCodeSchema,
  STUDENT_WRITABLE_INSTITUTIONAL_STATUSES,
  stageCodeFromSessionNumber,
  type SapIee2eAccess,
  type SapIee2eCalendarView,
  type SapIee2eDeclaredUnit,
  type SapIee2eSelfReport,
  type SapIee2eSemaineZeroChecklist,
  type SapSuiteDeclaredStage,
  type SapSuiteEvidence,
  type SapSuiteInstitutionalStatus,
  type SapSuiteProgramCatalog,
  type UpdateSapSuiteEvidenceRequest,
} from "@tec-platform/contracts";

export function createDefaultStages(): SapSuiteDeclaredStage[] {
  return SAP_SUITE_E2E_STAGE_CODES.map((stageCode) => ({
    stageCode,
    status: "not_started" as const,
  }));
}

export function mergeDeclaredStages(
  incoming: readonly SapSuiteDeclaredStage[] | undefined,
  sessionNumber: number,
): SapSuiteDeclaredStage[] {
  const byCode = new Map((incoming ?? []).map((stage) => [stage.stageCode, stage]));
  const current = stageCodeFromSessionNumber(sessionNumber);
  return createDefaultStages().map((stage) => {
    const existing = byCode.get(stage.stageCode);
    if (!existing) {
      return stage.stageCode === current && sessionNumber > 1
        ? { ...stage, status: "in_accompaniment" }
        : stage;
    }
    if (
      (PROFESSOR_ONLY_INSTITUTIONAL_STATUSES as readonly string[]).includes(existing.status)
    ) {
      return existing;
    }
    if (
      !(STUDENT_WRITABLE_INSTITUTIONAL_STATUSES as readonly string[]).includes(existing.status)
    ) {
      return stage;
    }
    return existing;
  });
}

export function applyProfessorStageStatus(
  stages: readonly SapSuiteDeclaredStage[],
  stageCode: SapSuiteDeclaredStage["stageCode"],
  status: (typeof PROFESSOR_ONLY_INSTITUTIONAL_STATUSES)[number],
): SapSuiteDeclaredStage[] {
  return mergeDeclaredStages([...stages], sessionNumberFromKnown(stageCode)).map((stage) =>
    stage.stageCode === stageCode ? { ...stage, status } : stage,
  );
}

function sessionNumberFromKnown(stageCode: SapSuiteDeclaredStage["stageCode"]): number {
  return SAP_SUITE_E2E_STAGE_CODES.indexOf(stageCode) + 1;
}

export function normalizeEvidence(
  incoming: readonly UpdateSapSuiteEvidenceRequest[] | readonly SapSuiteEvidence[] | undefined,
  now: Date,
): SapSuiteEvidence[] {
  if (!incoming) {
    return [];
  }
  return incoming.slice(0, 20).map((item, index) => ({
    id: "id" in item && typeof item.id === "string" && item.id.length > 0 ? item.id : `ev-${index + 1}`,
    stageCode: item.stageCode,
    kind: item.kind,
    label: item.label.trim(),
    referenceUrl: item.referenceUrl,
    declaredAt:
      "declaredAt" in item && typeof item.declaredAt === "string"
        ? item.declaredAt
        : now.toISOString(),
  }));
}

export function deriveInstitutionalStatus(input: {
  readonly requested?: SapSuiteInstitutionalStatus;
  readonly stages: readonly SapSuiteDeclaredStage[];
  readonly evidenceCount: number;
  readonly needsSupport: boolean;
  readonly persisted: boolean;
}): SapSuiteInstitutionalStatus {
  if (
    input.requested &&
    (PROFESSOR_ONLY_INSTITUTIONAL_STATUSES as readonly string[]).includes(input.requested)
  ) {
    return input.requested;
  }
  if (input.stages.every((stage) => stage.status === "accompaniment_completed")) {
    return "accompaniment_completed";
  }
  if (input.stages.some((stage) => stage.status === "institutional_review")) {
    return "institutional_review";
  }
  if (input.requested && input.requested === "evidence_submitted") {
    return "evidence_submitted";
  }
  if (input.evidenceCount > 0) {
    return "evidence_submitted";
  }
  if (input.requested && input.requested === "progress_declared") {
    return "progress_declared";
  }
  if (input.stages.some((stage) => stage.status === "progress_declared")) {
    return "progress_declared";
  }
  if (input.needsSupport || input.stages.some((stage) => stage.status === "in_accompaniment")) {
    return "in_accompaniment";
  }
  if (!input.persisted) {
    return "not_started";
  }
  return input.requested ?? "in_accompaniment";
}

export function buildProgramCatalog(): SapSuiteProgramCatalog {
  return {
    programCode: SAP_SUITE_E2E_PROGRAM_CODE,
    title: SAP_SUITE_E2E_TITLE,
    subtitle:
      "Accompagnement institutionnel des 10 étapes S1–S10. Le contenu officiel demeure sur SAP Learning.",
    // TEC.ERP never interpolates SAP lesson/unit identifiers into this URL.
    officialUrl: SAP_SUITE_E2E_OFFICIAL_URL,
    officialUrlOpensInNewTab: true,
    iframeForbidden: true,
    emitsSapAchievement: false,
    emitsSapCertification: false,
    officialSourceRemainsSap: true,
    disclaimer: SAP_IEE2E_ACHIEVEMENT_DISCLAIMER,
    certificationDisclaimer: SAP_SUITE_E2E_CERTIFICATION_DISCLAIMER,
    sourceDisclaimer: SAP_SUITE_E2E_SOURCE_DISCLAIMER,
    stages: [...SAP_SUITE_E2E_STAGES],
    officialPathUnits: [...SAP_SUITE_E2E_OFFICIAL_PATH_UNITS],
  };
}

export function isStageCode(value: string): value is SapSuiteDeclaredStage["stageCode"] {
  return SapSuiteStageCodeSchema.safeParse(value).success;
}

export function isInstitutionalStatus(value: string): value is SapSuiteInstitutionalStatus {
  return SapSuiteInstitutionalStatusSchema.safeParse(value).success;
}

export function parseStages(value: unknown): SapSuiteDeclaredStage[] {
  if (!Array.isArray(value)) {
    return createDefaultStages();
  }
  const parsed: SapSuiteDeclaredStage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      continue;
    }
    const record = item as Record<string, unknown>;
    const stageCode = typeof record.stageCode === "string" ? record.stageCode : "";
    const status = typeof record.status === "string" ? record.status : "";
    if (!isStageCode(stageCode) || !isInstitutionalStatus(status)) {
      continue;
    }
    parsed.push({ stageCode, status });
  }
  return mergeDeclaredStages(parsed, 1);
}

export function parseEvidence(value: unknown): SapSuiteEvidence[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return normalizeEvidence(
    value.filter((item): item is SapSuiteEvidence => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return false;
      }
      const record = item as Record<string, unknown>;
      return (
        typeof record.id === "string" &&
        typeof record.label === "string" &&
        (record.kind === "student_declaration" || record.kind === "external_reference")
      );
    }),
    new Date(),
  );
}

export function createDefaultUnits(): SapIee2eDeclaredUnit[] {
  return Array.from({ length: SAP_IEE2E_UNIT_COUNT }, (_, index) => ({
    unitNumber: index + 1,
    status: "a_decouvrir" as const,
  }));
}

export function mergeDeclaredUnits(
  incoming: readonly SapIee2eDeclaredUnit[],
): SapIee2eDeclaredUnit[] {
  const byNumber = new Map(incoming.map((unit) => [unit.unitNumber, unit]));
  return createDefaultUnits().map((unit) => byNumber.get(unit.unitNumber) ?? unit);
}

export function buildProgressionLabel(
  units: readonly SapIee2eDeclaredUnit[],
  currentUnit: number,
): string {
  const completed = units.filter((unit) => unit.status === "terminee_declaree").length;
  return `${completed}/${SAP_IEE2E_UNIT_COUNT} unités déclarées terminées · unité ${currentUnit}`;
}

export function formatDeclarationLabel(declaredAt: Date | null, _now: Date): string {
  if (!declaredAt) {
    return "Jamais déclarée";
  }
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(declaredAt);
}

export function isStaleDeclaration(
  declaredAt: Date | null,
  now: Date,
  staleAfterDays: number,
): boolean {
  if (!declaredAt) {
    return false;
  }
  const ageMs = now.getTime() - declaredAt.getTime();
  return ageMs > staleAfterDays * 24 * 60 * 60 * 1000;
}

export function createDefaultSelfReportView(): Omit<SapIee2eSelfReport, "lastUpdateLabel"> & {
  lastDeclaredAt: null;
} {
  const stages = createDefaultStages();
  return {
    currentUnit: 1,
    sessionNumber: 1,
    currentStageCode: "S1",
    institutionalStatus: "not_started",
    sapAccess: "non_confirme",
    difficulty: "",
    needsSupport: false,
    note: "",
    achievement: "non_declare",
    lastDeclaredAt: null,
    progressionLabel: buildProgressionLabel(createDefaultUnits(), 1),
    persisted: false,
    units: createDefaultUnits(),
    stages,
    evidence: [],
    semaineZero: { ...EMPTY_SAP_IEE2E_SEMAINE_ZERO },
    semaineZeroReady: false,
    calendar: buildCalendarView(null, new Date()),
    officialUrl: SAP_SUITE_E2E_OFFICIAL_URL,
    sapResultOfficial: false,
  };
}

export function parseSemaineZero(value: unknown): SapIee2eSemaineZeroChecklist {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...EMPTY_SAP_IEE2E_SEMAINE_ZERO };
  }
  const record = value as Record<string, unknown>;
  return {
    universalId: record.universalId === true,
    learningHub: record.learningHub === true,
    iee2eOpened: record.iee2eOpened === true,
    noSharedAccount: record.noSharedAccount === true,
    contingencyAck: record.contingencyAck === true,
  };
}

export function isSemaineZeroReady(checklist: SapIee2eSemaineZeroChecklist): boolean {
  return (
    checklist.universalId &&
    checklist.learningHub &&
    checklist.iee2eOpened &&
    checklist.noSharedAccount &&
    checklist.contingencyAck
  );
}

export function deriveSapAccessFromSemaineZero(
  checklist: SapIee2eSemaineZeroChecklist,
): SapIee2eAccess {
  if (checklist.iee2eOpened) {
    return "commence";
  }
  if (checklist.universalId && checklist.learningHub) {
    return "confirme";
  }
  return "non_confirme";
}

export function parseSession1Date(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const parsed = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatSession1Date(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function buildCalendarView(session1At: Date | null, now: Date): SapIee2eCalendarView {
  if (!session1At) {
    return {
      session1Date: null,
      session1At: null,
      semaineZeroOpensAt: null,
      daysUntilSession1: null,
      windowLabel: "Date de séance 1 non fixée — Semaine Zéro à planifier (14 à 21 jours avant).",
    };
  }
  const opensAt = new Date(
    session1At.getTime() - SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS * 24 * 60 * 60 * 1000,
  );
  const daysUntilSession1 = Math.ceil((session1At.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  let windowLabel: string;
  if (daysUntilSession1 < 0) {
    windowLabel =
      "Séance 1 dépassée — rattrapage d’accès. Jamais de compte SAP partagé.";
  } else if (daysUntilSession1 > SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS) {
    windowLabel = `Semaine Zéro dans ${daysUntilSession1 - SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS} j · séance 1 dans ${daysUntilSession1} j.`;
  } else {
    windowLabel = `Séance 1 dans ${daysUntilSession1} j — confirmer l’accès SAP avant le cours.`;
  }
  return {
    session1Date: formatSession1Date(session1At),
    session1At: session1At.toISOString(),
    semaineZeroOpensAt: opensAt.toISOString(),
    daysUntilSession1,
    windowLabel,
  };
}
