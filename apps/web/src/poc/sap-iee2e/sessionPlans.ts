/**
 * Comfort Pack professeur — 10 séances Collège × 180 min.
 * Source pédagogique : architecture 1C-A (IEE2E = épine dorsale SAP,
 * TEC.ERP = médiation institutionnelle). Aucun contenu propriétaire SAP.
 */

export interface SessionPlan {
  readonly sessionNumber: number;
  readonly titleFr: string;
  readonly relatedUnit: number;
  readonly objective: string;
  readonly individualWork: string;
  readonly sequence: readonly string[];
  readonly observe: readonly string[];
  readonly discussion: readonly string[];
  readonly closeReminder: string;
  readonly nextStep: string;
}

export const SESSION_PLANS: readonly SessionPlan[] = [
  {
    sessionNumber: 1,
    titleFr: "Voir l’entreprise comme un système intégré",
    relatedUnit: 1,
    objective:
      "Permettre à l’étudiant d’expliquer pourquoi les processus de bout en bout exigent une intégration, et de relier départements, processus et solutions.",
    individualWork:
      "Quiz SAP de l’unité 1 après la séance + démarrer la lecture de l’unité 2 (hors équivalence automatique avec 1 h officielle).",
    sequence: [
      "Accueil et objectif professionnel d’analyste ERP (15 min)",
      "Mise en contexte de l’entreprise intégrée (25 min)",
      "Exploration guidée sur SAP Learning (40 min)",
      "Cas Collège — rupture d’intégration (25 min)",
      "Pause (15 min)",
      "Travail SAP individuel (30 min)",
      "Mise en commun et glossaire de cohorte (15 min)",
      "Checkpoint et prochain pas (15 min)",
    ],
    observe: [
      "Étudiants sans accès SAP Learning confirmé",
      "Confusion processus métier vs application logicielle",
      "Lecture silencieuse trop longue sans médiation",
    ],
    discussion: [
      "Que se passe-t-il si un département optimise son silo?",
      "Où l’analyste ERP doit-il chercher la cause d’une rupture?",
      "Quelle preuve minimale avant de conclure à un problème d’intégration?",
    ],
    closeReminder: "Prochain pas individuel rappelé (unité 1 / quiz SAP)",
    nextStep:
      "séance 2 — comprendre SAP Business Suite ; lecture partielle de l’unité 2 avant le cours.",
  },
  {
    sessionNumber: 2,
    titleFr: "Comprendre SAP Business Suite",
    relatedUnit: 2,
    objective:
      "Permettre à l’étudiant de cartographier la Suite (applications, données, IA, métiers) sans en faire un catalogue de produits.",
    individualWork:
      "Finaliser le quiz de l’unité 2 si besoin (~30–45 min) et consolider le glossaire Suite.",
    sequence: [
      "Accueil et revue du quiz unité 1 (15 min)",
      "Carte Suite (professeur) : ERP, données, IA, adoption (30 min)",
      "Exploration guidée métiers / processus de bout en bout (35 min)",
      "Activité : relier un métier à un processus (20 min)",
      "Pause (15 min)",
      "Travail SAP individuel (35 min)",
      "Mise en commun des pièges de jargon (15 min)",
      "Checkpoint et quiz unité 2 (15 min)",
    ],
    observe: [
      "Surcharge de jargon (cloud, RISE, greenfield)",
      "Étudiants qui mémorisent des noms de produits sans rôle métier",
      "Glossaire EN–FR encore instable",
    ],
    discussion: [
      "Pourquoi une Suite n’est pas une collection d’applications isolées?",
      "Quel est le rôle de l’analyste face à l’IA embarquée?",
      "Que doit-on vérifier avant de comparer deux solutions de la Suite?",
    ],
    closeReminder: "Prochain pas individuel rappelé (unité 2 / glossaire Suite)",
    nextStep:
      "séance 3 — structures et objets centraux ; revoir les tableaux de l’unité 3 avant le cours.",
  },
  {
    sessionNumber: 3,
    titleFr: "Structurer l’entreprise et ses données",
    relatedUnit: 3,
    objective:
      "Permettre à l’étudiant d’expliquer les structures organisationnelles et les objets centraux, puis de les relier aux processus de bout en bout.",
    individualWork:
      "Préparation avant séance + finalisation après séance (hors équivalence automatique avec 1 h 40 min officiels).",
    sequence: [
      "Accueil et objectif professionnel (15 min)",
      "Mise en contexte des structures (40 min)",
      "Exploration guidée sur SAP Learning (25 min)",
      "Exercice Collège — matrice structures (25 min)",
      "Pause (15 min)",
      "Travail SAP individuel (30 min)",
      "Mise en commun des erreurs fréquentes (15 min)",
      "Checkpoint et prochain pas (15 min)",
    ],
    observe: [
      "Confusion société / division / organisation commerciale",
      "Données de base vs données transactionnelles",
      "Étudiants sans accès SAP confirmé",
    ],
    discussion: [
      "Pourquoi une même entreprise a-t-elle plusieurs structures?",
      "Quel impact si une affectation est incorrecte?",
      "Que doit vérifier un analyste ERP avant d’analyser un processus?",
    ],
    closeReminder: "Prochain pas individuel rappelé (unité 3 / quiz SAP)",
    nextStep:
      "séance 4 — finance (enregistrement au reporting), avec préparation SAP avant cours.",
  },
  {
    sessionNumber: 4,
    titleFr: "Piloter la finance (enregistrement au reporting — I)",
    relatedUnit: 4,
    objective:
      "Permettre à l’étudiant de distinguer finance et contrôle, et de suivre l’impact d’un document sur le grand livre, les tiers et les actifs — sans forcer le quiz final.",
    individualWork:
      "Forte charge individuelle : poursuivre l’unité 4 (~90–120 min) avant la séance 5. Durée officielle SAP de l’unité : 6 h 24 min.",
    sequence: [
      "Accueil + finance vs contrôle (20 min)",
      "Parcours guidé grand livre et documents (35 min)",
      "Cas : facture fournisseur / client et impacts (25 min)",
      "Pause (15 min)",
      "Travail SAP individuel (45 min)",
      "Mise en commun rôles partenaire / documents (20 min)",
      "Checkpoint « enregistrement au reporting I » (20 min)",
    ],
    observe: [
      "Confusion finance vs contrôle de gestion",
      "Documents vus comme des écrans, pas comme des événements",
      "Étudiants qui tentent d’avaler toute l’unité 4 en une séance",
    ],
    discussion: [
      "Quel document déclenche quel impact financier?",
      "Pourquoi un partenaire commercial a-t-il plusieurs rôles?",
      "Que doit vérifier l’analyste avant de conclure à une erreur de grand livre?",
    ],
    closeReminder: "Prochain pas individuel rappelé (poursuivre l’unité 4, pas le quiz final)",
    nextStep:
      "séance 5 — ledgers, coûts et quiz de l’unité 4 ; ne pas arriver à froid.",
  },
  {
    sessionNumber: 5,
    titleFr: "Contrôler les coûts et intégrer (enregistrement au reporting — II)",
    relatedUnit: 4,
    objective:
      "Clôturer l’unité 4 : ledgers, overhead, intégration finance–contrôle, puis soumettre le quiz SAP avec atelier de rattrapage.",
    individualWork:
      "Finaliser l’unité 4 et le quiz SAP pendant / après la séance. Seule unité observée avec retry en exploration réelle.",
    sequence: [
      "Accueil et questions ouvertes de la séance 4 (15 min)",
      "Ledgers parallèles et contrôle (30 min)",
      "Exploration guidée overhead / aide à la décision (25 min)",
      "Atelier lecture de rétroaction de quiz (20 min)",
      "Pause (15 min)",
      "SAP : finaliser l’unité 4 et soumettre le quiz (45 min)",
      "Mise en commun des erreurs fréquentes (15 min)",
      "Checkpoint unité 4 et pont vers l’humain (15 min)",
    ],
    observe: [
      "Étudiants bloqués par le quiz (prévoir retry sans stigmatiser)",
      "Intégration finance–contrôle encore abstraite",
      "Retards d’accès qui empêchent la soumission",
    ],
    discussion: [
      "Pourquoi un même événement peut-il impacter plusieurs ledgers?",
      "Que lit l’analyste dans un écart de coûts?",
      "Comment utiliser la rétroaction d’un quiz sans copier la banque SAP?",
    ],
    closeReminder: "Prochain pas individuel rappelé (unité 4 clôturée / plan de rattrapage)",
    nextStep: "séance 6 — expérience humaine ; aperçu SuccessFactors (~45 min) avant le cours.",
  },
  {
    sessionNumber: 6,
    titleFr: "Gérer l’expérience humaine (recrutement à la retraite)",
    relatedUnit: 5,
    objective:
      "Permettre à l’étudiant de relier le cycle humain (recrutement → paie) au cycle financier, et d’identifier les systèmes touchés.",
    individualWork: "Parcours SuccessFactors déclaré + quiz de l’unité 5.",
    sequence: [
      "Accueil et pont finance ↔ expérience humaine (15 min)",
      "Parcours recrutement → intégration → paie (35 min)",
      "Cas : nouvel employé — quels systèmes sont touchés? (25 min)",
      "Pause (15 min)",
      "Travail SAP individuel + quiz (50 min)",
      "Mise en commun (20 min)",
      "Checkpoint unité 5 (20 min)",
    ],
    observe: [
      "Cycle humain traité comme un RH isolé, sans impact finance",
      "Confusion entre dossier employé et partenaire commercial",
      "Étudiants en retard sur l’unité 4 qui décrochent",
    ],
    discussion: [
      "Où le cycle humain rejoint-il le grand livre?",
      "Que doit vérifier l’analyste avant une première paie?",
      "Quel risque si l’onboarding n’est pas intégré?",
    ],
    closeReminder: "Prochain pas individuel rappelé (unité 5 / quiz SAP)",
    nextStep:
      "séance 7 — approvisionnement ; préparation SAP obligatoire avant le cours.",
  },
  {
    sessionNumber: 7,
    titleFr: "Approvisionner l’entreprise (approvisionnement)",
    relatedUnit: 6,
    objective:
      "Permettre à l’étudiant de suivre la chaîne demande → commande → réception → facture → paiement, et d’en lire les impacts stock / finance / fournisseur.",
    individualWork:
      "Préparation SAP obligatoire avant séance ; ~60–90 min après séance si l’unité n’est pas close.",
    sequence: [
      "Accueil et chaîne d’approvisionnement (20 min)",
      "Exploration guidée demande → commande → réception → facture (35 min)",
      "Exercice : impacts stock / finance / fournisseur (25 min)",
      "Pause (15 min)",
      "Travail SAP individuel + quiz (50 min)",
      "Mise en commun réception / écarts / contrats-cadres (20 min)",
      "Checkpoint unité 6 (15 min)",
    ],
    observe: [
      "Documents vus hors séquence (facture avant réception)",
      "Impact stock oublié au profit du seul paiement",
      "Unité commencée à froid malgré la préparation demandée",
    ],
    discussion: [
      "Que se passe-t-il si l’on facture avant de recevoir?",
      "Quel document prouve que l’entreprise a vraiment reçu?",
      "Où l’analyste cherche-t-il un écart fournisseur?",
    ],
    closeReminder: "Prochain pas individuel rappelé (unité 6 / quiz SAP)",
    nextStep:
      "séance 8 — production et planification ; ne pas démarrer l’unité 7 à froid.",
  },
  {
    sessionNumber: 8,
    titleFr: "Produire et planifier (conception aux opérations)",
    relatedUnit: 7,
    objective:
      "Permettre à l’étudiant de suivre la séquence demande → plan → MRP → ordre, et d’anticiper les impacts d’une rupture de composant.",
    individualWork:
      "Ne pas démarrer l’unité 7 à froid. Rattrapage fréquent de 60–120 min (durée officielle 6 h 12 min).",
    sequence: [
      "Accueil et séquence demande → plan → MRP (25 min)",
      "Guidé : données de production et estimation de coûts (30 min)",
      "Cas : rupture de composant — qui est impacté? (25 min)",
      "Pause (15 min)",
      "Travail SAP individuel + quiz (50 min)",
      "Mise en commun consommation / clôture d’ordre (20 min)",
      "Checkpoint unité 7 (15 min)",
    ],
    observe: [
      "Deuxième pic de densité — fatigue et décrochage",
      "MRP compris comme « magie » plutôt que comme besoin calculé",
      "Étudiants sans préparation préalable",
    ],
    discussion: [
      "Que calcule vraiment un besoin de matières?",
      "Qui est touché si un composant manque?",
      "Quel impact financier d’une consommation ou d’un règlement d’ordre?",
    ],
    closeReminder: "Prochain pas individuel rappelé (unité 7 / plan de rattrapage)",
    nextStep: "séance 9 — ventes et encaissement ; chaîne documents ventes → finance.",
  },
  {
    sessionNumber: 9,
    titleFr: "Vendre et encaisser (Lead-to-Cash — ventes)",
    relatedUnit: 8,
    objective:
      "Permettre à l’étudiant de suivre commande → livraison → facturation → encaissement, et de relier l’organisation commerciale à la finance.",
    individualWork: "Chaîne documents ventes → finance + quiz de l’unité 8.",
    sequence: [
      "Accueil et organisation commerciale (20 min)",
      "Guidé : commande → livraison → facture → paiement (35 min)",
      "Exercice chaîne de documents + finance (25 min)",
      "Pause (15 min)",
      "Travail SAP individuel + quiz (50 min)",
      "Mise en commun (20 min)",
      "Checkpoint unité 8 et préparation service (15 min)",
    ],
    observe: [
      "Confusion organisation commerciale vs société",
      "Livraison vue sans impact de sortie de stock / finance",
      "Conditions de prix traitées comme un détail technique",
    ],
    discussion: [
      "Quel document transforme une promesse en créance?",
      "Pourquoi une sortie de marchandises impacte-t-elle la finance?",
      "Que vérifie l’analyste avant de clôturer un cycle de vente?",
    ],
    closeReminder: "Prochain pas individuel rappelé (unité 8 / quiz SAP)",
    nextStep:
      "séance 10 — service, synthèse transversale et SAP Achievement ; unité 9 majoritairement parcourue avant le cours.",
  },
  {
    sessionNumber: 10,
    titleFr: "Servir le client et consolider la vision transversale",
    relatedUnit: 9,
    objective:
      "Clôturer le parcours : service, synthèse des cinq processus, distinction Achievement SAP vs certificat Collège, évaluation institutionnelle courte.",
    individualWork:
      "Unité 9 majoritairement parcourue avant la séance ; vérifier le badge SAP selon les conditions de SAP Learning.",
    sequence: [
      "Accueil : Achievement SAP vs certificat Collège (15 min)",
      "Guidé unité 9 — service / contrats / objets techniques (25 min)",
      "SAP : fin unité 9, quiz, vérification du badge (40 min)",
      "Pause (15 min)",
      "Synthèse transversale des cinq processus (35 min)",
      "Évaluation institutionnelle courte — cas de bout en bout (30 min)",
      "Clôture : preuves, rattrapage, hors Practice System / C_IEE2E (20 min)",
    ],
    observe: [
      "Confusion Achievement SAP vs certificat du Collège",
      "Étudiants en file de rattrapage — ne pas bloquer toute la cohorte",
      "Synthèse trop catalogue, trop peu « impact / donnée / décision »",
    ],
    discussion: [
      "En quoi le service prolonge-t-il (ou casse) le cycle de vente?",
      "Quelle preuve distingue un parcours SAP d’une compétence d’analyste?",
      "Que reste-t-il à l’analyste quand le badge SAP n’est pas encore obtenu?",
    ],
    closeReminder: "Prochain pas individuel rappelé (unité 9 / Achievement ou plan de rattrapage)",
    nextStep:
      "clôture Collège : dossier de preuves + Achievement SAP ou plan de rattrapage documenté.",
  },
] as const;

export function getSessionPlan(sessionNumber: number): SessionPlan {
  const plan = SESSION_PLANS.find((item) => item.sessionNumber === sessionNumber);
  if (!plan) {
    throw new Error(`Comfort Pack: séance ${sessionNumber} introuvable.`);
  }
  return plan;
}
