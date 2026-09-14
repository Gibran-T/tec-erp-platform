/** Product gate: TEC.ERP is the Analyste ERP SAP sofa only. */

export const SAP_ANALYSTE_SOFA_APP_IDS = [
  "accueil",
  "parcours-sap-iee2e",
  "profil",
  "administration",
] as const;

export const SAP_ANALYSTE_PROGRAM_TITLE = "Analyste ERP SAP";
export const SAP_ANALYSTE_PROGRAM_SUBTITLE = "Parcours SAP Suite End to End";

export function isSapAnalysteSofaApp(appId: string): boolean {
  return (SAP_ANALYSTE_SOFA_APP_IDS as readonly string[]).includes(appId);
}

export function buildSapAnalysteWelcome(displayName: string): string {
  return [
    `Bienvenue, ${displayName}.`,
    "Vous êtes dans le programme institutionnel Analyste ERP SAP.",
    "TEC.ERP organise votre parcours. Vous apprenez sur SAP Learning.",
    "Ouvrez votre parcours, préparez la Semaine Zéro, puis travaillez les unités officielles.",
  ].join(" ");
}
