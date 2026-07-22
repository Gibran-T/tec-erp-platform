import type { MissionDefinitionDocument } from "../schema.js";

export const M8_HCM_M03: MissionDefinitionDocument = {
  maxAttempts: 2,
  passThresholdPercent: 70,
  missionKey: "m8-m03-evaluer-competences-evolution",
  missionCode: "M8-M03",
  moduleCode: "M8",
  title: "Évaluer les compétences et préparer l’évolution",
  preview:
    "Menez la revue de compétences post-probation avec preuves, écarts, plan de développement et garde-fous IA.",
  briefing:
    "Bonjour,\n\nSamira Benali a terminé sa probation (90 jours). La matrice de compétences OPS-AN-14 exige niveau 3 en analyse de stocks et niveau 2 en coordination inter-entrepôts. Les preuves terrain (INV-CYC-12, transfert TF-441) indiquent observé 2 (stocks) et 2 (coordination). Un copilote IA propose automatiquement « promotion immédiate niveau 4 » sans preuve.\n\nVotre rôle : noter avec preuves, calculer les écarts, proposer une formation liée, et refuser toute décision d'emploi fondée uniquement sur l'IA ou sur des données protégées.\n\nJulie Tremblay\nRessources humaines — Equinoxe",
  unlockExplanation:
    "Complétez d'abord « Gérer le temps, les absences et l'impact financier » (ABS-REQ-7781 traitée).",
  sequence: 3,
  estimatedMinutes: 50,
  difficulty: "advanced",
  competencyCodes: ["C-HCM-05", "C-HCM-06"],
  contextItems: [
    {
      key: "ctx-competency-matrix",
      title: "Matrice de compétences OPS-AN-14",
      body: "Attendus : Analyse stocks = 3; Coordination inter-DC = 2; Conformité accès = 2. Échelle 1–4. Toute note ≥ attendu nécessite preuve datée; note < attendu génère un écart et un plan.",
      required: true,
    },
    {
      key: "ctx-evidence",
      title: "Dossier de preuves PERF-SB-90",
      body: "INV-CYC-12 : inventaire cycle complété avec 1 écart documenté (analyse stocks observé 2). TF-441 : transfert assisté sous supervision (coordination observé 2). Aucune preuve pour un niveau 4.",
      required: true,
    },
    {
      key: "ctx-ai-guardrail",
      title: "Garde-fou IA et équité",
      body: "L'IA peut suggérer des pistes de formation mais ne décide pas. Interdit : utiliser origine, santé, âge ou données familiales. Exiger explicabilité et jugement humain documenté (manager + RH).",
      required: true,
    },
  ],
  interactions: [
    {
      id: "rating-evidence",
      type: "SINGLE_CHOICE",
      prompt: "Quelle notation est supportée par PERF-SB-90 pour l'analyse de stocks ?",
      options: [
        { key: "obs-2", label: "Observé 2 — preuves INV-CYC-12 seulement" },
        { key: "obs-4", label: "Observé 4 — sur recommandation IA sans preuve" },
        { key: "obs-1", label: "Observé 1 — sans consulter le dossier de preuves" },
      ],
      scoring: { maxPoints: 20, correctKeys: ["obs-2"] },
    },
    {
      id: "gap-analysis",
      type: "SINGLE_CHOICE",
      prompt: "Quel écart prioritaire doit figurer dans l'analyse ?",
      options: [
        {
          key: "gap-stocks",
          label: "Écart −1 sur analyse stocks (attendu 3, observé 2)",
        },
        {
          key: "gap-none",
          label: "Aucun écart — l'IA a recommandé la promotion",
        },
        {
          key: "gap-contradict",
          label: "Noter stocks à 4 et coordination à 1 sans justification",
        },
      ],
      scoring: { maxPoints: 20, correctKeys: ["gap-stocks"] },
    },
    {
      id: "ai-role",
      type: "SINGLE_CHOICE",
      prompt: "Comment traiter la recommandation IA « promotion niveau 4 » ?",
      options: [
        {
          key: "advisory",
          label: "La traiter comme avis non autoritatif; décision humaine avec preuves",
        },
        {
          key: "final",
          label: "L'accepter comme décision finale d'emploi",
        },
        {
          key: "use-health",
          label: "Y ajouter des données de santé pour « affiner » le score",
        },
      ],
      scoring: { maxPoints: 20, correctKeys: ["advisory"] },
    },
    {
      id: "development-plan",
      type: "MULTI_CHOICE",
      prompt: "Quels éléments doivent figurer dans le plan de développement ?",
      options: [
        { key: "training-stock", label: "Formation analyse stocks avancée liée à l'écart −1" },
        { key: "evidence-log", label: "Journal de preuves pour la prochaine revue" },
        { key: "unrelated", label: "Formation marketing digital sans lien avec l'écart" },
        { key: "manager-decision", label: "Décision manager documentée (humain responsable)" },
      ],
      scoring: {
        maxPoints: 20,
        correctKeys: ["training-stock", "evidence-log", "manager-decision"],
        minimumSelections: 3,
      },
    },
    {
      id: "fairness",
      type: "DIAGNOSIS_RECOMMENDATION",
      prompt:
        "Formulez la recommandation managériale (preuves, écart, rôle de l'IA, formation liée).",
      scoring: {
        maxPoints: 20,
        requiredConcepts: [
          "preuve",
          "écart",
          "formation",
          "humain",
          "ia",
        ],
      },
    },
  ],
  completionFeedback:
    "Revue équitable : notations prouvées, écart stocks traité, IA non décisoire, plan de développement lié aux compétences. La progression de rôle reste une décision humaine.",
};
