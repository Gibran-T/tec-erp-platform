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
  M1: "Fondations ERP — cartographie processus, rôles et données de référence.",
  M2: "Données maîtres — articles, partenaires, cohérence des unités et coûts.",
  M3: "Procure-to-Pay — besoin, commande, réception, facture fournisseur.",
  M4: "Order-to-Cash — commande client, livraison, facturation, encaissement.",
  M5: "Supply Chain — stocks, transferts, risques de rupture.",
  M6: "Finance — factures, écarts, trésorerie et contrôles.",
  M7: "CRM — parcours client, opportunités et preuves transactionnelles.",
  M8: "Gouvernance — accès, séparation des tâches, contrôles internes.",
  M9: "BI & indicateurs — définition KPI, lignée de données, frontières analytiques.",
  M10: "Capstone / intégration — diagnostic transversal et recommandation exécutive.",
};

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

  return [prefix, body].filter(Boolean).join(" ").trim();
}

export function isRateLimited(recentCount: number): boolean {
  return recentCount >= RATE_LIMIT_PER_HOUR;
}

export const AI_COACH_DISCLAIMER =
  "Le coach IA est un assistant pédagogique. Il ne remplace pas votre jugement professionnel ni les consignes du professeur.";
