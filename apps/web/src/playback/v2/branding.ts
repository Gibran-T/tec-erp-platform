/**
 * Playback-only branding configuration.
 * Prototype demonstration — not multi-tenant production architecture.
 */

/** Owner-selected light-blue neutral application base (Revision 2). */
export const OWNER_CANVAS_TOKEN = "#eef4f8";

export type BrandingMode = "college" | "independent";

export interface PlaybackBranding {
  productName: string;
  institutionName: string;
  institutionEndorsementFr: string;
  institutionEndorsementEn: string;
  institutionLogo?: string;
  showInstitution: boolean;
  certificationIssuer: string;
  supportContext: string;
}

export const BRANDING_PRESETS: Record<BrandingMode, PlaybackBranding> = {
  college: {
    productName: "TEC.ERP",
    institutionName: "Collège de la Concorde",
    institutionEndorsementFr: "Une expérience de formation du Collège de la Concorde",
    institutionEndorsementEn: "A learning experience from Collège de la Concorde",
    showInstitution: true,
    certificationIssuer: "Collège de la Concorde",
    supportContext: "formation-institutionnelle",
  },
  independent: {
    productName: "TEC.ERP",
    institutionName: "",
    institutionEndorsementFr: "",
    institutionEndorsementEn: "",
    showInstitution: false,
    certificationIssuer: "TEC.ERP",
    supportContext: "produit-independant",
  },
};

/** No authorized College logo asset found in repository — text endorsement only (P2). */
export const INSTITUTION_LOGO_STATUS = "missing-authorized-asset" as const;
