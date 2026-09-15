/** Product gate: TEC.ERP is the Analyste ERP SAP sofa only. */

export const SAP_ANALYSTE_SOFA_APP_IDS = [
  "accueil",
  "parcours-sap-iee2e",
  "profil",
  "administration",
] as const;

export const SAP_ANALYSTE_PROGRAM_TITLE = "Analyste ERP SAP";
export const SAP_ANALYSTE_PROGRAM_SUBTITLE = "Parcours SAP Suite End to End";
export const SAP_ANALYSTE_INSTITUTION = "Collège de la Concorde";

const RETIRED_COMPANY_MARKERS = /nordhabitat|entreprise simulée/i;

export function isSapAnalysteSofaApp(appId: string): boolean {
  return (SAP_ANALYSTE_SOFA_APP_IDS as readonly string[]).includes(appId);
}

export function displayInstitutionalAffiliation(companyName: string | null | undefined): string {
  if (!companyName || RETIRED_COMPANY_MARKERS.test(companyName)) {
    return SAP_ANALYSTE_INSTITUTION;
  }
  return companyName;
}

export function buildSapAnalysteWelcome(displayName: string): string {
  return [
    `Bienvenue, ${displayName}.`,
    "Vous êtes dans le programme institutionnel Analyste ERP SAP.",
    "Vous apprenez sur SAP Learning. Le TEC.ERP organise et accompagne votre parcours.",
    "Ouvrez le parcours, préparez la Semaine Zéro, puis avancez sur S1 à S10.",
  ].join(" ");
}
