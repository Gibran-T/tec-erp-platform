/**
 * Official V2 HCM Module 8 assessment bank (HCM_M8).
 * Source of truth for seeding, scoring metadata, analytics and tests.
 * Learner APIs must never expose correctKeys / answer-key fields before submission.
 */

export const HCM_M8_ASSESSMENT_CODE = "HCM_M8" as const;
export const HCM_M8_TITLE = "Évaluation — Ressources humaines et HCM";
export const HCM_M8_MODULE_SCOPE = "M8";
export const HCM_M8_PASS_THRESHOLD_PERCENT = 70;
export const HCM_M8_MAX_ATTEMPTS = 2;
export const HCM_M8_TIME_LIMIT_SECONDS = 40 * 60;
export const HCM_M8_TOTAL_POINTS = 100;
export const HCM_M8_QUESTION_COUNT = 20;

export type HcmQuestionKind =
  | "conceptual"
  | "scenario"
  | "sequence"
  | "interpretation"
  | "quantitative"
  | "diagnosis_governance";

export type HcmMissionCode = "M8-M01" | "M8-M02" | "M8-M03";
export type HcmOptionKey = "a" | "b" | "c" | "d";
export type HcmDifficulty = "intro" | "intermediate" | "advanced";

export interface HcmQuestionOption {
  readonly key: HcmOptionKey;
  readonly label: string;
  readonly whyIncorrect?: string;
}

export interface HcmBankQuestion {
  readonly questionKey: string;
  readonly sequence: number;
  readonly mission: HcmMissionCode;
  readonly competency: string;
  readonly kind: HcmQuestionKind;
  readonly difficulty: HcmDifficulty;
  readonly points: number;
  readonly prompt: string;
  readonly options: readonly [HcmQuestionOption, HcmQuestionOption, HcmQuestionOption, HcmQuestionOption];
  readonly correctKey: HcmOptionKey;
  readonly explanation: string;
  readonly businessRationale: string;
  readonly sourceConcept: string;
  readonly tags: readonly string[];
  readonly quantitative?: {
    readonly inputs: Record<string, number>;
    readonly expected: Record<string, number>;
  };
}

export const HCM_M8_DEFINITION_JSON = {
  kind: "hcm",
  curriculumVersion: "V2",
  modules: ["M8"],
  missions: ["M8-M01", "M8-M02", "M8-M03"],
  totalPoints: HCM_M8_TOTAL_POINTS,
  questionCount: HCM_M8_QUESTION_COUNT,
  language: "fr",
} as const;

export const HCM_M8_QUESTIONS: readonly HcmBankQuestion[] = [
  {
    questionKey: "HCM-M8-Q01",
    sequence: 1,
    mission: "M8-M01",
    competency: "C-HCM-01",
    kind: "conceptual",
    difficulty: "intro",
    points: 5,
    prompt:
      "Dans la fiche employé HCM, quelle distinction doit être respectée entre identité légale et identité professionnelle ?",
    options: [
      {
        key: "a",
        label:
          "L'identité légale (ex. pièce d'identité / NAS) reste au coffre RH; l'identité professionnelle (matricule, courriel) sert aux accès et transactions ERP.",
      },
      {
        key: "b",
        label: "Le NAS doit figurer sur chaque ticket d'accès pour accélérer le provisionnement.",
        whyIncorrect: "Le NAS est une donnée sensible hors périmètre d'accès ERP.",
      },
      {
        key: "c",
        label: "L'identité professionnelle remplace l'identité légale dès le premier jour.",
        whyIncorrect: "Les deux coexistent avec des finalités et contrôles distincts.",
      },
      {
        key: "d",
        label: "Aucune distinction n'est nécessaire si le gestionnaire connaît la personne.",
        whyIncorrect: "La connaissance informelle ne remplace pas la gouvernance des données.",
      },
    ],
    correctKey: "a",
    explanation:
      "Le moindre besoin impose de séparer données légales RH et identifiants professionnels utilisés pour l'autorisation ERP.",
    businessRationale:
      "Une fuite de données légales dans un ticket d'accès crée un risque de confidentialité et de non-conformité.",
    sourceConcept: "Employee master — legal vs professional identity boundary",
    tags: ["privacy", "employee-master", "onboarding"],
  },
  {
    questionKey: "HCM-M8-Q02",
    sequence: 2,
    mission: "M8-M01",
    competency: "C-HCM-01",
    kind: "scenario",
    difficulty: "intermediate",
    points: 5,
    prompt:
      "Samira Benali (OPS-AN-14, DC Montréal) doit être rattachée à Operations. Quel centre de coûts est valide ?",
    options: [
      {
        key: "a",
        label: "CC-FIN-HQ — Finance siège, car « tous les coûts passent par Finance ».",
        whyIncorrect: "Hors périmètre Operations; fausse l'imputation et le reporting.",
      },
      {
        key: "b",
        label: "CC-OPS-MTL — Operations Montréal, aligné au poste et au lieu de travail.",
      },
      {
        key: "c",
        label: "CC-EXT-PART — partenaire externe, pour mutualiser les coûts.",
        whyIncorrect: "Centre externe invalide pour un employé interne Equinoxe.",
      },
      {
        key: "d",
        label: "Aucun centre de coûts — on le complétera après la première paie.",
        whyIncorrect: "Sans centre de coûts, reporting et contrôles financiers sont incomplets.",
      },
    ],
    correctKey: "b",
    explanation:
      "Le centre de coûts doit correspondre à l'affectation organisationnelle réelle (Operations / Montréal).",
    businessRationale:
      "Un mauvais centre de coûts fausse les coûts de mission, les tableaux de bord et les analyses de marge.",
    sourceConcept: "Cost center assignment validity",
    tags: ["cost-center", "onboarding", "finance-impact"],
  },
  {
    questionKey: "HCM-M8-Q03",
    sequence: 3,
    mission: "M8-M01",
    competency: "C-HCM-02",
    kind: "sequence",
    difficulty: "intermediate",
    points: 5,
    prompt: "Quelle séquence d'intégration est conforme aux contrôles HCM / ERP ?",
    options: [
      {
        key: "a",
        label:
          "Créer les accès Admin → créer la fiche → valider l'identité → affecter le poste.",
        whyIncorrect: "Les accès ne doivent jamais précéder l'identité et l'affectation.",
      },
      {
        key: "b",
        label:
          "Activer la paie → affecter le centre de coûts → valider l'identité → créer la fiche.",
        whyIncorrect: "La paie ne peut pas précéder la fiche et les contrôles d'identité.",
      },
      {
        key: "c",
        label:
          "Valider l'identité → créer la fiche employé → affecter poste/organisation/centre de coûts → déclencher la demande d'accès à moindre privilège → clôturer les contrôles d'intégration.",
      },
      {
        key: "d",
        label:
          "Créer la fiche sans affectation → ouvrir tous les modules → valider l'identité plus tard.",
        whyIncorrect: "Bypass des contrôles d'affectation, d'identité et de moindre privilège.",
      },
    ],
    correctKey: "c",
    explanation:
      "L'ordre identité → master data → affectations → accès garantit traçabilité, moindre privilège et isolation société.",
    businessRationale:
      "Inverser l'ordre expose l'ERP à des comptes orphelins ou sur-privilegiés.",
    sourceConcept: "Onboarding control sequence",
    tags: ["sequence", "onboarding", "least-privilege"],
  },
  {
    questionKey: "HCM-M8-Q04",
    sequence: 4,
    mission: "M8-M01",
    competency: "C-HCM-02",
    kind: "scenario",
    difficulty: "intermediate",
    points: 5,
    prompt:
      "Pour un analyste opérations, quelle demande d'accès respecte le moindre privilège ?",
    options: [
      {
        key: "a",
        label: "Admin Finance + création fournisseur « au cas où ».",
        whyIncorrect: "Accès excessif, hors besoin métier, risque SoD.",
      },
      {
        key: "b",
        label: "Tous les modules en écriture pour gagner du temps la première semaine.",
        whyIncorrect: "Sur-privilège temporaire reste un écart de gouvernance.",
      },
      {
        key: "c",
        label: "Accès lecture seule globale entreprise, y compris paie détaillée.",
        whyIncorrect: "La paie détaillée est hors besoin et sensible.",
      },
      {
        key: "d",
        label:
          "Lecture Stocks + saisie inventaire cycle, liés au poste OPS-AN-14 et à la demande ONB.",
      },
    ],
    correctKey: "d",
    explanation:
      "L'accès doit être dérivé du poste et de la demande d'intégration, pas d'une commodité opérationnelle.",
    businessRationale:
      "Le moindre privilège réduit fraude, erreurs et exposition de données RH/finance.",
    sourceConcept: "Least-privilege access request",
    tags: ["access", "least-privilege", "onboarding"],
  },
  {
    questionKey: "HCM-M8-Q05",
    sequence: 5,
    mission: "M8-M01",
    competency: "C-HCM-01",
    kind: "diagnosis_governance",
    difficulty: "intermediate",
    points: 5,
    prompt:
      "Un collègue propose d'ajouter le NAS dans le ticket d'accès ACC-REQ « pour vérifier l'identité ». Quelle décision est correcte ?",
    options: [
      {
        key: "a",
        label:
          "Refuser : le NAS reste au coffre RH; le ticket d'accès utilise matricule/courriel professionnels après validation d'identité.",
      },
      {
        key: "b",
        label: "Accepter : plus de données dans le ticket = meilleure sécurité.",
        whyIncorrect: "Plus de données sensibles augmente le risque, sans améliorer l'autorisation.",
      },
      {
        key: "c",
        label: "Accepter uniquement si le ticket est chiffré par e-mail.",
        whyIncorrect: "Le canal ne justifie pas d'élargir le périmètre de données.",
      },
      {
        key: "d",
        label: "Reporter la décision au nouvel employé le premier jour.",
        whyIncorrect: "La gouvernance des données sensibles n'est pas déléguée à l'employé.",
      },
    ],
    correctKey: "a",
    explanation:
      "La validation d'identité RH et le provisionnement d'accès sont des contrôles distincts; le NAS n'appartient pas au ticket d'accès.",
    businessRationale:
      "La minimisation des données sensibles est un contrôle de confidentialité non négociable.",
    sourceConcept: "Privacy boundary on access tickets",
    tags: ["privacy", "governance", "access"],
  },
  {
    questionKey: "HCM-M8-Q06",
    sequence: 6,
    mission: "M8-M01",
    competency: "C-HCM-02",
    kind: "scenario",
    difficulty: "advanced",
    points: 5,
    prompt:
      "On propose Marc Dubois (société partenaire ThermoControl) comme gestionnaire de Samira (Equinoxe). Quelle analyse est correcte ?",
    options: [
      {
        key: "a",
        label: "Valide si Marc connaît bien le métier opérations.",
        whyIncorrect: "La compétence métier ne remplace pas l'isolation société.",
      },
      {
        key: "b",
        label:
          "Invalide : le gestionnaire doit appartenir à la même société légale; choisir un manager Equinoxe (ex. Julie Tremblay).",
      },
      {
        key: "c",
        label: "Valide temporairement jusqu'à la première évaluation.",
        whyIncorrect: "Une affectation cross-company reste non conforme.",
      },
      {
        key: "d",
        label: "Valide si le centre de coûts est partagé.",
        whyIncorrect: "Le partage de coûts n'autorise pas un manager hors société.",
      },
    ],
    correctKey: "b",
    explanation:
      "L'affectation organisationnelle est bornée par la société légale pour approbations, isolation et audit.",
    businessRationale:
      "Un manager hors société casse les workflows d'approbation et la séparation des entités.",
    sourceConcept: "Cross-company manager rejection",
    tags: ["company-isolation", "manager", "onboarding"],
  },
  {
    questionKey: "HCM-M8-Q07",
    sequence: 7,
    mission: "M8-M01",
    competency: "C-HCM-01",
    kind: "conceptual",
    difficulty: "intermediate",
    points: 5,
    prompt:
      "Pourquoi un employé ne peut-il pas être activé sans affectation organisationnelle valide (poste, département, manager, centre de coûts, lieu) ?",
    options: [
      {
        key: "a",
        label: "Parce que l'interface ERP masque alors les boutons de paie.",
        whyIncorrect: "Ce n'est pas une raison UI; c'est un contrôle métier.",
      },
      {
        key: "b",
        label: "Parce que le certificat Gold l'interdit explicitement.",
        whyIncorrect: "Hors sujet certification; enjeu HCM/ERP.",
      },
      {
        key: "c",
        label:
          "Parce que sans affectation, approbations, imputation des coûts, reporting et contrôles d'accès ne sont pas fiables.",
      },
      {
        key: "d",
        label: "Parce que le NAS devient obligatoire seulement après activation.",
        whyIncorrect: "Ne répond pas au besoin d'affectation organisationnelle.",
      },
    ],
    correctKey: "c",
    explanation:
      "L'affectation organisationnelle est le socle des workflows, de la finance analytique et de l'autorisation.",
    businessRationale:
      "Activer sans rattachement crée des employés « orphelins » impossibles à gouverner.",
    sourceConcept: "Organizational assignment prerequisite",
    tags: ["organizational-assignment", "activation", "controls"],
  },
  {
    questionKey: "HCM-M8-Q08",
    sequence: 8,
    mission: "M8-M02",
    competency: "C-HCM-03",
    kind: "sequence",
    difficulty: "intermediate",
    points: 5,
    prompt: "Quelle séquence est correcte pour traiter une absence avec impact opérationnel ?",
    options: [
      {
        key: "a",
        label:
          "Calculer le coût → poster l'absence → demander l'approbation → choisir le type.",
        whyIncorrect: "L'approbation et le type doivent précéder l'enregistrement.",
      },
      {
        key: "b",
        label:
          "Saisir les heures présentes en double → approuver → ignorer le coût.",
        whyIncorrect: "Double saisie et oubli financier sont des écarts.",
      },
      {
        key: "c",
        label:
          "Planifier 12 h HS d'abord → soumettre l'absence sans type → approuver ensuite.",
        whyIncorrect: "Bypass du type, de l'approbation et de la politique HS.",
      },
      {
        key: "d",
        label:
          "Soumettre la demande → valider le type d'absence → obtenir l'approbation → mettre à jour horaire/capacité → évaluer remplacement/HS → calculer l'impact financier → documenter.",
      },
    ],
    correctKey: "d",
    explanation:
      "L'absence suit un cycle contrôlé : demande, type, approbation, capacité, continuité, finance, documentation.",
    businessRationale:
      "Sauter l'approbation ou le calcul de coût expose le service et la paie à des erreurs.",
    sourceConcept: "Absence-to-finance control sequence",
    tags: ["sequence", "absence", "payroll-impact"],
  },
  {
    questionKey: "HCM-M8-Q09",
    sequence: 9,
    mission: "M8-M02",
    competency: "C-HCM-03",
    kind: "scenario",
    difficulty: "intermediate",
    points: 5,
    prompt:
      "ABS-REQ-7781 (maladie courte durée, 16 h) est encore « en attente d'approbation ». Quelle action est conforme ?",
    options: [
      {
        key: "a",
        label:
          "Faire approuver par le manager, puis enregistrer l'absence sur l'horaire avant d'ajuster capacité et coûts.",
      },
      {
        key: "b",
        label: "Poster l'absence immédiatement pour ne pas bloquer le planning.",
        whyIncorrect: "Une absence non approuvée ne doit pas être postée.",
      },
      {
        key: "c",
        label: "Reclasser en congé parental sans justificatif pour simplifier.",
        whyIncorrect: "Type d'absence incorrect et non justifié.",
      },
      {
        key: "d",
        label: "Supprimer la demande et saisir 16 h présentes.",
        whyIncorrect: "Falsifie la présence et la capacité réelle.",
      },
    ],
    correctKey: "a",
    explanation:
      "L'approbation manager et le type d'absence valide précèdent toute mise à jour d'horaire.",
    businessRationale:
      "Poster sans approbation fausse la paie, la capacité et l'audit des absences.",
    sourceConcept: "Absence approval before posting",
    tags: ["absence-approval", "absence-type", "controls"],
  },
  {
    questionKey: "HCM-M8-Q10",
    sequence: 10,
    mission: "M8-M02",
    competency: "C-HCM-04",
    kind: "quantitative",
    difficulty: "advanced",
    points: 5,
    prompt:
      "Horaire planifié 40 h; absence approuvée 16 h; besoin opérationnel 36 h. Combien d'heures supplémentaires sont requises pour combler l'écart de capacité ?",
    options: [
      {
        key: "a",
        label: "8 h (politique max confondue avec le besoin).",
        whyIncorrect: "8 h est un plafond politique, pas le calcul de l'écart 36−24.",
      },
      {
        key: "b",
        label: "12 h (capacité restante 24 h; écart 36 − 24 = 12).",
      },
      {
        key: "c",
        label: "16 h (égale à l'absence).",
        whyIncorrect: "L'absence n'est pas égale au besoin d'HS.",
      },
      {
        key: "d",
        label: "36 h (besoin total sans soustraire la capacité restante).",
        whyIncorrect: "Ignore les 24 h de capacité régulière restante.",
      },
    ],
    correctKey: "b",
    explanation:
      "Capacité restante = 40 − 16 = 24 h; écart = 36 − 24 = 12 h d'HS requises.",
    businessRationale:
      "Quantifier l'écart évite sous/sur-couverture et erreurs de coût.",
    sourceConcept: "Capacity gap and overtime hours",
    tags: ["quantitative", "capacity", "overtime"],
    quantitative: {
      inputs: {
        plannedHours: 40,
        approvedAbsenceHours: 16,
        operationalRequirementHours: 36,
      },
      expected: {
        remainingRegularCapacityHours: 24,
        capacityGapOvertimeHours: 12,
      },
    },
  },
  {
    questionKey: "HCM-M8-Q11",
    sequence: 11,
    mission: "M8-M02",
    competency: "C-HCM-04",
    kind: "quantitative",
    difficulty: "advanced",
    points: 5,
    prompt:
      "Avec 12 h d'HS, taux normal 28 $/h et majoration 1,5 : quel est le coût incrémental des heures supplémentaires ?",
    options: [
      {
        key: "a",
        label: "336 $ (12 × 28, sans majoration).",
        whyIncorrect: "Omet le multiplicateur 1,5.",
      },
      {
        key: "b",
        label: "420 $ (10 × 28 × 1,5).",
        whyIncorrect: "Utilise un nombre d'heures incorrect.",
      },
      {
        key: "c",
        label: "504 $ (taux HS 28 × 1,5 = 42; 12 × 42 = 504).",
      },
      {
        key: "d",
        label: "672 $ (12 × 28 × 2).",
        whyIncorrect: "Multiplicateur erroné (2 au lieu de 1,5).",
      },
    ],
    correctKey: "c",
    explanation:
      "Taux HS = 28 × 1,5 = 42 $/h; coût incrémental = 12 × 42 = 504 $ (calcul déterministe, sans arrondi).",
    businessRationale:
      "Le coût incrémental doit être imputé au centre de coûts pour la décision de continuité.",
    sourceConcept: "Incremental overtime cost",
    tags: ["quantitative", "overtime", "cost-center"],
    quantitative: {
      inputs: {
        overtimeHours: 12,
        normalHourlyCost: 28,
        overtimeMultiplier: 1.5,
      },
      expected: {
        overtimeHourlyCost: 42,
        incrementalOvertimeCost: 504,
      },
    },
  },
  {
    questionKey: "HCM-M8-Q12",
    sequence: 12,
    mission: "M8-M02",
    competency: "C-HCM-03",
    kind: "interpretation",
    difficulty: "intermediate",
    points: 5,
    prompt:
      "La feuille de temps contient 16 h « présentes » le même jour que 16 h d'absence approuvée. Quelle interprétation est correcte ?",
    options: [
      {
        key: "a",
        label: "C'est acceptable si le total hebdomadaire reste 40 h.",
        whyIncorrect: "Le total masque une double saisie incohérente.",
      },
      {
        key: "b",
        label: "C'est utile pour documenter la motivation de l'employé.",
        whyIncorrect: "Hors finalité timesheet; risque d'erreur de paie.",
      },
      {
        key: "c",
        label: "Cela augmente automatiquement la capacité opérationnelle.",
        whyIncorrect: "Une double saisie n'ajoute pas de capacité réelle.",
      },
      {
        key: "d",
        label:
          "C'est une double saisie invalide : présence et absence ne peuvent se chevaucher; corriger avant paie et capacité.",
      },
    ],
    correctKey: "d",
    explanation:
      "Présence et absence sur le même intervalle sont mutuellement exclusives; la correction protège paie et capacité.",
    businessRationale:
      "Les doublons timesheet génèrent surpaiement et fausse couverture de service.",
    sourceConcept: "Duplicate timesheet detection",
    tags: ["timesheet", "duplicate", "payroll-impact"],
  },
  {
    questionKey: "HCM-M8-Q13",
    sequence: 13,
    mission: "M8-M02",
    competency: "C-HCM-04",
    kind: "interpretation",
    difficulty: "advanced",
    points: 5,
    prompt:
      "Capacité régulière restante 24 h, besoin 36 h, relève qualifiée indisponible. Quel risque faut-il prioriser dans la décision ?",
    options: [
      {
        key: "a",
        label:
          "Risque de service (inventaire/cycle retardé) et risque financier (HS / remplacement), à documenter avec le coût incrémental.",
      },
      {
        key: "b",
        label: "Aucun risque si l'absence est de type « maladie ».",
        whyIncorrect: "Le type n'élimine pas l'écart de capacité.",
      },
      {
        key: "c",
        label: "Risque uniquement esthétique sur le tableau de bord RH.",
        whyIncorrect: "L'impact est opérationnel et financier, pas cosmétique.",
      },
      {
        key: "d",
        label: "Risque nul tant que le certificat Silver est obtenu.",
        whyIncorrect: "Hors sujet certification.",
      },
    ],
    correctKey: "a",
    explanation:
      "L'écart 12 h crée un risque de continuité de service et un coût HS qu'il faut rendre explicites.",
    businessRationale:
      "Ignorer l'impact financier ou opérationnel conduit à des décisions non gouvernées.",
    sourceConcept: "Operational and financial risk from capacity gap",
    tags: ["service-risk", "financial-impact", "interpretation"],
  },
  {
    questionKey: "HCM-M8-Q14",
    sequence: 14,
    mission: "M8-M02",
    competency: "C-HCM-04",
    kind: "conceptual",
    difficulty: "intermediate",
    points: 5,
    prompt:
      "La politique limite les HS à 8 h/semaine, mais le calcul de besoin indique 12 h. Quelle conduite est correcte ?",
    options: [
      {
        key: "a",
        label: "Poster 12 h d'HS sans escalade, car le besoin opérationnel prime toujours.",
        whyIncorrect: "Le besoin ne légitime pas le dépassement silencieux de politique.",
      },
      {
        key: "b",
        label:
          "Ne pas dépasser silencieusement la politique : documenter l'écart, escalader (remplacement, priorisation, dérogation formelle) et chiffrer le coût.",
      },
      {
        key: "c",
        label: "Ignorer le besoin et laisser le service sans couverture.",
        whyIncorrect: "L'inaction non documentée n'est pas une gouvernance acceptable.",
      },
      {
        key: "d",
        label: "Recoder 4 h d'HS en présence pour masquer le dépassement.",
        whyIncorrect: "Falsification de données de temps.",
      },
    ],
    correctKey: "b",
    explanation:
      "Le plafond politique est un contrôle; tout dépassement exige escalade et traçabilité, pas de contournement.",
    businessRationale:
      "La conformité HS protège coûts, santé organisationnelle et auditabilité.",
    sourceConcept: "Overtime policy limit governance",
    tags: ["overtime-policy", "governance", "financial-impact"],
  },
  {
    questionKey: "HCM-M8-Q15",
    sequence: 15,
    mission: "M8-M03",
    competency: "C-HCM-05",
    kind: "sequence",
    difficulty: "intermediate",
    points: 5,
    prompt: "Quelle séquence d'évaluation des compétences est conforme ?",
    options: [
      {
        key: "a",
        label:
          "Appliquer la reco IA comme décision finale → collecter des preuves ensuite.",
        whyIncorrect: "L'IA est advisory; les preuves précèdent le jugement.",
      },
      {
        key: "b",
        label:
          "Définir un plan de formation générique → noter sans preuves → valider plus tard.",
        whyIncorrect: "Le plan doit découler des écarts evidencés.",
      },
      {
        key: "c",
        label:
          "Définir le niveau attendu → collecter des preuves → évaluer le niveau observé → identifier l'écart → définir une action de développement mesurable → validation manager → suivi.",
      },
      {
        key: "d",
        label:
          "Utiliser des données sensibles hors emploi pour prédire le potentiel → noter → former.",
        whyIncorrect: "Données protégées / non pertinentes interdites pour la décision.",
      },
    ],
    correctKey: "c",
    explanation:
      "La boucle compétence exige attendu, preuves, observé, écart, action, validation humaine et suivi.",
    businessRationale:
      "Sans preuves et validation manager, l'évaluation n'est ni équitable ni auditable.",
    sourceConcept: "Competency review sequence",
    tags: ["sequence", "competency", "evidence"],
  },
  {
    questionKey: "HCM-M8-Q16",
    sequence: 16,
    mission: "M8-M03",
    competency: "C-HCM-05",
    kind: "scenario",
    difficulty: "advanced",
    points: 5,
    prompt:
      "Un manager attribue « expert » sans livrable, observation ni feedback documenté. Quelle conduite est correcte ?",
    options: [
      {
        key: "a",
        label: "Accepter la note : l'intuition managériale suffit.",
        whyIncorrect: "Les notes sans preuves ne sont pas défendables.",
      },
      {
        key: "b",
        label: "Demander à l'IA de confirmer automatiquement la note.",
        whyIncorrect: "L'IA ne remplace pas les preuves ni le jugement responsable.",
      },
      {
        key: "c",
        label: "Convertir immédiatement la note en promotion.",
        whyIncorrect: "Décision d'emploi sans fondement evidencé.",
      },
      {
        key: "d",
        label:
          "Rejeter la note non supportée; exiger des preuves avant de figer le niveau observé et le plan.",
      },
    ],
    correctKey: "d",
    explanation:
      "Toute cotation de compétence doit reposer sur des preuves observables et traçables.",
    businessRationale:
      "Les notes sans preuves exposent à l'iniquité et aux décisions non auditables.",
    sourceConcept: "Unsupported rating rejection",
    tags: ["evidence", "fairness", "competency"],
  },
  {
    questionKey: "HCM-M8-Q17",
    sequence: 17,
    mission: "M8-M03",
    competency: "C-HCM-06",
    kind: "diagnosis_governance",
    difficulty: "advanced",
    points: 5,
    prompt:
      "Le coach IA recommande une formation. Un collègue veut l'appliquer comme décision finale de développement. Que faire ?",
    options: [
      {
        key: "a",
        label:
          "Traiter la reco comme advisory : le manager reste responsable; valider l'alignement aux écarts evidencés avant d'agir.",
      },
      {
        key: "b",
        label: "Appliquer automatiquement la reco pour éviter le biais humain.",
        whyIncorrect: "L'automatisation sans jugement humain déplace la responsabilité.",
      },
      {
        key: "c",
        label: "Ignorer toute preuve humaine si l'IA est confiante.",
        whyIncorrect: "La confiance modèle ne remplace pas les preuves métier.",
      },
      {
        key: "d",
        label: "Utiliser la reco IA pour contourner l'approbation manager.",
        whyIncorrect: "Bypass de la responsabilité managériale.",
      },
    ],
    correctKey: "a",
    explanation:
      "Les recommandations IA sont consultatives; la décision d'emploi/développement reste humaine et justifiée.",
    businessRationale:
      "Préserver l'accountability évite les décisions opaques et les biais non contrôlés.",
    sourceConcept: "AI advisory vs human accountability",
    tags: ["ai-governance", "human-accountability", "bias"],
  },
  {
    questionKey: "HCM-M8-Q18",
    sequence: 18,
    mission: "M8-M03",
    competency: "C-HCM-06",
    kind: "conceptual",
    difficulty: "intermediate",
    points: 5,
    prompt:
      "Quelle règle s'applique aux données sensibles / protégées dans une décision d'évolution ou de performance ?",
    options: [
      {
        key: "a",
        label: "Elles peuvent départager deux candidats si le modèle IA les juge utiles.",
        whyIncorrect: "Les traits protégés / non pertinents ne doivent pas fonder la décision.",
      },
      {
        key: "b",
        label:
          "Elles ne doivent pas déterminer les décisions d'emploi; seules des preuves de performance/compétences pertinentes comptent.",
      },
      {
        key: "c",
        label: "Elles sont obligatoires pour prouver l'équité algorithmique.",
        whyIncorrect: "L'équité ne s'obtient pas en injectant des données sensibles.",
      },
      {
        key: "d",
        label: "Elles remplacent le plan de développement si absentes.",
        whyIncorrect: "Sans rapport avec l'objectif de développement mesurable.",
      },
    ],
    correctKey: "b",
    explanation:
      "Les décisions d'emploi reposent sur des preuves professionnelles pertinentes, jamais sur des attributs sensibles.",
    businessRationale:
      "Cette borne protège l'équité, la conformité et la confiance institutionnelle.",
    sourceConcept: "Sensitive data exclusion from employment decisions",
    tags: ["privacy", "fairness", "governance"],
  },
  {
    questionKey: "HCM-M8-Q19",
    sequence: 19,
    mission: "M8-M03",
    competency: "C-HCM-05",
    kind: "interpretation",
    difficulty: "advanced",
    points: 5,
    prompt:
      "Les preuves montrent un niveau « intermédiaire » en analyse, mais la note saisie est « expert » sans nouvel élément. Quelle interprétation est correcte ?",
    options: [
      {
        key: "a",
        label: "La note expert prévaut car plus favorable à l'employé.",
        whyIncorrect: "Une note favorable non supportée reste non conforme.",
      },
      {
        key: "b",
        label: "La contradiction prouve que les preuves sont inutiles.",
        whyIncorrect: "Les preuves sont le fondement; la note doit s'y aligner.",
      },
      {
        key: "c",
        label:
          "Écart contradictoire : recalibrer le niveau observé sur les preuves, documenter, puis définir l'écart et l'action.",
      },
      {
        key: "d",
        label: "Laisser l'IA choisir la note la plus haute.",
        whyIncorrect: "L'IA ne tranche pas les contradictions sans preuves.",
      },
    ],
    correctKey: "c",
    explanation:
      "En cas de contradiction, les preuves observables gouvernent; la note est corrigée avant le plan.",
    businessRationale:
      "L'explicabilité exige la cohérence entre preuves, niveau et actions.",
    sourceConcept: "Contradictory competency evidence handling",
    tags: ["evidence", "explainability", "competency-gap"],
  },
  {
    questionKey: "HCM-M8-Q20",
    sequence: 20,
    mission: "M8-M03",
    competency: "C-HCM-06",
    kind: "conceptual",
    difficulty: "intermediate",
    points: 5,
    prompt:
      "Après identification d'un écart en « analyse de données », quelle action de développement est conforme ?",
    options: [
      {
        key: "a",
        label: "Inscrire à une formation vente terrain sans lien avec l'écart.",
        whyIncorrect: "Formation non alignée à l'écart identifié.",
      },
      {
        key: "b",
        label: "Clôturer sans objectif mesurable « pour garder de la flexibilité ».",
        whyIncorrect: "Sans objectif mesurable, le suivi est impossible.",
      },
      {
        key: "c",
        label: "Assimiler performance actuelle et potentiel de leadership sans preuve.",
        whyIncorrect: "Performance et potentiel ne sont pas équivalents.",
      },
      {
        key: "d",
        label:
          "Définir un objectif mesurable lié à l'écart (ex. produire 2 analyses inventaire validées), avec échéance et validation manager.",
      },
    ],
    correctKey: "d",
    explanation:
      "L'action de développement doit correspondre à l'écart evidencé, être mesurable et validée par le manager.",
    businessRationale:
      "Un plan aligné et mesurable rend le progrès auditable et équitable.",
    sourceConcept: "Gap-aligned measurable development objective",
    tags: ["development-plan", "competency-gap", "accountability"],
  },
] as const;

export function assertHcmM8BankInvariants(questions: readonly HcmBankQuestion[] = HCM_M8_QUESTIONS): void {
  if (questions.length !== HCM_M8_QUESTION_COUNT) {
    throw new Error(`HCM_M8 expects ${HCM_M8_QUESTION_COUNT} questions`);
  }
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  if (totalPoints !== HCM_M8_TOTAL_POINTS) {
    throw new Error(`HCM_M8 expects ${HCM_M8_TOTAL_POINTS} points, got ${totalPoints}`);
  }
  const keys = new Set(questions.map((q) => q.questionKey));
  if (keys.size !== questions.length) {
    throw new Error("HCM_M8 duplicate questionKey");
  }
  for (const question of questions) {
    if (question.options.length !== 4) {
      throw new Error(`${question.questionKey} must have 4 options`);
    }
    if (!question.options.some((option) => option.key === question.correctKey)) {
      throw new Error(`${question.questionKey} correctKey missing`);
    }
    if (!question.explanation.trim() || !question.businessRationale.trim()) {
      throw new Error(`${question.questionKey} missing explanation metadata`);
    }
  }
}

export function hcmM8MissionCounts(questions: readonly HcmBankQuestion[] = HCM_M8_QUESTIONS): Record<HcmMissionCode, number> {
  return {
    "M8-M01": questions.filter((q) => q.mission === "M8-M01").length,
    "M8-M02": questions.filter((q) => q.mission === "M8-M02").length,
    "M8-M03": questions.filter((q) => q.mission === "M8-M03").length,
  };
}

export function hcmM8KindCounts(
  questions: readonly HcmBankQuestion[] = HCM_M8_QUESTIONS,
): Record<HcmQuestionKind, number> {
  const counts: Record<HcmQuestionKind, number> = {
    conceptual: 0,
    scenario: 0,
    sequence: 0,
    interpretation: 0,
    quantitative: 0,
    diagnosis_governance: 0,
  };
  for (const question of questions) {
    counts[question.kind] += 1;
  }
  return counts;
}

export function hcmM8AnswerKeyDistribution(
  questions: readonly HcmBankQuestion[] = HCM_M8_QUESTIONS,
): Record<HcmOptionKey, number> {
  const counts: Record<HcmOptionKey, number> = { a: 0, b: 0, c: 0, d: 0 };
  for (const question of questions) {
    counts[question.correctKey] += 1;
  }
  return counts;
}

export function toAssessmentQuestionSeed(question: HcmBankQuestion) {
  return {
    questionKey: question.questionKey,
    sequence: question.sequence,
    type: "SINGLE_CHOICE" as const,
    prompt: question.prompt,
    optionsJson: question.options.map((option) => ({
      key: option.key,
      label: option.label,
    })),
    scoringJson: {
      maxPoints: question.points,
      correctKeys: [question.correctKey],
      curriculumVersion: "V2",
      module: "M8",
      mission: question.mission,
      competency: question.competency,
      questionKind: question.kind,
      difficulty: question.difficulty,
      tags: [...question.tags],
      explanation: question.explanation,
      whyAlternativesIncorrect: Object.fromEntries(
        question.options
          .filter((option) => option.key !== question.correctKey)
          .map((option) => [option.key, option.whyIncorrect ?? "Option non conforme au contrôle HCM."]),
      ),
      businessRationale: question.businessRationale,
      sourceConcept: question.sourceConcept,
      quantitative: question.quantitative ?? null,
      analytics: {
        quantitative: question.kind === "quantitative",
        privacyGovernance:
          question.tags.includes("privacy") ||
          question.tags.includes("governance") ||
          question.kind === "diagnosis_governance",
      },
    },
  };
}
