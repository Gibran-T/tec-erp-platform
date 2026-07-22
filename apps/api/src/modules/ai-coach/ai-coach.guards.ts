const ANSWER_KEY_PATTERNS = [
  /correctkeys/i,
  /bonne\s+r[eé]ponse/i,
  /answer\s*key/i,
  /cl[eé]\s+correcte/i,
  /solution\s+exacte/i,
  /r[eé]v[eè]le\s+la\s+r[eé]ponse/i,
  /donne\s+moi\s+la\s+r[eé]ponse/i,
];

const MAX_QUESTION_LENGTH = 2000;
const RATE_LIMIT_PER_HOUR = 30;

export interface AiCoachAnswerContext {
  readonly moduleCode?: string;
  readonly missionKey?: string;
  readonly department?: string;
}

export function sanitizeAiCoachQuestion(raw: string): string {
  return [...raw]
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code <= 0x1f || code === 0x7f) {
        return " ";
      }
      return char;
    })
    .join("")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_QUESTION_LENGTH);
}

export function refusesAnswerKeyRequest(question: string): boolean {
  return ANSWER_KEY_PATTERNS.some((pattern) => pattern.test(question));
}

const MODULE_CONTEXT: Record<string, string> = {
  M1: "Entreprise intégrée et processus — cartographie ERP, rôles et dépendances.",
  M2: "Structure organisationnelle et données de base — master data et qualité.",
  M3: "Approvisionnement / Procure-to-Pay — besoin, commande, réception, impact fournisseur.",
  M4: "Ventes / Order-to-Cash — commande, allocation, livraison, clôture.",
  M5: "Stocks, réapprovisionnement et S&OP — capacité et planification.",
  M6: "Finance et contrôle — factures, rapprochement trois voies, explication d'écart.",
  M7: "CRM et service client — dossier, escalade, récupération de satisfaction.",
  M8: "Ressources humaines / HCM — intégration, temps/absences, compétences (décision humaine).",
  M9: "Gouvernance, accès et conformité — approbations, SoD, responsabilité professionnelle.",
  M10: "BI, KPI, IA et conseil — définition d'indicateurs, interprétation, limites de l'IA.",
};

const HCM_SAFEGUARD =
  "Garde-fou HCM : ne jamais inférer de traits sensibles, ne pas prendre de décision d'emploi finale, exiger des preuves, préserver la vie privée et rappeler la responsabilité humaine.";

const M10_AI_SAFEGUARD =
  "Garde-fou M10 : expliquer les KPI (formule, source, variance), distinguer anomalie et causalité, rappeler hallucination/biais/explicabilité et human-in-the-loop. L'IA n'est pas autoritative.";

function detectCategory(normalized: string): string {
  if (/flux|document|commande|facture|livraison|r[eé]ception/.test(normalized)) {
    return "document_flow";
  }
  if (/risque|fraude|rupture|non[- ]conform/.test(normalized)) {
    return "business_risk";
  }
  if (/financier|tr[eé]sorerie|[eé]cart|co[uû]t|marge|cash/.test(normalized)) {
    return "financial_impact";
  }
  if (/contr[oô]le|s[eé]paration|acc[eè]s|audit|gouvernance/.test(normalized)) {
    return "control";
  }
  if (/kpi|indicateur|tableau de bord|m[eé]trique/.test(normalized)) {
    return "kpi";
  }
  if (/erreur|pi[eè]ge|oubli|fr[eé]quent/.test(normalized)) {
    return "common_error";
  }
  if (/expliquez|comme un professeur|p[eé]dagogique|concept/.test(normalized)) {
    return "professor_style";
  }
  return "concept";
}

function isDeepMode(normalized: string): boolean {
  return /professionnel|senior|approfondi|expert|d[eé]taill/.test(normalized);
}

export function buildDeterministicAiCoachAnswer(
  question: string,
  context: AiCoachAnswerContext = {},
): string {
  const normalized = question.toLowerCase();
  const moduleCode =
    context.moduleCode?.toUpperCase() ??
    (normalized.match(/\bm(?:10|[1-9])\b/i)?.[0]?.toUpperCase() ?? undefined);
  const moduleHint = moduleCode ? MODULE_CONTEXT[moduleCode] : undefined;
  const category = detectCategory(normalized);
  const deep = isDeepMode(normalized);
  const department = context.department?.trim();

  const prefix = [
    moduleHint ? `Contexte module ${moduleCode} : ${moduleHint}` : null,
    context.missionKey ? `Mission concernée : ${context.missionKey}.` : null,
    department ? `Département / fonction : ${department}.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  let body: string;
  switch (category) {
    case "document_flow":
      body = deep
        ? "Retracez le flux documentaire ERP de bout en bout : document source → contrôle métier → document suivant → preuve de clôture. Pour chaque étape, demandez-vous quel rôle valide, quelle donnée doit être cohérente, et quelle rupture créerait un écart financier ou opérationnel."
        : "Identifiez le document source, le document suivant et la preuve de clôture dans le flux ERP. Quelle validation manquerait si vous sautiez une étape ?";
      break;
    case "business_risk":
      body = deep
        ? "Formulez le risque en trois couches : opérationnelle (processus), financière (impact P&L / cash) et de contrôle (qui peut détecter l'écart). Proposez un indicateur d'alerte avant de conclure une action corrective."
        : "Nommez le risque métier principal, son impact probable et le contrôle qui le réduirait — sans exécuter l'action à ma place.";
      break;
    case "financial_impact":
      body = deep
        ? "Reliez la décision à l'impact financier : timing cash, écart prix/quantité, provision ou marge. Vérifiez la lignée facture ↔ réception ↔ commande avant de justifier un montant."
        : "Quel effet cash ou marge cette décision produit-elle, et quelle pièce ERP le prouve ?";
      break;
    case "control":
      body = deep
        ? "Vérifiez la séparation des tâches, les profils d'accès et la piste d'audit. Un même acteur ne doit pas initier, approuver et clôturer sans contrôle compensatoire."
        : "Qui initie, qui approuve, qui contrôle ? Si c'est la même personne, où est le risque ?";
      break;
    case "kpi":
      body = deep
        ? "Un KPI utile éclaire une décision. Définissez la question métier, la formule, la source ERP simulée et la limite d'interprétation (ce que l'indicateur ne mesure pas)."
        : "Quel indicateur éclaire la décision, et d'où viennent ses données dans l'ERP simulé ?";
      break;
    case "common_error":
      body = deep
        ? "Erreur fréquente : traiter l'écran isolément. Relisez le briefing, validez les prérequis documentaires, puis justifiez le lien processus ↔ KPI. Je ne fournirai pas la réponse attendue."
        : "Erreur fréquente : sauter le diagnostic. Relisez le briefing et nommez le processus avant d'agir.";
      break;
    case "professor_style":
      body = deep
        ? "Comme un professeur : posez d'abord le « pourquoi » métier, puis le « comment » ERP, enfin le « comment savoir » (contrôle/KPI). Votre justification doit relier ces trois niveaux."
        : "Expliquez le concept en une phrase métier, une phrase ERP, une phrase de contrôle.";
      break;
    default:
      body = deep
        ? "Clarifiez l'objectif métier, les documents ERP impliqués, le risque si vous vous trompez, et l'indicateur qui confirmera le résultat. Je guide la démarche — je ne révèle pas les réponses attendues ni ne modifie scores, déblocages ou certificats."
        : "Je peux vous guider avec des questions réflexives sur le processus métier, sans modifier vos scores ni révéler les réponses attendues.";
  }

  const safeguards: string[] = [];
  if (moduleCode === "M8" || /hcm|rh|employ[eé]|absence|comp[eé]tence/.test(normalized)) {
    safeguards.push(HCM_SAFEGUARD);
  }
  if (moduleCode === "M10" || /kpi|bi\b|hallucin|biais|copilote|ia\b/.test(normalized)) {
    safeguards.push(M10_AI_SAFEGUARD);
  }

  return [prefix, body, ...safeguards].filter(Boolean).join(" ").trim();
}

export function isRateLimited(recentCount: number): boolean {
  return recentCount >= RATE_LIMIT_PER_HOUR;
}

export const AI_COACH_DISCLAIMER =
  "Le coach IA est un assistant pédagogique. Il ne remplace pas votre jugement professionnel ni les consignes du professeur.";
