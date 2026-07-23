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

export type JourneyChapter = "foundations" | "operations" | "steering" | "governance";

export interface PlaybackModule {
  code: "M1" | "M2" | "M3" | "M4" | "M5" | "M6" | "M7" | "M8" | "M9" | "M10";
  chapter: JourneyChapter;
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
  professionalStepFr: string;
  professionalStepEn: string;
}

export const JOURNEY_CHAPTERS: readonly {
  id: JourneyChapter;
  fr: string;
  en: string;
}[] = [
  { id: "foundations", fr: "Fondations", en: "Foundations" },
  { id: "operations", fr: "Opérations intégrées", en: "Integrated operations" },
  { id: "steering", fr: "Pilotage de l’entreprise", en: "Enterprise steering" },
  { id: "governance", fr: "Gouvernance et conseil", en: "Governance and advice" },
] as const;

export const PLAYBACK_MODULES: readonly PlaybackModule[] = [
  {
    code: "M1",
    chapter: "foundations",
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
    enterpriseChapterFr: "Découvrir l’entreprise",
    enterpriseChapterEn: "Discover the company",
    professionalStepFr: "Observateur",
    professionalStepEn: "Observer",
  },
  {
    code: "M2",
    chapter: "foundations",
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
    enterpriseChapterFr: "Établir l’intégrité des données",
    enterpriseChapterEn: "Establish data integrity",
    professionalStepFr: "Analyste junior",
    professionalStepEn: "Junior analyst",
  },
  {
    code: "M3",
    chapter: "operations",
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
    evidenceFr: "Bon de commande · réception · justification d’écart",
    evidenceEn: "Purchase order · receipt · variance justification",
    impactFr: "OTIF · stock · trésorerie",
    impactEn: "OTIF · inventory · cash",
    enterpriseChapterFr: "Piloter les opérations",
    enterpriseChapterEn: "Steer operations",
    professionalStepFr: "Analyste de processus",
    professionalStepEn: "Process analyst",
  },
  {
    code: "M4",
    chapter: "operations",
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
    enterpriseChapterFr: "Piloter les opérations",
    enterpriseChapterEn: "Steer operations",
    professionalStepFr: "Analyste de processus",
    professionalStepEn: "Process analyst",
  },
  {
    code: "M5",
    chapter: "operations",
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
    enterpriseChapterFr: "Piloter les opérations",
    enterpriseChapterEn: "Steer operations",
    professionalStepFr: "Analyste de processus",
    professionalStepEn: "Process analyst",
  },
  {
    code: "M6",
    chapter: "steering",
    titleFr: "Finance et Record-to-Report",
    titleEn: "Finance and Record-to-Report",
    businessAreaFr: "Finance",
    businessAreaEn: "Finance",
    processFr: "Record-to-Report / trésorerie",
    processEn: "Record-to-Report / cash",
    mandateFr: "Lier transactions, contrôles et trésorerie",
    mandateEn: "Link transactions, controls and cash",
    role: "consultant",
    stakeholderComplexity: "high",
    evidenceFr: "Écritures · contrôles · écarts",
    evidenceEn: "Postings · controls · variances",
    impactFr: "Marge · trésorerie · conformité",
    impactEn: "Margin · cash · compliance",
    enterpriseChapterFr: "Intégrer les fonctions",
    enterpriseChapterEn: "Integrate functions",
    professionalStepFr: "Consultant ERP",
    professionalStepEn: "ERP consultant",
  },
  {
    code: "M7",
    chapter: "steering",
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
    enterpriseChapterFr: "Intégrer les fonctions",
    enterpriseChapterEn: "Integrate functions",
    professionalStepFr: "Consultant ERP",
    professionalStepEn: "ERP consultant",
  },
  {
    code: "M8",
    chapter: "steering",
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
    enterpriseChapterFr: "Intégrer les fonctions",
    enterpriseChapterEn: "Integrate functions",
    professionalStepFr: "Consultant ERP",
    professionalStepEn: "ERP consultant",
  },
  {
    code: "M9",
    chapter: "governance",
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
    enterpriseChapterFr: "Gouverner et conseiller",
    enterpriseChapterEn: "Govern and advise",
    professionalStepFr: "Conseiller de confiance",
    professionalStepEn: "Trusted advisor",
  },
  {
    code: "M10",
    chapter: "governance",
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
    impactFr: "Décision · suivi",
    impactEn: "Decision · monitoring",
    enterpriseChapterFr: "Gouverner et conseiller",
    enterpriseChapterEn: "Govern and advise",
    professionalStepFr: "Conseiller de confiance",
    professionalStepEn: "Trusted advisor",
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

export const PROCESS_CHAIN_STEPS: readonly {
  fr: string;
  en: string;
  documentFr: string;
  documentEn: string;
  consequenceFr: string;
  consequenceEn: string;
  stakeholderFr: string;
  stakeholderEn: string;
}[] = [
  {
    fr: "Demande client",
    en: "Customer demand",
    documentFr: "Demande client",
    documentEn: "Customer request",
    consequenceFr: "Engagement de service",
    consequenceEn: "Service commitment",
    stakeholderFr: "Client",
    stakeholderEn: "Customer",
  },
  {
    fr: "Commande de vente",
    en: "Sales order",
    documentFr: "SO-1048",
    documentEn: "SO-1048",
    consequenceFr: "Promesse client",
    consequenceEn: "Customer promise",
    stakeholderFr: "Ventes",
    stakeholderEn: "Sales",
  },
  {
    fr: "Allocation stock",
    en: "Inventory allocation",
    documentFr: "Allocation",
    documentEn: "Allocation",
    consequenceFr: "Disponibilité",
    consequenceEn: "Availability",
    stakeholderFr: "Stocks",
    stakeholderEn: "Inventory",
  },
  {
    fr: "Besoin de réappro",
    en: "Replenishment need",
    documentFr: "Demande d’achat",
    documentEn: "Purchase requisition",
    consequenceFr: "Délai",
    consequenceEn: "Lead time",
    stakeholderFr: "Achats",
    stakeholderEn: "Procurement",
  },
  {
    fr: "Bon de commande",
    en: "Purchase order",
    documentFr: "Bon de commande",
    documentEn: "Purchase order",
    consequenceFr: "Engagement fournisseur",
    consequenceEn: "Supplier commitment",
    stakeholderFr: "Fournisseur",
    stakeholderEn: "Supplier",
  },
  {
    fr: "Réponse fournisseur",
    en: "Supplier response",
    documentFr: "Confirmation",
    documentEn: "Confirmation",
    consequenceFr: "Délai +4 jours",
    consequenceEn: "Lead time +4 days",
    stakeholderFr: "Fournisseur",
    stakeholderEn: "Supplier",
  },
  {
    fr: "Réception",
    en: "Receipt",
    documentFr: "Bon de réception",
    documentEn: "Goods receipt",
    consequenceFr: "Capacité quai",
    consequenceEn: "Dock capacity",
    stakeholderFr: "Entrepôt",
    stakeholderEn: "Warehouse",
  },
  {
    fr: "Facture",
    en: "Invoice",
    documentFr: "Facture",
    documentEn: "Invoice",
    consequenceFr: "Coût",
    consequenceEn: "Cost",
    stakeholderFr: "Finance",
    stakeholderEn: "Finance",
  },
  {
    fr: "Paiement",
    en: "Payment",
    documentFr: "Paiement",
    documentEn: "Payment",
    consequenceFr: "Trésorerie",
    consequenceEn: "Cash",
    stakeholderFr: "Finance",
    stakeholderEn: "Finance",
  },
  {
    fr: "Comptabilisation",
    en: "Accounting update",
    documentFr: "Écriture comptable",
    documentEn: "Accounting entry",
    consequenceFr: "Service / KPI",
    consequenceEn: "Service / KPI",
    stakeholderFr: "Contrôle",
    stakeholderEn: "Control",
  },
  {
    fr: "Mouvement KPI",
    en: "KPI movement",
    documentFr: "Tableau de bord",
    documentEn: "Dashboard",
    consequenceFr: "OTIF / risque",
    consequenceEn: "OTIF / risk",
    stakeholderFr: "BI",
    stakeholderEn: "BI",
  },
  {
    fr: "Recommandation",
    en: "Consulting recommendation",
    documentFr: "Synthèse exécutive",
    documentEn: "Executive synthesis",
    consequenceFr: "Décision",
    consequenceEn: "Decision",
    stakeholderFr: "Direction",
    stakeholderEn: "Management",
  },
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

export const PULSE_NODES = [
  { id: "customers", fr: "Client", en: "Customer", x: 8, y: 28 },
  { id: "sales", fr: "Ventes", en: "Sales", x: 24, y: 18 },
  { id: "inventory", fr: "Stocks", en: "Inventory", x: 42, y: 26 },
  { id: "procurement", fr: "Achats", en: "Procurement", x: 34, y: 48 },
  { id: "suppliers", fr: "Fournisseur", en: "Supplier", x: 14, y: 66 },
  { id: "warehouse", fr: "Entrepôt", en: "Warehouse", x: 52, y: 58 },
  { id: "finance", fr: "Finance", en: "Finance", x: 70, y: 42 },
  { id: "hcm", fr: "HCM", en: "HCM", x: 66, y: 70 },
  { id: "governance", fr: "Gouvernance", en: "Governance", x: 86, y: 24 },
  { id: "bi", fr: "BI", en: "BI", x: 84, y: 56 },
  { id: "management", fr: "Direction", en: "Management", x: 58, y: 12 },
] as const;

export type PulseNodeId = (typeof PULSE_NODES)[number]["id"];

/** Active flow path used for pulse demonstration */
export const ACTIVE_FLOW: readonly PulseNodeId[] = [
  "customers",
  "sales",
  "inventory",
  "procurement",
  "suppliers",
  "warehouse",
  "finance",
  "bi",
  "management",
];
