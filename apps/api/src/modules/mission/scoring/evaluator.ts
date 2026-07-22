import type {
  MissionDefinitionDocument,
  MissionInteraction,
} from "@tec-platform/mission-catalog";

export interface ScoreInteractionResult {
  readonly interactionId: string;
  readonly earnedPoints: number;
  readonly maxPoints: number;
  readonly matchedConcepts: readonly string[];
  readonly feedback: string | null;
}

export interface MissionScoreResult {
  readonly earnedPoints: number;
  readonly maxPoints: number;
  readonly scorePercent: number;
  readonly passed: boolean;
  readonly interactionResults: readonly ScoreInteractionResult[];
  readonly feedback: string;
  readonly gapExplanation: string;
  readonly retryGuidance: string;
}

export type ResponseValue =
  | string
  | number
  | readonly string[]
  | readonly { readonly leftKey: string; readonly rightKey: string }[];

export interface ScoredResponse {
  readonly interactionId: string;
  readonly value: ResponseValue;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function scoreSingleChoice(interaction: MissionInteraction, value: ResponseValue): ScoreInteractionResult {
  const maxPoints = interaction.scoring.maxPoints;
  const selected = typeof value === "string" ? value : null;
  const correct = interaction.scoring.correctKeys ?? [];
  const ok = selected !== null && correct.includes(selected);

  return {
    interactionId: interaction.id,
    earnedPoints: ok ? maxPoints : 0,
    maxPoints,
    matchedConcepts: [],
    feedback: ok ? null : "Réponse incorrecte.",
  };
}

function scoreMultiChoice(interaction: MissionInteraction, value: ResponseValue): ScoreInteractionResult {
  const maxPoints = interaction.scoring.maxPoints;
  const selected = Array.isArray(value) && value.every((item) => typeof item === "string")
    ? (value as readonly string[])
    : [];
  const correct = new Set(interaction.scoring.correctKeys ?? []);
  const minimum = interaction.scoring.minimumSelections ?? correct.size;

  if (selected.length < minimum) {
    return {
      interactionId: interaction.id,
      earnedPoints: 0,
      maxPoints,
      matchedConcepts: [],
      feedback: `Sélectionnez au moins ${minimum} options.`,
    };
  }

  const selectedSet = new Set(selected);
  let hits = 0;
  for (const key of correct) {
    if (selectedSet.has(key)) {
      hits += 1;
    }
  }

  const falsePositives = selected.filter((key) => !correct.has(key)).length;
  const ratio = correct.size === 0 ? 0 : Math.max(0, hits - falsePositives) / correct.size;
  const earnedPoints = Math.round(maxPoints * ratio * 100) / 100;

  return {
    interactionId: interaction.id,
    earnedPoints,
    maxPoints,
    matchedConcepts: [],
    feedback: ratio >= 1 ? null : "Certaines sélections sont incomplètes ou incorrectes.",
  };
}

function scoreOrdering(interaction: MissionInteraction, value: ResponseValue): ScoreInteractionResult {
  const maxPoints = interaction.scoring.maxPoints;
  const order = Array.isArray(value) && value.every((item) => typeof item === "string")
    ? (value as readonly string[])
    : [];
  const expected = interaction.scoring.correctOrder ?? [];

  if (order.length !== expected.length) {
    return {
      interactionId: interaction.id,
      earnedPoints: 0,
      maxPoints,
      matchedConcepts: [],
      feedback: "L’ordre soumis est incomplet.",
    };
  }

  let matches = 0;
  for (let index = 0; index < expected.length; index += 1) {
    if (order[index] === expected[index]) {
      matches += 1;
    }
  }

  const ratio = expected.length === 0 ? 0 : matches / expected.length;
  return {
    interactionId: interaction.id,
    earnedPoints: Math.round(maxPoints * ratio * 100) / 100,
    maxPoints,
    matchedConcepts: [],
    feedback: ratio >= 1 ? null : "L’ordre proposé n’est que partiellement correct.",
  };
}

function scoreNumeric(interaction: MissionInteraction, value: ResponseValue): ScoreInteractionResult {
  const maxPoints = interaction.scoring.maxPoints;
  const target = interaction.scoring.numericTarget;
  const tolerance = interaction.scoring.numericTolerance ?? 0;
  const numeric = typeof value === "number" ? value : Number.NaN;

  if (target === undefined || Number.isNaN(numeric)) {
    return {
      interactionId: interaction.id,
      earnedPoints: 0,
      maxPoints,
      matchedConcepts: [],
      feedback: "Valeur numérique invalide.",
    };
  }

  const ok = Math.abs(numeric - target) <= tolerance;
  return {
    interactionId: interaction.id,
    earnedPoints: ok ? maxPoints : 0,
    maxPoints,
    matchedConcepts: [],
    feedback: ok ? null : "Valeur numérique incorrecte.",
  };
}

function scoreTextConcepts(
  interaction: MissionInteraction,
  value: ResponseValue,
): ScoreInteractionResult {
  const maxPoints = interaction.scoring.maxPoints;
  const text = typeof value === "string" ? value : "";
  const normalized = normalizeText(text);
  const required = interaction.scoring.requiredConcepts ?? [];
  const matched = required.filter((concept) => normalized.includes(normalizeText(concept)));
  const ratio = required.length === 0 ? 1 : matched.length / required.length;

  return {
    interactionId: interaction.id,
    earnedPoints: Math.round(maxPoints * ratio * 100) / 100,
    maxPoints,
    matchedConcepts: matched,
    feedback:
      ratio >= 1
        ? null
        : "Votre texte ne couvre pas encore tous les concepts attendus.",
  };
}

function scoreDiagnosis(
  interaction: MissionInteraction,
  value: ResponseValue,
): ScoreInteractionResult {
  const maxPoints = interaction.scoring.maxPoints;
  const pairs =
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        "leftKey" in item &&
        "rightKey" in item,
    )
      ? (value as readonly { readonly leftKey: string; readonly rightKey: string }[])
      : [];

  const allowed = interaction.scoring.allowedPairs ?? [];
  const minimum = interaction.scoring.minimumSelections ?? 1;

  if (pairs.length < minimum) {
    return {
      interactionId: interaction.id,
      earnedPoints: 0,
      maxPoints,
      matchedConcepts: [],
      feedback: `Fournissez au moins ${minimum} associations.`,
    };
  }

  const allowedSet = new Set(allowed.map((pair) => `${pair.leftKey}::${pair.rightKey}`));
  const validCount = pairs.filter((pair) =>
    allowedSet.has(`${pair.leftKey}::${pair.rightKey}`),
  ).length;
  const ratio = pairs.length === 0 ? 0 : validCount / pairs.length;

  return {
    interactionId: interaction.id,
    earnedPoints: Math.round(maxPoints * ratio * 100) / 100,
    maxPoints,
    matchedConcepts: [],
    feedback: ratio >= 1 ? null : "Certaines associations ne sont pas valides.",
  };
}

function scoreAcknowledgement(
  interaction: MissionInteraction,
  value: ResponseValue,
): ScoreInteractionResult {
  const maxPoints = interaction.scoring.maxPoints;
  const selected = Array.isArray(value) && value.every((item) => typeof item === "string")
    ? (value as readonly string[])
    : [];
  const required = interaction.scoring.correctKeys ?? [];
  const missing = required.filter((key) => !selected.includes(key));

  return {
    interactionId: interaction.id,
    earnedPoints: missing.length === 0 ? maxPoints : 0,
    maxPoints,
    matchedConcepts: [],
    feedback: missing.length === 0 ? null : "Contextes requis non reconnus.",
  };
}

function scoreInteraction(
  interaction: MissionInteraction,
  value: ResponseValue | undefined,
): ScoreInteractionResult {
  if (value === undefined) {
    return {
      interactionId: interaction.id,
      earnedPoints: 0,
      maxPoints: interaction.scoring.maxPoints,
      matchedConcepts: [],
      feedback: "Réponse manquante.",
    };
  }

  switch (interaction.type) {
    case "SINGLE_CHOICE":
      return scoreSingleChoice(interaction, value);
    case "MULTI_CHOICE":
      return scoreMultiChoice(interaction, value);
    case "ORDERING":
      return scoreOrdering(interaction, value);
    case "NUMERIC_INPUT":
      return scoreNumeric(interaction, value);
    case "TEXT_ANALYSIS":
      return scoreTextConcepts(interaction, value);
    case "DIAGNOSIS_RECOMMENDATION":
      return scoreDiagnosis(interaction, value);
    case "PROCESS_MAP_ACKNOWLEDGEMENT":
      return scoreAcknowledgement(interaction, value);
    default: {
      const _exhaustive: never = interaction.type;
      return {
        interactionId: interaction.id,
        earnedPoints: 0,
        maxPoints: interaction.scoring.maxPoints,
        matchedConcepts: [],
        feedback: `Type d’interaction non supporté: ${String(_exhaustive)}`,
      };
    }
  }
}

export function evaluateMissionResponses(
  definition: MissionDefinitionDocument,
  responses: readonly ScoredResponse[],
): MissionScoreResult {
  const byId = new Map(responses.map((item) => [item.interactionId, item.value]));
  const interactionResults = definition.interactions.map((interaction) =>
    scoreInteraction(interaction, byId.get(interaction.id)),
  );

  const earnedPoints = interactionResults.reduce((sum, item) => sum + item.earnedPoints, 0);
  const maxPoints = interactionResults.reduce((sum, item) => sum + item.maxPoints, 0);
  const scorePercent = maxPoints === 0 ? 0 : Math.round((earnedPoints / maxPoints) * 10000) / 100;
  const passed = scorePercent >= definition.passThresholdPercent;
  const lostPoints = Math.max(0, Math.round((maxPoints - earnedPoints) * 100) / 100);
  const gapExplanation = passed
    ? lostPoints > 0
      ? `Mission validée. ${lostPoints} point(s) non obtenus sur ${maxPoints} — révisez les critères partiels ci-dessous pour consolider votre maîtrise.`
      : "Mission validée avec le score maximal."
    : `Score insuffisant (${scorePercent} % / seuil ${definition.passThresholdPercent} %). ${lostPoints} point(s) manquants sur ${maxPoints}.`;
  const retryGuidance = passed
    ? lostPoints > 0
      ? "Vous pouvez poursuivre. Pour progresser, relisez le briefing et les critères où des points ont été perdus — sans chercher une clé de réponse."
      : "Poursuivez vers la mission suivante ou le module suivant."
    : "Relisez le briefing, vérifiez vos mappings et justifications, puis retentez la mission. Les erreurs de validation (champs incomplets) ne sont pas des déductions pédagogiques.";

  return {
    earnedPoints,
    maxPoints,
    scorePercent,
    passed,
    interactionResults,
    feedback: passed
      ? definition.completionFeedback
      : "Score insuffisant. Relisez le briefing et retentez la mission.",
    gapExplanation,
    retryGuidance,
  };
}

/** Lightweight keyword coverage helper used by unit tests and TEXT_ANALYSIS scoring. */
export function matchRequiredConcepts(
  text: string,
  requiredConcepts: readonly string[],
): readonly string[] {
  const normalized = normalizeText(text);
  return requiredConcepts.filter((concept) => normalized.includes(normalizeText(concept)));
}
