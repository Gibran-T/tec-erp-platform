import type { MissionBilanContent } from "../../types.js";
import { M1_SPINE } from "./spine.js";

export const M1_BILAN: MissionBilanContent = {
  title: "Bilan d’analyse — Module 1 NordHabitat",
  learnerActionsSummary:
    "Vous avez parcouru APPRENDRE, complété le Connection Lab, puis exécuté le parcours missions M1-M01 → M1-M02 → M1-M03 dans le Centre de mission.",
  recognizedConcepts: [
    "Entreprise intégrée",
    "Fragmentation d’information",
    "Processus transversal",
    "Inventaire système versus physique",
    "Lecture partagée inter-départements",
    "Préparation organisationnelle partielle",
  ],
  keyDecisions: [
    "Traiter 40 versus 36 comme un signal analytique, non comme un ajustement immédiat.",
    "Prioriser la clarification du propriétaire de processus inventaire avant l’automatisation.",
    "Partager l’impact ventes/finance avant toute action isolée.",
  ],
  crossFunctionalImpact: `L’écart de ${M1_SPINE.inventoryVariance} unités sur ${M1_SPINE.materialSku} (DC-MTL) touche Entrepôt (signal), TI (cohérence), Opérations (coordination), Ventes (promesse à ${M1_SPINE.customer}), Approvisionnement (${M1_SPINE.supplier}) et Finance (valorisation).`,
  kpiInterpretation:
    "L’exactitude d’inventaire locale à 90 % est sous la cible pédagogique (≥ 98 %). La tendance est à risque tant que système et terrain ne sont pas réconciliés sous un propriétaire clair.",
  strengths: [
    "Lecture systémique du signal plutôt que correction locale.",
    "Reconnaissance des dépendances multi-départements.",
    "Justification orientée fragmentation et préparation.",
  ],
  gaps: [
    "Propriété de processus inventaire encore insuffisamment clarifiée opérationnellement.",
    "Risque de décisions en silo si ventes ou finance agissent sans validation croisée.",
    "Master data et processus consommateurs à approfondir au Module 2.",
  ],
  recommendedAction:
    "Convoquer une lecture partagée Entrepôt–TI–Opérations, confirmer le propriétaire du processus inventaire, puis communiquer l’impact service/finance avant tout ajustement.",
  improvementGuidance:
    "Pour progresser : relier chaque signal à un processus, un propriétaire et un KPI ; documenter la preuve (mémo NH-INV-SIG-4036) ; éviter les actions isolées.",
  authoredConsequence:
    "Conséquence authored : la fragmentation est reconnue. NordHabitat peut continuer vers la structure organisationnelle et les données de base (M2) avec une conscience explicite du risque de lecture divergente.",
  affectedDepartments: M1_SPINE.departments.map((dept) => dept.label),
  kpiImpact:
    "KPI impacté : exactitude d’inventaire — valeur 90 %, cible ≥ 98 %, statut À risque ; processus inventaire / coordination.",
};
