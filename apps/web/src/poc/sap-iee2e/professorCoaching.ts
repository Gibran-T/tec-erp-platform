/**
 * Coaching professeur — comment enseigner IEE2E dans TEC.ERP.
 * Contenu Collège original. Aucun matériel propriétaire SAP.
 */

export const TEACHING_GOLDEN_RULES: readonly string[] = [
  "SAP enseigne (contenu, quiz, Achievement). Vous médiez la cohorte.",
  "N’expliquez pas SAP en recopiant l’écran. Faites vivre une décision d’analyste.",
  "Ne mélangez pas l’accompagnement institutionnel TEC.ERP et le contenu officiel de SAP Learning.",
  "Les 32 h 43 min officielles ne tiennent pas dans dix séances de 3 h. Distinguez salle et individuel.",
  "L’Achievement est émis par SAP. Le certificat est émis par le Collège. Deux preuves, deux émetteurs.",
  "Dans TEC.ERP, la progression est déclarée par l’étudiant. La vérité officielle reste sur SAP Learning.",
  "La Semaine Zéro précède la séance 1 : compte SAP individuel, jamais partagé. Un accès en retard se rattrape.",
] as const;

export interface SessionTeachingGuide {
  readonly sessionNumber: number;
  readonly openingLine: string;
  readonly sapDoes: string;
  readonly youDo: string;
  readonly trap: string;
  readonly collegeCase: string;
  readonly firstQuestion: string;
  readonly closeScript: string;
}

export const SESSION_TEACHING_GUIDES: readonly SessionTeachingGuide[] = [
  {
    sessionNumber: 1,
    openingLine:
      "Aujourd’hui, vous n’apprenez pas un logiciel. Vous apprenez à voir l’entreprise comme un système.",
    sapDoes:
      "L’unité 1 présente les processus de bout en bout et le défi d’intégration — sur SAP Learning, pas ici.",
    youDo:
      "Vous ouvrez la salle, confirmez les accès, et faites vivre une rupture d’intégration avec un cas Collège.",
    trap: "Laisser 40 minutes de lecture silencieuse sans médiation — les étudiants « regardent SAP » au lieu d’analyser.",
    collegeCase:
      "Une commande client est confirmée. L’entrepôt n’a jamais reçu l’ordre. Le commercial dit « c’est dans le système ». L’entrepôt dit « rien n’est arrivé ». Où l’analyste cherche-t-il d’abord la rupture — et quelle preuve minimale lui suffit?",
    firstQuestion: "Que se passe-t-il si un département optimise son silo?",
    closeScript:
      "Avant de partir : accès SAP confirmé, unité 1 à terminer avec quiz, séance 2 = Suite. Déclarez votre unité dans TEC.ERP.",
  },
  {
    sessionNumber: 2,
    openingLine:
      "Une Suite n’est pas un catalogue de produits. C’est un système d’entreprise.",
    sapDoes:
      "L’unité 2 décrit SAP Business Suite — applications, données, IA, métiers — dans le parcours officiel.",
    youDo:
      "Vous empêchez la mémorisation de jargon. Vous reliez un métier à un processus de bout en bout.",
    trap: "Transformer la séance en liste de noms (cloud, RISE, greenfield) sans rôle d’analyste.",
    collegeCase:
      "Un directeur veut « acheter un module RH ». Quelle question l’analyste doit-il poser avant de comparer deux applications de la Suite?",
    firstQuestion: "Pourquoi une Suite n’est-elle pas une collection d’applications isolées?",
    closeScript:
      "Glossaire Suite consolidé. Quiz unité 2. Séance 3 = structures. Déclarez votre progression.",
  },
  {
    sessionNumber: 3,
    openingLine:
      "Si les structures sont fausses, tous les processus mentent.",
    sapDoes:
      "L’unité 3 présente les structures organisationnelles et les objets centraux — titres et tableaux restent chez SAP.",
    youDo:
      "Vous faites remplir une matrice Collège : quelle structure pour quelle décision — sans copier les écrans SAP.",
    trap: "Confondre société, division et organisation commerciale, puis « avancer quand même ».",
    collegeCase:
      "Vente à Montréal, livraison depuis Québec, facturation au siège. Quelles structures sont touchées? Quelle affectation incorrecte casserait le processus?",
    firstQuestion: "Pourquoi une même entreprise a-t-elle plusieurs structures?",
    closeScript:
      "Matrice revue. Unité 3 / quiz. Séance 4 = finance — ne pas avaler l’unité 4 d’un coup.",
  },
  {
    sessionNumber: 4,
    openingLine:
      "Un document n’est pas un écran. C’est un événement qui laisse une trace financière.",
    sapDoes:
      "L’unité 4 (partie I) suit l’enregistrement au reporting — grand livre, tiers, actifs — sur SAP Learning (6 h 24 au total).",
    youDo:
      "Vous coupez l’unité en deux séances. Aujourd’hui : finance vs contrôle, et l’impact d’un document. Pas le quiz final.",
    trap: "Tenter d’avaler toute l’unité 4 en 180 minutes.",
    collegeCase:
      "Une facture fournisseur est saisie. Quel événement a eu lieu? Qui est touché — grand livre, partenaire, stock? Quelle preuve l’analyste exige avant de conclure à une erreur?",
    firstQuestion: "Quel document déclenche quel impact financier?",
    closeScript:
      "Poursuivre l’unité 4 avant la séance 5. Ne pas arriver à froid. Quiz = séance suivante.",
  },
  {
    sessionNumber: 5,
    openingLine:
      "Le quiz n’est pas l’ennemi. C’est un diagnostic — on le lit, on ne le copie pas.",
    sapDoes:
      "La fin de l’unité 4 (ledgers, overhead, intégration finance–contrôle) et le quiz officiel restent chez SAP.",
    youDo:
      "Vous tenez un atelier de rétroaction sans stigmatiser le retry. Vous reliez un écart de coûts à une décision d’analyste.",
    trap: "Humilier ceux qui retentent, ou traiter le quiz comme une banque à mémoriser.",
    collegeCase:
      "Un écart de coûts apparaît après un document. L’analyste ouvre-t-il d’abord le grand livre ou le centre de coûts? Quelle question pose-t-il avant de « corriger »?",
    firstQuestion: "Pourquoi un même événement peut-il impacter plusieurs ledgers?",
    closeScript:
      "Unité 4 clôturée ou plan de rattrapage nommé. Séance 6 = expérience humaine. Pont finance ↔ RH.",
  },
  {
    sessionNumber: 6,
    openingLine:
      "L’humain n’est pas un îlot RH. Il rejoint le grand livre.",
    sapDoes:
      "L’unité 5 parcourt le cycle recrutement à la retraite — le contenu officiel reste sur SAP Learning.",
    youDo:
      "Vous faites tracer les systèmes touchés par un nouvel employé, jusqu’à la première paie.",
    trap: "Traiter le cycle humain comme un SIRH isolé, sans impact finance.",
    collegeCase:
      "Premier jour d’un nouvel employé. Quels systèmes sont touchés avant la première paie? Que doit vérifier l’analyste si l’onboarding n’est pas intégré?",
    firstQuestion: "Où le cycle humain rejoint-il le grand livre?",
    closeScript:
      "Unité 5 / quiz. Séance 7 = approvisionnement — préparation SAP obligatoire, pas à froid.",
  },
  {
    sessionNumber: 7,
    openingLine:
      "On ne paie pas ce que l’on n’a pas reçu. La chaîne a un ordre.",
    sapDoes:
      "L’unité 6 suit la demande, la commande, la réception, la facture et le paiement — chez SAP.",
    youDo:
      "Vous imposez la séquence. Vous faites nommer l’impact stock, finance et fournisseur à chaque document.",
    trap: "Commencer par la facture, ou arriver sans préparation malgré la consigne.",
    collegeCase:
      "La facture arrive avant la réception. Que se passe-t-il au stock, au fournisseur, à la finance? Quel document prouve que l’entreprise a vraiment reçu?",
    firstQuestion: "Que se passe-t-il si l’on facture avant de recevoir?",
    closeScript:
      "Unité 6 / quiz. Séance 8 = production. Ne pas démarrer l’unité 7 à froid (6 h 12).",
  },
  {
    sessionNumber: 8,
    openingLine:
      "Le besoin de matières n’est pas de la magie. C’est un calcul.",
    sapDoes:
      "L’unité 7 suit la conception aux opérations — demande, plan, besoin, ordre — durée officielle 6 h 12 min.",
    youDo:
      "Vous anticipez le pic de densité. Vous faites vivre une rupture de composant : qui est touché?",
    trap: "Démarrer l’unité 7 à froid, ou laisser la fatigue masquer le décrochage.",
    collegeCase:
      "Un composant manque. Qui est impacté — production, achat, client, finance? Quelle décision l’analyste propose-t-il avant de « lancer l’ordre quand même »?",
    firstQuestion: "Qui est touché si un composant manque?",
    closeScript:
      "Unité 7 / plan de rattrapage. Séance 9 = ventes. Chaîne documents → finance.",
  },
  {
    sessionNumber: 9,
    openingLine:
      "Vendre, c’est transformer une promesse en créance.",
    sapDoes:
      "L’unité 8 suit le Lead-to-Cash côté ventes — commande, livraison, facture, encaissement.",
    youDo:
      "Vous reliez l’organisation commerciale à la finance. Vous faites nommer le document qui crée la créance.",
    trap: "Oublier la sortie de stock à la livraison, ou confondre organisation commerciale et société.",
    collegeCase:
      "Commande → livraison → facture. À quel document la finance « voit » le client comme débiteur? Que vérifie l’analyste avant de clôturer le cycle?",
    firstQuestion: "Quel document transforme une promesse en créance?",
    closeScript:
      "Unité 8 / quiz. Séance 10 = service, synthèse, Achievement SAP vs certificat Collège. Unité 9 avant le cours.",
  },
  {
    sessionNumber: 10,
    openingLine:
      "Deux preuves, deux émetteurs. L’Achievement est SAP. Le certificat est Collège.",
    sapDoes:
      "L’unité 9 clôture le service. L’Achievement Course Completion est émis selon les conditions de SAP Learning.",
    youDo:
      "Vous tenez la synthèse transversale et l’évaluation institutionnelle. Vous ne bloquez pas la cohorte pour le rattrapage.",
    trap: "Confondre badge SAP et diplôme Collège, ou transformer la synthèse en catalogue de processus.",
    collegeCase:
      "Un client commande, on approvisionne, on produit, on livre, on facture, on sert. Où l’intégration peut-elle casser? Quelle preuve distingue un parcours SAP d’une compétence d’analyste?",
    firstQuestion:
      "Que reste-t-il à l’analyste quand le badge SAP n’est pas encore obtenu?",
    closeScript:
      "Dossier de preuves Collège + Achievement SAP ou plan de rattrapage documenté. Hors Practice System et hors C_IEE2E.",
  },
] as const;

export function getSessionTeachingGuide(sessionNumber: number): SessionTeachingGuide {
  const guide = SESSION_TEACHING_GUIDES.find((item) => item.sessionNumber === sessionNumber);
  if (!guide) {
    throw new Error(`Coaching professeur : séance ${sessionNumber} introuvable.`);
  }
  return guide;
}
