import type { CurriculumVersion } from "./curriculum-version.js";

export interface MissionPlacement {
  readonly missionKey: string;
  readonly moduleCode: string;
  readonly missionCode: string;
  readonly sequence: number;
  readonly title?: string;
}

export interface ModulePlacement {
  readonly moduleCode: string;
  readonly title: string;
  readonly sequence: number;
  readonly competencySummary: string;
  readonly processTags: readonly string[];
  readonly missionKeys: readonly string[];
}

const V1_REGULAR_KEYS: readonly string[] = [
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
];

const V2_REGULAR_KEYS: readonly string[] = [
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
  "m8-m01-integrer-nouvel-employe",
  "m8-m02-gerer-temps-absences",
  "m8-m03-evaluer-competences-evolution",
  "m8-m01-matrice-approbation-pression",
  "m8-m02-revue-acces-sod",
  "m8-m03-autoevaluation-probation",
  "m9-m01-atelier-definition-kpi",
  "m9-m02-tableau-bord-comite",
  "m9-m03-analyse-concurrentielle-ia",
];

/** Capstone-linked historical keys — V1 regular only; never counted in V2's 30. */
export const V1_CAPSTONE_MODULE_MISSION_KEYS: readonly string[] = [
  "m10-m01-diapositive-conseil",
  "m10-m02-defi-final-equinoxe",
  "m10-m03-presentation-capstone-or",
];

export const HCM_MISSION_KEYS: readonly string[] = [
  "m8-m01-integrer-nouvel-employe",
  "m8-m02-gerer-temps-absences",
  "m8-m03-evaluer-competences-evolution",
];

const V1_MODULES: readonly ModulePlacement[] = [
  {
    moduleCode: "M1",
    title: "Module 1 — Découverte organisationnelle",
    sequence: 1,
    competencySummary: "Comprendre l'entreprise intégrée et les dépendances interdépartementales.",
    processTags: ["ERP", "processus"],
    missionKeys: V1_REGULAR_KEYS.slice(0, 3),
  },
  {
    moduleCode: "M2",
    title: "Module 2 — Donnees de reference et structure",
    sequence: 2,
    competencySummary: "Structurer l'organisation et gouverner la qualité des données de base.",
    processTags: ["master-data", "organisation"],
    missionKeys: V1_REGULAR_KEYS.slice(3, 6),
  },
  {
    moduleCode: "M3",
    title: "Module 3 — Procure-to-Pay",
    sequence: 3,
    competencySummary: "Exécuter le cycle d'approvisionnement jusqu'à l'impact fournisseur.",
    processTags: ["P2P"],
    missionKeys: V1_REGULAR_KEYS.slice(6, 9),
  },
  {
    moduleCode: "M4",
    title: "Module 4 — Order-to-Cash",
    sequence: 4,
    competencySummary: "Gérer la commande client jusqu'à la clôture de vente.",
    processTags: ["O2C"],
    missionKeys: V1_REGULAR_KEYS.slice(9, 12),
  },
  {
    moduleCode: "M5",
    title: "Module 5 — Supply Chain et inventaire",
    sequence: 5,
    competencySummary: "Analyser stocks, transferts et recommandation S&OP.",
    processTags: ["inventory", "S&OP"],
    missionKeys: V1_REGULAR_KEYS.slice(12, 15),
  },
  {
    moduleCode: "M6",
    title: "Module 6 — Finance et comptabilite",
    sequence: 6,
    competencySummary: "Traiter factures, exceptions de rapprochement et explication financière.",
    processTags: ["finance", "AP"],
    missionKeys: V1_REGULAR_KEYS.slice(15, 18),
  },
  {
    moduleCode: "M7",
    title: "Module 7 — CRM et service client",
    sequence: 7,
    competencySummary: "Ouvrir, escalader et clôturer un dossier client avec récupération NPS.",
    processTags: ["CRM"],
    missionKeys: V1_REGULAR_KEYS.slice(18, 21),
  },
  {
    moduleCode: "M8",
    title: "Module 8 — Gouvernance et conformite",
    sequence: 8,
    competencySummary: "Appliquer approbations, accès/SoD et autoévaluation de probation.",
    processTags: ["governance", "SoD"],
    missionKeys: V1_REGULAR_KEYS.slice(21, 24),
  },
  {
    moduleCode: "M9",
    title: "Module 9 — BI et intelligence artificielle",
    sequence: 9,
    competencySummary: "Définir des KPI, lire un tableau de bord et cadrer l'usage de l'IA.",
    processTags: ["BI", "KPI", "AI"],
    missionKeys: V1_REGULAR_KEYS.slice(24, 27),
  },
  {
    moduleCode: "M10",
    title: "Module 10 — Capstone Equinoxe",
    sequence: 10,
    competencySummary: "Synthèse conseil, crise intégrée et présentation Capstone Or.",
    processTags: ["capstone", "consulting"],
    missionKeys: V1_REGULAR_KEYS.slice(27, 30),
  },
];

const V2_MODULES: readonly ModulePlacement[] = [
  {
    moduleCode: "M1",
    title: "Module 1 — Entreprise intégrée et processus",
    sequence: 1,
    competencySummary:
      "Comprendre l'ERP intégré, identifier les processus de bout en bout et reconnaître les dépendances départementales.",
    processTags: ["ERP", "processus"],
    missionKeys: V2_REGULAR_KEYS.slice(0, 3),
  },
  {
    moduleCode: "M2",
    title: "Module 2 — Structure organisationnelle et données de base",
    sequence: 2,
    competencySummary: "Structurer l'organisation, créer les données de référence et gouverner la qualité des données.",
    processTags: ["master-data", "organisation"],
    missionKeys: V2_REGULAR_KEYS.slice(3, 6),
  },
  {
    moduleCode: "M3",
    title: "Module 3 — Approvisionnement et Procure-to-Pay",
    sequence: 3,
    competencySummary:
      "Identifier un besoin, traiter une commande d'achat et analyser l'impact fournisseur (sensibilisation three-way).",
    processTags: ["P2P"],
    missionKeys: V2_REGULAR_KEYS.slice(6, 9),
  },
  {
    moduleCode: "M4",
    title: "Module 4 — Ventes et Order-to-Cash",
    sequence: 4,
    competencySummary: "Saisir la commande, allouer entre entrepôts et clôturer la vente.",
    processTags: ["O2C"],
    missionKeys: V2_REGULAR_KEYS.slice(9, 12),
  },
  {
    moduleCode: "M5",
    title: "Module 5 — Stocks, réapprovisionnement et S&OP",
    sequence: 5,
    competencySummary: "Analyser les stocks, décider un transfert inter-centres et présenter une recommandation S&OP.",
    processTags: ["inventory", "S&OP"],
    missionKeys: V2_REGULAR_KEYS.slice(12, 15),
  },
  {
    moduleCode: "M6",
    title: "Module 6 — Finance et contrôle",
    sequence: 6,
    competencySummary: "Réceptionner une facture, traiter l'exception de rapprochement et expliquer l'écart.",
    processTags: ["finance", "contrôle"],
    missionKeys: V2_REGULAR_KEYS.slice(15, 18),
  },
  {
    moduleCode: "M7",
    title: "Module 7 — CRM et service client",
    sequence: 7,
    competencySummary: "Ouvrir le dossier, coordonner l'escalade et récupérer la satisfaction client.",
    processTags: ["CRM"],
    missionKeys: V2_REGULAR_KEYS.slice(18, 21),
  },
  {
    moduleCode: "M8",
    title: "Module 8 — Ressources humaines et HCM",
    sequence: 8,
    competencySummary:
      "Intégrer un employé, gérer temps/absences et impact financier, évaluer compétences et préparer l'évolution.",
    processTags: ["HCM", "RH"],
    missionKeys: V2_REGULAR_KEYS.slice(21, 24),
  },
  {
    moduleCode: "M9",
    title: "Module 9 — Gouvernance, accès et conformité",
    sequence: 9,
    competencySummary:
      "Appliquer la matrice d'approbation, réviser accès/SoD et réaliser une autoévaluation de conformité professionnelle.",
    processTags: ["governance", "SoD", "conformité"],
    missionKeys: V2_REGULAR_KEYS.slice(24, 27),
  },
  {
    moduleCode: "M10",
    title: "Module 10 — BI, KPI, IA et conseil",
    sequence: 10,
    competencySummary:
      "Définir des KPI, analyser le tableau de bord de direction et formuler une recommandation BI/IA/conseil.",
    processTags: ["BI", "KPI", "AI", "conseil"],
    missionKeys: V2_REGULAR_KEYS.slice(27, 30),
  },
];

function buildPlacements(
  modules: readonly ModulePlacement[],
  overlays: Readonly<Record<string, Partial<Pick<MissionPlacement, "title">>>> = {},
): ReadonlyMap<string, MissionPlacement> {
  const map = new Map<string, MissionPlacement>();
  for (const module of modules) {
    module.missionKeys.forEach((missionKey, index) => {
      const overlay = overlays[missionKey];
      map.set(missionKey, {
        missionKey,
        moduleCode: module.moduleCode,
        missionCode: `${module.moduleCode}-M0${index + 1}`,
        sequence: index + 1,
        title: overlay?.title,
      });
    });
  }
  return map;
}

const V2_TITLE_OVERLAYS: Readonly<Record<string, Partial<Pick<MissionPlacement, "title">>>> = {
  "m1-m01-decouvrir-entreprise": { title: "Découvrir l’entreprise" },
  "m1-m02-connecter-departements": { title: "Connecter les départements" },
  "m1-m03-diagnostiquer-preparation": { title: "Diagnostiquer la préparation organisationnelle" },
  "m8-m01-integrer-nouvel-employe": { title: "Intégrer un nouvel employé" },
  "m8-m02-gerer-temps-absences": { title: "Gérer le temps, les absences et l’impact financier" },
  "m8-m03-evaluer-competences-evolution": { title: "Évaluer les compétences et préparer l’évolution" },
  "m8-m01-matrice-approbation-pression": {
    title: "Appliquer la matrice d’approbation sous pression",
  },
  "m8-m02-revue-acces-sod": { title: "Réviser les accès et la ségrégation des tâches" },
  "m8-m03-autoevaluation-probation": {
    title: "Réaliser une autoévaluation de conformité professionnelle",
  },
  "m9-m01-atelier-definition-kpi": { title: "Définir les KPI de gestion" },
  "m9-m02-tableau-bord-comite": { title: "Analyser le tableau de bord de direction" },
  "m9-m03-analyse-concurrentielle-ia": {
    title: "Formuler une recommandation intégrant BI, IA et conseil",
  },
};

const PLACEMENTS: Record<CurriculumVersion, ReadonlyMap<string, MissionPlacement>> = {
  V1: buildPlacements(V1_MODULES),
  V2: buildPlacements(V2_MODULES, V2_TITLE_OVERLAYS),
};

const MODULES: Record<CurriculumVersion, readonly ModulePlacement[]> = {
  V1: V1_MODULES,
  V2: V2_MODULES,
};

const REGULAR_KEYS: Record<CurriculumVersion, readonly string[]> = {
  V1: V1_REGULAR_KEYS,
  V2: V2_REGULAR_KEYS,
};

export function listRegularMissionKeys(version: CurriculumVersion): readonly string[] {
  return REGULAR_KEYS[version];
}

export function listModulePlacements(version: CurriculumVersion): readonly ModulePlacement[] {
  return MODULES[version];
}

export function getMissionPlacement(
  version: CurriculumVersion,
  missionKey: string,
): MissionPlacement | undefined {
  return PLACEMENTS[version].get(missionKey);
}

export function isRegularMissionInCurriculum(
  version: CurriculumVersion,
  missionKey: string,
): boolean {
  return PLACEMENTS[version].has(missionKey);
}

export function moduleCodeForMissionInCurriculum(
  version: CurriculumVersion,
  missionKey: string,
): string | undefined {
  return PLACEMENTS[version].get(missionKey)?.moduleCode;
}

export function nextUnlockKeyAfterMission(
  version: CurriculumVersion,
  missionKey: string,
): string | undefined {
  const keys = REGULAR_KEYS[version];
  const index = keys.indexOf(missionKey);
  if (index < 0 || index >= keys.length - 1) {
    return undefined;
  }
  return keys[index + 1];
}
