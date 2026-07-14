import type { MissionKey } from "@tec-platform/contracts";

export const ENTERPRISE_DISCOVERY_MISSION_KEY =
  "m1-m01-decouvrir-entreprise" satisfies MissionKey;

export const MISSION_FEEDBACK_COMPLETE_KEY = "fb-discovery-complete";

export const MISSION_COMPETENCY_CODES = ["C-ORG-01", "C-BUS-01"] as const;

export const REQUIRED_ACKNOWLEDGED_INPUT_KEYS = [
  "ctx-nordhabitat-overview",
  "ctx-tom-40-36",
] as const;

export const JUSTIFICATION_MIN_LENGTH = 40;
export const JUSTIFICATION_MAX_LENGTH = 1000;
export const MINIMUM_MAPPING_COUNT = 2;

export interface MissionCatalogEntry {
  readonly missionKey: MissionKey;
  readonly title: string;
  readonly preview: string;
  readonly briefing: string;
  readonly unlockExplanation: string;
  readonly competencyCodes: readonly string[];
}

export interface MissionContextCatalogItem {
  readonly key: string;
  readonly title: string;
  readonly body: string;
  readonly required: boolean;
}

export interface MissionDepartmentCatalogItem {
  readonly key: string;
  readonly label: string;
  readonly description: string;
}

export interface MissionProblemCatalogItem {
  readonly key: string;
  readonly label: string;
  readonly description: string;
}

export interface AllowedDepartmentProblemPair {
  readonly departmentKey: string;
  readonly problemKey: string;
}

export const MISSION_CATALOG: readonly MissionCatalogEntry[] = [
  {
    missionKey: ENTERPRISE_DISCOVERY_MISSION_KEY,
    title: "Découvrir l’entreprise",
    preview:
      "Claire Fontaine vous confie une première découverte : comprendre comment NordHabitat organise l’information.",
    briefing:
      "Bonjour,\n\nVotre premier jour est derrière vous. Je vous confie maintenant une responsabilité d’observation : Découvrir l’entreprise.\n\nChez NordHabitat, l’information circule entre plusieurs départements. Un signal récent — l’écart d’inventaire signalé par Tom — illustre une fragmentation : le système affiche 40 unités, l’observation terrain en compte 36.\n\nVotre rôle est celui d’un Observateur-Analyste. Vous n’ajustez pas le stock et vous n’enregistrez aucune transaction. Identifiez quels départements sont touchés et quels problèmes d’affaires apparaissent, puis justifiez brièvement votre lecture.\n\nClaire Fontaine\nGestionnaire — NordHabitat",
    unlockExplanation:
      "Terminez d’abord votre première journée : lisez le message de Claire Fontaine et complétez votre première responsabilité opérationnelle. Le Centre de mission s’ouvrira ensuite.",
    competencyCodes: MISSION_COMPETENCY_CODES,
  },
];

export const MISSION_CONTEXT_CATALOG: readonly MissionContextCatalogItem[] = [
  {
    key: "ctx-nordhabitat-overview",
    title: "NordHabitat — vue d’ensemble",
    body: "NordHabitat est une entreprise de matériaux et solutions pour l’habitat. Les décisions reposent sur plusieurs départements : direction, opérations, finance, ventes, approvisionnement, entrepôt et TI. Une lecture partagée de la réalité est essentielle pour piloter l’entreprise.",
    required: true,
  },
  {
    key: "ctx-tom-40-36",
    title: "Signal de Tom — 40 versus 36",
    body: "Tom signale un écart d’inventaire : le système indique 40 unités, alors que le comptage physique en observe 36. Ce n’est pas une demande d’ajustement de stock. C’est un signal de fragmentation d’information et de propriété de processus entre départements.",
    required: true,
  },
];

export const MISSION_DEPARTMENT_CATALOG: readonly MissionDepartmentCatalogItem[] = [
  {
    key: "dept-direction",
    label: "Direction",
    description: "Gouverne les priorités et l’alignement entre unités.",
  },
  {
    key: "dept-operations",
    label: "Opérations",
    description: "Coordonne l’exécution quotidienne des processus.",
  },
  {
    key: "dept-finance",
    label: "Finance",
    description: "Suit la valorisation et la fiabilité des chiffres.",
  },
  {
    key: "dept-ventes",
    label: "Ventes",
    description: "S’appuie sur la disponibilité réelle pour servir les clients.",
  },
  {
    key: "dept-approvisionnement",
    label: "Approvisionnement",
    description: "Planifie les réapprovisionnements selon la demande et les stocks.",
  },
  {
    key: "dept-entrepot",
    label: "Entrepôt",
    description: "Gère les stocks physiques et les observations terrain.",
  },
  {
    key: "dept-ti",
    label: "TI",
    description: "Assure la cohérence des données dans les systèmes.",
  },
];

export const MISSION_PROBLEM_CATALOG: readonly MissionProblemCatalogItem[] = [
  {
    key: "prob-inventaire-divergent",
    label: "Inventaire divergent",
    description: "Écart entre quantité système et observation physique.",
  },
  {
    key: "prob-delais-approvisionnement",
    label: "Délais d’approvisionnement",
    description: "Risque de délais lorsque la réalité stock n’est pas partagée.",
  },
  {
    key: "prob-plaintes-clients",
    label: "Plaintes clients",
    description: "Écarts de service lorsque la disponibilité affichée est incorrecte.",
  },
  {
    key: "prob-visibilite-financiere",
    label: "Visibilité financière incomplète",
    description: "Valorisation et reporting fragilisés par des données incohérentes.",
  },
  {
    key: "prob-coherence-donnees",
    label: "Cohérence des données TI",
    description: "Données fragmentées entre systèmes et réalité terrain.",
  },
  {
    key: "prob-coordination-interdep",
    label: "Coordination inter-départements",
    description: "Responsabilités floues lorsqu’un signal touche plusieurs unités.",
  },
];

/**
 * Server-side only. Never serialize to mission detail responses.
 */
export const ALLOWED_DEPARTMENT_PROBLEM_PAIRS: readonly AllowedDepartmentProblemPair[] = [
  { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
  { departmentKey: "dept-entrepot", problemKey: "prob-coherence-donnees" },
  { departmentKey: "dept-ti", problemKey: "prob-inventaire-divergent" },
  { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
  { departmentKey: "dept-operations", problemKey: "prob-inventaire-divergent" },
  { departmentKey: "dept-operations", problemKey: "prob-coordination-interdep" },
  { departmentKey: "dept-finance", problemKey: "prob-inventaire-divergent" },
  { departmentKey: "dept-finance", problemKey: "prob-visibilite-financiere" },
  { departmentKey: "dept-approvisionnement", problemKey: "prob-delais-approvisionnement" },
  { departmentKey: "dept-approvisionnement", problemKey: "prob-inventaire-divergent" },
  { departmentKey: "dept-ventes", problemKey: "prob-plaintes-clients" },
  { departmentKey: "dept-ventes", problemKey: "prob-inventaire-divergent" },
  { departmentKey: "dept-direction", problemKey: "prob-coordination-interdep" },
  { departmentKey: "dept-direction", problemKey: "prob-inventaire-divergent" },
];

export const MISSION_FEEDBACK_CATALOG: Readonly<Record<string, string>> = {
  [MISSION_FEEDBACK_COMPLETE_KEY]:
    "Merci. Votre observation est enregistrée. L’écart 40 versus 36 illustre bien une fragmentation d’information entre départements — sans exiger un ajustement de stock de votre part. Nous pourrons plus tard approfondir le contexte organisationnel. Continuer à observer avec rigueur.\n\nClaire Fontaine",
};

export function getMissionCatalogEntry(missionKey: string): MissionCatalogEntry | undefined {
  return MISSION_CATALOG.find((mission) => mission.missionKey === missionKey);
}

export function isKnownMissionKey(missionKey: string): missionKey is MissionKey {
  return MISSION_CATALOG.some((mission) => mission.missionKey === missionKey);
}

export function isAllowedDepartmentProblemPair(
  departmentKey: string,
  problemKey: string,
): boolean {
  return ALLOWED_DEPARTMENT_PROBLEM_PAIRS.some(
    (pair) => pair.departmentKey === departmentKey && pair.problemKey === problemKey,
  );
}

export function pairKey(departmentKey: string, problemKey: string): string {
  return `${departmentKey}::${problemKey}`;
}
