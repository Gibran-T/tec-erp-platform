import type { MissionDefinitionDocument } from "../schema.js";

export const M8_HCM_M02: MissionDefinitionDocument = {
  maxAttempts: 2,
  passThresholdPercent: 70,
  missionKey: "m8-m02-gerer-temps-absences",
  missionCode: "M8-M02",
  moduleCode: "M8",
  title: "Gérer le temps, les absences et l’impact financier",
  preview:
    "Traitez une absence critique : capacité, heures supplémentaires, coût incrémental et continuité de service.",
  briefing:
    "Bonjour,\n\nSamira Benali (EMP-SB-14, Equinoxe) est absente 16 h sur une semaine planifiée de 40 h (ABS-REQ-7781, type maladie courte durée). Le DC Montréal doit maintenir le cycle d'inventaire. Politique heures supp. : max 8 h/semaine, taux 1,5 × 42 CAD/h, centre de coûts CC-OPS-MTL.\n\nVotre rôle : valider la demande d'absence, éviter les doubles saisies, quantifier capacité et coût, et recommander une continuité sans ignorer l'impact financier.\n\nJulie Tremblay\nRessources humaines — Equinoxe",
  unlockExplanation: "Complétez d'abord « Intégrer un nouvel employé » (ONB-4412 clôturée).",
  sequence: 2,
  estimatedMinutes: 50,
  difficulty: "advanced",
  competencyCodes: ["C-HCM-03", "C-HCM-04"],
  contextItems: [
    {
      key: "ctx-absence-request",
      title: "Demande d'absence ABS-REQ-7781",
      body: "Employé EMP-SB-14 Samira Benali (société Equinoxe); type : maladie courte durée; 16 h; semaine S36; statut : en attente d'approbation manager; remplace éventuel : stagiaire lecture seule (insuffisant pour saisie cycle).",
      required: true,
    },
    {
      key: "ctx-schedule-timesheet",
      title: "Horaire et feuille de temps",
      body: "Horaire planifié : 40 h. Feuille TS-SB-36 : ne doit pas dupliquer les 16 h absentes en présence. Capacité disponible = planifié − absent. Heures supp. autorisées ≤ 8 h; au-delà = violation politique.",
      required: true,
    },
    {
      key: "ctx-cost-policy",
      title: "Note d'impact financier",
      body: "Taux horaire de base 42 CAD; majoration HS 1,5. Coût incrémental HS = heures_HS × 42 × 1,5. Risque service : inventaire cycle retardé si capacité < 24 h sans relève qualifiée.",
      required: true,
    },
  ],
  interactions: [
    {
      id: "absence-approval",
      type: "SINGLE_CHOICE",
      prompt: "Quelle action est conforme pour ABS-REQ-7781 ?",
      options: [
        {
          key: "approve-then-post",
          label: "Faire approuver par le manager puis enregistrer l'absence sur l'horaire",
        },
        {
          key: "unapproved",
          label: "Poster l'absence sans approbation pour « ne pas bloquer » le planning",
        },
        {
          key: "wrong-type",
          label: "Reclasser en congé parental sans pièce justificative",
        },
      ],
      scoring: { maxPoints: 15, correctKeys: ["approve-then-post"] },
    },
    {
      id: "available-capacity",
      type: "NUMERIC_INPUT",
      prompt: "Calculez la capacité disponible (heures) : planifié 40 − absent 16.",
      scoring: { maxPoints: 20, numericTarget: 24, numericTolerance: 0 },
    },
    {
      id: "overtime-hours",
      type: "NUMERIC_INPUT",
      prompt:
        "Pour ramener la capacité à 32 h de couverture opérationnelle, combien d'heures supplémentaires sont nécessaires (max politique 8) ?",
      scoring: { maxPoints: 15, numericTarget: 8, numericTolerance: 0 },
    },
    {
      id: "incremental-cost",
      type: "NUMERIC_INPUT",
      prompt:
        "Calculez le coût incrémental des 8 h HS (42 CAD × 1,5 × 8). Réponse en CAD.",
      scoring: { maxPoints: 20, numericTarget: 504, numericTolerance: 0 },
    },
    {
      id: "wrong-actions",
      type: "MULTI_CHOICE",
      prompt: "Quelles actions sont incorrectes et doivent être évitées ?",
      options: [
        { key: "duplicate-ts", label: "Saisir 16 h présentes + 16 h absentes le même jour" },
        { key: "ot-12", label: "Planifier 12 h HS malgré le plafond de 8 h" },
        { key: "wrong-co", label: "Imputer l'absence sur un employé ThermoControl" },
        { key: "cost-note", label: "Joindre la note d'impact 504 CAD au centre CC-OPS-MTL" },
      ],
      scoring: {
        maxPoints: 15,
        correctKeys: ["duplicate-ts", "ot-12", "wrong-co"],
        minimumSelections: 3,
      },
    },
    {
      id: "continuity",
      type: "SINGLE_CHOICE",
      prompt: "Quelle recommandation assure continuité et contrôle financier ?",
      options: [
        {
          key: "ot-8-with-cost",
          label: "Approuver 8 h HS + documenter 504 CAD et risque service résiduel",
        },
        {
          key: "ignore-cost",
          label: "Approuver HS sans note de coût — « on verra en paie »",
        },
        {
          key: "cancel-inventory",
          label: "Annuler tout inventaire sans escalade ni analyse de capacité",
        },
      ],
      scoring: { maxPoints: 15, correctKeys: ["ot-8-with-cost"] },
    },
  ],
  completionFeedback:
    "Absence approuvée, capacité 24 h, HS 8 h à 504 CAD documentés, doubles saisies évitées. La continuité opérationnelle reste un arbitrage managérial explicite.",
};
