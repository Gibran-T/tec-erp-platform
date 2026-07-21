import type { MissionDefinitionDocument } from "../schema.js";

export const M1_M03: MissionDefinitionDocument = {
  missionKey: "m1-m03-diagnostiquer-preparation",
  missionCode: "M1-M03",
  moduleCode: "M1",
  title: "Diagnostiquer la préparation",
  preview:
    "Évaluez si NordHabitat est prête à traiter la fragmentation d’information avant d’ouvrir le Module 2.",
  briefing:
    "Bonjour,\n\nDernière mission du Module 1. À partir de vos observations, diagnostiquez la préparation organisationnelle de NordHabitat.\n\nNous ne cherchons pas un correctif transactionnel. Nous voulons savoir si les rôles, les données et les processus sont suffisamment alignés pour qu’un analyste junior puisse transformer un signal en décision partagée.\n\nFormulez un diagnostic et une recommandation prioritaire.\n\nClaire Fontaine\nGestionnaire — NordHabitat",
  unlockExplanation:
    "Complétez d’abord « Connecter les départements » pour accéder à cette mission de clôture du Module 1.",
  sequence: 3,
  maxAttempts: 2,
  passThresholdPercent: 70,
  estimatedMinutes: 35,
  difficulty: "intermediate",
  competencyCodes: ["C-ORG-01", "C-BUS-01"],
  contextItems: [
    {
      key: "ctx-readiness-rubric",
      title: "Grille de préparation",
      body: "Une organisation est préparée lorsque : (1) le signal terrain est visible, (2) la donnée système est vérifiable, (3) un propriétaire de processus est identifiable, (4) les impacts ventes/finance sont discutés avant toute action isolée.",
      required: true,
    },
  ],
  interactions: [
    {
      id: "readiness-level",
      type: "SINGLE_CHOICE",
      prompt: "Quel niveau de préparation attribuez-vous actuellement à NordHabitat ?",
      options: [
        { key: "ready", label: "Prête — rôles et données déjà alignés" },
        { key: "partial", label: "Partiellement prête — signaux visibles, gouvernance encore floue" },
        { key: "unready", label: "Non prête — chaque département agit en silo" },
      ],
      scoring: {
        maxPoints: 20,
        correctKeys: ["partial"],
      },
    },
    {
      id: "blockers",
      type: "MULTI_CHOICE",
      prompt: "Quels freins limitent aujourd’hui la préparation de NordHabitat ?",
      options: [
        { key: "data-fragmentation", label: "Fragmentation des données système/terrain" },
        { key: "unclear-ownership", label: "Propriété de processus floue" },
        { key: "isolated-decisions", label: "Décisions isolées par département" },
        { key: "branding", label: "Identité de marque insuffisante" },
      ],
      scoring: {
        maxPoints: 25,
        correctKeys: ["data-fragmentation", "unclear-ownership", "isolated-decisions"],
        minimumSelections: 2,
      },
    },
    {
      id: "priority-order",
      type: "ORDERING",
      prompt: "Priorisez les actions pour améliorer la préparation (de la plus urgente à la suivante).",
      options: [
        { key: "clarify-owner", label: "Clarifier le propriétaire du processus inventaire" },
        { key: "align-data", label: "Aligner la lecture système et terrain" },
        { key: "share-impact", label: "Partager l’impact ventes/finance" },
        { key: "automate-later", label: "Automatiser plus tard les ajustements" },
      ],
      scoring: {
        maxPoints: 25,
        correctOrder: ["clarify-owner", "align-data", "share-impact", "automate-later"],
      },
    },
    {
      id: "diagnosis",
      type: "DIAGNOSIS_RECOMMENDATION",
      prompt: "Associez chaque symptôme à la recommandation la plus pertinente.",
      options: [
        { key: "sym-gap", label: "Écart 40/36" },
        { key: "sym-silo", label: "Décisions en silo" },
        { key: "rec-verify", label: "Vérifier avant d’ajuster" },
        { key: "rec-coordinate", label: "Coordonner inter-départements" },
      ],
      scoring: {
        maxPoints: 15,
        minimumSelections: 2,
        allowedPairs: [
          { leftKey: "sym-gap", rightKey: "rec-verify" },
          { leftKey: "sym-silo", rightKey: "rec-coordinate" },
        ],
      },
    },
    {
      id: "closing-note",
      type: "TEXT_ANALYSIS",
      prompt: "Synthétisez votre diagnostic de préparation en quelques phrases.",
      scoring: {
        maxPoints: 15,
        requiredConcepts: ["préparation", "processus", "fragmentation"],
      },
    },
  ],
  completionFeedback:
    "Excellent travail. Votre diagnostic de préparation clôture le Module 1. Le Module 2 restera verrouillé jusqu’à l’ouverture institutionnelle suivante ; vous avez toutefois posé les bases d’une lecture ERP orientée processus.\n\nClaire Fontaine",
};
