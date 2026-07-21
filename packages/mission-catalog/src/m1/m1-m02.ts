import type { MissionDefinitionDocument } from "../schema.js";

export const M1_M02: MissionDefinitionDocument = {
  missionKey: "m1-m02-connecter-departements",
  missionCode: "M1-M02",
  moduleCode: "M1",
  title: "Connecter les départements",
  preview:
    "Reliez les flux d’information entre départements pour expliquer comment un écart local devient un risque d’entreprise.",
  briefing:
    "Bonjour,\n\nVotre découverte initiale est notée. Nous devons maintenant connecter les départements.\n\nUn écart d’inventaire n’est jamais isolé : il traverse l’entrepôt, les TI, les opérations, les ventes et la finance. Votre mission est de reconstruire la chaîne de dépendance et d’identifier où la lecture partagée se brise.\n\nOrdre attendu : observer le signal terrain, vérifier la donnée système, alerter les opérations, informer les ventes, puis documenter l’impact financier.\n\nClaire Fontaine\nGestionnaire — NordHabitat",
  unlockExplanation:
    "Complétez d’abord la mission « Découvrir l’entreprise » pour débloquer cette étape.",
  sequence: 2,
  maxAttempts: 2,
  passThresholdPercent: 70,
  estimatedMinutes: 30,
  difficulty: "intro",
  competencyCodes: ["C-ORG-01", "C-BUS-01"],
  contextItems: [
    {
      key: "ctx-flow-overview",
      title: "Chaîne d’information NordHabitat",
      body: "Le signal terrain (entrepôt) doit rejoindre le système (TI), puis les opérations, les ventes et la finance. Sans ce parcours, chaque département décide sur une réalité différente.",
      required: true,
    },
  ],
  interactions: [
    {
      id: "primary-owner",
      type: "SINGLE_CHOICE",
      prompt: "Quel département détient en premier le signal physique de l’écart d’inventaire ?",
      options: [
        { key: "dept-entrepot", label: "Entrepôt" },
        { key: "dept-ventes", label: "Ventes" },
        { key: "dept-finance", label: "Finance" },
        { key: "dept-direction", label: "Direction" },
      ],
      scoring: {
        maxPoints: 20,
        correctKeys: ["dept-entrepot"],
      },
    },
    {
      id: "impacted-units",
      type: "MULTI_CHOICE",
      prompt: "Quels départements sont directement touchés lorsque le stock système diverge du terrain ?",
      options: [
        { key: "dept-ti", label: "TI" },
        { key: "dept-operations", label: "Opérations" },
        { key: "dept-ventes", label: "Ventes" },
        { key: "dept-finance", label: "Finance" },
        { key: "dept-rh", label: "Ressources humaines" },
      ],
      scoring: {
        maxPoints: 25,
        correctKeys: ["dept-ti", "dept-operations", "dept-ventes", "dept-finance"],
        minimumSelections: 3,
      },
    },
    {
      id: "process-order",
      type: "ORDERING",
      prompt: "Ordonnez les étapes d’une réponse organisationnelle cohérente à l’écart.",
      options: [
        { key: "step-observe", label: "Observer le signal terrain" },
        { key: "step-verify", label: "Vérifier la donnée système" },
        { key: "step-alert-ops", label: "Alerter les opérations" },
        { key: "step-inform-sales", label: "Informer les ventes" },
        { key: "step-finance", label: "Documenter l’impact financier" },
      ],
      scoring: {
        maxPoints: 30,
        correctOrder: [
          "step-observe",
          "step-verify",
          "step-alert-ops",
          "step-inform-sales",
          "step-finance",
        ],
      },
    },
    {
      id: "gap-size",
      type: "NUMERIC_INPUT",
      prompt: "Quel est l’écart d’unités signalé par Tom (système 40 − observation 36) ?",
      scoring: {
        maxPoints: 10,
        numericTarget: 4,
        numericTolerance: 0,
      },
    },
    {
      id: "connection-rationale",
      type: "TEXT_ANALYSIS",
      prompt: "Expliquez pourquoi connecter les départements réduit le risque de décisions contradictoires.",
      scoring: {
        maxPoints: 15,
        requiredConcepts: ["départements", "information", "décision"],
      },
    },
  ],
  completionFeedback:
    "Bien. Vous avez relié le signal local à une chaîne inter-départements. La suite consistera à diagnostiquer la préparation de NordHabitat à traiter ce type de fragmentation.\n\nClaire Fontaine",
};
