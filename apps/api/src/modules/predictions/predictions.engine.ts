import { listAllMissions } from "@tec-platform/mission-catalog";

export const PREDICTION_MODEL_VERSION = "v1-deterministic-2026-07";

export interface AttemptSummary {
  readonly missionKey: string;
  readonly status: string;
  readonly scorePercent: number | null;
}

export interface PredictionPayload {
  readonly missionFailureRisk: number;
  readonly nonCompletionRisk: number;
  readonly competencyWeakness: string | null;
  readonly modelVersion: string;
  readonly evidence: Readonly<Record<string, unknown>>;
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value * 100) / 100));
}

export function computePredictions(attempts: readonly AttemptSummary[]): PredictionPayload {
  const allMissions = listAllMissions();
  const completed = new Set(
    attempts.filter((attempt) => attempt.status === "completed").map((attempt) => attempt.missionKey),
  );
  const failed = attempts.filter((attempt) => attempt.status === "failed").length;
  const inProgress = attempts.filter((attempt) => attempt.status === "in_progress").length;
  const lowScores = attempts.filter(
    (attempt) => attempt.scorePercent !== null && attempt.scorePercent < 70,
  ).length;

  const completionRatio = allMissions.length === 0 ? 0 : completed.size / allMissions.length;
  const nonCompletionRisk = clampPercent((1 - completionRatio) * 100 + inProgress * 2);
  const missionFailureRisk = clampPercent(failed * 15 + lowScores * 10 + inProgress * 5);

  let competencyWeakness: string | null = null;
  if (lowScores >= 2) {
    competencyWeakness = "Analyse transactionnelle et justification metier";
  } else if (nonCompletionRisk >= 60) {
    competencyWeakness = "Regularite de completion des missions";
  }

  return {
    missionFailureRisk,
    nonCompletionRisk,
    competencyWeakness,
    modelVersion: PREDICTION_MODEL_VERSION,
    evidence: {
      completedCount: completed.size,
      totalMissions: allMissions.length,
      failedAttempts: failed,
      lowScoreAttempts: lowScores,
    },
  };
}
