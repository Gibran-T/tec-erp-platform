/**
 * RC01 Slice E — Organizational ERP read-only workplace copy.
 * Evergreen consultation only: no attempt, score, restart, or completion vocabulary.
 */

export const ORGANIZATION_PAGE_TITLE = "ERP — Organisation NordHabitat";

export const ORGANIZATION_PAGE_INTRO =
  "Poste de travail de consultation organisationnelle. Explorez l’entreprise, ses départements et ses processus avant de poser des gestes transactionnels.";

export const ORGANIZATION_LOADING_STATUS = "Chargement de l’organisation NordHabitat…";

export const ORGANIZATION_ERROR_FALLBACK =
  "Impossible de charger l’organisation NordHabitat. Veuillez réessayer.";

export const ORGANIZATION_ERROR_NETWORK =
  "Impossible de charger les informations organisationnelles. Veuillez réessayer.";

export const ORGANIZATION_ERROR_AUTH = "Authentification requise.";

export const ORGANIZATION_ERROR_MALFORMED =
  "La réponse de l’organisation est invalide. Veuillez réessayer.";

/**
 * The only French messages the organization error state may ever render.
 * Any candidate outside this set — arbitrary server text, raw fetch/browser
 * exception messages, technical/internal details — is replaced by
 * ORGANIZATION_ERROR_FALLBACK before it can reach the UI. This is the single
 * source of truth for safe organization error copy, consumed by both the
 * API client and the page-local fetch hook.
 */
const ORGANIZATION_SAFE_ERROR_MESSAGES: ReadonlySet<string> = new Set([
  ORGANIZATION_ERROR_FALLBACK,
  ORGANIZATION_ERROR_NETWORK,
  ORGANIZATION_ERROR_AUTH,
  ORGANIZATION_ERROR_MALFORMED,
]);

export function toSafeOrganizationErrorMessage(candidate: unknown): string {
  if (typeof candidate === "string" && ORGANIZATION_SAFE_ERROR_MESSAGES.has(candidate)) {
    return candidate;
  }

  return ORGANIZATION_ERROR_FALLBACK;
}

export const ORGANIZATION_RETRY_LABEL = "Réessayer";

export const ORGANIZATION_EMPTY_TITLE = "Organisation";

export const ORGANIZATION_EMPTY_DESCRIPTION =
  "Le contenu organisationnel n’a pas pu être assemblé pour le moment. Revenez plus tard ou contactez l’équipe des technologies de l’information si la situation persiste.";

export const RETURN_TO_HOME_LABEL = "Retourner à l’accueil";

export const COMPANY_PROFILE_HEADING = "Profil de l’entreprise";

export const COMPANY_PROFILE_FIELD_LABELS = {
  industry: "Secteur d’activité",
  operatingContext: "Contexte d’exploitation",
  organizationalSummary: "Synthèse organisationnelle",
  erpLearningContext: "Point de départ dans l’ERP",
} as const;

export const DEPARTMENT_DIRECTORY_HEADING = "Répertoire des départements";

export const DEPARTMENT_DIRECTORY_INTRO =
  "Sélectionnez un département pour consulter ses responsabilités, ses besoins d’information et ses signaux de fragmentation.";

export const RESPONSIBILITIES_LABEL = "Responsabilités";
export const PROCESS_CONTRIBUTIONS_LABEL = "Contribution aux processus";
export const INFORMATION_NEEDS_LABEL = "Besoins d’information";
export const DEPARTMENT_FRAGMENTATION_SIGNALS_LABEL = "Signaux de fragmentation observés";

export const RELATIONSHIPS_HEADING = "Relations interdépartementales";

export const RELATIONSHIPS_INTRO =
  "Ces relations montrent qui dépend de qui pour une information fiable, et où la coordination peut se rompre.";

export const EXCHANGED_INFORMATION_LABEL = "Information échangée";
export const COORDINATION_RISK_LABEL = "Risque de coordination";

export const PROCESS_AWARENESS_HEADING = "Sensibilisation aux processus";

export const PROCESS_AWARENESS_INTRO =
  "Chaque processus relie une information source à un contrôle attendu. Repérez la question analytique associée.";

export const PARTICIPATING_DEPARTMENTS_LABEL = "Départements concernés";
export const SOURCE_INFORMATION_LABEL = "Information source";
export const EXPECTED_CONTROL_LABEL = "Contrôle attendu";
export const ANALYTICAL_QUESTION_LABEL = "Question analytique";

export const FRAGMENTATION_HEADING = "Signaux de fragmentation";

export const FRAGMENTATION_INTRO =
  "Ces signaux documentent des preuves de fragmentation organisationnelle, à des fins de diagnostic — sans valeur d’indicateur en direct.";

export const AFFECTED_DEPARTMENTS_LABEL = "Départements touchés";
export const BUSINESS_IMPACT_LABEL = "Impact d’affaires";
export const EVIDENCE_LABEL = "Preuve observée";
export const ANALYTICAL_PROMPT_LABEL = "Piste d’analyse";

export const NARRATIVE_CONTEXT_HEADING = "Contexte analytique — Signal de Tom";

export const EXPECTED_VALUE_LABEL = "Valeur attendue (système)";
export const ACTUAL_VALUE_LABEL = "Valeur observée (terrain)";
export const INTERPRETATION_CONSTRAINT_LABEL = "Cadre d’interprétation";

export const MISSION_LINK_HEADING = "Pour aller plus loin";

export const MISSION_LINK_DESCRIPTION =
  "Vous pouvez consulter cette organisation à tout moment pendant que vous travaillez sur vos responsabilités confiées dans le Centre de mission.";

export const MISSION_LINK_LABEL = "Consulter le Centre de mission";
