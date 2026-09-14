/**
 * Wave 2A Playback Zero — bilingual learner-facing copy (Revision 2).
 * Professional French; no internal wave terminology in learner UI.
 */

export type PlaybackLocale = "fr" | "en";

export interface PlaybackCopy {
  marker: string;
  previewBadge: string;
  demoData: string;
  nav: {
    promise: string;
    enterprise: string;
    missions: string;
    modes: string;
    journey: string;
    process: string;
    impact: string;
    ai: string;
    professor: string;
    capstone: string;
    login: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    previewTitle: string;
    demandLabel: string;
    demandValue: string;
    processLabel: string;
    processValue: string;
    messageLabel: string;
    messageValue: string;
    impactLabel: string;
    impactValue: string;
    decisionLabel: string;
    decisionValue: string;
  };
  enterprise: {
    title: string;
    lead: string;
    twin: string;
    engine: string;
    selectHint: string;
    flowLabel: string;
    detail: {
      person: string;
      role: string;
      process: string;
      document: string;
      situation: string;
      message: string;
      consequence: string;
      kpi: string;
      dependency: string;
    };
    nodes: Record<
      string,
      {
        person: string;
        role: string;
        process: string;
        document: string;
        situation: string;
        message: string;
        consequence: string;
        kpi: string;
        dependency: string;
      }
    >;
  };
  missions: {
    title: string;
    lead: string;
    chain: string;
    items: { title: string; body: string; output: string }[];
  };
  modes: {
    title: string;
    lead: string;
    axes: { help: string; autonomy: string; consequences: string; evidence: string };
    continuum: { from: string; to: string }[];
    items: { title: string; short: string; detail: string }[];
  };
  journey: {
    title: string;
    lead: string;
    enterpriseAxis: string;
    professionalAxis: string;
    selectHint: string;
    detail: {
      domain: string;
      role: string;
      process: string;
      mandate: string;
      stakeholders: string;
      evidence: string;
      impact: string;
    };
  };
  process: {
    title: string;
    lead: string;
    documentFlow: string;
    consequenceFlow: string;
    activeDoc: string;
    activeStakeholder: string;
  };
  impact: {
    title: string;
    lead: string;
    decision: string;
    decisionValue: string;
    signals: {
      label: string;
      baseline: string;
      next: string;
      cause: string;
      horizon: string;
      stakeholder: string;
      confidence: string;
    }[];
    labels: {
      cause: string;
      horizon: string;
      stakeholder: string;
      projection: string;
      baseline: string;
      after: string;
    };
  };
  ai: {
    title: string;
    lead: string;
    visibleTitle: string;
    visibleBody: string;
    ambientTitle: string;
    ambientBody: string;
    timelineTitle: string;
    items: {
      source: string;
      channel: string;
      time: string;
      message: string;
      classification: string;
      nature: string;
      kind: "fact" | "stakeholder" | "ai" | "sim" | "risk";
    }[];
  };
  professor: {
    title: string;
    lead: string;
    classInProgress: string;
    cohort: string;
    mandate: string;
    decisions: string;
    misconception: string;
    simStatus: string;
    nextEvent: string;
    debrief: string;
    deck: string;
    controls: string[];
  };
  capstone: {
    title: string;
    badge: string;
    lead: string;
    framing: string;
    approval: string;
    evidence: string;
  };
  login: {
    title: string;
    lead: string;
    email: string;
    password: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    back: string;
    signal: string;
    promise: string;
  };
  cockpit: {
    greeting: string;
    role: string;
    module: string;
    classContext: string;
    professor: string;
    mandateTitle: string;
    situation: string;
    decision: string;
    cta: string;
    pulseTitle: string;
    inboxTitle: string;
    evidenceTitle: string;
    learningTitle: string;
    mode: string;
    progress: string;
    capstoneNote: string;
    evidenceStatus: string;
    nextEvidence: string;
    previewTitle: string;
    previewLead: string;
    previewClose: string;
  };
  controls: {
    open: string;
    close: string;
    title: string;
    locale: string;
    theme: string;
    viewport: string;
    level: string;
    module: string;
    ambient: string;
    page: string;
    branding: string;
    brandingCollege: string;
    brandingIndependent: string;
    simRole: string;
    pages: { portal: string; login: string; cockpit: string };
  };
}

const FR: PlaybackCopy = {
  marker: "PLAYBACK ZERO · NOT PRODUCTION",
  previewBadge: "APERÇU — NON IMPLÉMENTÉ",
  demoData: "Données de démonstration",
  nav: {
    promise: "Promesse",
    enterprise: "Entreprise",
    missions: "Missions",
    modes: "Modes",
    journey: "Parcours",
    process: "Processus",
    impact: "Impact",
    ai: "IA",
    professor: "Professeur",
    capstone: "Capstone",
    login: "Connexion",
  },
  hero: {
    kicker: "TEC.ERP · Digital Twin pédagogique",
    title: "Entrez dans une entreprise vivante.\nDevenez analyste et consultant ERP.",
    subtitle:
      "Analysez les processus, exécutez des opérations ERP contrôlées, échangez avec les parties prenantes, observez les conséquences et défendez vos recommandations.",
    ctaPrimary: "Commencer l’expérience",
    ctaSecondary: "Explorer le parcours",
    previewTitle: "Equinoxe · signal en cours",
    demandLabel: "Demande client",
    demandValue: "SO-1048 · 140 unités · échéance vendredi",
    processLabel: "Processus",
    processValue: "Ventes → Stocks → Achats → Fournisseur",
    messageLabel: "Message",
    messageValue: "Fournisseur : +4 jours si quantité > 120",
    impactLabel: "Impact",
    impactValue: "OTIF 91 % → 86 %",
    decisionLabel: "Décision",
    decisionValue: "Confirmer 140, négocier 120 ou replanifier ?",
  },
  enterprise: {
    title: "Equinoxe — carte du pouls de l’entreprise",
    lead:
      "Le Digital Twin est le corps. Le moteur de vie de l’entreprise fait circuler messages, documents et indicateurs clés de performance (KPI).",
    twin: "Digital Twin — structure opérationnelle",
    engine: "Moteur de vie — circulation et réaction",
    selectHint: "Sélectionnez un nœud pour ouvrir le panneau opérationnel.",
    flowLabel:
      "Flux actif : Client → Ventes → Stocks → Achats → Fournisseur → Entrepôt → Finance → BI → Direction",
    detail: {
      person: "Responsable",
      role: "Rôle",
      process: "Processus actif",
      document: "Document",
      situation: "Situation",
      message: "Message récent",
      consequence: "Impact",
      kpi: "Indicateur clé de performance (KPI) / risque",
      dependency: "Dépendance suivante",
    },
    nodes: {
      customers: {
        person: "Nathalie Roy",
        role: "Acheteuse client",
        process: "Demande client",
        document: "Demande · 140 u.",
        situation: "Commande urgente pour vendredi",
        message: "Pouvez-vous confirmer la disponibilité ?",
        consequence: "Promesse sous pression",
        kpi: "CSAT à risque",
        dependency: "Confirmation ventes",
      },
      sales: {
        person: "Marc Tremblay",
        role: "Directeur commercial",
        process: "Order-to-Cash (commande à encaissement)",
        document: "SO-1048",
        situation: "Promesse client à risque",
        message: "Confirmation demandée avant 15 h",
        consequence: "OTIF projeté −5 pts",
        kpi: "OTIF 91 % → 86 %",
        dependency: "Disponibilité fournisseur",
      },
      inventory: {
        person: "Sofia Nguyen",
        role: "Planificatrice des stocks",
        process: "Allocation",
        document: "Allocation famille A",
        situation: "Stocks famille A sous tension",
        message: "Couverture insuffisante pour 140 u.",
        consequence: "Besoin de réapprovisionnement",
        kpi: "Couverture < 3 jours",
        dependency: "Demande d’achat",
      },
      procurement: {
        person: "Léa Martin",
        role: "Acheteuse",
        process: "Procure-to-Pay (approvisionnement)",
        document: "Demande d’achat DA-77",
        situation: "Quantité proposée 100 → 140",
        message: "Fournisseur à solliciter immédiatement",
        consequence: "Engagement coût et délai",
        kpi: "Écart quantité +40 %",
        dependency: "Réponse fournisseur",
      },
      suppliers: {
        person: "NordLog Parts",
        role: "Fournisseur",
        process: "Confirmation de délai",
        document: "Confirmation partielle",
        situation: "Capacité saturée",
        message: "+4 jours si quantité > 120",
        consequence: "Retard potentiel",
        kpi: "Délai +4 j",
        dependency: "Réception entrepôt",
      },
      warehouse: {
        person: "Hugo Bélanger",
        role: "Chef d’entrepôt",
        process: "Réception / quai",
        document: "Créneau quai Q-3",
        situation: "Créneau vendredi saturé",
        message: "Réception anticipée impossible sans réaffectation",
        consequence: "Blocage logistique",
        kpi: "Occupation quai 96 %",
        dependency: "Finance / trésorerie",
      },
      finance: {
        person: "Amira Benali",
        role: "Contrôleuse financière",
        process: "Record-to-Report (clôture et reporting)",
        document: "Engagement trésorerie",
        situation: "Pression sur la trésorerie à court terme",
        message: "L’écart de quantité impacte la trésorerie de la semaine",
        consequence: "Arbitrage coût / service",
        kpi: "Trésorerie −12 k$",
        dependency: "Lecture BI",
      },
      hcm: {
        person: "Kim Lefebvre",
        role: "Responsable HCM",
        process: "Hire-to-Retire (cycle RH)",
        document: "Plan de capacité",
        situation: "Équipe entrepôt en surcharge",
        message: "Heures supplémentaires déjà maximales",
        consequence: "Capacité humaine contrainte",
        kpi: "Productivité −8 %",
        dependency: "Gouvernance des accès",
      },
      governance: {
        person: "Paul Girard",
        role: "Responsable du contrôle interne",
        process: "Contrôles et accès",
        document: "Alerte ségrégation",
        situation: "Pression pour contourner un contrôle",
        message: "Ne validez pas sans piste d’audit",
        consequence: "Risque de conformité",
        kpi: "Risque élevé",
        dependency: "Décision BI",
      },
      bi: {
        person: "Studio BI",
        role: "Signal décisionnel",
        process: "Data-to-Decision (données vers décision)",
        document: "Projection OTIF",
        situation: "Dégradation de service projetée",
        message: "Trois scénarios disponibles pour la direction",
        consequence: "Choix exécutif requis",
        kpi: "Confiance de projection 78 %",
        dependency: "Direction",
      },
      management: {
        person: "Direction Equinoxe",
        role: "Comité opérationnel",
        process: "Arbitrage exécutif",
        document: "Décision à rendre",
        situation: "Service vs coût vs risque",
        message: "Quelle recommandation défendez-vous ?",
        consequence: "Décision à documenter",
        kpi: "Priorité : service client",
        dependency: "Preuve consultante",
      },
    },
  },
  missions: {
    title: "Trois missions de transformation",
    lead: "Chaque mandat fait évoluer la production de l’apprenant : de l’hypothèse à la recommandation exécutive.",
    chain: "Hypothèse → Preuve transactionnelle → Recommandation exécutive",
    items: [
      {
        title: "Enquête et diagnostic",
        body: "Recueillir des preuves, cartographier le flux et formuler une hypothèse testable.",
        output: "Hypothèse fondée",
      },
      {
        title: "Intervention ERP et contrôle",
        body: "Exécuter des opérations contrôlées, produire des documents et franchir un point de contrôle.",
        output: "Preuve transactionnelle",
      },
      {
        title: "Conseil, récupération et décision",
        body: "Lire les conséquences, comparer les alternatives et défendre une recommandation.",
        output: "Recommandation exécutive",
      },
    ],
  },
  modes: {
    title: "Continuum d’expérience",
    lead: "L’aide diminue, l’autonomie augmente, les conséquences s’officialisent.",
    axes: {
      help: "Aide",
      autonomy: "Autonomie",
      consequences: "Conséquences",
      evidence: "Preuves",
    },
    continuum: [
      { from: "Forte", to: "Restreinte" },
      { from: "Faible", to: "Élevée" },
      { from: "Aucune mutation", to: "État officiel" },
      { from: "Orientation", to: "Immuables" },
    ],
    items: [
      {
        title: "Exploration",
        short: "Découvrir sans mutation",
        detail: "Navigation sûre, orientation forte, preuves non officielles.",
      },
      {
        title: "Pratique guidée",
        short: "S’exercer avec filet",
        detail: "IA visible (Coach IA) disponible, contrôles pédagogiques, erreurs récupérables.",
      },
      {
        title: "Simulation",
        short: "Décider sous tension",
        detail: "État simulé mutable, parties prenantes actives, conséquences visibles.",
      },
      {
        title: "Évaluation",
        short: "Produire des preuves officielles",
        detail: "IA restreinte, preuves immuables, jugement professoral.",
      },
    ],
  },
  journey: {
    title: "Parcours M1–M10 · double évolution",
    lead: "L’entreprise évolue. Le professionnel évolue. Capstone reste distinct — pas un onzième module.",
    enterpriseAxis: "Évolution de l’entreprise",
    professionalAxis: "Évolution professionnelle",
    selectHint: "Sélectionnez un module pour le détail.",
    detail: {
      domain: "Domaine",
      role: "Rôle",
      process: "Processus",
      mandate: "Mandat",
      stakeholders: "Complexité parties prenantes",
      evidence: "Preuves",
      impact: "Impact",
    },
  },
  process: {
    title: "Processus de bout en bout",
    lead: "Deux couches coordonnées : documents et conséquences d’affaires.",
    documentFlow: "Flux documentaire",
    consequenceFlow: "Flux de conséquences",
    activeDoc: "Document actif",
    activeStakeholder: "Partie prenante",
  },
  impact: {
    title: "Impact exécutif",
    lead: "Surface décisionnelle — pas une collection de cartes métriques.",
    decision: "Décision",
    decisionValue: "Quantité proposée portée de 100 à 140 unités",
    signals: [
      {
        label: "OTIF",
        baseline: "91 %",
        next: "86 %",
        cause: "Délai fournisseur +4 j",
        horizon: "Cette semaine",
        stakeholder: "Ventes / Client",
        confidence: "Projection 78 %",
      },
      {
        label: "Stocks",
        baseline: "Couverture 4 j",
        next: "Couverture 2 j",
        cause: "Allocation famille A",
        horizon: "Immédiat",
        stakeholder: "Planification",
        confidence: "Mesure système",
      },
      {
        label: "Marge",
        baseline: "18,2 %",
        next: "16,9 %",
        cause: "Surcoût accélération",
        horizon: "Cycle commande",
        stakeholder: "Finance",
        confidence: "Projection 72 %",
      },
      {
        label: "Trésorerie",
        baseline: "Planifiée",
        next: "−12 k$",
        cause: "Quantité du bon de commande +40 %",
        horizon: "7 jours",
        stakeholder: "Trésorerie",
        confidence: "Projection 80 %",
      },
      {
        label: "CSAT",
        baseline: "Stable",
        next: "Sous tension",
        cause: "Promesse vendredi",
        horizon: "Après livraison",
        stakeholder: "Service client",
        confidence: "Qualitatif",
      },
      {
        label: "Risque",
        baseline: "Modéré",
        next: "Élevé",
        cause: "Pression de contournement",
        horizon: "Contrôle",
        stakeholder: "Gouvernance",
        confidence: "Alerte contrôle",
      },
    ],
    labels: {
      cause: "Cause",
      horizon: "Horizon",
      stakeholder: "Partie prenante",
      projection: "Projection",
      baseline: "Référence",
      after: "Après",
    },
  },
  ai: {
    title: "IA visible et IA ambiante",
    lead:
      "Même intelligence, deux postures : IA visible (Coach IA) explicite et IA ambiante pour la communication d’entreprise gouvernée.",
    visibleTitle: "IA visible",
    visibleBody:
      "IA visible (Coach IA) : coach pédagogique explicite. Oriente, ne répond pas à la place de l’apprenant.",
    ambientTitle: "IA ambiante",
    ambientBody: "Messages d’entreprise gouvernés : fournisseur, entrepôt, finance, supervision.",
    timelineTitle: "Flux de communication",
    items: [
      {
        source: "Système ERP",
        channel: "Événement système",
        time: "08:12",
        message: "SO-1048 créée · 140 unités · échéance vendredi",
        classification: "Fait du système",
        nature: "Factuel",
        kind: "fact",
      },
      {
        source: "NordLog Parts",
        channel: "Message fournisseur",
        time: "09:04",
        message: "+4 jours si quantité > 120",
        classification: "Message du fournisseur",
        nature: "Factuel (partie prenante)",
        kind: "stakeholder",
      },
      {
        source: "Entrepôt Equinoxe",
        channel: "Alerte opérationnelle",
        time: "09:18",
        message: "Créneau quai vendredi saturé",
        classification: "Alerte de l’entrepôt",
        nature: "Factuel",
        kind: "risk",
      },
      {
        source: "Contrôle financier",
        channel: "Avertissement",
        time: "09:41",
        message: "Engagement trésorerie hors plan de la semaine",
        classification: "Avertissement financier",
        nature: "Factuel",
        kind: "risk",
      },
      {
        source: "Superviseure",
        channel: "Question managériale",
        time: "10:02",
        message: "Quelle option défendez-vous avant 15 h ?",
        classification: "Question du superviseur",
        nature: "Factuel",
        kind: "stakeholder",
      },
      {
        source: "IA visible",
        channel: "Coach IA",
        time: "10:05",
        message: "Quelles preuves manquent encore avant de recommander ?",
        classification: "IA visible (Coach IA)",
        nature: "Pédagogique (non factuel)",
        kind: "ai",
      },
      {
        source: "Simulation",
        channel: "Projection",
        time: "10:06",
        message: "Scénario 140 u. : OTIF 86 %, trésorerie −12 k$",
        classification: "Projection simulée",
        nature: "Simulé",
        kind: "sim",
      },
    ],
  },
  professor: {
    title: "Orchestration professorale",
    lead: "Le professeur reste l’autorité pédagogique : rythme, événements, comparaison, débrief.",
    classInProgress: "Cohorte Equinoxe · séance en cours",
    cohort: "24 apprenants",
    mandate: "Mandat actif : SO-1048 sous tension",
    decisions: "Décisions : 11 confirmer · 8 négocier · 5 replanifier",
    misconception:
      "Idée fausse fréquente : « augmenter la quantité du bon de commande résout toujours le service »",
    simStatus: "Simulation : active · pause disponible",
    nextEvent: "Prochain événement : alerte quai",
    debrief:
      "Question de débrief : Quel indicateur clé de performance (KPI) doit primer ici ?",
    deck: "Support pédagogique : prêt (aperçu)",
    controls: [
      "Mettre en pause",
      "Déclencher l’événement",
      "Comparer les décisions",
      "Ouvrir le débrief",
      "Afficher une preuve",
    ],
  },
  capstone: {
    title: "Capstone — engagement final de conseil",
    badge: "Capstone distinct · pas M11",
    lead: "Après M1–M10 : diagnostic, crise, feuille de route et défense devant un jury.",
    framing: "Engagement exécutif · preuves · défense",
    approval: "Approbation professorale requise",
    evidence: "Dossier de preuves + recommandation défendue",
  },
  login: {
    title: "Connexion",
    lead: "Poursuivez vers votre mandat actif dans Equinoxe.",
    email: "Adresse courriel",
    password: "Mot de passe",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    submit: "Entrer dans Equinoxe",
    back: "Retour au portail",
    signal: "Signal actuel : SO-1048 · OTIF sous tension",
    promise: "De l’enquête au conseil exécutif — dans une entreprise qui réagit.",
  },
  cockpit: {
    greeting: "Bonjour Camille",
    role: "Analyste junior · Mandat de diagnostic",
    module: "M1 · Entreprise intégrée et processus",
    classContext: "Cohorte Equinoxe · Groupe A",
    professor: "Professeur disponible",
    mandateTitle: "Mandat actif",
    situation:
      "Equinoxe reçoit une demande client urgente (140 unités). Le stock famille A est sous tension et le fournisseur signale un délai.",
    decision: "Votre enquête doit établir ce qui menace la promesse client — avant toute intervention.",
    cta: "Commencer l’enquête",
    pulseTitle: "Pouls de l’entreprise",
    inboxTitle: "Boîte de réception",
    evidenceTitle: "Preuves du mandat",
    learningTitle: "Contexte d’apprentissage",
    mode: "Mode : Pratique guidée",
    progress: "Progression M1 / M10",
    capstoneNote: "Capstone distinct — hors M1–M10",
    evidenceStatus: "0 / 3 preuves collectées",
    nextEvidence: "Prochaine preuve : carte du processus Order-to-Cash",
    previewTitle: "Mission 1 — Enquête et diagnostic",
    previewLead:
      "Aperçu sécurisé du mandat. L’expérience complète de mission sera disponible dans une prochaine livraison produit.",
    previewClose: "Fermer l’aperçu",
  },
  controls: {
    open: "Contrôles de lecture",
    close: "Fermer",
    title: "Contrôles Playback Zero",
    locale: "Langue",
    theme: "Thème",
    viewport: "Viewport",
    level: "Niveau apprenant",
    module: "Module",
    ambient: "Événement partie prenante",
    page: "Page",
    branding: "Identité institutionnelle",
    brandingCollege: "Collège de la Concorde",
    brandingIndependent: "TEC.ERP indépendant",
    simRole: "Rôle simulé (contrôle)",
    pages: { portal: "Portail", login: "Connexion", cockpit: "Cockpit de mission" },
  },
};

const EN: PlaybackCopy = {
  ...FR,
  marker: "PLAYBACK ZERO · NOT PRODUCTION",
  previewBadge: "PREVIEW — NOT IMPLEMENTED",
  demoData: "Demonstration data",
  nav: {
    promise: "Promise",
    enterprise: "Enterprise",
    missions: "Missions",
    modes: "Modes",
    journey: "Journey",
    process: "Process",
    impact: "Impact",
    ai: "AI",
    professor: "Professor",
    capstone: "Capstone",
    login: "Sign in",
  },
  hero: {
    kicker: "TEC.ERP · Pedagogical Digital Twin",
    title: "Enter a living enterprise.\nBecome an ERP analyst and consultant.",
    subtitle:
      "Analyze processes, execute controlled ERP operations, engage stakeholders, observe consequences, and defend your recommendations.",
    ctaPrimary: "Start the experience",
    ctaSecondary: "Explore the journey",
    previewTitle: "Equinoxe · live signal",
    demandLabel: "Customer demand",
    demandValue: "SO-1048 · 140 units · due Friday",
    processLabel: "Process",
    processValue: "Sales → Inventory → Procurement → Supplier",
    messageLabel: "Message",
    messageValue: "Supplier: +4 days if quantity > 120",
    impactLabel: "Impact",
    impactValue: "OTIF 91% → 86%",
    decisionLabel: "Decision",
    decisionValue: "Confirm 140, negotiate 120, or reschedule?",
  },
  enterprise: {
    title: "Equinoxe — enterprise pulse map",
    lead: "The Digital Twin is the body. The Enterprise Life Engine circulates messages, documents, and KPIs.",
    twin: "Digital Twin — operating structure",
    engine: "Life Engine — circulation and reaction",
    selectHint: "Select a node to open the operational panel.",
    flowLabel: "Active flow: Customer → Sales → Inventory → Procurement → Supplier → Warehouse → Finance → BI → Management",
    detail: {
      person: "Owner",
      role: "Role",
      process: "Active process",
      document: "Document",
      situation: "Situation",
      message: "Recent message",
      consequence: "Impact",
      kpi: "KPI / risk",
      dependency: "Next dependency",
    },
    nodes: {
      customers: {
        person: "Nathalie Roy",
        role: "Customer buyer",
        process: "Customer demand",
        document: "Request · 140 u.",
        situation: "Urgent Friday order",
        message: "Can you confirm availability?",
        consequence: "Promise under pressure",
        kpi: "CSAT at risk",
        dependency: "Sales confirmation",
      },
      sales: {
        person: "Marc Tremblay",
        role: "Sales director",
        process: "Order-to-Cash",
        document: "SO-1048",
        situation: "Customer promise at risk",
        message: "Confirmation needed before 3 p.m.",
        consequence: "Projected OTIF −5 pts",
        kpi: "OTIF 91% → 86%",
        dependency: "Supplier availability",
      },
      inventory: {
        person: "Sofia Nguyen",
        role: "Inventory planner",
        process: "Allocation",
        document: "Family A allocation",
        situation: "Family A stock under tension",
        message: "Coverage insufficient for 140 units",
        consequence: "Replenishment required",
        kpi: "Coverage < 3 days",
        dependency: "Purchase requisition",
      },
      procurement: {
        person: "Léa Martin",
        role: "Buyer",
        process: "Procure-to-Pay",
        document: "PR DA-77",
        situation: "Proposed quantity 100 → 140",
        message: "Supplier must be contacted now",
        consequence: "Cost and lead-time commitment",
        kpi: "Quantity variance +40%",
        dependency: "Supplier response",
      },
      suppliers: {
        person: "NordLog Parts",
        role: "Supplier",
        process: "Lead-time confirmation",
        document: "Partial confirmation",
        situation: "Capacity saturated",
        message: "+4 days if quantity > 120",
        consequence: "Potential delay",
        kpi: "Lead time +4 days",
        dependency: "Warehouse receipt",
      },
      warehouse: {
        person: "Hugo Bélanger",
        role: "Warehouse lead",
        process: "Receipt / dock",
        document: "Dock slot Q-3",
        situation: "Friday dock slot saturated",
        message: "Early receipt impossible without reassignment",
        consequence: "Logistics block",
        kpi: "Dock occupancy 96%",
        dependency: "Finance / cash",
      },
      finance: {
        person: "Amira Benali",
        role: "Financial controller",
        process: "Record-to-Report",
        document: "Cash commitment",
        situation: "Short-term cash pressure",
        message: "Quantity variance hits this week’s cash-flow",
        consequence: "Cost / service trade-off",
        kpi: "Cash −12k",
        dependency: "BI reading",
      },
      hcm: {
        person: "Kim Lefebvre",
        role: "HCM lead",
        process: "Hire-to-Retire",
        document: "Capacity plan",
        situation: "Warehouse team overloaded",
        message: "Overtime already at maximum",
        consequence: "Human capacity constrained",
        kpi: "Productivity −8%",
        dependency: "Access governance",
      },
      governance: {
        person: "Paul Girard",
        role: "Internal control",
        process: "Controls and access",
        document: "Segregation alert",
        situation: "Pressure to bypass a control",
        message: "Do not approve without an audit trail",
        consequence: "Compliance risk",
        kpi: "High risk",
        dependency: "BI decision",
      },
      bi: {
        person: "BI Studio",
        role: "Decision signal",
        process: "Data-to-Decision",
        document: "OTIF projection",
        situation: "Projected service degradation",
        message: "Three scenarios ready for management",
        consequence: "Executive choice required",
        kpi: "Projection confidence 78%",
        dependency: "Management",
      },
      management: {
        person: "Equinoxe leadership",
        role: "Operations committee",
        process: "Executive trade-off",
        document: "Decision pending",
        situation: "Service vs cost vs risk",
        message: "Which recommendation do you defend?",
        consequence: "Decision to document",
        kpi: "Priority: customer service",
        dependency: "Consultant evidence",
      },
    },
  },
  missions: {
    title: "Three transformation missions",
    lead: "Each mandate evolves the learner’s output: from hypothesis to executive recommendation.",
    chain: "Hypothesis → Transactional evidence → Executive recommendation",
    items: [
      {
        title: "Inquiry and diagnosis",
        body: "Gather evidence, map the flow, and form a testable hypothesis.",
        output: "Grounded hypothesis",
      },
      {
        title: "ERP intervention and control",
        body: "Execute controlled operations, produce documents, and pass a control checkpoint.",
        output: "Transactional evidence",
      },
      {
        title: "Advice, recovery and decision",
        body: "Read consequences, compare alternatives, and defend a recommendation.",
        output: "Executive recommendation",
      },
    ],
  },
  modes: {
    title: "Experience continuum",
    lead: "Guidance decreases, autonomy rises, consequences become official.",
    axes: {
      help: "Help",
      autonomy: "Autonomy",
      consequences: "Consequences",
      evidence: "Evidence",
    },
    continuum: [
      { from: "Strong", to: "Restricted" },
      { from: "Low", to: "High" },
      { from: "No mutation", to: "Official state" },
      { from: "Orientation", to: "Immutable" },
    ],
    items: [
      {
        title: "Exploration",
        short: "Discover without mutation",
        detail: "Safe navigation, strong guidance, non-official evidence.",
      },
      {
        title: "Guided practice",
        short: "Practice with a safety net",
        detail: "AI coach available, pedagogical controls, recoverable mistakes.",
      },
      {
        title: "Simulation",
        short: "Decide under tension",
        detail: "Mutable simulated state, active stakeholders, visible consequences.",
      },
      {
        title: "Evaluation",
        short: "Produce official evidence",
        detail: "Restricted AI, immutable evidence, professor judgment.",
      },
    ],
  },
  journey: {
    title: "M1–M10 journey · dual evolution",
    lead: "The enterprise evolves. The professional evolves. Capstone stays distinct — not an eleventh module.",
    enterpriseAxis: "Enterprise evolution",
    professionalAxis: "Professional evolution",
    selectHint: "Select a module for detail.",
    detail: {
      domain: "Domain",
      role: "Role",
      process: "Process",
      mandate: "Mandate",
      stakeholders: "Stakeholder complexity",
      evidence: "Evidence",
      impact: "Impact",
    },
  },
  process: {
    title: "End-to-end process",
    lead: "Two coordinated layers: documents and business consequences.",
    documentFlow: "Document flow",
    consequenceFlow: "Consequence flow",
    activeDoc: "Active document",
    activeStakeholder: "Stakeholder",
  },
  impact: {
    title: "Executive impact",
    lead: "Decision surface — not a metric-card collection.",
    decision: "Decision",
    decisionValue: "Proposed quantity raised from 100 to 140 units",
    signals: [
      {
        label: "OTIF",
        baseline: "91%",
        next: "86%",
        cause: "Supplier lead time +4 days",
        horizon: "This week",
        stakeholder: "Sales / Customer",
        confidence: "Projection 78%",
      },
      {
        label: "Inventory",
        baseline: "Coverage 4 days",
        next: "Coverage 2 days",
        cause: "Family A allocation",
        horizon: "Immediate",
        stakeholder: "Planning",
        confidence: "System measure",
      },
      {
        label: "Margin",
        baseline: "18.2%",
        next: "16.9%",
        cause: "Expedite surcharge",
        horizon: "Order cycle",
        stakeholder: "Finance",
        confidence: "Projection 72%",
      },
      {
        label: "Cash",
        baseline: "Planned",
        next: "−12k",
        cause: "Purchase-order quantity +40%",
        horizon: "7 days",
        stakeholder: "Treasury",
        confidence: "Projection 80%",
      },
      {
        label: "CSAT",
        baseline: "Stable",
        next: "Under tension",
        cause: "Friday promise",
        horizon: "After delivery",
        stakeholder: "Customer service",
        confidence: "Qualitative",
      },
      {
        label: "Risk",
        baseline: "Moderate",
        next: "High",
        cause: "Bypass pressure",
        horizon: "Control",
        stakeholder: "Governance",
        confidence: "Control alert",
      },
    ],
    labels: {
      cause: "Cause",
      horizon: "Horizon",
      stakeholder: "Stakeholder",
      projection: "Projection",
      baseline: "Baseline",
      after: "After",
    },
  },
  ai: {
    title: "Visible AI and Ambient AI",
    lead: "Same intelligence, two postures: explicit coach and governed enterprise communication.",
    visibleTitle: "Visible AI",
    visibleBody: "Explicit pedagogical coach. Guides — does not answer for the learner.",
    ambientTitle: "Ambient AI",
    ambientBody: "Governed enterprise messages: supplier, warehouse, finance, supervision.",
    timelineTitle: "Communication stream",
    items: [
      {
        source: "ERP system",
        channel: "System event",
        time: "08:12",
        message: "SO-1048 created · 140 units · due Friday",
        classification: "System fact",
        nature: "Factual",
        kind: "fact",
      },
      {
        source: "NordLog Parts",
        channel: "Supplier message",
        time: "09:04",
        message: "+4 days if quantity > 120",
        classification: "Supplier message",
        nature: "Factual (stakeholder)",
        kind: "stakeholder",
      },
      {
        source: "Equinoxe warehouse",
        channel: "Operational alert",
        time: "09:18",
        message: "Friday dock slot saturated",
        classification: "Warehouse alert",
        nature: "Factual",
        kind: "risk",
      },
      {
        source: "Financial control",
        channel: "Warning",
        time: "09:41",
        message: "Cash commitment outside this week’s plan",
        classification: "Financial warning",
        nature: "Factual",
        kind: "risk",
      },
      {
        source: "Supervisor",
        channel: "Managerial question",
        time: "10:02",
        message: "Which option do you defend before 3 p.m.?",
        classification: "Supervisor question",
        nature: "Factual",
        kind: "stakeholder",
      },
      {
        source: "AI Coach",
        channel: "Visible AI",
        time: "10:05",
        message: "Which evidence is still missing before you recommend?",
        classification: "AI Coach",
        nature: "Pedagogical (non-factual)",
        kind: "ai",
      },
      {
        source: "Simulation",
        channel: "Projection",
        time: "10:06",
        message: "140-unit scenario: OTIF 86%, cash −12k",
        classification: "Simulated projection",
        nature: "Simulated",
        kind: "sim",
      },
    ],
  },
  professor: {
    title: "Professor orchestration",
    lead: "The professor remains pedagogical authority: pacing, events, comparison, debrief.",
    classInProgress: "Equinoxe cohort · session in progress",
    cohort: "24 learners",
    mandate: "Active mandate: SO-1048 under tension",
    decisions: "Decisions: 11 confirm · 8 negotiate · 5 reschedule",
    misconception:
      "Common misconception: “raising the purchase-order quantity always fixes service”",
    simStatus: "Simulation: active · pause available",
    nextEvent: "Next event: dock alert",
    debrief: "Debrief question: Which KPI should lead here?",
    deck: "Teaching support: ready (preview)",
    controls: ["Pause", "Trigger event", "Compare decisions", "Open debrief", "Show evidence"],
  },
  capstone: {
    title: "Capstone — final consulting engagement",
    badge: "Distinct Capstone · not M11",
    lead: "After M1–M10: diagnosis, crisis, roadmap, and defense before a jury.",
    framing: "Executive engagement · evidence · defense",
    approval: "Professor approval required",
    evidence: "Evidence dossier + defended recommendation",
  },
  login: {
    title: "Sign in",
    lead: "Continue toward your active mandate in Equinoxe.",
    email: "Email address",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Enter Equinoxe",
    back: "Back to portal",
    signal: "Current signal: SO-1048 · OTIF under tension",
    promise: "From inquiry to executive advice — inside a reacting enterprise.",
  },
  cockpit: {
    greeting: "Hello Camille",
    role: "Junior analyst · Diagnostic mandate",
    module: "M1 · Integrated enterprise and processes",
    classContext: "Equinoxe cohort · Group A",
    professor: "Professor available",
    mandateTitle: "Active mandate",
    situation:
      "Equinoxe receives an urgent customer demand (140 units). Family A stock is under tension and the supplier signals a delay.",
    decision: "Your inquiry must establish what threatens the customer promise — before any intervention.",
    cta: "Start the inquiry",
    pulseTitle: "Enterprise pulse",
    inboxTitle: "Inbox",
    evidenceTitle: "Mandate evidence",
    learningTitle: "Learning context",
    mode: "Mode: Guided practice",
    progress: "Progress M1 / M10",
    capstoneNote: "Capstone distinct — outside M1–M10",
    evidenceStatus: "0 / 3 evidence items collected",
    nextEvidence: "Next evidence: Order-to-Cash process map",
    previewTitle: "Mission 1 — Inquiry and diagnosis",
    previewLead: "Safe mandate preview. The full mission experience will ship in a later product delivery.",
    previewClose: "Close preview",
  },
  controls: {
    open: "Playback controls",
    close: "Close",
    title: "Playback Zero controls",
    locale: "Language",
    theme: "Theme",
    viewport: "Viewport",
    level: "Learner level",
    module: "Module",
    ambient: "Stakeholder event",
    page: "Page",
    branding: "Institutional identity",
    brandingCollege: "Collège de la Concorde",
    brandingIndependent: "Independent TEC.ERP",
    simRole: "Simulated role (control)",
    pages: { portal: "Portal", login: "Sign in", cockpit: "Mission cockpit" },
  },
};

export const COPY: Record<PlaybackLocale, PlaybackCopy> = { fr: FR, en: EN };
