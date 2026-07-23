export type PlaybackLocale = "fr" | "en";

export interface PlaybackCopy {
  marker: string;
  nav: {
    experience: string;
    journey: string;
    enterprise: string;
    biAi: string;
    capstone: string;
    login: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    support: string;
    primaryCta: string;
    secondaryCta: string;
    notLms: string;
  };
  enterprise: {
    title: string;
    support: string;
    hint: string;
  };
  consulting: {
    title: string;
    support: string;
    understand: string;
    act: string;
    advise: string;
    m1Title: string;
    m1Body: string;
    m2Title: string;
    m2Body: string;
    m3Title: string;
    m3Body: string;
  };
  modes: {
    title: string;
    support: string;
    exploration: { name: string; guidance: string; consequence: string; ai: string; evidence: string; score: string };
    guided: { name: string; guidance: string; consequence: string; ai: string; evidence: string; score: string };
    simulation: { name: string; guidance: string; consequence: string; ai: string; evidence: string; score: string };
    evaluation: { name: string; guidance: string; consequence: string; ai: string; evidence: string; score: string };
  };
  journey: {
    title: string;
    support: string;
    enterpriseLabel: string;
    professionalLabel: string;
    selectHint: string;
    business: string;
    role: string;
    process: string;
    mandate: string;
    stakeholders: string;
    evidence: string;
    impact: string;
  };
  process: {
    title: string;
    support: string;
  };
  impact: {
    title: string;
    support: string;
    demoLabel: string;
    baseline: string;
    change: string;
    cause: string;
    timing: string;
    stakeholder: string;
  };
  ai: {
    title: string;
    support: string;
    visibleTitle: string;
    visibleBody: string;
    ambientTitle: string;
    ambientBody: string;
    chainTitle: string;
    fact: string;
    stakeholder: string;
    coach: string;
    projection: string;
  };
  professor: {
    title: string;
    support: string;
    previewLabel: string;
    capabilities: string[];
  };
  capstone: {
    title: string;
    support: string;
    separate: string;
    approval: string;
  };
  cta: {
    title: string;
    support: string;
    login: string;
    explore: string;
  };
  login: {
    title: string;
    support: string;
    email: string;
    password: string;
    showPassword: string;
    hidePassword: string;
    submit: string;
    back: string;
    prototypeNote: string;
    demoEmail: string;
    validationEmail: string;
    validationPassword: string;
    roleLearner: string;
    roleProfessor: string;
  };
  orientation: {
    title: string;
    where: string;
    who: string;
    mandate: string;
    company: string;
    next: string;
    pulse: string;
    evidence: string;
    mode: string;
    message: string;
    professor: string;
    continue: string;
    backPortal: string;
  };
  controls: {
    title: string;
    open: string;
    close: string;
    locale: string;
    theme: string;
    viewport: string;
    level: string;
    module: string;
    event: string;
    screen: string;
    light: string;
    dark: string;
    projector: string;
    novice: string;
    intermediate: string;
    advanced: string;
  };
  nodes: Record<string, { role: string; process: string; document: string; consequence: string }>;
}

export const COPY: Record<PlaybackLocale, PlaybackCopy> = {
  fr: {
    marker: "PLAYBACK ZERO · NOT PRODUCTION",
    nav: {
      experience: "Expérience",
      journey: "Parcours",
      enterprise: "Entreprise",
      biAi: "BI & IA",
      capstone: "Capstone",
      login: "Se connecter",
    },
    hero: {
      eyebrow: "TEC.ERP · Collège de la Concorde",
      title: "Entrez dans une entreprise vivante.\nDevenez analyste et consultant ERP.",
      support:
        "Investigatez les processus, exécutez des actions ERP contrôlées, communiquez avec les parties prenantes, observez les conséquences et défendez vos recommandations.",
      primaryCta: "Commencer l’expérience",
      secondaryCta: "Explorer le parcours",
      notLms: "Ce n’est pas un LMS. C’est une simulation professionnelle.",
    },
    enterprise: {
      title: "Une entreprise persistante : Equinoxe",
      support:
        "Le même Digital Twin évolue du premier module au Capstone. Clients, ventes, stocks, achats, finance, HCM, gouvernance et BI restent connectés.",
      hint: "Survolez ou sélectionnez un nœud pour voir rôle, processus, document et conséquence.",
    },
    consulting: {
      title: "Vous travaillez par mandats de consultation",
      support: "Chaque module contient trois missions distinctes — jamais trois tâches similaires.",
      understand: "COMPRENDRE",
      act: "AGIR",
      advise: "CONSEILLER",
      m1Title: "Mission 1 — Enquête et diagnostic",
      m1Body: "Former une hypothèse, cartographier les preuves, cadrer le problème.",
      m2Title: "Mission 2 — Intervention ERP et contrôle",
      m2Body: "Exécuter sous contrôle et produire une preuve transactionnelle.",
      m3Title: "Mission 3 — Conseil, récupération et décision",
      m3Body: "Lire les conséquences, récupérer et défendre une recommandation.",
    },
    modes: {
      title: "Quatre modes d’expérience",
      support: "Le mode actif est toujours explicite. L’aide et les conséquences changent avec le mode.",
      exploration: {
        name: "Exploration",
        guidance: "Orientation forte",
        consequence: "Aucune mutation officielle",
        ai: "Aide d’orientation",
        evidence: "Orientative seulement",
        score: "Sans score",
      },
      guided: {
        name: "Pratique guidée",
        guidance: "Étapes et exemples",
        consequence: "Voie d’entraînement bornée",
        ai: "Soutien pédagogique borné",
        evidence: "Séparée de la maîtrise officielle",
        score: "Feedback, pas maîtrise finale",
      },
      simulation: {
        name: "Simulation",
        guidance: "Assistance limitée",
        consequence: "Conséquences Twin persistantes",
        ai: "Coach Visible · Ambient gouverné",
        evidence: "Preuves officielles enregistrées",
        score: "Jugement + preuves",
      },
      evaluation: {
        name: "Évaluation",
        guidance: "Assistance restreinte",
        consequence: "Environnement contrôlé",
        ai: "Aide minimale",
        evidence: "Preuves immuables",
        score: "Séquence, diagnostic, jugement",
      },
    },
    journey: {
      title: "Parcours M1–M10 et identité professionnelle",
      support: "Deux voyages simultanés : l’entreprise évolue, et votre rôle professionnel aussi.",
      enterpriseLabel: "Évolution de l’entreprise",
      professionalLabel: "Évolution professionnelle",
      selectHint: "Sélectionnez un module",
      business: "Domaine",
      role: "Rôle",
      process: "Processus",
      mandate: "Mandat",
      stakeholders: "Complexité parties prenantes",
      evidence: "Preuves attendues",
      impact: "Impacts",
    },
    process: {
      title: "Chaîne de bout en bout",
      support: "Aucun module n’est isolé. Une demande client traverse ventes, stock, achats, finance, KPI et conseil.",
    },
    impact: {
      title: "Impact exécutif — aperçu",
      support: "Après une décision importante, le learner lit conséquences immédiates, processuelles, entreprise et temporelles.",
      demoLabel: "APERÇU DE L’EXPÉRIENCE FUTURE · DONNÉES DE DÉMONSTRATION",
      baseline: "Baseline",
      change: "Variation",
      cause: "Cause",
      timing: "Horizon",
      stakeholder: "Partie prenante",
    },
    ai: {
      title: "Deux formes d’IA, clairement distinctes",
      support: "L’IA soutient le jugement. Elle ne le remplace pas. Le Twin reste la source de vérité.",
      visibleTitle: "IA Visible — coach de raisonnement",
      visibleBody: "Explique, questionne, expose les lacunes, compare des alternatives, exige votre synthèse.",
      ambientTitle: "IA Ambient — vie de l’entreprise",
      ambientBody: "Donne une voix gouvernée aux parties prenantes : fournisseur, entrepôt, finance, superviseur.",
      chainTitle: "Chaîne représentative (contenu rédigé)",
      fact: "Fait système",
      stakeholder: "Message partie prenante",
      coach: "Coach IA",
      projection: "Projection simulée",
    },
    professor: {
      title: "Le Professor reste central",
      support: "TEC.ERP amplifie l’enseignement. Il ne réduit pas le Professor à un administrateur de scores.",
      previewLabel: "APERÇU — non implémenté",
      capabilities: [
        "Présenter et démontrer",
        "Mettre en pause la simulation",
        "Déclencher un événement",
        "Observer et comparer",
        "Questionner et débriefer",
        "Valider la progression",
      ],
    },
    capstone: {
      title: "Capstone — engagement culminant",
      support: "Hors de M1–M10. Diagnostiquer, analyser, utiliser BI et IA de façon responsable, défendre une recommandation.",
      separate: "Capstone distinct · pas M11",
      approval: "Approbation Professor requise · pas d’approbation automatique",
    },
    cta: {
      title: "Prêt à entrer dans Equinoxe ?",
      support: "Connectez-vous pour l’orientation initiale — prototype local, hors production.",
      login: "Ouvrir la connexion prototype",
      explore: "Revenir à l’entreprise",
    },
    login: {
      title: "Connexion à TEC.ERP",
      support: "Simulation professionnelle Equinoxe · Collège de la Concorde",
      email: "Adresse courriel",
      password: "Mot de passe",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      submit: "Entrer dans l’orientation",
      back: "Retour au portail",
      prototypeNote: "Données de démonstration — non connectées à l’authentification production.",
      demoEmail: "analyste.demo@playback.tec-erp.local",
      validationEmail: "Indiquez une adresse courriel valide.",
      validationPassword: "Le mot de passe est requis dans ce prototype.",
      roleLearner: "Apprenant",
      roleProfessor: "Professor",
    },
    orientation: {
      title: "Orientation initiale",
      where: "Où suis-je ?",
      who: "Qui suis-je ?",
      mandate: "Quel est mon mandat ?",
      company: "Où en est l’entreprise ?",
      next: "Que dois-je faire maintenant ?",
      pulse: "Pouls d’Equinoxe",
      evidence: "État des preuves",
      mode: "Mode d’apprentissage",
      message: "Message partie prenante",
      professor: "Contexte de classe",
      continue: "Continuer vers le parcours (Wave 3)",
      backPortal: "Retour au portail",
    },
    controls: {
      title: "Contrôles Playback",
      open: "Contrôles",
      close: "Fermer",
      locale: "Langue",
      theme: "Apparence",
      viewport: "Viewport",
      level: "Niveau learner",
      module: "Module",
      event: "Événement Ambient",
      screen: "Écran",
      light: "Clair",
      dark: "Sombre",
      projector: "Projecteur",
      novice: "Novice",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
    },
    nodes: {
      customers: {
        role: "Client clé",
        process: "Lead-to-Cash / Service",
        document: "Commande · réclamation",
        consequence: "Satisfaction · revenu",
      },
      sales: {
        role: "Vendeur",
        process: "Order-to-Cash",
        document: "Bon de commande vente",
        consequence: "Promesse client",
      },
      inventory: {
        role: "Planificateur stock",
        process: "Allocation / réappro",
        document: "Mouvement de stock",
        consequence: "OTIF · rupture",
      },
      procurement: {
        role: "Acheteur",
        process: "Procure-to-Pay",
        document: "Bon de commande",
        consequence: "Délai fournisseur · coût",
      },
      suppliers: {
        role: "Fournisseur",
        process: "Réponse / livraison",
        document: "Confirmation · ASN",
        consequence: "OTIF · risque appro",
      },
      warehouse: {
        role: "Réceptionnaire",
        process: "Réception / capacité",
        document: "Bon de réception",
        consequence: "Capacité · écart",
      },
      finance: {
        role: "Contrôleur",
        process: "Facture / paiement / R2R",
        document: "Facture · écriture",
        consequence: "Cash · marge",
      },
      hcm: {
        role: "RH / superviseur",
        process: "Hire-to-Retire",
        document: "Dossier employé",
        consequence: "Capacité humaine",
      },
      governance: {
        role: "Auditeur / conformité",
        process: "Contrôles / SoD",
        document: "Constat d’audit",
        consequence: "Risque · accès",
      },
      bi: {
        role: "Analyste décision",
        process: "Data-to-Decision",
        document: "Rapport KPI",
        consequence: "Recommandation",
      },
      management: {
        role: "Sponsor exécutif",
        process: "Comité / arbitrage",
        document: "Synthèse exécutive",
        consequence: "Décision · priorité",
      },
    },
  },
  en: {
    marker: "PLAYBACK ZERO · NOT PRODUCTION",
    nav: {
      experience: "Experience",
      journey: "Journey",
      enterprise: "Enterprise",
      biAi: "BI & AI",
      capstone: "Capstone",
      login: "Sign in",
    },
    hero: {
      eyebrow: "TEC.ERP · Collège de la Concorde",
      title: "Enter a living enterprise.\nBecome an ERP analyst and consultant.",
      support:
        "Investigate processes, execute controlled ERP actions, communicate with stakeholders, observe business consequences and defend recommendations.",
      primaryCta: "Start the experience",
      secondaryCta: "Explore the journey",
      notLms: "This is not an LMS. It is a professional simulation.",
    },
    enterprise: {
      title: "One persistent enterprise: Equinoxe",
      support:
        "The same Digital Twin evolves from the first module to Capstone. Customers, sales, inventory, procurement, finance, HCM, governance and BI stay connected.",
      hint: "Hover or select a node to reveal role, process, document and consequence.",
    },
    consulting: {
      title: "You work through consulting mandates",
      support: "Each module has three distinct missions — never three similar tasks.",
      understand: "UNDERSTAND",
      act: "ACT",
      advise: "ADVISE",
      m1Title: "Mission 1 — Investigation and diagnosis",
      m1Body: "Form a hypothesis, map evidence, frame the problem.",
      m2Title: "Mission 2 — ERP intervention and control",
      m2Body: "Execute under control and produce transactional proof.",
      m3Title: "Mission 3 — Advice, recovery and decision",
      m3Body: "Read consequences, recover and defend a recommendation.",
    },
    modes: {
      title: "Four experience modes",
      support: "The active mode is always explicit. Help and consequences change with the mode.",
      exploration: {
        name: "Exploration",
        guidance: "Strong orientation",
        consequence: "No official mutation",
        ai: "Orienting help",
        evidence: "Orienting only",
        score: "No scoring",
      },
      guided: {
        name: "Guided practice",
        guidance: "Steps and examples",
        consequence: "Bounded practice lane",
        ai: "Bounded instructional support",
        evidence: "Separated from official mastery",
        score: "Feedback, not final mastery",
      },
      simulation: {
        name: "Simulation",
        guidance: "Limited assistance",
        consequence: "Persistent Twin consequences",
        ai: "Visible coach · governed Ambient",
        evidence: "Official evidence recorded",
        score: "Judgment + evidence",
      },
      evaluation: {
        name: "Evaluation",
        guidance: "Restricted assistance",
        consequence: "Controlled environment",
        ai: "Minimal help",
        evidence: "Immutable evidence",
        score: "Sequence, diagnosis, judgment",
      },
    },
    journey: {
      title: "M1–M10 journey and professional identity",
      support: "Two journeys at once: the company evolves, and so does your professional role.",
      enterpriseLabel: "Enterprise evolution",
      professionalLabel: "Professional evolution",
      selectHint: "Select a module",
      business: "Business area",
      role: "Role",
      process: "Process",
      mandate: "Mandate",
      stakeholders: "Stakeholder complexity",
      evidence: "Expected evidence",
      impact: "Impacts",
    },
    process: {
      title: "End-to-end process chain",
      support: "No module is isolated. Customer demand flows through sales, inventory, procurement, finance, KPIs and advice.",
    },
    impact: {
      title: "Executive impact — preview",
      support: "After an important decision, the learner reads immediate, process, enterprise and delayed consequences.",
      demoLabel: "FUTURE EXPERIENCE PREVIEW · DEMONSTRATION DATA",
      baseline: "Baseline",
      change: "Change",
      cause: "Cause",
      timing: "Horizon",
      stakeholder: "Stakeholder",
    },
    ai: {
      title: "Two forms of AI, clearly distinct",
      support: "AI supports judgment. It does not replace it. The Twin remains the source of truth.",
      visibleTitle: "Visible AI — reasoning coach",
      visibleBody: "Explains, questions, exposes gaps, compares alternatives, requires your synthesis.",
      ambientTitle: "Ambient AI — enterprise life",
      ambientBody: "Gives governed voice to stakeholders: supplier, warehouse, finance, supervisor.",
      chainTitle: "Representative chain (authored content)",
      fact: "System fact",
      stakeholder: "Stakeholder message",
      coach: "AI coach",
      projection: "Simulated projection",
    },
    professor: {
      title: "The Professor remains central",
      support: "TEC.ERP amplifies teaching. It does not reduce the Professor to a score administrator.",
      previewLabel: "PREVIEW — not implemented",
      capabilities: [
        "Present and demonstrate",
        "Pause the simulation",
        "Trigger an event",
        "Observe and compare",
        "Question and debrief",
        "Validate progression",
      ],
    },
    capstone: {
      title: "Capstone — culminating engagement",
      support: "Outside M1–M10. Diagnose, analyze, use BI and AI responsibly, defend a recommendation.",
      separate: "Separate Capstone · not M11",
      approval: "Professor approval required · no automatic approval",
    },
    cta: {
      title: "Ready to enter Equinoxe?",
      support: "Sign in for initial orientation — local prototype, outside production.",
      login: "Open prototype login",
      explore: "Back to the enterprise",
    },
    login: {
      title: "Sign in to TEC.ERP",
      support: "Equinoxe professional simulation · Collège de la Concorde",
      email: "Email address",
      password: "Password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      submit: "Enter orientation",
      back: "Back to portal",
      prototypeNote: "Demonstration data — not connected to production authentication.",
      demoEmail: "analyste.demo@playback.tec-erp.local",
      validationEmail: "Enter a valid email address.",
      validationPassword: "Password is required in this prototype.",
      roleLearner: "Learner",
      roleProfessor: "Professor",
    },
    orientation: {
      title: "Initial orientation",
      where: "Where am I?",
      who: "Who am I?",
      mandate: "What is my mandate?",
      company: "What is the company state?",
      next: "What should I do now?",
      pulse: "Equinoxe pulse",
      evidence: "Evidence status",
      mode: "Learning mode",
      message: "Stakeholder message",
      professor: "Class context",
      continue: "Continue to journey (Wave 3)",
      backPortal: "Back to portal",
    },
    controls: {
      title: "Playback controls",
      open: "Controls",
      close: "Close",
      locale: "Language",
      theme: "Appearance",
      viewport: "Viewport",
      level: "Learner level",
      module: "Module",
      event: "Ambient event",
      screen: "Screen",
      light: "Light",
      dark: "Dark",
      projector: "Projector",
      novice: "Novice",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    nodes: {
      customers: {
        role: "Key customer",
        process: "Lead-to-Cash / Service",
        document: "Order · complaint",
        consequence: "Satisfaction · revenue",
      },
      sales: {
        role: "Salesperson",
        process: "Order-to-Cash",
        document: "Sales order",
        consequence: "Customer promise",
      },
      inventory: {
        role: "Inventory planner",
        process: "Allocation / replenishment",
        document: "Stock movement",
        consequence: "OTIF · stockout",
      },
      procurement: {
        role: "Buyer",
        process: "Procure-to-Pay",
        document: "Purchase order",
        consequence: "Supplier lead time · cost",
      },
      suppliers: {
        role: "Supplier",
        process: "Response / delivery",
        document: "Confirmation · ASN",
        consequence: "OTIF · supply risk",
      },
      warehouse: {
        role: "Receiver",
        process: "Receipt / capacity",
        document: "Goods receipt",
        consequence: "Capacity · variance",
      },
      finance: {
        role: "Controller",
        process: "Invoice / payment / R2R",
        document: "Invoice · posting",
        consequence: "Cash · margin",
      },
      hcm: {
        role: "HR / supervisor",
        process: "Hire-to-Retire",
        document: "Employee record",
        consequence: "Workforce capacity",
      },
      governance: {
        role: "Auditor / compliance",
        process: "Controls / SoD",
        document: "Audit finding",
        consequence: "Risk · access",
      },
      bi: {
        role: "Decision analyst",
        process: "Data-to-Decision",
        document: "KPI report",
        consequence: "Recommendation",
      },
      management: {
        role: "Executive sponsor",
        process: "Committee / arbitration",
        document: "Executive synthesis",
        consequence: "Decision · priority",
      },
    },
  },
};
