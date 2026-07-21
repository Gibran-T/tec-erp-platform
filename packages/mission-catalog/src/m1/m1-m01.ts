import type { MissionDefinitionDocument } from "../schema.js";

export const M1_M01: MissionDefinitionDocument = {
  missionKey: "m1-m01-decouvrir-entreprise",
  missionCode: "M1-M01",
  moduleCode: "M1",
  title: "Découvrir l’entreprise",
  preview:
    "Claire Fontaine vous confie une première découverte : comprendre comment NordHabitat organise l’information.",
  briefing:
    "Bonjour,\n\nVotre premier jour est derrière vous. Je vous confie maintenant une responsabilité d’observation : Découvrir l’entreprise.\n\nChez NordHabitat, l’information circule entre plusieurs départements. Un signal récent — l’écart d’inventaire signalé par Tom — illustre une fragmentation : le système affiche 40 unités, l’observation terrain en compte 36.\n\nVotre rôle est celui d’un Observateur-Analyste. Vous n’ajustez pas le stock et vous n’enregistrez aucune transaction. Identifiez quels départements sont touchés et quels problèmes d’affaires apparaissent, puis justifiez brièvement votre lecture.\n\nClaire Fontaine\nGestionnaire — NordHabitat",
  unlockExplanation:
    "Terminez d’abord votre première journée : lisez le message de Claire Fontaine et complétez votre première responsabilité opérationnelle. Le Centre de mission s’ouvrira ensuite.",
  sequence: 1,
  maxAttempts: 2,
  passThresholdPercent: 70,
  estimatedMinutes: 25,
  difficulty: "intro",
  competencyCodes: ["C-ORG-01", "C-BUS-01"],
  contextItems: [
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
  ],
  interactions: [
    {
      id: "ack-contexts",
      type: "PROCESS_MAP_ACKNOWLEDGEMENT",
      prompt: "Reconnaissez les contextes requis avant de soumettre votre découverte.",
      scoring: {
        maxPoints: 20,
        correctKeys: ["ctx-nordhabitat-overview", "ctx-tom-40-36"],
        minimumSelections: 2,
      },
    },
    {
      id: "dept-problem-mapping",
      type: "DIAGNOSIS_RECOMMENDATION",
      prompt:
        "Associez au moins deux relations département/problème pertinentes face à l’écart 40 versus 36.",
      options: [
        { key: "dept-direction", label: "Direction", description: "Gouverne les priorités et l’alignement entre unités." },
        { key: "dept-operations", label: "Opérations", description: "Coordonne l’exécution quotidienne des processus." },
        { key: "dept-finance", label: "Finance", description: "Suit la valorisation et la fiabilité des chiffres." },
        { key: "dept-ventes", label: "Ventes", description: "S’appuie sur la disponibilité réelle pour servir les clients." },
        {
          key: "dept-approvisionnement",
          label: "Approvisionnement",
          description: "Planifie les réapprovisionnements selon la demande et les stocks.",
        },
        { key: "dept-entrepot", label: "Entrepôt", description: "Gère les stocks physiques et les observations terrain." },
        { key: "dept-ti", label: "TI", description: "Assure la cohérence des données dans les systèmes." },
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
      ],
      scoring: {
        maxPoints: 50,
        minimumSelections: 2,
        allowedPairs: [
          { leftKey: "dept-entrepot", rightKey: "prob-inventaire-divergent" },
          { leftKey: "dept-entrepot", rightKey: "prob-coherence-donnees" },
          { leftKey: "dept-ti", rightKey: "prob-inventaire-divergent" },
          { leftKey: "dept-ti", rightKey: "prob-coherence-donnees" },
          { leftKey: "dept-operations", rightKey: "prob-inventaire-divergent" },
          { leftKey: "dept-operations", rightKey: "prob-coordination-interdep" },
          { leftKey: "dept-finance", rightKey: "prob-inventaire-divergent" },
          { leftKey: "dept-finance", rightKey: "prob-visibilite-financiere" },
          { leftKey: "dept-approvisionnement", rightKey: "prob-delais-approvisionnement" },
          { leftKey: "dept-approvisionnement", rightKey: "prob-inventaire-divergent" },
          { leftKey: "dept-ventes", rightKey: "prob-plaintes-clients" },
          { leftKey: "dept-ventes", rightKey: "prob-inventaire-divergent" },
          { leftKey: "dept-direction", rightKey: "prob-coordination-interdep" },
          { leftKey: "dept-direction", rightKey: "prob-inventaire-divergent" },
        ],
      },
    },
    {
      id: "justification",
      type: "TEXT_ANALYSIS",
      prompt: "Justifiez brièvement votre lecture de la fragmentation d’information (40–1000 caractères).",
      scoring: {
        maxPoints: 30,
        requiredConcepts: ["fragmentation", "inventaire", "départements"],
      },
    },
  ],
  completionFeedback:
    "Merci. Votre observation est enregistrée. L’écart 40 versus 36 illustre bien une fragmentation d’information entre départements — sans exiger un ajustement de stock de votre part. Nous pourrons plus tard approfondir le contexte organisationnel. Continuer à observer avec rigueur.\n\nClaire Fontaine",
};
