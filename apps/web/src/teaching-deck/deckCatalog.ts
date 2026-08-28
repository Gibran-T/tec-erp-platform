import { SESSION_PLANS } from "../poc/sap-iee2e/sessionPlans.js";
import {
  SAP_COLLEGE_SESSIONS,
  TEACHING_SESSION_CODES,
  type TeachingSessionCode,
} from "../sofa/sapCollegeCalendar.js";
import type { ModuleDeckMeta, TeachingModuleDeck, TeachingSlide } from "./types.js";

const SAP_ARMCHAIR_BULLETS = [
  "SAP Learning Hub est le cours — contenu, quiz, Achievement.",
  "TEC.ERP est le sofa : ordre de séance, cohorte, autodéclaration, confort professeur/élève.",
  "Les modules NordHabitat M1–M10 sont des coussins optionnels, pas le calendrier du cours.",
  "Compte Hub individuel — jamais partagé. Aucun clonage d’écran SAP.",
] as const;

function nextSessionLabel(sessionNumber: number): string {
  if (sessionNumber >= 10) {
    return "Clôture Collège · preuves + Achievement SAP ou plan de rattrapage";
  }
  const next = SAP_COLLEGE_SESSIONS.find((item) => item.sessionNumber === sessionNumber + 1);
  return next ? `Séance ${next.sessionNumber} — ${next.titleFr}` : "Séance suivante";
}

function buildMeta(sessionCode: TeachingSessionCode): ModuleDeckMeta {
  const college = SAP_COLLEGE_SESSIONS.find((item) => item.sessionCode === sessionCode);
  const plan = SESSION_PLANS.find((item) => item.sessionNumber === college?.sessionNumber);
  if (!college || !plan) {
    throw new Error(`Teaching Deck: séance ${sessionCode} introuvable.`);
  }
  const sofa = college.sofaCushion;
  const sofaLine = sofa
    ? `${sofa.label} — ouvrir seulement si ça aide la pensée, jamais à la place de SAP.`
    : "Pas de coussin TEC obligatoire cette séance — rester sur SAP Learning.";

  return {
    moduleCode: college.sessionCode,
    sessionNumber: college.sessionNumber,
    title: college.titleFr,
    sapUnitLabel: `SAP Unité ${college.relatedUnit} — ${college.sapUnitTitleFr} (${college.sapDurationLabel})`,
    tecModuleLabel: sofaLine,
    objectives: [
      college.comfortObjective,
      "Travailler l’unité SAP officielle (Hub), pas un clone d’écran.",
      "Utiliser TEC.ERP pour l’ordre de séance, la cohorte et l’autodéclaration.",
      sofa
        ? "Coussin lab optionnel : ne pas confondre NordHabitat et l’entreprise de formation SAP."
        : "Aucun module TEC n’est exigé pour valider cette séance.",
    ],
    context: `Séance Collège ${college.sessionNumber}/10. Le fondement est l’unité SAP ${college.relatedUnit}. TEC.ERP organise le confort (agenda, checkpoint, sofa).`,
    processMap: plan.sequence.slice(0, 5),
    actors: [
      "Professeur — médiation de cohorte, pas substitut de SAP Learning",
      "Apprenant — compte Hub individuel + poste TEC.ERP (sofa)",
      "SAP Learning — source officielle du cours",
    ],
    dataPoints: [
      "Métadonnées publiques de l’unité (titre, durée) — aucun quiz SAP recopié",
      "Autodéclaration de progression dans Parcours SAP (TEC.ERP)",
      sofa ? `Coussin ${sofa.moduleCode} disponible dans le lab si le professeur l’ouvre` : "Pas de mission TEC obligatoire",
    ],
    concept:
      "Le cours appliqué est SAP. TEC.ERP ne remplace pas l’année virtuelle NordHabitat comme calendrier : ce timing appartenait à l’ancien TEC.ERP-comme-cours.",
    quantitativeExample: [
      `Charge SAP officielle de l’unité ${college.relatedUnit} : ${college.sapDurationLabel} — une séance Collège = 180 min, donc du travail individuel reste hors séance.`,
      "Ne pas avaler une unité de 6 h dans 180 minutes.",
      "Autodéclaration ≠ badge SAP.",
    ],
    commonError:
      "Enseigner M1–M10 comme si chaque séance Collège était un module TEC. Ça casse l’ordre SAP (finance avant achats, RH avant P2P).",
    erpLabDemo: sofa
      ? [
          "D’abord SAP Learning (unité officielle).",
          sofaLine,
          "Jamais projeter un écran SAP recopié dans TEC.ERP.",
        ]
      : [
          "Séance sans coussin : Hub + Teaching Deck + checkpoint cohorte.",
          "Parcours SAP pour l’autodéclaration.",
          "Pas de Mission Center obligatoire.",
        ],
    kpiFocus: [
      "Accès Hub confirmé (Semaine Zéro)",
      "Unité SAP entamée / quiz déclaré — vérité sur Learning Hub",
      "Étudiants « à accompagner » dans Parcours SAP",
    ],
    decisionPrompt: plan.discussion[0] ?? "Quelle preuve minimale avant de conclure ?",
    classroomQuestion: plan.discussion[1] ?? plan.discussion[0] ?? "Que doit vérifier l’analyste ?",
    missionBriefing: sofa
      ? [
          "Le briefing mission TEC est optionnel.",
          `Si coussin ouvert : Course Edition ${sofa.moduleCode} — APPRENDRE puis missions du lab.`,
          "Le scoring TEC ne remplace pas le quiz SAP.",
        ]
      : [
          "Pas de mission TEC au programme de cette séance.",
          "Travail individuel = unité SAP + quiz Hub.",
          "Checkpoint cohorte dans TEC.ERP (sofa).",
        ],
    debriefPoints: plan.observe.slice(0, 3),
    synthesis: [
      plan.closeReminder,
      `Prochain pas : ${plan.nextStep}`,
    ],
    nextModuleLabel: nextSessionLabel(college.sessionNumber),
  };
}

const SAP_ARMCHAIR_NOTES =
  "Règle d’or : SAP enseigne. TEC.ERP organise. Ne jamais projeter un quiz SAP avec réponses. Ne pas enseigner M1–M10 comme calendrier.";

function buildSlides(meta: ModuleDeckMeta): TeachingSlide[] {
  const prefix = meta.moduleCode.toLowerCase();
  return [
    {
      id: `${prefix}-01-cover`,
      anchor: "cover",
      title: `Séance ${meta.sessionNumber} — ${meta.title}`,
      bullets: [meta.moduleCode, meta.sapUnitLabel, "TEC.ERP = sofa · SAP = cours"],
      speakerNotes: `Ouvrir la séance ${meta.sessionNumber}. Vérifier projecteur et accès Hub individuels.`,
    },
    {
      id: `${prefix}-02-objectives`,
      anchor: "objectives",
      title: "Objectifs d’apprentissage",
      bullets: meta.objectives,
      speakerNotes: "Lire lentement. Le succès se mesure d’abord sur SAP Learning, pas sur un module TEC.",
    },
    {
      id: `${prefix}-03-sap-reminder`,
      anchor: "sap-reminder",
      title: "SAP enseigne · TEC.ERP est le sofa",
      bullets: [...SAP_ARMCHAIR_BULLETS],
      speakerNotes: SAP_ARMCHAIR_NOTES,
    },
    {
      id: `${prefix}-04-context`,
      anchor: "context",
      title: "Contexte de séance",
      bullets: [meta.context, meta.tecModuleLabel],
      speakerNotes: "Ancrer l’unité SAP. Le coussin NordHabitat est facultatif.",
    },
    {
      id: `${prefix}-05-process-map`,
      anchor: "process-map",
      title: "Ordre de la séance (Comfort Pack)",
      bullets: meta.processMap,
      speakerNotes: "C’est l’agenda Collège, pas une carte de module TEC.",
    },
    {
      id: `${prefix}-06-actors`,
      anchor: "actors",
      title: "Qui fait quoi",
      bullets: meta.actors,
      speakerNotes: "Le professeur médie ; SAP Learning reste la source.",
    },
    {
      id: `${prefix}-07-data`,
      anchor: "data",
      title: "Preuves et traces",
      bullets: meta.dataPoints,
      speakerNotes: "Autodéclaration TEC ≠ Achievement SAP.",
    },
    {
      id: `${prefix}-08-concept`,
      anchor: "concept",
      title: "Concept clé",
      bullets: [meta.concept],
      speakerNotes: "L’année virtuelle NordHabitat n’est plus le calendrier du cours.",
    },
    {
      id: `${prefix}-09-quantitative`,
      anchor: "quantitative",
      title: "Charge réelle SAP vs 180 min",
      bullets: meta.quantitativeExample,
      speakerNotes: "Dire explicitement le travail hors séance.",
    },
    {
      id: `${prefix}-10-common-error`,
      anchor: "common-error",
      title: "Erreur à éviter",
      bullets: [meta.commonError],
      speakerNotes: "Si quelqu’un parle « module 4 = séance 4 », corriger tout de suite.",
    },
    {
      id: `${prefix}-11-erp-lab`,
      anchor: "erp-lab",
      title: "Sofa / lab (optionnel)",
      bullets: meta.erpLabDemo,
      speakerNotes: "N’ouvrir le coussin que s’il sert la compréhension, jamais pour « finir TEC ».",
    },
    {
      id: `${prefix}-12-kpi`,
      anchor: "kpi",
      title: "Signaux professeur (sofa)",
      bullets: meta.kpiFocus,
      speakerNotes: "Parcours SAP : à accompagner, accès, autodéclaration.",
    },
    {
      id: `${prefix}-13-decision`,
      anchor: "decision",
      title: "Question de décision",
      bullets: [meta.decisionPrompt],
      speakerNotes: "Discussion de cohorte — pas de clé de quiz SAP.",
    },
    {
      id: `${prefix}-14-classroom-question`,
      anchor: "classroom-question",
      title: "Question de salle",
      bullets: [meta.classroomQuestion],
      speakerNotes: "Faire parler avant de montrer SAP.",
    },
    {
      id: `${prefix}-15-mission-briefing`,
      anchor: "mission-briefing",
      title: "Travail demandé",
      bullets: meta.missionBriefing,
      speakerNotes: "Le travail noté du cours est sur SAP. TEC est confort et organisation.",
    },
    {
      id: `${prefix}-16-debrief`,
      anchor: "debrief",
      title: "À observer (Comfort Pack)",
      bullets: meta.debriefPoints,
      speakerNotes: "Noter qui décroche sans stigmatiser.",
    },
    {
      id: `${prefix}-17-synthesis`,
      anchor: "synthesis",
      title: "Synthèse et transition",
      bullets: [...meta.synthesis, `Ensuite : ${meta.nextModuleLabel}`],
      speakerNotes: `Clôturer la séance ${meta.sessionNumber}.`,
    },
  ];
}

export const MODULE_DECK_META: readonly ModuleDeckMeta[] = TEACHING_SESSION_CODES.map(buildMeta);

export const TEACHING_DECK_CATALOG: readonly TeachingModuleDeck[] = MODULE_DECK_META.map((meta) => ({
  moduleCode: meta.moduleCode,
  sessionNumber: meta.sessionNumber,
  title: meta.title,
  sapUnitLabel: meta.sapUnitLabel,
  tecModuleLabel: meta.tecModuleLabel,
  slides: buildSlides(meta),
}));

/** @deprecated Use TEACHING_SESSION_CODES — kept so existing imports compile. */
export const TEACHING_MODULE_CODES = TEACHING_SESSION_CODES as unknown as string[];

export const SLIDES_PER_MODULE = 17;

export function getTeachingDeck(moduleCode: string): TeachingModuleDeck | null {
  const normalized = moduleCode.toUpperCase();
  return TEACHING_DECK_CATALOG.find((deck) => deck.moduleCode === normalized) ?? null;
}

export function getSessionPackPath(sessionNumber: number): string {
  if (sessionNumber === 1) {
    return "apps/web/src/course-edition/content/m1/SESSION_1_FACILITATION_PACK.md";
  }
  return `apps/web/src/teaching-deck/packs/SESSION_${sessionNumber}_FACILITATION_PACK.md`;
}
