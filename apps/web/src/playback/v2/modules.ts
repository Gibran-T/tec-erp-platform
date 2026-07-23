/**
 * Wave 2A Playback Zero — representative curriculum and journey data.
 * Source of titles: TEC_ERP_V2_CURRICULUM_MASTER_MAP.md (V2).
 * NOT production curriculum state. No M11. Capstone separate.
 */

export type ProfessionalStage =
  | "observer"
  | "junior"
  | "process"
  | "consultant"
  | "advisor";

export interface PlaybackModule {
  code: "M1" | "M2" | "M3" | "M4" | "M5" | "M6" | "M7" | "M8" | "M9" | "M10";
  titleFr: string;
  titleEn: string;
  businessAreaFr: string;
  businessAreaEn: string;
  processFr: string;
  processEn: string;
  mandateFr: string;
  mandateEn: string;
  role: ProfessionalStage;
  stakeholderComplexity: "low" | "medium" | "high";
  evidenceFr: string;
  evidenceEn: string;
  impactFr: string;
  impactEn: string;
  enterpriseChapterFr: string;
  enterpriseChapterEn: string;
}

export const PLAYBACK_MODULES: readonly PlaybackModule[] = [
  {
    code: "M1",
    titleFr: "Entreprise intégrée et processus",
    titleEn: "Integrated enterprise and processes",
    businessAreaFr: "Vue d’entreprise",
    businessAreaEn: "Enterprise view",
    processFr: "Cartographie des processus",
    processEn: "Process mapping",
    mandateFr: "Comprendre Equinoxe et ses chaînes de valeur",
    mandateEn: "Understand Equinoxe and its value chains",
    role: "observer",
    stakeholderComplexity: "low",
    evidenceFr: "Carte processus + notes de cadrage",
    evidenceEn: "Process map + framing notes",
    impactFr: "Orientation · langage professionnel",
    impactEn: "Orientation · professional language",
    enterpriseChapterFr: "Découverte de l’entreprise",
    enterpriseChapterEn: "Company discovery",
  },
  {
    code: "M2",
    titleFr: "Données de base et intégrité",
    titleEn: "Master data and integrity",
    businessAreaFr: "Fondations de données",
    businessAreaEn: "Data foundation",
    processFr: "Qualité des données maîtres",
    processEn: "Master data quality",
    mandateFr: "Diagnostiquer l’intégrité des données critiques",
    mandateEn: "Diagnose critical master-data integrity",
    role: "junior",
    stakeholderComplexity: "low",
    evidenceFr: "Anomalies documentées + corrections proposées",
    evidenceEn: "Documented anomalies + proposed fixes",
    impactFr: "Qualité · risques aval",
    impactEn: "Quality · downstream risk",
    enterpriseChapterFr: "Fondation des données",
    enterpriseChapterEn: "Data foundation",
  },
  {
    code: "M3",
    titleFr: "Approvisionnement et Procure-to-Pay",
    titleEn: "Procurement and Procure-to-Pay",
    businessAreaFr: "Achats",
    businessAreaEn: "Procurement",
    processFr: "Procure-to-Pay",
    processEn: "Procure-to-Pay",
    mandateFr: "Sécuriser un achat sous contrôle face à la pression",
    mandateEn: "Secure a controlled purchase under pressure",
    role: "process",
    stakeholderComplexity: "medium",
    evidenceFr: "PO · réception · justification d’écart",
    evidenceEn: "PO · receipt · variance justification",
    impactFr: "OTIF · stock · cash",
    impactEn: "OTIF · inventory · cash",
    enterpriseChapterFr: "Approvisionnement",
    enterpriseChapterEn: "Procurement",
  },
  {
    code: "M4",
    titleFr: "Ventes et Order-to-Cash",
    titleEn: "Sales and Order-to-Cash",
    businessAreaFr: "Ventes",
    businessAreaEn: "Sales",
    processFr: "Order-to-Cash",
    processEn: "Order-to-Cash",
    mandateFr: "Tenir la promesse client sous contrainte de stock",
    mandateEn: "Keep the customer promise under stock constraint",
    role: "process",
    stakeholderComplexity: "medium",
    evidenceFr: "Commande · livraison · service",
    evidenceEn: "Order · delivery · service",
    impactFr: "Service · revenu",
    impactEn: "Service · revenue",
    enterpriseChapterFr: "Ventes",
    enterpriseChapterEn: "Sales",
  },
  {
    code: "M5",
    titleFr: "Stocks et Supply Chain",
    titleEn: "Inventory and Supply Chain",
    businessAreaFr: "Logistique",
    businessAreaEn: "Logistics",
    processFr: "Allocation et réapprovisionnement",
    processEn: "Allocation and replenishment",
    mandateFr: "Arbitrer stock, service et capacité",
    mandateEn: "Trade off inventory, service and capacity",
    role: "process",
    stakeholderComplexity: "medium",
    evidenceFr: "Mouvements · exception · capacité",
    evidenceEn: "Movements · exception · capacity",
    impactFr: "Inventaire · délai · productivité",
    impactEn: "Inventory · lead time · productivity",
    enterpriseChapterFr: "Inventaire",
    enterpriseChapterEn: "Inventory",
  },
  {
    code: "M6",
    titleFr: "Finance et Record-to-Report",
    titleEn: "Finance and Record-to-Report",
    businessAreaFr: "Finance",
    businessAreaEn: "Finance",
    processFr: "Record-to-Report / cash",
    processEn: "Record-to-Report / cash",
    mandateFr: "Lier transactions, contrôles et trésorerie",
    mandateEn: "Link transactions, controls and cash",
    role: "consultant",
    stakeholderComplexity: "high",
    evidenceFr: "Écritures · contrôles · écarts",
    evidenceEn: "Postings · controls · variances",
    impactFr: "Marge · cash · conformité",
    impactEn: "Margin · cash · compliance",
    enterpriseChapterFr: "Finance",
    enterpriseChapterEn: "Finance",
  },
  {
    code: "M7",
    titleFr: "Client, service et relation",
    titleEn: "Customer, service and relationship",
    businessAreaFr: "Client",
    businessAreaEn: "Customer",
    processFr: "Issue-to-Resolution",
    processEn: "Issue-to-Resolution",
    mandateFr: "Résoudre un incident sans casser le processus",
    mandateEn: "Resolve an incident without breaking process",
    role: "consultant",
    stakeholderComplexity: "high",
    evidenceFr: "Dossier service · récupération",
    evidenceEn: "Service case · recovery",
    impactFr: "Satisfaction · risque relationnel",
    impactEn: "Satisfaction · relationship risk",
    enterpriseChapterFr: "Client",
    enterpriseChapterEn: "Customer",
  },
  {
    code: "M8",
    titleFr: "Ressources humaines et HCM",
    titleEn: "Human resources and HCM",
    businessAreaFr: "HCM",
    businessAreaEn: "HCM",
    processFr: "Hire-to-Retire",
    processEn: "Hire-to-Retire",
    mandateFr: "Diagnostiquer capacité et compétences",
    mandateEn: "Diagnose capacity and skills",
    role: "consultant",
    stakeholderComplexity: "medium",
    evidenceFr: "Dossier HCM · temps · compétences",
    evidenceEn: "HCM file · time · skills",
    impactFr: "Productivité · disponibilité",
    impactEn: "Productivity · availability",
    enterpriseChapterFr: "Effectifs",
    enterpriseChapterEn: "Workforce",
  },
  {
    code: "M9",
    titleFr: "Gouvernance, accès et risques",
    titleEn: "Governance, access and risk",
    businessAreaFr: "Gouvernance",
    businessAreaEn: "Governance",
    processFr: "Contrôles et ségrégation",
    processEn: "Controls and segregation",
    mandateFr: "Exposer un risque d’accès et recommander un contrôle",
    mandateEn: "Expose an access risk and recommend a control",
    role: "advisor",
    stakeholderComplexity: "high",
    evidenceFr: "SoD · audit · recommandation",
    evidenceEn: "SoD · audit · recommendation",
    impactFr: "Risque · conformité",
    impactEn: "Risk · compliance",
    enterpriseChapterFr: "Gouvernance",
    enterpriseChapterEn: "Governance",
  },
  {
    code: "M10",
    titleFr: "BI, KPI, IA et décision",
    titleEn: "BI, KPI, AI and decision",
    businessAreaFr: "Décision",
    businessAreaEn: "Decision",
    processFr: "Data-to-Decision",
    processEn: "Data-to-Decision",
    mandateFr: "Transformer des signaux en recommandation exécutive",
    mandateEn: "Turn signals into an executive recommendation",
    role: "advisor",
    stakeholderComplexity: "high",
    evidenceFr: "Interprétation KPI + synthèse",
    evidenceEn: "KPI interpretation + synthesis",
    impactFr: "Décision · monitoring",
    impactEn: "Decision · monitoring",
    enterpriseChapterFr: "BI et conseil",
    enterpriseChapterEn: "BI and consulting",
  },
] as const;

export const PROFESSIONAL_STAGES: readonly {
  id: ProfessionalStage;
  fr: string;
  en: string;
}[] = [
  { id: "observer", fr: "Observateur", en: "Observer" },
  { id: "junior", fr: "Analyste junior", en: "Junior analyst" },
  { id: "process", fr: "Analyste de processus", en: "Process analyst" },
  { id: "consultant", fr: "Consultant ERP", en: "ERP consultant" },
  { id: "advisor", fr: "Conseiller de confiance", en: "Trusted advisor" },
] as const;

export const PROCESS_CHAIN_STEPS: readonly { fr: string; en: string }[] = [
  { fr: "Demande client", en: "Customer demand" },
  { fr: "Commande de vente", en: "Sales order" },
  { fr: "Allocation stock", en: "Inventory allocation" },
  { fr: "Besoin de réappro", en: "Replenishment need" },
  { fr: "Bon de commande", en: "Purchase order" },
  { fr: "Réponse fournisseur", en: "Supplier response" },
  { fr: "Réception", en: "Receipt" },
  { fr: "Facture", en: "Invoice" },
  { fr: "Paiement", en: "Payment" },
  { fr: "Comptabilisation", en: "Accounting update" },
  { fr: "Mouvement KPI", en: "KPI movement" },
  { fr: "Recommandation", en: "Consulting recommendation" },
] as const;

export const CAPSTONE_STAGES: readonly { id: string; fr: string; en: string }[] = [
  { id: "S1", fr: "Briefing exécutif", en: "Executive briefing" },
  { id: "S2", fr: "Diagnostic entreprise", en: "Enterprise diagnosis" },
  { id: "S3", fr: "Preuves et données", en: "Evidence and data" },
  { id: "S4", fr: "Crise opérationnelle", en: "Operational crisis" },
  { id: "S5", fr: "Analyse et BI", en: "Analysis and BI" },
  { id: "S6", fr: "Feuille de route", en: "Roadmap" },
  { id: "S7", fr: "Défense exécutive", en: "Executive defense" },
] as const;
