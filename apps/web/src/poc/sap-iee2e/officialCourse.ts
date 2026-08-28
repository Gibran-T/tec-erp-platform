/**
 * Métadonnées publiques confirmées — SAP Learning (version FR).
 * Source: https://learning.sap.com/courses/exploring-end-to-end-business-processes-in-sap-business-suite-fr
 * Validé le 9 août 2026 (America/Toronto).
 *
 * Ne contient aucun contenu pédagogique propriétaire SAP.
 */

export const SAP_IEE2E_OFFICIAL_FR_URL =
  "https://learning.sap.com/courses/exploring-end-to-end-business-processes-in-sap-business-suite-fr" as const;

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
