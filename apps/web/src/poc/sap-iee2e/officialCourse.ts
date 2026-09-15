import { SAP_SUITE_E2E_OFFICIAL_URL } from "@tec-platform/contracts";

/**
 * Métadonnées publiques confirmées — SAP Learning (version FR).
 * Identification du parcours officiel uniquement — aucun contenu pédagogique copié.
 *
 * TEC.ERP n’ouvre que l’URL stable du parcours officiel. Jamais d’unité,
 * slug ou lessonId interpolés dans une route SAP.
 */

export const SAP_IEE2E_OFFICIAL_FR_URL = SAP_SUITE_E2E_OFFICIAL_URL;
export const SAP_OFFICIAL_LAUNCH_LABEL = "Ouvrir dans SAP Learning" as const;
export const SAP_OFFICIAL_LAUNCH_HINT =
  "Choisissez vous-même l’unité dans SAP Learning. TEC.ERP n’ouvre pas de page interne SAP." as const;

/** Titre affiché par SAP Learning (FR) — conserve le nom anglais officiel du parcours. */
export const SAP_IEE2E_OFFICIAL_TITLE =
  "Exploring End-to-End Business Processes in SAP Business Suite" as const;

export const SAP_IEE2E_OFFICIAL_TITLE_SUFFIX_FR = "FR" as const;

export interface OfficialUnitMeta {
  readonly unitNumber: number;
  readonly titleFr: string;
  readonly lessonCount: number;
  /** Durée telle qu’affichée sur SAP Learning FR */
  readonly durationLabel: string;
  readonly durationMinutes: number;
}

export const OFFICIAL_UNITS_FR: readonly OfficialUnitMeta[] = [
  {
    unitNumber: 1,
    titleFr:
      "Identifier les processus de gestion de bout en bout et leur défi en matière d'intégration",
    lessonCount: 3,
    durationLabel: "1 h",
    durationMinutes: 60,
  },
  {
    unitNumber: 2,
    titleFr: "Description de SAP Business Suite",
    lessonCount: 9,
    durationLabel: "2 h",
    durationMinutes: 120,
  },
  {
    unitNumber: 3,
    titleFr: "Discussion sur les concepts et objets centraux dans SAP Business Suite",
    lessonCount: 3,
    durationLabel: "1 h 40 min",
    durationMinutes: 100,
  },
  {
    unitNumber: 4,
    titleFr:
      "Exécution du processus de l'enregistrement au reporting : accent mis sur la comptabilité financière et le contrôle de gestion",
    lessonCount: 8,
    durationLabel: "6 h 24 min",
    durationMinutes: 384,
  },
  {
    unitNumber: 5,
    titleFr:
      "Exécution du processus du recrutement à la retraite : focus sur le pilotage de l'expérience humaine",
    lessonCount: 5,
    durationLabel: "2 h 39 min",
    durationMinutes: 159,
  },
  {
    unitNumber: 6,
    titleFr: "Exécution du processus d'approvisionnement : focalisation sur l'approvisionnement",
    lessonCount: 8,
    durationLabel: "4 h 7 min",
    durationMinutes: 247,
  },
  {
    unitNumber: 7,
    titleFr:
      "Exécution du processus de la conception aux opérations : accent mis sur la production",
    lessonCount: 6,
    durationLabel: "6 h 12 min",
    durationMinutes: 372,
  },
  {
    unitNumber: 8,
    titleFr: "Exécution du processus Lead-to-Cash : accent mis sur les ventes",
    lessonCount: 7,
    durationLabel: "4 h 55 min",
    durationMinutes: 295,
  },
  {
    unitNumber: 9,
    titleFr: "Exécution du processus Lead-to-Cash : focalisation sur le service",
    lessonCount: 5,
    durationLabel: "3 h 46 min",
    durationMinutes: 226,
  },
] as const;

export const OFFICIAL_TOTAL_DURATION_MINUTES = OFFICIAL_UNITS_FR.reduce(
  (sum, unit) => sum + unit.durationMinutes,
  0,
);

/** Affichage institutionnel : 32 h 43 min (somme des durées FR confirmées). */
export const OFFICIAL_TOTAL_DURATION_LABEL = "32 h 43 min" as const;

export const OFFICIAL_UNIT_COUNT = OFFICIAL_UNITS_FR.length;

/**
 * SAP Achievement — Course Completion (niveau Intermediate).
 * Confirmé via parcours réel (FASE 1B, badge émis) ; libellé institutionnel FR.
 * L’émetteur demeure SAP Learning selon ses conditions.
 */
export const SAP_ACHIEVEMENT_LABEL_FR =
  "SAP Achievement — Course Completion (niveau Intermediate)" as const;

export type OfficialSapLearningHref = typeof SAP_IEE2E_OFFICIAL_FR_URL;

export interface SapInternalIdentifierAttempt {
  readonly slug?: string | null;
  readonly lessonId?: string | null;
  readonly unitId?: string | null;
}

function summarizeDiscardedCandidate(value: unknown): string {
  if (value == null) {
    return String(value);
  }
  if (typeof value !== "string") {
    return typeof value;
  }
  const trimmed = value.trim();
  return trimmed.length > 180 ? `${trimmed.slice(0, 180)}…` : trimmed;
}

function logDiscardedSapLaunch(reason: string, candidate: unknown): void {
  console.warn("[tec-erp][sap-learning-launch] discarded non-official SAP target", {
    reason,
    candidate: summarizeDiscardedCandidate(candidate),
  });
}

function isUnusableSapIdentifier(value: unknown): boolean {
  if (value == null) {
    return true;
  }
  if (typeof value !== "string") {
    return true;
  }
  const trimmed = value.trim().toLowerCase();
  return trimmed === "" || trimmed === "null" || trimmed === "undefined";
}

function looksLikeSapInternalOrNullRoute(value: string): boolean {
  const normalized = value.trim();
  if (/\/null(?:\/|$|\?|#)/i.test(normalized) || /(?:\?|&|#)[^=]*=null(?:&|#|$)/i.test(normalized)) {
    return true;
  }
  try {
    const parsed = new URL(normalized);
    if (parsed.hostname !== "learning.sap.com") {
      return false;
    }
    const path = parsed.pathname.replace(/\/+$/, "");
    return path !== "/courses/exploring-end-to-end-business-processes-in-sap-business-suite-fr";
  } catch {
    return true;
  }
}

/** Unique href TEC.ERP may open for SAP Learning. Never concatenates identifiers. */
export function officialSapLearningLaunchHref(): OfficialSapLearningHref {
  return SAP_IEE2E_OFFICIAL_FR_URL;
}

/**
 * If a candidate is missing, null, `/null`, or any SAP internal/deep link, keep
 * the official course URL. Students never see a technical error.
 */
export function sanitizeOfficialSapLearningHref(candidate?: unknown): OfficialSapLearningHref {
  if (candidate === undefined) {
    return SAP_IEE2E_OFFICIAL_FR_URL;
  }
  if (candidate === SAP_SUITE_E2E_OFFICIAL_URL) {
    return SAP_IEE2E_OFFICIAL_FR_URL;
  }
  if (isUnusableSapIdentifier(candidate)) {
    logDiscardedSapLaunch("absent-or-null", candidate);
    return SAP_IEE2E_OFFICIAL_FR_URL;
  }
  if (typeof candidate === "string" && looksLikeSapInternalOrNullRoute(candidate)) {
    logDiscardedSapLaunch("internal-or-null-route", candidate);
    return SAP_IEE2E_OFFICIAL_FR_URL;
  }
  logDiscardedSapLaunch("non-official", candidate);
  return SAP_IEE2E_OFFICIAL_FR_URL;
}

/**
 * Policy trap: slug / lessonId / unitId must never become a SAP URL.
 * Missing or invalid identifiers are discarded internally.
 */
export function officialSapLearningHrefIgnoringIdentifiers(
  identifiers?: SapInternalIdentifierAttempt,
): OfficialSapLearningHref {
  if (identifiers !== undefined) {
    const attempted = [identifiers.slug, identifiers.lessonId, identifiers.unitId];
    const hasInvalid = attempted.some(
      (value) => value !== undefined && isUnusableSapIdentifier(value),
    );
    logDiscardedSapLaunch(hasInvalid ? "identifiers-absent-or-null" : "deep-link-refused", {
      slug: identifiers.slug ?? null,
      lessonId: identifiers.lessonId ?? null,
      unitId: identifiers.unitId ?? null,
    });
  }
  return SAP_IEE2E_OFFICIAL_FR_URL;
}
