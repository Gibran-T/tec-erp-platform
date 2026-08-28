import type { InteractionResponses } from "../mission/MissionInteractions.js";
import type { ConnectionLabActivity, ConnectionLabDefinition, ConsolidationQuizItem } from "./types.js";

export interface LabActivityScore {
  readonly activityId: string;
  readonly earnedPoints: number;
  readonly maxPoints: number;
  readonly matchedConcepts: readonly string[];
  readonly feedback: string | null;
  readonly passed: boolean;
}

export interface LabScoreResult {
  readonly earnedPoints: number;
  readonly maxPoints: number;
  readonly scorePercent: number;
  readonly passed: boolean;
  readonly activityResults: readonly LabActivityScore[];
  readonly summaryFeedback: {
    readonly correctRelationships: string;
    readonly missingRelationships: string;
    readonly systemicImplication: string;
    readonly improvement: string;
  };
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function scoreActivity(
  activity: ConnectionLabActivity,
  value: InteractionResponses[string] | undefined,
): LabActivityScore {
  const scoring = activity.interaction.scoring;
  const maxPoints = scoring.maxPoints;
  const type = activity.interaction.type;

  if (value === undefined) {
    return {
      activityId: activity.id,
      earnedPoints: 0,
      maxPoints,
      matchedConcepts: [],
      feedback: "Réponse manquante.",
      passed: false,
    };
  }

  if (type === "DIAGNOSIS_RECOMMENDATION") {
    const pairs =
      Array.isArray(value) &&
      value.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "leftKey" in item &&
          "rightKey" in item,
      )
        ? (value as Array<{ leftKey: string; rightKey: string }>)
        : [];
    const allowed = scoring.allowedPairs ?? [];
    const minimum = scoring.minimumSelections ?? 1;
    if (pairs.length < minimum) {
      return {
        activityId: activity.id,
        earnedPoints: 0,
        maxPoints,
        matchedConcepts: [],
        feedback: `Fournissez au moins ${minimum} associations.`,
        passed: false,
      };
    }
    const allowedSet = new Set(
      allowed.map((pair: { leftKey: string; rightKey: string }) => `${pair.leftKey}::${pair.rightKey}`),
    );
    const validCount = pairs.filter((pair) =>
      allowedSet.has(`${pair.leftKey}::${pair.rightKey}`),
    ).length;
    const ratio = pairs.length === 0 ? 0 : validCount / pairs.length;
    const earnedPoints = Math.round(maxPoints * ratio * 100) / 100;
    return {
      activityId: activity.id,
      earnedPoints,
      maxPoints,
      matchedConcepts: [],
      feedback: ratio >= 1 ? null : "Certaines associations ne sont pas valides.",
      passed: ratio >= 0.7,
    };
  }

  if (type === "ORDERING") {
    const order =
      Array.isArray(value) && value.every((item) => typeof item === "string")
        ? (value as string[])
        : [];
    const expected = scoring.correctOrder ?? [];
    if (order.length !== expected.length) {
      return {
        activityId: activity.id,
        earnedPoints: 0,
        maxPoints,
        matchedConcepts: [],
        feedback: "L’ordre soumis est incomplet.",
        passed: false,
      };
    }
    let matches = 0;
    for (let index = 0; index < expected.length; index += 1) {
      if (order[index] === expected[index]) {
        matches += 1;
      }
    }
    const ratio = expected.length === 0 ? 0 : matches / expected.length;
    const earnedPoints = Math.round(maxPoints * ratio * 100) / 100;
    return {
      activityId: activity.id,
      earnedPoints,
      maxPoints,
      matchedConcepts: [],
      feedback: ratio >= 1 ? null : "L’ordre proposé n’est que partiellement correct.",
      passed: ratio >= 1,
    };
  }

  if (type === "NUMERIC_INPUT") {
    const numeric = typeof value === "number" ? value : Number.NaN;
    const target = scoring.numericTarget;
    const tolerance = scoring.numericTolerance ?? 0;
    if (target === undefined || Number.isNaN(numeric)) {
      return {
        activityId: activity.id,
        earnedPoints: 0,
        maxPoints,
        matchedConcepts: [],
        feedback: "Valeur numérique invalide.",
        passed: false,
      };
    }
    const ok = Math.abs(numeric - target) <= tolerance;
    return {
      activityId: activity.id,
      earnedPoints: ok ? maxPoints : 0,
      maxPoints,
      matchedConcepts: [],
      feedback: ok ? null : "Valeur numérique incorrecte.",
      passed: ok,
    };
  }

  if (type === "TEXT_ANALYSIS") {
    const text = typeof value === "string" ? value : "";
    const normalized = normalizeText(text);
    const required = scoring.requiredConcepts ?? [];
    const matched = required.filter((concept: string) =>
      normalized.includes(normalizeText(concept)),
    );
    const ratio = required.length === 0 ? 1 : matched.length / required.length;
    const earnedPoints = Math.round(maxPoints * ratio * 100) / 100;
    return {
      activityId: activity.id,
      earnedPoints,
      maxPoints,
      matchedConcepts: matched,
      feedback:
        ratio >= 1
          ? null
          : "Votre texte ne couvre pas encore tous les concepts attendus.",
      passed: ratio >= 0.67,
    };
  }

  if (type === "SINGLE_CHOICE") {
    const selected = typeof value === "string" ? value : null;
    const correct = scoring.correctKeys ?? [];
    const ok = selected !== null && correct.includes(selected);
    return {
      activityId: activity.id,
      earnedPoints: ok ? maxPoints : 0,
      maxPoints,
      matchedConcepts: [],
      feedback: ok ? null : "Réponse incorrecte.",
      passed: ok,
    };
  }

  return {
    activityId: activity.id,
    earnedPoints: 0,
    maxPoints,
    matchedConcepts: [],
    feedback: "Type d’activité non supporté dans le laboratoire.",
    passed: false,
  };
}

export function scoreConnectionLab(
  lab: ConnectionLabDefinition,
  responses: InteractionResponses,
): LabScoreResult {
  const activityResults = lab.activities.map((activity) =>
    scoreActivity(activity, responses[activity.interaction.id]),
  );
  const earnedPoints = activityResults.reduce((sum, item) => sum + item.earnedPoints, 0);
  const maxPoints = activityResults.reduce((sum, item) => sum + item.maxPoints, 0);
  const scorePercent = maxPoints === 0 ? 0 : Math.round((earnedPoints / maxPoints) * 10000) / 100;
  const passed = scorePercent >= lab.passThresholdPercent;

  return {
    earnedPoints,
    maxPoints,
    scorePercent,
    passed,
    activityResults,
    summaryFeedback: lab.feedback,
  };
}

export interface QuizScoreResult {
  readonly earned: number;
  readonly total: number;
  readonly percent: number;
  readonly passed: boolean;
  readonly results: readonly {
    readonly id: string;
    readonly correct: boolean;
    readonly explanation: string;
  }[];
}

export function scoreConsolidationQuiz(
  items: readonly ConsolidationQuizItem[],
  answers: Record<string, string>,
  passThresholdPercent = 70,
): QuizScoreResult {
  const results = items.map((item) => {
    const selected = answers[item.id] ?? "";
    const correct = selected === item.correctKey;
    return {
      id: item.id,
      correct,
      explanation: item.explanation,
    };
  });
  const earned = results.filter((item) => item.correct).length;
  const total = items.length;
  const percent = total === 0 ? 0 : Math.round((earned / total) * 10000) / 100;
  return {
    earned,
    total,
    percent,
    passed: percent >= passThresholdPercent,
    results,
  };
}
