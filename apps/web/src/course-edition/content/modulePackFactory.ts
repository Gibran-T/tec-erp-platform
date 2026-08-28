import type {
  BusinessDocumentContent,
  ConnectionLabDefinition,
  CourseEditionModulePack,
  CourseEditionSurfaceMeta,
  CourseMissionLink,
  MissionBilanContent,
  ModuleKpiLearningView,
  VisualFrameContent,
} from "../types.js";
import { getAppPath } from "../../workspace/appRegistry.js";

interface MissionSeed {
  readonly missionKey: string;
  readonly missionCode: string;
  readonly title: string;
  readonly role: string;
  readonly objective: string;
  readonly consequenceSummary: string;
}

interface ModuleSeed {
  readonly moduleCode: string;
  readonly title: string;
  readonly subtitle: string;
  readonly processFocus: string;
  readonly learningObjectives: readonly string[];
  readonly glossary: readonly { readonly term: string; readonly definition: string }[];
  readonly frameTopics: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly bodyHeading: string;
    readonly bodyDetail: string;
  }[];
  readonly document: {
    readonly id: string;
    readonly title: string;
    readonly docType: string;
    readonly reference: string;
    readonly summary: string;
    readonly rows: readonly { readonly label: string; readonly value: string }[];
  };
  readonly orderingSteps: readonly { readonly key: string; readonly label: string }[];
  readonly choiceQuestion: {
    readonly prompt: string;
    readonly options: readonly { readonly key: string; readonly label: string }[];
    readonly correctKey: string;
  };
  readonly missions: readonly [MissionSeed, MissionSeed, MissionSeed];
  readonly bilanTheme: string;
  readonly quiz: readonly {
    readonly id: string;
    readonly prompt: string;
    readonly options: readonly { readonly key: string; readonly label: string }[];
    readonly correctKey: string;
    readonly explanation: string;
  }[];
  readonly kpi: ModuleKpiLearningView;
}

const SURFACES = (
  moduleCode: string,
  processFocus: string,
): readonly CourseEditionSurfaceMeta[] => [
  {
    id: "apprendre",
    label: "APPRENDRE",
    shortLabel: "Apprendre",
    objective: `Comprendre le cadre ${processFocus} avant toute exécution dans NordHabitat (laboratoire TEC.ERP).`,
  },
  {
    id: "connecter",
    label: "CONNECTER ET PRATIQUER",
    shortLabel: "Connecter",
    objective:
      "Relier concepts, processus et décisions avec rétroaction immédiate dans le Connection Lab.",
  },
  {
    id: "missions",
    label: "MISSIONS",
    shortLabel: "Missions",
    objective: `Accomplir ${moduleCode}-M01 → ${moduleCode}-M03 dans le Centre de mission (runtime V2).`,
  },
  {
    id: "bilan",
    label: "BILAN ET CONSOLIDATION",
    shortLabel: "Bilan",
    objective: "Synthétiser décisions, impacts KPI et consolider par quiz de module.",
  },
];

const PROFESSOR_NOTES: readonly string[] = [
  "Le cours institutionnel est SAP ; TEC.ERP est le fauteuil pédagogique (simulation guidée).",
  "NordHabitat est réservé au laboratoire — ne pas confondre avec un environnement SAP productif.",
  "Faciliter APPRENDRE comme cadrage métier, pas comme LMS autonome.",
  "Après CONNECTER, orienter vers le Centre de mission pour l’exécution et le scoring officiel.",
  "Débriefer avec BILAN : conséquence authored, KPI du module et quiz de consolidation.",
  "Suivre progression et scores via le Portail professeur / PCC existant.",
];

function buildVisualFrames(seed: ModuleSeed): readonly VisualFrameContent[] {
  return seed.frameTopics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    professorNote: `Cadrer ${seed.processFocus} sans copier d’écran SAP — rester sur la logique métier NordHabitat.`,
    bodyHtml: `
      <div class="ce-visual-scene" data-asset-slot="${topic.id}">
        <div class="ce-visual-scene__hero">
          <p class="ce-visual-kicker">${seed.moduleCode} · NordHabitat · laboratoire TEC.ERP</p>
          <h3>${topic.bodyHeading}</h3>
          <p>${topic.bodyDetail}</p>
        </div>
        <p class="ce-visual-caption">SAP = cours · TEC.ERP = fauteuil · NordHabitat = lab-only</p>
      </div>
    `,
  }));
}

function buildDocument(seed: ModuleSeed): readonly BusinessDocumentContent[] {
  return [
    {
      id: seed.document.id,
      title: seed.document.title,
      docType: seed.document.docType,
      reference: seed.document.reference,
      status: "Publié",
      issuedAt: "2026-08-28",
      companyName: "NordHabitat",
      sections: [
        {
          heading: "Contexte module",
          paragraphs: [seed.document.summary],
          rows: seed.document.rows,
        },
        {
          heading: "Périmètre pédagogique",
          paragraphs: [
            `Document de démonstration Course Edition ${seed.moduleCode}. Le processus ${seed.processFocus} est enseigné via SAP en classe ; l’exercice s’effectue dans TEC.ERP sur le cas NordHabitat.`,
          ],
        },
      ],
      footerNote: "Document pédagogique Course Edition — NordHabitat lab-only · TEC.ERP.",
    },
  ];
}

function buildConnectionLab(seed: ModuleSeed): ConnectionLabDefinition {
  return {
    id: `${seed.moduleCode.toLowerCase()}-connection-lab`,
    title: `Laboratoire de connexion — ${seed.moduleCode}`,
    objective: `Relier la séquence comprendre → exécuter → décider au processus ${seed.processFocus}.`,
    passThresholdPercent: 70,
    activities: [
      {
        id: "lab-ordering",
        title: "Séquence pédagogique du module",
        instruction:
          "Ordonnez les trois missions du module : comprendre d’abord, exécuter ensuite, décider en dernier.",
        interaction: {
          id: "lab-ordering",
          type: "ORDERING",
          prompt: "Classez les étapes dans l’ordre pédagogique attendu.",
          options: seed.orderingSteps.map((step) => ({
            key: step.key,
            label: step.label,
          })),
          scoring: {
            maxPoints: 50,
            correctOrder: seed.orderingSteps.map((step) => step.key),
          },
        },
      },
      {
        id: "lab-choice",
        title: "Lecture du processus",
        instruction: `Choisissez l’énoncé qui décrit le mieux le processus ${seed.processFocus} dans NordHabitat.`,
        interaction: {
          id: "lab-choice",
          type: "SINGLE_CHOICE",
          prompt: seed.choiceQuestion.prompt,
          options: seed.choiceQuestion.options.map((option) => ({
            key: option.key,
            label: option.label,
          })),
          scoring: {
            maxPoints: 50,
            correctKeys: [seed.choiceQuestion.correctKey],
          },
        },
      },
    ],
    feedback: {
      correctRelationships: `Séquence correcte : ${seed.orderingSteps.map((s) => s.label).join(" → ")}.`,
      missingRelationships: `Revoyez le lien entre ${seed.processFocus} et les trois rôles comprendre / exécuter / décider.`,
      systemicImplication: `Une décision ${seed.processFocus} prise sans compréhension ni exécution contrôlée dégrade les KPI aval.`,
      improvement:
        "Amélioration professionnelle : documenter la preuve métier avant toute clôture ou recommandation.",
    },
  };
}

function buildBilan(seed: ModuleSeed): MissionBilanContent {
  return {
    title: `Bilan — ${seed.moduleCode} NordHabitat`,
    learnerActionsSummary: `Parcours APPRENDRE → CONNECTER → MISSIONS (${seed.moduleCode}-M01 à M03) → BILAN complété dans Course Edition.`,
    recognizedConcepts: [
      seed.processFocus,
      "Comprendre avant exécuter",
      "Décision avec conséquence",
      "Lecture KPI inter-départements",
      "SAP (cours) vs TEC.ERP (fauteuil) vs NordHabitat (lab)",
    ],
    keyDecisions: seed.missions.map((mission) => mission.consequenceSummary.slice(0, 120)),
    crossFunctionalImpact: seed.bilanTheme,
    kpiInterpretation: seed.kpi.interpretation,
    strengths: [
      "Respect de la séquence pédagogique comprendre → exécuter → décider.",
      "Lecture métier avant action transactionnelle.",
      "Lien explicite entre preuve documentaire et KPI.",
    ],
    gaps: [
      "Risque d’action isolée si la décision M03 n’est pas partagée inter-départements.",
      "Qualité des données amont à surveiller avant modules suivants.",
    ],
    recommendedAction: seed.kpi.recommendedAction,
    improvementGuidance:
      "Pour progresser : relier chaque mission à un rôle, une preuve et un KPI avant de clôturer le module.",
    authoredConsequence: `Conséquence authored : le module ${seed.moduleCode} consolide ${seed.processFocus} avec une décision documentée et un KPI interprété.`,
    affectedDepartments: ["Opérations", "Finance", "Approvisionnement", "Ventes", "TI"],
    kpiImpact: `KPI impacté : ${seed.kpi.name} — ${seed.kpi.actual} vs cible ${seed.kpi.target}.`,
  };
}

function buildPack(seed: ModuleSeed): CourseEditionModulePack {
  return {
    moduleCode: seed.moduleCode,
    title: seed.title,
    subtitle: seed.subtitle,
    learningObjectives: seed.learningObjectives,
    surfaces: SURFACES(seed.moduleCode, seed.processFocus),
    visualFrames: buildVisualFrames(seed),
    glossary: seed.glossary,
    documents: buildDocument(seed),
    connectionLab: buildConnectionLab(seed),
    missions: seed.missions as unknown as readonly CourseMissionLink[],
    bilan: buildBilan(seed),
    quiz: seed.quiz,
    kpi: seed.kpi,
    erpDemoPath: getAppPath("erp"),
    professorNotes: PROFESSOR_NOTES,
  };
}

const MODULE_SEEDS: readonly ModuleSeed[] = [
  {
    moduleCode: "M2",
    title: "Structure organisationnelle et données de base",
    subtitle: "Organisation, master data et qualité — Course Edition",
    processFocus: "structure organisationnelle et données de référence",
    learningObjectives: [
      "Structurer l’organisation NordHabitat avant toute transaction.",
      "Créer les données de référence essentielles (article, partenaire, site).",
      "Corriger la qualité des données sans casser l’intégrité référentielle.",
    ],
    glossary: [
      {
        term: "Master data",
        definition: "Données de référence stables consommées par plusieurs processus transactionnels.",
      },
      {
        term: "Unité organisationnelle",
        definition: "Segment de l’entreprise (siège, DC) qui porte responsabilités et coûts.",
      },
      {
        term: "Qualité des données",
        definition: "Cohérence, complétude et unicité des enregistrements de référence.",
      },
    ],
    frameTopics: [
      {
        id: "m2-frame-org",
        title: "Cartographie organisationnelle",
        description: "Siège, DC-MTL et DC-TRT avant transaction.",
        bodyHeading: "Structurer avant de transiger",
        bodyDetail: "L’organisation ERP traduit la réalité NordHabitat en unités exploitables.",
      },
      {
        id: "m2-frame-md",
        title: "Données de référence",
        description: "Articles, partenaires et sites partagés.",
        bodyHeading: "Une donnée, plusieurs processus",
        bodyDetail: "SKU-HVAC-4421, ThermoControl et Sacré-Cœur alimentent P2P et O2C.",
      },
      {
        id: "m2-frame-quality",
        title: "Gouvernance qualité",
        description: "Doublons, champs manquants, enregistrements bloqués.",
        bodyHeading: "Corriger sans effet cascade",
        bodyDetail: "La qualité protège les modules transactionnels aval.",
      },
      {
        id: "m2-frame-sequence",
        title: "Séquence pédagogique M2",
        description: "Comprendre → exécuter → décider sur la structure et la qualité.",
        bodyHeading: "Trois missions, trois rôles",
        bodyDetail: "Structurer, créer, corriger — puis décider sur la qualité.",
      },
    ],
    document: {
      id: "doc-m2-org-brief",
      title: "Brief structuration organisationnelle",
      docType: "Note de cadrage",
      reference: "NH-ORG-BRF-M2",
      summary:
        "Avant Procure-to-Pay, NordHabitat doit cartographier siège, centres de distribution et centres de coûts.",
      rows: [
        { label: "Module", value: "M2" },
        { label: "Processus", value: "Organisation · Master data" },
        { label: "Sites", value: "HQ-MTL · DC-MTL · DC-TRT" },
      ],
    },
    orderingSteps: [
      { key: "step-comprendre", label: "M2-M01 — Structurer l’organisation (comprendre)" },
      { key: "step-executer", label: "M2-M02 — Créer les données de référence (exécuter)" },
      { key: "step-decider", label: "M2-M03 — Corriger la qualité des données (décider)" },
    ],
    choiceQuestion: {
      prompt: "Quel est l’ordre de priorité le plus sain pour M2 ?",
      options: [
        { key: "a", label: "Transaction d’abord, structure ensuite" },
        { key: "b", label: "Organisation → master data → qualité" },
        { key: "c", label: "Qualité uniquement, sans structure" },
        { key: "d", label: "Ignorer les centres de coûts" },
      ],
      correctKey: "b",
    },
    missions: [
      {
        missionKey: "m2-m01-structurer-organisation",
        missionCode: "M2-M01",
        title: "Structurer l’organisation",
        role: "Comprendre — structuration organisationnelle",
        objective: "Cartographier siège, DC et centres de coûts avant toute transaction.",
        consequenceSummary:
          "La structuration valide que NordHabitat peut transiger sans ambiguïté organisationnelle.",
      },
      {
        missionKey: "m2-m02-creer-donnees-reference",
        missionCode: "M2-M02",
        title: "Créer les données de référence essentielles",
        role: "Exécuter — création master data",
        objective: "Créer clients, fournisseurs, articles et unités de mesure cohérents.",
        consequenceSummary:
          "Les références créées alimentent P2P et O2C avec une base partagée fiable.",
      },
      {
        missionKey: "m2-m03-corriger-qualite-donnees",
        missionCode: "M2-M03",
        title: "Corriger les problèmes de qualité des données",
        role: "Décider — gouvernance qualité",
        objective: "Corriger doublons et incohérences sans casser l’intégrité référentielle.",
        consequenceSummary:
          "La décision qualité autorise le passage au Procure-to-Pay avec un référentiel sain.",
      },
    ],
    bilanTheme:
      "La qualité organisationnelle et référentielle conditionne toutes les transactions M3+.",
    quiz: [
      {
        id: "q1",
        prompt: "Pourquoi structurer l’organisation avant de transiger ?",
        options: [
          { key: "a", label: "Pour accélérer la paie uniquement" },
          { key: "b", label: "Pour éviter des transactions sans propriétaire ni centre de coût clair" },
          { key: "c", label: "Pour supprimer les KPI" },
          { key: "d", label: "Pour copier un écran SAP" },
        ],
        correctKey: "b",
        explanation: "La structure porte responsabilités et coûts avant l’exécution.",
      },
      {
        id: "q2",
        prompt: "Qu’est-ce que la master data dans M2 ?",
        options: [
          { key: "a", label: "Uniquement les factures" },
          { key: "b", label: "Des données de référence multi-processus" },
          { key: "c", label: "Des brouillons marketing" },
          { key: "d", label: "Des logs TI" },
        ],
        correctKey: "b",
        explanation: "Article, partenaire et site sont consommés par plusieurs flux.",
      },
      {
        id: "q3",
        prompt: "Quel rôle correspond à M2-M03 ?",
        options: [
          { key: "a", label: "Comprendre" },
          { key: "b", label: "Exécuter" },
          { key: "c", label: "Décider" },
          { key: "d", label: "Observer uniquement" },
        ],
        correctKey: "c",
        explanation: "M03 clôt par une décision sur la qualité des données.",
      },
    ],
    kpi: {
      name: "Complétude référentielle",
      definition: "Part des enregistrements master data obligatoires complets et uniques.",
      formula: "Enregistrements valides ÷ Enregistrements requis × 100",
      unit: "%",
      period: "Clôture M2",
      target: "≥ 95 %",
      actual: "88 %",
      variance: "−7 pts",
      trend: "À améliorer",
      source: "NH-ORG-BRF-M2 · rapport qualité M2",
      interpretation: "Des doublons fournisseurs persistent — risque pour P2P.",
      risk: "Commandes et factures sur partenaires incorrects.",
      recommendedAction: "Prioriser correction doublons avant M3.",
      affectedProcess: "Master data / organisation",
      affectedDepartment: "TI · Opérations · Finance",
    },
  },
  {
    moduleCode: "M3",
    title: "Approvisionnement et Procure-to-Pay",
    subtitle: "Besoin d’achat à analyse fournisseur — Course Edition",
    processFocus: "Procure-to-Pay (P2P)",
    learningObjectives: [
      "Identifier un besoin d’achat à partir d’un signal opérationnel.",
      "Créer et traiter une commande d’achat contrôlée.",
      "Réceptionner et analyser la performance fournisseur.",
    ],
    glossary: [
      {
        term: "Procure-to-Pay",
        definition: "Chaîne besoin → demande → commande → réception → facture → paiement.",
      },
      { term: "Demande d’achat", definition: "Expression formalisée d’un besoin avant engagement." },
      {
        term: "Three-way match",
        definition: "Rapprochement commande, réception et facture (sensibilisation M3).",
      },
    ],
    frameTopics: [
      {
        id: "m3-frame-p2p",
        title: "Vue Procure-to-Pay",
        description: "Chaîne achat NordHabitat de bout en bout.",
        bodyHeading: "Du besoin au paiement",
        bodyDetail: "ThermoControl et Denise illustrent le flux P2P pédagogique.",
      },
      {
        id: "m3-frame-need",
        title: "Besoin contrôlé",
        description: "Transformer un signal stock en demande.",
        bodyHeading: "Comprendre le besoin",
        bodyDetail: "M3-M01 ancre la lecture métier avant commande.",
      },
      {
        id: "m3-frame-po",
        title: "Commande d’achat",
        description: "Engagement fournisseur et contrôle.",
        bodyHeading: "Exécuter la commande",
        bodyDetail: "M3-M02 porte l’exécution transactionnelle guidée.",
      },
      {
        id: "m3-frame-supplier",
        title: "Performance fournisseur",
        description: "Réception et analyse aval.",
        bodyHeading: "Décider sur le fournisseur",
        bodyDetail: "M3-M03 clôt par une décision sur la relation fournisseur.",
      },
    ],
    document: {
      id: "doc-m3-purchase-need",
      title: "Signal besoin d’achat HVAC",
      docType: "Demande interne",
      reference: "NH-P2P-REQ-M3",
      summary: "Denise signale tension stock pièces HVAC — besoin formalisé vers ThermoControl.",
      rows: [
        { label: "Demandeur", value: "Denise — Opérations" },
        { label: "Fournisseur cible", value: "ThermoControl" },
        { label: "Article", value: "SKU-HVAC-4421" },
      ],
    },
    orderingSteps: [
      { key: "step-comprendre", label: "M3-M01 — Identifier le besoin d’achat (comprendre)" },
      { key: "step-executer", label: "M3-M02 — Créer et traiter la commande (exécuter)" },
      { key: "step-decider", label: "M3-M03 — Réceptionner et analyser le fournisseur (décider)" },
    ],
    choiceQuestion: {
      prompt: "Quelle étape ouvre logiquement le P2P NordHabitat ?",
      options: [
        { key: "a", label: "Payer la facture sans commande" },
        { key: "b", label: "Identifier et formaliser le besoin d’achat" },
        { key: "c", label: "Clôturer le dossier client" },
        { key: "d", label: "Évaluer les compétences RH" },
      ],
      correctKey: "b",
    },
    missions: [
      {
        missionKey: "m3-m01-identifier-besoin-achat",
        missionCode: "M3-M01",
        title: "Identifier un besoin d’achat",
        role: "Comprendre — besoin d’achat",
        objective: "Transformer un besoin opérationnel en demande d’achat contrôlée.",
        consequenceSummary: "Le besoin identifié justifie l’engagement fournisseur sans sur-commande.",
      },
      {
        missionKey: "m3-m02-creer-traiter-commande-achat",
        missionCode: "M3-M02",
        title: "Créer et traiter une commande d’achat",
        role: "Exécuter — commande d’achat",
        objective: "Créer et traiter la commande avec contrôles d’approbation adaptés.",
        consequenceSummary: "La commande exécutée prépare réception et rapprochement aval.",
      },
      {
        missionKey: "m3-m03-receptionner-analyser-fournisseur",
        missionCode: "M3-M03",
        title: "Réceptionner et analyser le fournisseur",
        role: "Décider — performance fournisseur",
        objective: "Réceptionner la marchandise et analyser la performance ThermoControl.",
        consequenceSummary: "La décision fournisseur influence stocks, coût et fiabilité P2P.",
      },
    ],
    bilanTheme: "P2P relie approvisionnement, entrepôt et finance sur une preuve commune.",
    quiz: [
      {
        id: "q1",
        prompt: "Quelle mission M3 correspond au rôle « exécuter » ?",
        options: [
          { key: "a", label: "M3-M01" },
          { key: "b", label: "M3-M02" },
          { key: "c", label: "M3-M03" },
          { key: "d", label: "M2-M03" },
        ],
        correctKey: "b",
        explanation: "M3-M02 porte la création et le traitement de commande.",
      },
      {
        id: "q2",
        prompt: "Pourquoi formaliser le besoin avant la commande ?",
        options: [
          { key: "a", label: "Pour contourner la gouvernance" },
          { key: "b", label: "Pour ancrer l’achat dans un signal métier traçable" },
          { key: "c", label: "Pour supprimer le fournisseur" },
          { key: "d", label: "Pour éviter la réception" },
        ],
        correctKey: "b",
        explanation: "Le besoin formalisé évite les engagements non justifiés.",
      },
      {
        id: "q3",
        prompt: "Où s’exerce le parcours P2P pédagogique ?",
        options: [
          { key: "a", label: "SAP productif client" },
          { key: "b", label: "TEC.ERP / NordHabitat lab-only" },
          { key: "c", label: "Réseaux sociaux" },
          { key: "d", label: "Aucun environnement" },
        ],
        correctKey: "b",
        explanation: "NordHabitat est le laboratoire ; SAP est enseigné en cours.",
      },
    ],
    kpi: {
      name: "Délai cycle P2P",
      definition: "Temps entre demande validée et réception enregistrée.",
      formula: "Date réception − Date demande",
      unit: "jours",
      period: "M3 NordHabitat",
      target: "≤ 5 j",
      actual: "7 j",
      variance: "+2 j",
      trend: "À surveiller",
      source: "NH-P2P-REQ-M3",
      interpretation: "Le délai impacte stock et production HVAC.",
      risk: "Rupture ou sur-stock si le cycle s’allonge.",
      recommendedAction: "Revoir lead time ThermoControl avant prochaine commande.",
      affectedProcess: "Procure-to-Pay",
      affectedDepartment: "Approvisionnement · Entrepôt · Finance",
    },
  },
  {
    moduleCode: "M4",
    title: "Ventes et Order-to-Cash",
    subtitle: "Commande client à clôture de vente — Course Edition",
    processFocus: "Order-to-Cash (O2C)",
    learningObjectives: [
      "Saisir une commande institutionnelle avec contrôles crédit/disponibilité.",
      "Allouer entre entrepôts pour honorer la promesse client.",
      "Confirmer livraison et clôturer la vente avec preuve.",
    ],
    glossary: [
      {
        term: "Order-to-Cash",
        definition: "Chaîne commande client → livraison → facturation → encaissement.",
      },
      { term: "Allocation", definition: "Affectation stock aux lignes de commande par site." },
      { term: "Promesse client", definition: "Date et quantité engageantes vis-à-vis du client." },
    ],
    frameTopics: [
      {
        id: "m4-frame-o2c",
        title: "Chaîne O2C",
        description: "De la commande Sacré-Cœur à la clôture.",
        bodyHeading: "Vendre avec preuve",
        bodyDetail: "O2C relie ventes, entrepôt et finance.",
      },
      {
        id: "m4-frame-order",
        title: "Commande institutionnelle",
        description: "Saisie contrôlée M4-M01.",
        bodyHeading: "Comprendre l’engagement client",
        bodyDetail: "La commande formalise la promesse commerciale.",
      },
      {
        id: "m4-frame-alloc",
        title: "Allocation inter-entrepôts",
        description: "DC-MTL vs DC-TRT.",
        bodyHeading: "Exécuter l’allocation",
        bodyDetail: "L’allocation traduit la disponibilité réelle.",
      },
      {
        id: "m4-frame-close",
        title: "Clôture de vente",
        description: "Livraison confirmée et impact KPI.",
        bodyHeading: "Décider la clôture",
        bodyDetail: "M4-M03 consolide service et encaissement.",
      },
    ],
    document: {
      id: "doc-m4-inst-order",
      title: "Commande institutionnelle Sacré-Cœur",
      docType: "Bon de commande client",
      reference: "NH-O2C-ORD-M4",
      summary: "Commande institutionnelle HVAC pour le client Sacré-Cœur — allocation requise.",
      rows: [
        { label: "Client", value: "Institution Sacré-Cœur" },
        { label: "Article", value: "SKU-HVAC-4421" },
        { label: "Sites", value: "DC-MTL · DC-TRT" },
      ],
    },
    orderingSteps: [
      { key: "step-comprendre", label: "M4-M01 — Saisir la commande institutionnelle (comprendre)" },
      { key: "step-executer", label: "M4-M02 — Allocation inter-entrepôts (exécuter)" },
      { key: "step-decider", label: "M4-M03 — Confirmer livraison et clôturer (décider)" },
    ],
    choiceQuestion: {
      prompt: "Quel enjeu central du O2C NordHabitat ?",
      options: [
        { key: "a", label: "Promettre sans vérifier le stock" },
        { key: "b", label: "Aligner promesse client, allocation et clôture" },
        { key: "c", label: "Ignorer le crédit client" },
        { key: "d", label: "Supprimer la facturation" },
      ],
      correctKey: "b",
    },
    missions: [
      {
        missionKey: "m4-m01-saisir-commande-institutionnelle",
        missionCode: "M4-M01",
        title: "Saisir la commande institutionnelle",
        role: "Comprendre — engagement client",
        objective: "Saisir la commande avec contrôles crédit et disponibilité.",
        consequenceSummary: "La commande saisie expose les contraintes stock et crédit.",
      },
      {
        missionKey: "m4-m02-allocation-inter-entrepots",
        missionCode: "M4-M02",
        title: "Allocation inter-entrepôts",
        role: "Exécuter — allocation stock",
        objective: "Allouer les lignes entre DC-MTL et DC-TRT pour honorer la promesse.",
        consequenceSummary: "L’allocation exécutée sécurise la livraison planifiée.",
      },
      {
        missionKey: "m4-m03-confirmer-livraison-cloture",
        missionCode: "M4-M03",
        title: "Confirmer la livraison et clôturer",
        role: "Décider — clôture de vente",
        objective: "Confirmer livraison, documenter écarts et clôturer la vente.",
        consequenceSummary: "La clôture relie service client, inventaire et encaissement.",
      },
    ],
    bilanTheme: "O2C convertit la promesse commerciale en preuve logistique et financière.",
    quiz: [
      {
        id: "q1",
        prompt: "Quelle mission alloue le stock entre entrepôts ?",
        options: [
          { key: "a", label: "M4-M01" },
          { key: "b", label: "M4-M02" },
          { key: "c", label: "M4-M03" },
          { key: "d", label: "M5-M01" },
        ],
        correctKey: "b",
        explanation: "M4-M02 est la mission d’exécution allocation.",
      },
      {
        id: "q2",
        prompt: "Pourquoi la clôture M4-M03 est une décision ?",
        options: [
          { key: "a", label: "Elle n’a aucun impact KPI" },
          { key: "b", label: "Elle engage service, stock et finance simultanément" },
          { key: "c", label: "Elle remplace le P2P" },
          { key: "d", label: "Elle supprime le client" },
        ],
        correctKey: "b",
        explanation: "La clôture consolide conséquences cross-fonctionnelles.",
      },
      {
        id: "q3",
        prompt: "Le cours SAP vs TEC.ERP :",
        options: [
          { key: "a", label: "SAP = fauteuil, TEC.ERP = cours" },
          { key: "b", label: "SAP = cours, TEC.ERP = fauteuil lab NordHabitat" },
          { key: "c", label: "Les deux sont identiques en production" },
          { key: "d", label: "NordHabitat est un client SAP réel" },
        ],
        correctKey: "b",
        explanation: "Distinction pédagogique institutionnelle.",
      },
    ],
    kpi: {
      name: "Taux de livraison à temps (OTIF)",
      definition: "Commandes livrées complètes et à la date promise.",
      formula: "Livraisons OTIF ÷ Commandes promises × 100",
      unit: "%",
      period: "M4 NordHabitat",
      target: "≥ 95 %",
      actual: "91 %",
      variance: "−4 pts",
      trend: "À surveiller",
      source: "NH-O2C-ORD-M4",
      interpretation: "L’allocation inter-DC influence directement OTIF.",
      risk: "Insatisfaction client institutionnel.",
      recommendedAction: "Revoir règles d’allocation avant pic de demande.",
      affectedProcess: "Order-to-Cash",
      affectedDepartment: "Ventes · Entrepôt · Finance",
    },
  },
  {
    moduleCode: "M5",
    title: "Stocks, réapprovisionnement et S&OP",
    subtitle: "Analyse stock, transfert et recommandation S&OP — Course Edition",
    processFocus: "supply chain et S&OP",
    learningObjectives: [
      "Analyser stock et déclencher réapprovisionnement.",
      "Décider un transfert inter-centres de distribution.",
      "Présenter une recommandation S&OP documentée.",
    ],
    glossary: [
      { term: "S&OP", definition: "Sales & Operations Planning — alignement demande/offre." },
      { term: "Point de commande", definition: "Seuil déclenchant réapprovisionnement." },
      { term: "Transfert inter-DC", definition: "Mouvement stock entre DC-MTL et DC-TRT." },
    ],
    frameTopics: [
      {
        id: "m5-frame-stock",
        title: "Lecture stock",
        description: "Signaux réappro SKU-HVAC-4421.",
        bodyHeading: "Comprendre le stock",
        bodyDetail: "M5-M01 analyse disponibilité et risque rupture.",
      },
      {
        id: "m5-frame-replen",
        title: "Réapprovisionnement",
        description: "Lien P2P et inventaire.",
        bodyHeading: "Exécuter le transfert",
        bodyDetail: "M5-M02 décide du mouvement inter-DC.",
      },
      {
        id: "m5-frame-sop",
        title: "Recommandation S&OP",
        description: "Synthèse comité demande/offre.",
        bodyHeading: "Décider en comité",
        bodyDetail: "M5-M03 présente la recommandation S&OP.",
      },
      {
        id: "m5-frame-balance",
        title: "Équilibre service/coût",
        description: "KPI service vs coût stock.",
        bodyHeading: "Impact systémique",
        bodyDetail: "Supply chain relie ventes, entrepôt et finance.",
      },
    ],
    document: {
      id: "doc-m5-stock-review",
      title: "Revue stock HVAC inter-DC",
      docType: "Rapport inventaire",
      reference: "NH-SC-STK-M5",
      summary: "Analyse stock SKU-HVAC-4421 — écart couverture entre DC-MTL et DC-TRT.",
      rows: [
        { label: "Article", value: "SKU-HVAC-4421" },
        { label: "Couverture DC-MTL", value: "12 j" },
        { label: "Couverture DC-TRT", value: "4 j" },
      ],
    },
    orderingSteps: [
      { key: "step-comprendre", label: "M5-M01 — Analyser stock et réappro (comprendre)" },
      { key: "step-executer", label: "M5-M02 — Décision transfert inter-DC (exécuter)" },
      { key: "step-decider", label: "M5-M03 — Présentation S&OP (décider)" },
    ],
    choiceQuestion: {
      prompt: "Quel objectif du S&OP NordHabitat ?",
      options: [
        { key: "a", label: "Isoler ventes et opérations" },
        { key: "b", label: "Aligner demande, stock et capacité avant décision" },
        { key: "c", label: "Supprimer les transferts" },
        { key: "d", label: "Éviter tout KPI" },
      ],
      correctKey: "b",
    },
    missions: [
      {
        missionKey: "m5-m01-analyser-stock-reappro",
        missionCode: "M5-M01",
        title: "Analyser le stock et le réapprovisionnement",
        role: "Comprendre — analyse stock",
        objective: "Analyser couverture stock et besoin de réapprovisionnement.",
        consequenceSummary: "L’analyse expose risque rupture et sur-stock par DC.",
      },
      {
        missionKey: "m5-m02-decision-transfert-inter-dc",
        missionCode: "M5-M02",
        title: "Décision de transfert inter-DC",
        role: "Exécuter — transfert stock",
        objective: "Exécuter ou recommander transfert entre DC-MTL et DC-TRT.",
        consequenceSummary: "Le transfert exécuté rééquilibre service régional.",
      },
      {
        missionKey: "m5-m03-presentation-sop",
        missionCode: "M5-M03",
        title: "Présentation S&OP",
        role: "Décider — recommandation S&OP",
        objective: "Présenter recommandation S&OP au comité demande/offre.",
        consequenceSummary: "La décision S&OP aligne ventes, opérations et finance.",
      },
    ],
    bilanTheme: "S&OP traduit signaux stock en décision comité partagée.",
    quiz: [
      {
        id: "q1",
        prompt: "Quelle mission présente la recommandation S&OP ?",
        options: [
          { key: "a", label: "M5-M01" },
          { key: "b", label: "M5-M02" },
          { key: "c", label: "M5-M03" },
          { key: "d", label: "M4-M03" },
        ],
        correctKey: "c",
        explanation: "M5-M03 est la mission décider du module.",
      },
      {
        id: "q2",
        prompt: "Pourquoi un transfert inter-DC ?",
        options: [
          { key: "a", label: "Pour masquer un écart inventaire" },
          { key: "b", label: "Pour rééquilibrer couverture et service client régional" },
          { key: "c", label: "Pour annuler O2C" },
          { key: "d", label: "Pour supprimer ThermoControl" },
        ],
        correctKey: "b",
        explanation: "Le transfert corrige un déséquilibre de couverture.",
      },
      {
        id: "q3",
        prompt: "NordHabitat dans M5 sert à :",
        options: [
          { key: "a", label: "Remplacer SAP en production" },
          { key: "b", label: "Laboratoire TEC.ERP pour exercer supply chain" },
          { key: "c", label: "Héberger des secrets SAP" },
          { key: "d", label: "Ignorer les KPI" },
        ],
        correctKey: "b",
        explanation: "NordHabitat est lab-only.",
      },
    ],
    kpi: {
      name: "Couverture stock (jours)",
      definition: "Autonomie stock moyenne par article critique et site.",
      formula: "Stock disponible ÷ Demande moyenne journalière",
      unit: "jours",
      period: "M5 NordHabitat",
      target: "8–14 j",
      actual: "DC-TRT 4 j",
      variance: "Sous seuil",
      trend: "Risque rupture",
      source: "NH-SC-STK-M5",
      interpretation: "DC-TRT sous couverture — transfert ou réappro requis.",
      risk: "Rupture service client régional.",
      recommendedAction: "Prioriser transfert ou commande avant comité S&OP.",
      affectedProcess: "Supply chain / S&OP",
      affectedDepartment: "Opérations · Entrepôt · Ventes",
    },
  },
  {
    moduleCode: "M6",
    title: "Finance et contrôle",
    subtitle: "Facture, rapprochement et explication d’écart — Course Edition",
    processFocus: "comptabilité fournisseurs et contrôle",
    learningObjectives: [
      "Réceptionner une facture fournisseur avec contrôles.",
      "Traiter une exception de rapprochement trois voies.",
      "Expliquer l’écart financier aux parties prenantes.",
    ],
    glossary: [
      {
        term: "Rapprochement trois voies",
        definition: "Alignement commande, réception et facture avant paiement.",
      },
      { term: "Exception AP", definition: "Écart bloquant le paiement automatique." },
      { term: "Explication d’écart", definition: "Narratif métier justifiant l’écart aux décideurs." },
    ],
    frameTopics: [
      {
        id: "m6-frame-ap",
        title: "Comptabilité fournisseurs",
        description: "Réception facture ThermoControl.",
        bodyHeading: "Comprendre la facture",
        bodyDetail: "M6-M01 ancre réception et contrôles.",
      },
      {
        id: "m6-frame-match",
        title: "Exception three-way",
        description: "Écart quantité ou prix.",
        bodyHeading: "Exécuter le rapprochement",
        bodyDetail: "M6-M02 traite l’exception avec preuve.",
      },
      {
        id: "m6-frame-explain",
        title: "Explication finance",
        description: "Communication aux opérationnels.",
        bodyHeading: "Décider et expliquer",
        bodyDetail: "M6-M03 clôt par explication d’écart.",
      },
      {
        id: "m6-frame-control",
        title: "Contrôle interne",
        description: "Lien P2P et trésorerie.",
        bodyHeading: "Impact trésorerie",
        bodyDetail: "Finance protège paiement et conformité.",
      },
    ],
    document: {
      id: "doc-m6-invoice",
      title: "Facture fournisseur ThermoControl",
      docType: "Facture AP",
      reference: "NH-FIN-INV-M6",
      summary: "Facture HVAC avec écart quantité vs réception — exception three-way.",
      rows: [
        { label: "Fournisseur", value: "ThermoControl" },
        { label: "Montant", value: "4 280 CAD" },
        { label: "Statut", value: "Exception rapprochement" },
      ],
    },
    orderingSteps: [
      { key: "step-comprendre", label: "M6-M01 — Réception facture (comprendre)" },
      { key: "step-executer", label: "M6-M02 — Exception rapprochement trois voies (exécuter)" },
      { key: "step-decider", label: "M6-M03 — Expliquer l’écart finance (décider)" },
    ],
    choiceQuestion: {
      prompt: "Que vérifie le rapprochement trois voies ?",
      options: [
        { key: "a", label: "Uniquement la paie" },
        { key: "b", label: "Commande, réception et facture" },
        { key: "c", label: "Seulement le marketing" },
        { key: "d", label: "Les accès SoD" },
      ],
      correctKey: "b",
    },
    missions: [
      {
        missionKey: "m6-m01-reception-facture",
        missionCode: "M6-M01",
        title: "Réceptionner la facture",
        role: "Comprendre — réception facture",
        objective: "Réceptionner la facture fournisseur avec contrôles préliminaires.",
        consequenceSummary: "La réception expose l’écart nécessitant rapprochement.",
      },
      {
        missionKey: "m6-m02-exception-rapprochement-trois-voies",
        missionCode: "M6-M02",
        title: "Exception de rapprochement trois voies",
        role: "Exécuter — traitement exception",
        objective: "Traiter l’exception three-way avec preuves P2P.",
        consequenceSummary: "L’exécution débloque ou retient le paiement selon preuve.",
      },
      {
        missionKey: "m6-m03-expliquer-ecart-finance",
        missionCode: "M6-M03",
        title: "Expliquer l’écart à la finance",
        role: "Décider — explication d’écart",
        objective: "Formuler explication métier de l’écart aux parties prenantes.",
        consequenceSummary: "L’explication autorise décision paiement et leçon processus.",
      },
    ],
    bilanTheme: "Finance convertit exceptions P2P en décision trésorerie documentée.",
    quiz: [
      {
        id: "q1",
        prompt: "Quelle mission traite l’exception three-way ?",
        options: [
          { key: "a", label: "M6-M01" },
          { key: "b", label: "M6-M02" },
          { key: "c", label: "M6-M03" },
          { key: "d", label: "M3-M02" },
        ],
        correctKey: "b",
        explanation: "M6-M02 est la mission exécuter du rapprochement.",
      },
      {
        id: "q2",
        prompt: "Pourquoi expliquer l’écart (M6-M03) ?",
        options: [
          { key: "a", label: "Pour masquer l’écart" },
          { key: "b", label: "Pour permettre une décision paiement informée" },
          { key: "c", label: "Pour supprimer la commande" },
          { key: "d", label: "Pour éviter la réception" },
        ],
        correctKey: "b",
        explanation: "L’explication relie opérations et finance.",
      },
      {
        id: "q3",
        prompt: "TEC.ERP dans M6 est :",
        options: [
          { key: "a", label: "Le cours SAP officiel" },
          { key: "b", label: "Le fauteuil pédagogique sur NordHabitat" },
          { key: "c", label: "Un ERP client en production" },
          { key: "d", label: "Un LMS externe" },
        ],
        correctKey: "b",
        explanation: "TEC.ERP simule ; SAP est enseigné en classe.",
      },
    ],
    kpi: {
      name: "Taux exceptions AP",
      definition: "Factures bloquées par rapprochement trois voies.",
      formula: "Exceptions ÷ Factures reçues × 100",
      unit: "%",
      period: "M6 NordHabitat",
      target: "≤ 5 %",
      actual: "12 %",
      variance: "+7 pts",
      trend: "À risque",
      source: "NH-FIN-INV-M6",
      interpretation: "Écarts quantité ThermoControl augmentent délai paiement.",
      risk: "Tension trésorerie et relation fournisseur.",
      recommendedAction: "Renforcer contrôle réception avant facturation.",
      affectedProcess: "Accounts Payable / contrôle",
      affectedDepartment: "Finance · Approvisionnement",
    },
  },
  {
    moduleCode: "M7",
    title: "CRM et service client",
    subtitle: "Dossier client, escalade et récupération NPS — Course Edition",
    processFocus: "service client et CRM",
    learningObjectives: [
      "Ouvrir un dossier client structuré.",
      "Coordonner une escalade cross-fonctionnelle.",
      "Clôturer le cas avec récupération NPS.",
    ],
    glossary: [
      { term: "Dossier client", definition: "Registre traçable des interactions et engagements." },
      { term: "Escalade", definition: "Mobilisation d’autres départements pour résoudre un cas." },
      { term: "NPS", definition: "Net Promoter Score — mesure de recommandation client." },
    ],
    frameTopics: [
      {
        id: "m7-frame-case",
        title: "Ouverture dossier",
        description: "Client Sacré-Cœur insatisfait livraison.",
        bodyHeading: "Comprendre le cas",
        bodyDetail: "M7-M01 structure le dossier CRM.",
      },
      {
        id: "m7-frame-escalate",
        title: "Coordination escalade",
        description: "Ventes, entrepôt, finance mobilisés.",
        bodyHeading: "Exécuter l’escalade",
        bodyDetail: "M7-M02 coordonne la résolution.",
      },
      {
        id: "m7-frame-close",
        title: "Clôture NPS",
        description: "Récupération satisfaction.",
        bodyHeading: "Décider la clôture",
        bodyDetail: "M7-M03 clôt avec preuve et NPS.",
      },
      {
        id: "m7-frame-crm",
        title: "Lien O2C",
        description: "Service relié à promesse et livraison.",
        bodyHeading: "Impact O2C",
        bodyDetail: "CRM lit les conséquences M4/M5.",
      },
    ],
    document: {
      id: "doc-m7-case",
      title: "Dossier service — Institution Sacré-Cœur",
      docType: "Ticket CRM",
      reference: "NH-CRM-CSE-M7",
      summary: "Retard livraison HVAC — client institutionnel demande escalade.",
      rows: [
        { label: "Client", value: "Institution Sacré-Cœur" },
        { label: "Priorité", value: "Haute" },
        { label: "NPS initial", value: "6 / 10" },
      ],
    },
    orderingSteps: [
      { key: "step-comprendre", label: "M7-M01 — Ouvrir le dossier client (comprendre)" },
      { key: "step-executer", label: "M7-M02 — Coordonner l’escalade (exécuter)" },
      { key: "step-decider", label: "M7-M03 — Clôturer le cas NPS (décider)" },
    ],
    choiceQuestion: {
      prompt: "Quel est le premier geste CRM professionnel ?",
      options: [
        { key: "a", label: "Fermer le ticket sans preuve" },
        { key: "b", label: "Ouvrir un dossier structuré avec contexte O2C" },
        { key: "c", label: "Ignorer le client" },
        { key: "d", label: "Modifier le stock sans dossier" },
      ],
      correctKey: "b",
    },
    missions: [
      {
        missionKey: "m7-m01-ouvrir-dossier-client",
        missionCode: "M7-M01",
        title: "Ouvrir le dossier client",
        role: "Comprendre — dossier CRM",
        objective: "Ouvrir dossier structuré avec historique commande et livraison.",
        consequenceSummary: "Le dossier expose dépendances O2C et service.",
      },
      {
        missionKey: "m7-m02-coordonner-escalade",
        missionCode: "M7-M02",
        title: "Coordonner l’escalade",
        role: "Exécuter — coordination escalade",
        objective: "Mobiliser ventes, entrepôt et finance pour résolution.",
        consequenceSummary: "L’escalade exécutée débloque actions correctives.",
      },
      {
        missionKey: "m7-m03-cloturer-cas-nps",
        missionCode: "M7-M03",
        title: "Clôturer le cas NPS",
        role: "Décider — récupération NPS",
        objective: "Clôturer avec preuve, engagement et mesure NPS.",
        consequenceSummary: "La clôture documente récupération satisfaction et leçons processus.",
      },
    ],
    bilanTheme: "CRM transforme insatisfaction livraison en preuve et récupération NPS.",
    quiz: [
      {
        id: "q1",
        prompt: "Quelle mission coordonne l’escalade ?",
        options: [
          { key: "a", label: "M7-M01" },
          { key: "b", label: "M7-M02" },
          { key: "c", label: "M7-M03" },
          { key: "d", label: "M6-M03" },
        ],
        correctKey: "b",
        explanation: "M7-M02 est la mission exécuter.",
      },
      {
        id: "q2",
        prompt: "NPS en M7 sert à :",
        options: [
          { key: "a", label: "Mesurer la recommandation après résolution" },
          { key: "b", label: "Calculer la paie" },
          { key: "c", label: "Remplacer le three-way match" },
          { key: "d", label: "Structurer l’organisation" },
        ],
        correctKey: "a",
        explanation: "NPS valide récupération satisfaction.",
      },
      {
        id: "q3",
        prompt: "Le dossier CRM doit relier :",
        options: [
          { key: "a", label: "Uniquement marketing" },
          { key: "b", label: "Promesse O2C, livraison et actions correctives" },
          { key: "c", label: "Seulement RH" },
          { key: "d", label: "Rien" },
        ],
        correctKey: "b",
        explanation: "CRM lit la chaîne vente/livraison.",
      },
    ],
    kpi: {
      name: "NPS post-résolution",
      definition: "Score recommandation après clôture dossier.",
      formula: "Promoteurs − Détracteurs (échelle 0–10)",
      unit: "pts",
      period: "M7 NordHabitat",
      target: "≥ 8",
      actual: "7",
      variance: "−1 pt",
      trend: "Récupération partielle",
      source: "NH-CRM-CSE-M7",
      interpretation: "Escalade réussie mais marge d’amélioration sur délai.",
      risk: "Perte contrat institutionnel.",
      recommendedAction: "Renforcer communication proactive sur retards.",
      affectedProcess: "CRM / service client",
      affectedDepartment: "Ventes · Opérations · Service",
    },
  },
  {
    moduleCode: "M8",
    title: "Ressources humaines et HCM",
    subtitle: "Intégration, temps/absences et compétences — Course Edition",
    processFocus: "HCM et gestion des personnes",
    learningObjectives: [
      "Intégrer un nouvel employé avec dossier complet.",
      "Gérer temps, absences et impact financier.",
      "Évaluer compétences et préparer évolution.",
    ],
    glossary: [
      { term: "HCM", definition: "Human Capital Management — gestion du capital humain." },
      { term: "Onboarding", definition: "Parcours d’intégration employé et accès." },
      { term: "Impact financier RH", definition: "Coût absences et productivité sur finance." },
    ],
    frameTopics: [
      {
        id: "m8-frame-hire",
        title: "Intégration employé",
        description: "Nouvelle recrue entrepôt.",
        bodyHeading: "Comprendre l’intégration",
        bodyDetail: "M8-M01 structure onboarding NordHabitat.",
      },
      {
        id: "m8-frame-time",
        title: "Temps et absences",
        description: "Impact opérations et finance.",
        bodyHeading: "Exécuter la gestion temps",
        bodyDetail: "M8-M02 traite absences et coût.",
      },
      {
        id: "m8-frame-skills",
        title: "Compétences et évolution",
        description: "Évaluation et plan développement.",
        bodyHeading: "Décider sur l’évolution",
        bodyDetail: "M8-M03 prépare décision RH.",
      },
      {
        id: "m8-frame-people",
        title: "Lien opérations",
        description: "Personnes et capacité DC.",
        bodyHeading: "Capacité opérationnelle",
        bodyDetail: "HCM conditionne service et S&OP.",
      },
    ],
    document: {
      id: "doc-m8-onboard",
      title: "Dossier intégration — nouvelle recrue DC",
      docType: "Dossier RH",
      reference: "NH-HCM-ONB-M8",
      summary: "Intégration technicien entrepôt DC-MTL — accès, formation, badge.",
      rows: [
        { label: "Site", value: "DC-MTL" },
        { label: "Département", value: "Entrepôt" },
        { label: "Statut", value: "En intégration" },
      ],
    },
    orderingSteps: [
      { key: "step-comprendre", label: "M8-M01 — Intégrer nouvel employé (comprendre)" },
      { key: "step-executer", label: "M8-M02 — Gérer temps et absences (exécuter)" },
      { key: "step-decider", label: "M8-M03 — Évaluer compétences et évolution (décider)" },
    ],
    choiceQuestion: {
      prompt: "Pourquoi lier absences et finance en HCM ?",
      options: [
        { key: "a", label: "Pour ignorer la capacité DC" },
        { key: "b", label: "Pour quantifier impact coût et service" },
        { key: "c", label: "Pour supprimer le onboarding" },
        { key: "d", label: "Pour éviter les KPI" },
      ],
      correctKey: "b",
    },
    missions: [
      {
        missionKey: "m8-m01-integrer-nouvel-employe",
        missionCode: "M8-M01",
        title: "Intégrer un nouvel employé",
        role: "Comprendre — onboarding HCM",
        objective: "Constituer dossier intégration avec accès et formation.",
        consequenceSummary: "L’intégration sécurise capacité opérationnelle DC-MTL.",
      },
      {
        missionKey: "m8-m02-gerer-temps-absences",
        missionCode: "M8-M02",
        title: "Gérer temps, absences et impact financier",
        role: "Exécuter — gestion temps",
        objective: "Traiter absences et documenter impact financier.",
        consequenceSummary: "L’exécution aligne RH, opérations et finance sur capacité.",
      },
      {
        missionKey: "m8-m03-evaluer-competences-evolution",
        missionCode: "M8-M03",
        title: "Évaluer compétences et préparer l’évolution",
        role: "Décider — évolution compétences",
        objective: "Évaluer compétences et recommander évolution de poste.",
        consequenceSummary: "La décision RH prépare montée en compétence entrepôt.",
      },
    ],
    bilanTheme: "HCM relie personnes, capacité DC et coût finance.",
    quiz: [
      {
        id: "q1",
        prompt: "Quelles clés V2 pour M8 HCM ?",
        options: [
          { key: "a", label: "m8-m01-integrer-nouvel-employe …" },
          { key: "b", label: "m9-m01-atelier-definition-kpi …" },
          { key: "c", label: "m10-m01-diapositive-conseil …" },
          { key: "d", label: "m1-m01-decouvrir-entreprise …" },
        ],
        correctKey: "a",
        explanation: "M8 V2 utilise les clés HCM m8-m01-integrer…",
      },
      {
        id: "q2",
        prompt: "Quelle mission est « décider » en M8 ?",
        options: [
          { key: "a", label: "M8-M01" },
          { key: "b", label: "M8-M02" },
          { key: "c", label: "M8-M03" },
          { key: "d", label: "M7-M03" },
        ],
        correctKey: "c",
        explanation: "M8-M03 clôt par décision sur compétences.",
      },
      {
        id: "q3",
        prompt: "SAP vs TEC.ERP pour HCM :",
        options: [
          { key: "a", label: "Concepts SAP en cours ; pratique NordHabitat lab" },
          { key: "b", label: "Pas de distinction" },
          { key: "c", label: "NordHabitat remplace SuccessFactors client" },
          { key: "d", label: "HCM hors programme" },
        ],
        correctKey: "a",
        explanation: "Distinction institutionnelle maintenue.",
      },
    ],
    kpi: {
      name: "Taux absentéisme DC",
      definition: "Absences non planifiées sur capacité entrepôt.",
      formula: "Heures absence ÷ Heures planifiées × 100",
      unit: "%",
      period: "M8 NordHabitat",
      target: "≤ 3 %",
      actual: "4,2 %",
      variance: "+1,2 pts",
      trend: "À surveiller",
      source: "NH-HCM-ONB-M8",
      interpretation: "Absences impactent OTIF et coût main-d’œuvre.",
      risk: "Retards livraison et surcharge équipe.",
      recommendedAction: "Planifier relève et formation croisée.",
      affectedProcess: "HCM / capacité opérationnelle",
      affectedDepartment: "RH · Entrepôt · Finance",
    },
  },
  {
    moduleCode: "M9",
    title: "Gouvernance, accès et conformité",
    subtitle: "Approbations, SoD et autoévaluation — Course Edition",
    processFocus: "gouvernance et conformité",
    learningObjectives: [
      "Appliquer matrice d’approbation sous pression.",
      "Réviser accès et ségrégation des tâches (SoD).",
      "Réaliser autoévaluation de conformité professionnelle.",
    ],
    glossary: [
      { term: "SoD", definition: "Segregation of Duties — séparation des tâches incompatibles." },
      { term: "Matrice d’approbation", definition: "Règles qui déterminent qui peut engager quoi." },
      { term: "Conformité professionnelle", definition: "Autoévaluation éthique et procédurale." },
    ],
    frameTopics: [
      {
        id: "m9-frame-approval",
        title: "Approbation sous pression",
        description: "Commande urgente vs gouvernance.",
        bodyHeading: "Comprendre la gouvernance",
        bodyDetail: "M9-M01 teste matrice d’approbation.",
      },
      {
        id: "m9-frame-sod",
        title: "Revue accès SoD",
        description: "Conflits de rôles ERP.",
        bodyHeading: "Exécuter la revue accès",
        bodyDetail: "M9-M02 identifie conflits SoD.",
      },
      {
        id: "m9-frame-probation",
        title: "Autoévaluation",
        description: "Probation professionnelle.",
        bodyHeading: "Décider conformité",
        bodyDetail: "M9-M03 clôt par autoévaluation.",
      },
      {
        id: "m9-frame-risk",
        title: "Risque opérationnel",
        description: "Gouvernance vs vitesse.",
        bodyHeading: "Équilibre contrôle",
        bodyDetail: "Contrôles protègent trésorerie et réputation.",
      },
    ],
    document: {
      id: "doc-m9-approval",
      title: "Demande approbation urgente P2P",
      docType: "Note de gouvernance",
      reference: "NH-GOV-APP-M9",
      summary: "Commande HVAC urgente — pression opérationnelle vs matrice d’approbation.",
      rows: [
        { label: "Montant", value: "12 500 CAD" },
        { label: "Seuil DG", value: "10 000 CAD" },
        { label: "Conflit SoD", value: "À vérifier" },
      ],
    },
    orderingSteps: [
      { key: "step-comprendre", label: "M9-M01 — Matrice d’approbation (comprendre)" },
      { key: "step-executer", label: "M9-M02 — Revue accès SoD (exécuter)" },
      { key: "step-decider", label: "M9-M03 — Autoévaluation conformité (décider)" },
    ],
    choiceQuestion: {
      prompt: "Que protège la ségrégation des tâches ?",
      options: [
        { key: "a", label: "Uniquement le marketing" },
        { key: "b", label: "Fraude et erreurs par séparation des rôles incompatibles" },
        { key: "c", label: "La suppression des KPI" },
        { key: "d", label: "Les copies d’écran SAP" },
      ],
      correctKey: "b",
    },
    missions: [
      {
        missionKey: "m8-m01-matrice-approbation-pression",
        missionCode: "M9-M01",
        title: "Appliquer la matrice d’approbation sous pression",
        role: "Comprendre — matrice d’approbation",
        objective: "Appliquer matrice d’approbation face à urgence opérationnelle.",
        consequenceSummary: "La compréhension gouvernance évite engagement non autorisé.",
      },
      {
        missionKey: "m8-m02-revue-acces-sod",
        missionCode: "M9-M02",
        title: "Réviser les accès et la ségrégation des tâches",
        role: "Exécuter — revue SoD",
        objective: "Identifier et traiter conflits SoD sur accès ERP lab.",
        consequenceSummary: "La revue exécutée réduit risque fraude et erreur.",
      },
      {
        missionKey: "m8-m03-autoevaluation-probation",
        missionCode: "M9-M03",
        title: "Réaliser une autoévaluation de conformité professionnelle",
        role: "Décider — conformité professionnelle",
        objective: "Documenter autoévaluation éthique et procédurale.",
        consequenceSummary: "La décision conformité clôt le module gouvernance.",
      },
    ],
    bilanTheme: "Gouvernance équilibre vitesse opérationnelle et contrôle SoD.",
    quiz: [
      {
        id: "q1",
        prompt: "Les missions M9 utilisent quelles clés V2 ?",
        options: [
          { key: "a", label: "m8-m01-matrice-approbation-pression …" },
          { key: "b", label: "m8-m01-integrer-nouvel-employe …" },
          { key: "c", label: "m2-m01-structurer-organisation …" },
          { key: "d", label: "m9-m01-atelier-definition-kpi …" },
        ],
        correctKey: "a",
        explanation: "M9 affiche M9-Mxx mais clés gouvernance m8-m01-matrice…",
      },
      {
        id: "q2",
        prompt: "Code mission affiché pour matrice d’approbation :",
        options: [
          { key: "a", label: "M8-M01" },
          { key: "b", label: "M9-M01" },
          { key: "c", label: "M10-M01" },
          { key: "d", label: "M1-M01" },
        ],
        correctKey: "b",
        explanation: "Display code M9 malgré clé m8-m01-matrice…",
      },
      {
        id: "q3",
        prompt: "NordHabitat en gouvernance sert à :",
        options: [
          { key: "a", label: "Lab TEC.ERP sans impact production SAP" },
          { key: "b", label: "Environnement SAP client" },
          { key: "c", label: "Audit externe réel" },
          { key: "d", label: "Rien" },
        ],
        correctKey: "a",
        explanation: "Lab-only pour exercices SoD.",
      },
    ],
    kpi: {
      name: "Conflits SoD ouverts",
      definition: "Nombre d’accès incompatibles non résolus.",
      formula: "Conflits ouverts en fin de revue",
      unit: "conflits",
      period: "M9 NordHabitat",
      target: "0",
      actual: "2",
      variance: "+2",
      trend: "Action requise",
      source: "NH-GOV-APP-M9",
      interpretation: "Deux conflits création commande / paiement persistent.",
      risk: "Fraude ou erreur matérielle.",
      recommendedAction: "Retirer rôle incompatible avant prochaine commande urgente.",
      affectedProcess: "Gouvernance / accès",
      affectedDepartment: "TI · Finance · Direction",
    },
  },
  {
    moduleCode: "M10",
    title: "BI, KPI, IA et conseil",
    subtitle: "Définition KPI, tableau de bord et recommandation — Course Edition",
    processFocus: "BI, KPI et recommandation conseil",
    learningObjectives: [
      "Définir KPI de gestion alignés processus NordHabitat.",
      "Analyser tableau de bord de direction.",
      "Formuler recommandation intégrant BI, IA et conseil.",
    ],
    glossary: [
      { term: "KPI", definition: "Indicateur mesurable lié à un objectif métier." },
      { term: "Tableau de bord", definition: "Synthèse visuelle KPI pour comité direction." },
      {
        term: "Recommandation conseil",
        definition: "Proposition structurée appuyée sur données et scénarios.",
      },
    ],
    frameTopics: [
      {
        id: "m10-frame-kpi",
        title: "Atelier KPI",
        description: "Définir indicateurs OTIF, marge, NPS.",
        bodyHeading: "Comprendre les KPI",
        bodyDetail: "M10-M01 définit KPI de gestion.",
      },
      {
        id: "m10-frame-dashboard",
        title: "Tableau de bord comité",
        description: "Lecture direction NordHabitat.",
        bodyHeading: "Exécuter l’analyse BI",
        bodyDetail: "M10-M02 analyse tendances.",
      },
      {
        id: "m10-frame-ai",
        title: "Scénario IA / conseil",
        description: "Concurrence et recommandation.",
        bodyHeading: "Décider et recommander",
        bodyDetail: "M10-M03 formule recommandation conseil.",
      },
      {
        id: "m10-frame-bridge",
        title: "Pont Capstone",
        description: "Synthèse modules M1–M9.",
        bodyHeading: "Vision intégrée",
        bodyDetail: "BI consolide signaux P2P, O2C, CRM, finance.",
      },
    ],
    document: {
      id: "doc-m10-dashboard",
      title: "Brief tableau de bord direction Q3",
      docType: "Note comité",
      reference: "NH-BI-COM-M10",
      summary: "Synthèse KPI OTIF, marge brute, NPS et risques supply chain pour comité.",
      rows: [
        { label: "OTIF", value: "91 %" },
        { label: "NPS", value: "7" },
        { label: "Exceptions AP", value: "12 %" },
      ],
    },
    orderingSteps: [
      { key: "step-comprendre", label: "M10-M01 — Atelier définition KPI (comprendre)" },
      { key: "step-executer", label: "M10-M02 — Tableau de bord comité (exécuter)" },
      { key: "step-decider", label: "M10-M03 — Analyse concurrentielle IA (décider)" },
    ],
    choiceQuestion: {
      prompt: "Quel livrable clôt M10 ?",
      options: [
        { key: "a", label: "Recommandation BI/IA/conseil documentée" },
        { key: "b", label: "Suppression de tous les KPI" },
        { key: "c", label: "Copie écran SAP non commentée" },
        { key: "d", label: "Doublon fournisseur" },
      ],
      correctKey: "a",
    },
    missions: [
      {
        missionKey: "m9-m01-atelier-definition-kpi",
        missionCode: "M10-M01",
        title: "Définir les KPI de gestion",
        role: "Comprendre — définition KPI",
        objective: "Définir KPI alignés processus et cibles NordHabitat.",
        consequenceSummary: "Les KPI définis cadrent lecture comité direction.",
      },
      {
        missionKey: "m9-m02-tableau-bord-comite",
        missionCode: "M10-M02",
        title: "Analyser le tableau de bord de direction",
        role: "Exécuter — analyse BI",
        objective: "Analyser tendances OTIF, marge, NPS et risques.",
        consequenceSummary: "L’analyse exécutée expose priorités cross-modules.",
      },
      {
        missionKey: "m9-m03-analyse-concurrentielle-ia",
        missionCode: "M10-M03",
        title: "Formuler une recommandation BI, IA et conseil",
        role: "Décider — recommandation conseil",
        objective: "Formuler recommandation intégrant BI, scénario IA et conseil.",
        consequenceSummary: "La recommandation clôt le parcours BI avant Capstone.",
      },
    ],
    bilanTheme: "BI agrège signaux M1–M9 en recommandation direction actionnable.",
    quiz: [
      {
        id: "q1",
        prompt: "Clé V2 pour M10-M01 ?",
        options: [
          { key: "a", label: "m9-m01-atelier-definition-kpi" },
          { key: "b", label: "m10-m01-diapositive-conseil" },
          { key: "c", label: "m8-m01-integrer-nouvel-employe" },
          { key: "d", label: "m1-m03-diagnostiquer-preparation" },
        ],
        correctKey: "a",
        explanation: "M10 V2 utilise clés m9-m01… avec display M10-Mxx.",
      },
      {
        id: "q2",
        prompt: "Un KPI professionnel doit être :",
        options: [
          { key: "a", label: "Lié à un processus et une cible" },
          { key: "b", label: "Déconnecté de toute décision" },
          { key: "c", label: "Secret et non partagé" },
          { key: "d", label: "Copie d’écran SAP brute" },
        ],
        correctKey: "a",
        explanation: "KPI = indicateur + objectif + interprétation.",
      },
      {
        id: "q3",
        prompt: "SAP / TEC.ERP / NordHabitat en M10 :",
        options: [
          { key: "a", label: "SAP cours · TEC.ERP fauteuil · NordHabitat lab" },
          { key: "b", label: "Tous identiques en production client" },
          { key: "c", label: "NordHabitat = ERP SAP réel" },
          { key: "d", label: "BI hors programme" },
        ],
        correctKey: "a",
        explanation: "Rappel pédagogique institutionnel.",
      },
    ],
    kpi: {
      name: "Indice performance intégrée (IPE)",
      definition: "Composite OTIF, marge et NPS pondéré pour comité.",
      formula: "(OTIF × 0,4) + (Marge normée × 0,3) + (NPS normé × 0,3)",
      unit: "indice",
      period: "M10 NordHabitat",
      target: "≥ 80",
      actual: "74",
      variance: "−6",
      trend: "Plan d’action requis",
      source: "NH-BI-COM-M10",
      interpretation: "Faiblesse OTIF et AP tirent l’indice vers le bas.",
      risk: "Décisions direction sans correction priorisée.",
      recommendedAction: "Prioriser supply chain et AP dans recommandation conseil.",
      affectedProcess: "BI / pilotage direction",
      affectedDepartment: "Direction · Opérations · Finance",
    },
  },
];

export const GENERATED_MODULE_PACKS: Readonly<Record<string, CourseEditionModulePack>> =
  Object.fromEntries(MODULE_SEEDS.map((seed) => [seed.moduleCode, buildPack(seed)]));

export function buildGeneratedModulePack(
  moduleCode: string,
): CourseEditionModulePack | undefined {
  return GENERATED_MODULE_PACKS[moduleCode.toUpperCase()];
}
