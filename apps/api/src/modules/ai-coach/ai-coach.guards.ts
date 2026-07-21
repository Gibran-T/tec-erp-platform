const ANSWER_KEY_PATTERNS = [
  /correctkeys/i,
  /bonne\s+r[eé]ponse/i,
  /answer\s*key/i,
  /cl[eé]\s+correcte/i,
  /solution\s+exacte/i,
  /revele\s+la\s+reponse/i,
  /donne\s+moi\s+la\s+reponse/i,
];

const MAX_QUESTION_LENGTH = 2000;
const RATE_LIMIT_PER_HOUR = 30;

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

export function buildDeterministicAiCoachAnswer(question: string): string {
  const normalized = question.toLowerCase();
  if (normalized.includes("kpi") || normalized.includes("indicateur")) {
    return "Commencez par identifier la decision que l'indicateur doit eclairer, puis verifiez la lignee des donnees dans l'ERP simule.";
  }
  if (normalized.includes("capstone") || normalized.includes("equinoxe")) {
    return "Structurez votre analyse en diagnostic, priorisation, execution, analyse et recommandation. Reliez chaque action a un processus ERP concret.";
  }
  if (normalized.includes("crm") || normalized.includes("client")) {
    return "Cartographiez d'abord le parcours client et les documents relies (commande, livraison, cas). Quelle preuve transactionnelle soutient votre prochaine action ?";
  }
  return "Je peux vous guider avec des questions reflexives sur le processus metier, sans modifier vos scores ni reveler les reponses attendues.";
}

export function isRateLimited(recentCount: number): boolean {
  return recentCount >= RATE_LIMIT_PER_HOUR;
}

export const AI_COACH_DISCLAIMER =
  "Le coach IA est un assistant pedagogique. Il ne remplace pas votre jugement professionnel ni les consignes du professeur.";
