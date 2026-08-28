/**
 * Données de démonstration (MOCK) — PoC visuelle uniquement.
 * Aucune persistance, aucun appel SAP.
 */

import {
  SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS,
  type SapIee2eCalendarView,
  type SapIee2eSemaineZeroChecklist,
} from "@tec-platform/contracts";

import { OFFICIAL_UNITS_FR } from "./officialCourse.js";

export type DeclaredUnitStatus =
  | "a_decouvrir"
  | "en_cours"
  | "a_reprendre"
  | "terminee_declaree"
  | "accompagnement_requis";

export type AchievementDeclared = "non_declare" | "en_cours" | "obtenu_declare";

export type SapAccessState = "non_confirme" | "confirme" | "commence";

export interface DeclaredUnitProgress {
  readonly unitNumber: number;
  readonly status: DeclaredUnitStatus;
  readonly lastUpdateLabel: string;
  readonly professorHint: string;
}

export interface StudentSelfReport {
  readonly currentUnit: number;
  readonly progressionLabel: string;
  readonly difficulty: string;
  readonly needsSupport: boolean;
  readonly note: string;
  readonly achievement: AchievementDeclared;
  readonly lastUpdateLabel: string;
  readonly sessionNumber: number;
  readonly sapAccess: SapAccessState;
  readonly units: readonly DeclaredUnitProgress[];
  readonly semaineZero: SapIee2eSemaineZeroChecklist;
  readonly semaineZeroReady: boolean;
}

export interface CohortStudentRow {
  readonly id: string;
  readonly name: string;
  readonly access: SapAccessState;
  readonly declaredUnit: number | null;
  readonly progressionLabel: string;
  readonly lastUpdateLabel: string;
  readonly difficulty: string;
  readonly needsSupport: boolean;
  readonly achievement: AchievementDeclared;
  readonly staleUpdate: boolean;
  readonly notStarted: boolean;
  readonly semaineZeroReady: boolean;
}

export interface CollegeSessionSummary {
  readonly sessionNumber: number;
  readonly titleFr: string;
  readonly relatedUnit: number | null;
  readonly status: "modele" | "provisoire";
  readonly accompaniedMinutes: number;
  readonly individualHint: string;
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
): SapAccessState {
  if (checklist.iee2eOpened) {
    return "commence";
  }
  if (checklist.universalId && checklist.learningHub) {
    return "confirme";
  }
  return "non_confirme";
}

export function buildLocalCalendarView(
  session1Date: string | null,
  now = new Date(),
): SapIee2eCalendarView {
  if (!session1Date) {
    return {
      session1Date: null,
      session1At: null,
      semaineZeroOpensAt: null,
      daysUntilSession1: null,
      windowLabel: "Date de séance 1 non fixée — Semaine Zéro à planifier (14 à 21 jours avant).",
    };
  }
  const session1At = new Date(`${session1Date}T12:00:00.000Z`);
  const opensAt = new Date(
    session1At.getTime() - SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS * 24 * 60 * 60 * 1000,
  );
  const daysUntilSession1 = Math.ceil(
    (session1At.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
  );
  let windowLabel: string;
  if (daysUntilSession1 < 0) {
    windowLabel = "Séance 1 dépassée — rattrapage d’accès. Jamais de compte SAP partagé.";
  } else if (daysUntilSession1 > SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS) {
    windowLabel = `Semaine Zéro dans ${daysUntilSession1 - SAP_IEE2E_SEMAINE_ZERO_LEAD_DAYS} j · séance 1 dans ${daysUntilSession1} j.`;
  } else {
    windowLabel = `Séance 1 dans ${daysUntilSession1} j — confirmer l’accès SAP avant le cours.`;
  }
  return {
    session1Date,
    session1At: session1At.toISOString(),
    semaineZeroOpensAt: opensAt.toISOString(),
    daysUntilSession1,
    windowLabel,
  };
}

export const MOCK_SEMAINE_ZERO_READY: SapIee2eSemaineZeroChecklist = {
  universalId: true,
  learningHub: true,
  iee2eOpened: true,
  noSharedAccount: true,
  contingencyAck: true,
};

export const MOCK_CALENDAR: SapIee2eCalendarView = buildLocalCalendarView("2026-08-03");

/** MOCK — persona étudiante pour la démo */
export const MOCK_STUDENT_REPORT: StudentSelfReport = {
  currentUnit: 3,
  progressionLabel: "Unités 1–2 terminées (déclarées) · Unité 3 en cours",
  difficulty: "Distinction entre structures organisationnelles et données de base",
  needsSupport: false,
  note: "",
  achievement: "non_declare",
  lastUpdateLabel: "9 août 2026, 14 h 20",
  sessionNumber: 3,
  sapAccess: "commence",
  units: OFFICIAL_UNITS_FR.map((unit) => {
    if (unit.unitNumber <= 2) {
      return {
        unitNumber: unit.unitNumber,
        status: "terminee_declaree" as const,
        lastUpdateLabel: unit.unitNumber === 1 ? "2 août 2026" : "6 août 2026",
        professorHint:
          unit.unitNumber === 1
            ? "Bien ancré sur l’intégration. Poursuivre vers la Suite."
            : "Glossaire Suite consolidé. Préparer l’unité 3.",
      };
    }
    if (unit.unitNumber === 3) {
      return {
        unitNumber: 3,
        status: "en_cours" as const,
        lastUpdateLabel: "9 août 2026",
        professorHint: "Relire les affectations (société, division, organisation commerciale).",
      };
    }
    return {
      unitNumber: unit.unitNumber,
      status: "a_decouvrir" as const,
      lastUpdateLabel: "—",
      professorHint: "À aborder selon le calendrier des séances Collège.",
    };
  }),
  semaineZero: MOCK_SEMAINE_ZERO_READY,
  semaineZeroReady: true,
};

/** MOCK — cohorte démonstrative */
export const MOCK_COHORT: readonly CohortStudentRow[] = [
  {
    id: "s1",
    name: "Camille Tremblay",
    access: "commence",
    declaredUnit: 3,
    progressionLabel: "3 / 9 (déclarée)",
    lastUpdateLabel: "9 août",
    difficulty: "Structures organisationnelles",
    needsSupport: true,
    achievement: "non_declare",
    staleUpdate: false,
    notStarted: false,
    semaineZeroReady: true,
  },
  {
    id: "s2",
    name: "Émile Gagnon",
    access: "commence",
    declaredUnit: 4,
    progressionLabel: "4 / 9 (déclarée)",
    lastUpdateLabel: "8 août",
    difficulty: "—",
    needsSupport: false,
    achievement: "non_declare",
    staleUpdate: false,
    notStarted: false,
    semaineZeroReady: true,
  },
  {
    id: "s3",
    name: "Sofia Benali",
    access: "non_confirme",
    declaredUnit: null,
    progressionLabel: "0 / 9 (déclarée)",
    lastUpdateLabel: "—",
    difficulty: "Accès SAP Learning",
    needsSupport: true,
    achievement: "non_declare",
    staleUpdate: true,
    notStarted: true,
    semaineZeroReady: false,
  },
  {
    id: "s4",
    name: "Lucas Moreau",
    access: "commence",
    declaredUnit: 2,
    progressionLabel: "2 / 9 (déclarée)",
    lastUpdateLabel: "1er août",
    difficulty: "Terminologie Suite",
    needsSupport: false,
    achievement: "non_declare",
    staleUpdate: true,
    notStarted: false,
    semaineZeroReady: true,
  },
  {
    id: "s5",
    name: "Amina Diallo",
    access: "commence",
    declaredUnit: 9,
    progressionLabel: "9 / 9 (déclarée)",
    lastUpdateLabel: "9 août",
    difficulty: "—",
    needsSupport: false,
    achievement: "obtenu_declare",
    staleUpdate: false,
    notStarted: false,
    semaineZeroReady: true,
  },
  {
    id: "s6",
    name: "Nathan Roy",
    access: "confirme",
    declaredUnit: 1,
    progressionLabel: "1 / 9 (déclarée)",
    lastUpdateLabel: "7 août",
    difficulty: "—",
    needsSupport: false,
    achievement: "en_cours",
    staleUpdate: false,
    notStarted: false,
    semaineZeroReady: true,
  },
  {
    id: "s7",
    name: "Jade Lavoie",
    access: "commence",
    declaredUnit: 5,
    progressionLabel: "5 / 9 (déclarée)",
    lastUpdateLabel: "5 août",
    difficulty: "Intégration paie → finance",
    needsSupport: true,
    achievement: "non_declare",
    staleUpdate: true,
    notStarted: false,
    semaineZeroReady: true,
  },
  {
    id: "s8",
    name: "Olivier Fortin",
    access: "non_confirme",
    declaredUnit: null,
    progressionLabel: "0 / 9 (déclarée)",
    lastUpdateLabel: "—",
    difficulty: "Compte non activé",
    needsSupport: true,
    achievement: "non_declare",
    staleUpdate: true,
    notStarted: true,
    semaineZeroReady: false,
  },
] as const;

/**
 * MOCK / PROVISOIRE — organisation pédagogique Collège (10 séances).
 * Le mapping définitif dépend de la validation pédagogique intégrale.
 */
export const COLLEGE_SESSIONS: readonly CollegeSessionSummary[] = [
  {
    sessionNumber: 1,
    titleFr: "Voir l’entreprise comme un système intégré",
    relatedUnit: 1,
    status: "provisoire",
    accompaniedMinutes: 180,
    individualHint: "Travail individuel SAP estimé après séance",
  },
  {
    sessionNumber: 2,
    titleFr: "Comprendre SAP Business Suite",
    relatedUnit: 2,
    status: "provisoire",
    accompaniedMinutes: 180,
    individualHint: "Lecture Suite + glossaire",
  },
  {
    sessionNumber: 3,
    titleFr: "Structurer l’entreprise et ses données",
    relatedUnit: 3,
    status: "modele",
    accompaniedMinutes: 180,
    individualHint: "Préparation obligatoire avant séance + clôture après",
  },
  {
    sessionNumber: 4,
    titleFr: "Piloter la finance (enregistrement au reporting — I)",
    relatedUnit: 4,
    status: "provisoire",
    accompaniedMinutes: 180,
    individualHint: "Forte charge individuelle (durée officielle élevée)",
  },
  {
    sessionNumber: 5,
    titleFr: "Contrôler les coûts et intégrer (enregistrement au reporting — II)",
    relatedUnit: 4,
    status: "provisoire",
    accompaniedMinutes: 180,
    individualHint: "Finaliser l’unité 4 et le quiz SAP",
  },
  {
    sessionNumber: 6,
    titleFr: "Gérer l’expérience humaine (recrutement à la retraite)",
    relatedUnit: 5,
    status: "provisoire",
    accompaniedMinutes: 180,
    individualHint: "Parcours SuccessFactors déclaré",
  },
  {
    sessionNumber: 7,
    titleFr: "Approvisionner l’entreprise (approvisionnement)",
    relatedUnit: 6,
    status: "provisoire",
    accompaniedMinutes: 180,
    individualHint: "Préparation SAP obligatoire avant séance",
  },
  {
    sessionNumber: 8,
    titleFr: "Produire et planifier (conception aux opérations)",
    relatedUnit: 7,
    status: "provisoire",
    accompaniedMinutes: 180,
    individualHint: "Ne pas démarrer l’unité 7 à froid en séance",
  },
  {
    sessionNumber: 9,
    titleFr: "Vendre et encaisser (Lead-to-Cash — ventes)",
    relatedUnit: 8,
    status: "provisoire",
    accompaniedMinutes: 180,
    individualHint: "Chaîne documents ventes → finance",
  },
  {
    sessionNumber: 10,
    titleFr: "Servir le client et consolider la vision transversale",
    relatedUnit: 9,
    status: "provisoire",
    accompaniedMinutes: 180,
    individualHint: "Unité 9 majoritairement parcourue avant la séance",
  },
] as const;

export const UNIT_STATUS_LABEL: Record<DeclaredUnitStatus, string> = {
  a_decouvrir: "À découvrir",
  en_cours: "En cours",
  a_reprendre: "À reprendre",
  terminee_declaree: "Terminée — déclarée",
  accompagnement_requis: "Accompagnement requis",
};

export const ACHIEVEMENT_LABEL: Record<AchievementDeclared, string> = {
  non_declare: "Non déclaré",
  en_cours: "En cours",
  obtenu_declare: "Obtenu — déclaré par l’étudiant",
};

export const ACCESS_LABEL: Record<SapAccessState, string> = {
  non_confirme: "Non confirmé",
  confirme: "Confirmé",
  commence: "Commencé",
};
