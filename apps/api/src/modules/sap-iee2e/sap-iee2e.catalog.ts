import {
  EMPTY_SAP_IEE2E_SEMAINE_ZERO,
  SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS,
  SAP_IEE2E_UNIT_COUNT,
  type SapIee2eAccess,
  type SapIee2eCalendarView,
  type SapIee2eDeclaredUnit,
  type SapIee2eSelfReport,
  type SapIee2eSemaineZeroChecklist,
} from "@tec-platform/contracts";

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
  return {
    currentUnit: 1,
    sessionNumber: 1,
    sapAccess: "non_confirme",
    difficulty: "",
    needsSupport: false,
    note: "",
    achievement: "non_declare",
    lastDeclaredAt: null,
    progressionLabel: buildProgressionLabel(createDefaultUnits(), 1),
    persisted: false,
    units: createDefaultUnits(),
    semaineZero: { ...EMPTY_SAP_IEE2E_SEMAINE_ZERO },
    semaineZeroReady: false,
    calendar: buildCalendarView(null, new Date()),
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
