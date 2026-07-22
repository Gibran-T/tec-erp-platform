import type { MissionDefinitionDocument } from "../schema.js";

export const M8_HCM_M01: MissionDefinitionDocument = {
  maxAttempts: 2,
  passThresholdPercent: 70,
  missionKey: "m8-m01-integrer-nouvel-employe",
  missionCode: "M8-M01",
  moduleCode: "M8",
  title: "Intégrer un nouvel employé",
  preview:
    "Intégrez un analyste opérations avant sa date d'entrée : fiche employé, poste, centre de coûts et demande d'accès minimale.",
  briefing:
    "Bonjour,\n\nEquinoxe recrute Samira Benali comme analyste opérations (poste OPS-AN-14) au DC Montréal, date d'entrée 2026-09-08. RH a ouvert la demande d'intégration ONB-4412. Votre rôle : créer la fiche employé, rattacher poste / département / gestionnaire / centre de coûts, puis déclencher la demande d'accès seulement après validation d'identité.\n\nPrincipes : séparer identité légale et identité professionnelle, appliquer le moindre privilège, ne pas exposer de données personnelles inutiles, et ne jamais activer la paie sans données obligatoires validées.\n\nJulie Tremblay\nRessources humaines — Equinoxe / NordHabitat",
  unlockExplanation: "Complétez d'abord le Module 7 (clôture du dossier client) pour débloquer le HCM.",
  sequence: 1,
  estimatedMinutes: 45,
  difficulty: "intermediate",
  competencyCodes: ["C-HCM-01", "C-HCM-02"],
  contextItems: [
    {
      key: "ctx-onboarding-request",
      title: "Demande d'intégration ONB-4412",
      body: "Candidat : Samira Benali; poste OPS-AN-14 Analyste opérations; département Operations; gestionnaire Julie Tremblay (EMP-JT-01, même société); centre de coûts CC-OPS-MTL; lieu DC Montréal; statut À embaucher; date d'entrée 2026-09-08; accès cible : lecture Stocks + saisie inventaire cycle.",
      required: true,
    },
    {
      key: "ctx-org-assignment",
      title: "Règles d'affectation organisationnelle",
      body: "Le gestionnaire doit appartenir à la même société. Centres de coûts valides Operations : CC-OPS-MTL, CC-OPS-QUE. Invalid : CC-FIN-HQ (Finance), CC-EXT-PART (partenaire externe). Identité légale (NAS/pièce) reste en coffre RH; l'identité professionnelle (matricule, courriel) sert aux accès ERP.",
      required: true,
    },
    {
      key: "ctx-access-checklist",
      title: "Checklist d'intégration et accès",
      body: "Ordre obligatoire : 1) validation identité RH, 2) fiche employé + affectations, 3) demande d'accès ACC-REQ liée à ONB-4412, 4) provisionnement moindre privilège. Interdit : accès Admin Finance, création fournisseur, ou partage du NAS dans le ticket d'accès.",
      required: true,
    },
  ],
  interactions: [
    {
      id: "identity-boundary",
      type: "SINGLE_CHOICE",
      prompt:
        "Quelle donnée doit rester hors du ticket d'accès ACC-REQ (principe du moindre besoin) ?",
      options: [
        { key: "nas", label: "NAS / numéro d'assurance sociale (coffre RH uniquement)" },
        { key: "matricule", label: "Matricule professionnel EMP-SB-14" },
        { key: "courriel", label: "Courriel professionnel samira.benali@equinoxe.local" },
      ],
      scoring: { maxPoints: 15, correctKeys: ["nas"] },
    },
    {
      id: "cost-center",
      type: "SINGLE_CHOICE",
      prompt: "Quel centre de coûts est valide pour OPS-AN-14 au DC Montréal ?",
      options: [
        { key: "cc-ops-mtl", label: "CC-OPS-MTL — Operations Montréal" },
        { key: "cc-fin-hq", label: "CC-FIN-HQ — Finance siège (hors périmètre)" },
        { key: "cc-ext", label: "CC-EXT-PART — partenaire externe" },
      ],
      scoring: { maxPoints: 20, correctKeys: ["cc-ops-mtl"] },
    },
    {
      id: "manager-assignment",
      type: "SINGLE_CHOICE",
      prompt: "Quelle affectation de gestionnaire est conforme ?",
      options: [
        {
          key: "julie-same-co",
          label: "Julie Tremblay (EMP-JT-01) — même société Equinoxe",
        },
        {
          key: "other-co",
          label: "Marc Dubois (EMP-MD-99) — société partenaire ThermoControl",
        },
        {
          key: "no-manager",
          label: "Aucun gestionnaire — à compléter après le premier jour",
        },
      ],
      scoring: { maxPoints: 20, correctKeys: ["julie-same-co"] },
    },
    {
      id: "access-timing",
      type: "SINGLE_CHOICE",
      prompt: "Quand déclencher la demande d'accès ACC-REQ ?",
      options: [
        {
          key: "after-identity",
          label: "Après validation d'identité RH et fiche + affectations complètes",
        },
        {
          key: "before-identity",
          label: "Dès la signature de l'offre, avant validation d'identité",
        },
        {
          key: "admin-finance",
          label: "Immédiatement avec profil Admin Finance pour « aller plus vite »",
        },
      ],
      scoring: { maxPoints: 20, correctKeys: ["after-identity"] },
    },
    {
      id: "mandatory-assignments",
      type: "MULTI_CHOICE",
      prompt: "Quelles affectations sont obligatoires avant de clôturer ONB-4412 ?",
      options: [
        { key: "position", label: "Poste OPS-AN-14" },
        { key: "department", label: "Département Operations" },
        { key: "cost-center", label: "Centre de coûts CC-OPS-MTL" },
        { key: "hobby", label: "Centres d'intérêt personnels (non requis ERP)" },
      ],
      scoring: {
        maxPoints: 15,
        correctKeys: ["position", "department", "cost-center"],
        minimumSelections: 3,
      },
    },
    {
      id: "access-scope",
      type: "SINGLE_CHOICE",
      prompt: "Quel périmètre d'accès respecte le moindre privilège pour ce poste ?",
      options: [
        {
          key: "inv-cycle",
          label: "Lecture Stocks + saisie inventaire cycle (ACC-REQ liée à ONB-4412)",
        },
        {
          key: "excessive",
          label: "Admin P2P + création fournisseurs + approbation PO",
        },
        {
          key: "payroll-edit",
          label: "Modification directe des taux de paie",
        },
      ],
      scoring: { maxPoints: 10, correctKeys: ["inv-cycle"] },
    },
  ],
  completionFeedback:
    "Intégration conforme : identité protégée, affectations valides, accès déclenché après validation et limité au besoin opérationnel. La paie reste hors de votre périmètre d'accès.",
};
