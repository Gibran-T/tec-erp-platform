import type { EmployeeRole } from "@tec-platform/contracts";

/** NordHabitat universe constants — static copy only, never employee identity. */
export const NORDHABITAT_TAGLINE = "Centre d'excellence ERP";

export const MANAGER_NAME = "Claire Fontaine";

export const IT_CONTACT_NAME = "Alex Nguyen";

export const IT_CONTACT_REFERENCE = "Équipe des technologies de l'information";

export const ROLE_LABELS: Record<EmployeeRole, string> = {
  JR_BUSINESS_ANALYST: "Analyste d'affaires junior",
};

export const ACCESS_PREPARING_LABEL = "Accès en préparation";

export const CONTEXT_PANEL_TITLE = "Votre première journée";

export const CONTEXT_PANEL_CHECKLIST = [
  "Badge employé activé",
  "Poste de travail numérique provisionné",
  "En attente : premier message de votre gestionnaire",
] as const;

export const DASHBOARD_PREVIEW_TITLE = "Aperçu des indicateurs";

export const DASHBOARD_PREVIEW_COPY =
  "Aperçu des indicateurs de l'entreprise. Vos accès analytiques seront activés progressivement.";

export function buildWelcomeMessage(displayName: string): string {
  return [
    `Bienvenue chez NordHabitat, ${displayName}.`,
    "Aujourd'hui, c'est votre première journée au sein du Centre d'excellence ERP. Votre poste de travail numérique a été préparé par l'équipe des technologies de l'information : votre badge est activé et vos accès de base sont en place.",
    "Prenez le temps d'explorer votre environnement. Certaines applications afficheront « Accès en préparation » — c'est normal pour une première journée : vos accès seront activés progressivement au fil de votre intégration.",
    `Votre gestionnaire, ${MANAGER_NAME}, vous contactera sous peu avec vos premières responsabilités.`,
  ].join(" ");
}

export const EMPTY_STATE_COPY: Record<string, { title: string; description: string }> = {
  "boite-reception": {
    title: "Boîte de réception",
    description:
      "Votre boîte de réception est vide pour le moment. Aucun message professionnel n'a encore été reçu — c'est attendu lors d'une première journée.",
  },
  taches: {
    title: "Tâches",
    description:
      "Aucune tâche ne vous est assignée pour l'instant. Votre gestionnaire vous transmettra vos premières responsabilités sous peu.",
  },
  documents: {
    title: "Documents",
    description:
      "Votre espace documentaire sera alimenté au fil de votre intégration. Les dossiers partagés de l'équipe seront accessibles ici.",
  },
  "centre-mission": {
    title: "Centre de mission",
    description:
      "Votre mandat opérationnel sera activé après votre intégration initiale. En attendant, explorez votre environnement de travail.",
  },
  erp: {
    title: "ERP",
    description:
      "L'accès aux processus ERP sera ouvert progressivement selon votre rôle et votre intégration au sein de NordHabitat.",
  },
  "tableaux-bord": {
    title: "Tableaux de bord",
    description:
      "Vos accès analytiques seront activés progressivement. Les indicateurs opérationnels apparaîtront ici lorsque vos droits seront en place.",
  },
  calendrier: {
    title: "Calendrier",
    description:
      "Votre agenda professionnel sera synchronisé après la configuration de vos accès. Les invitations de l'équipe apparaîtront ici.",
  },
  "centre-services-ti": {
    title: "Centre de services TI",
    description: `Pour toute demande technique, l'équipe TI (${IT_CONTACT_NAME}) reste disponible. Vos accès au portail de services seront activés prochainement.`,
  },
};

export const PREPARING_ACCESS_DESCRIPTION =
  "Cette application fait partie de l'écosystème NordHabitat. Votre accès sera activé progressivement au fil de votre intégration — c'est normal pour une première journée.";
