import {
  HCM_M8_ASSESSMENT_CODE,
  HCM_M8_QUESTIONS,
  type HcmMissionCode,
  type HcmQuestionKind,
} from "./hcm-m8-question-bank.js";

export interface HcmAttemptAnalyticsInput {
  readonly employeeId: string;
  readonly pedagogicalCourseRunId: string;
  readonly curriculumVersion: "V1" | "V2";
  readonly attemptNumber: number;
  readonly status: string;
  readonly scorePercent: number | null;
  readonly responses: ReadonlyArray<{ readonly questionKey: string; readonly value: string | string[] }>;
}

export interface HcmCohortAnalytics {
  readonly assessmentCode: typeof HCM_M8_ASSESSMENT_CODE;
  readonly learnerCount: number;
  readonly attemptCount: number;
  readonly averageScore: number;
  readonly medianScore: number;
  readonly successRate: number;
  readonly missionBreakdown: Record<HcmMissionCode, { correctRate: number; answered: number }>;
  readonly questionSuccessRate: Record<string, number>;
  readonly mostMissedQuestions: string[];
  readonly quantitativeErrorRate: number;
  readonly privacyGovernanceErrorRate: number;
  readonly competencyBreakdown: Record<string, { correct: number; total: number }>;
  readonly questionTypeBreakdown: Record<HcmQuestionKind, { correct: number; total: number }>;
}

function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2) * 100) / 100;
  }
  return sorted[mid] ?? 0;
}

/**
 * Aggregates HCM analytics without double-counting a learner across multiple runs:
 * callers must pass at most one official attempt (or best attempt) per learner.
 */
export function aggregateHcmAssessmentAnalytics(
  attempts: readonly HcmAttemptAnalyticsInput[],
): HcmCohortAnalytics {
  const scores = attempts
    .map((attempt) => attempt.scorePercent)
    .filter((score): score is number => score != null);
  const passed = attempts.filter(
    (attempt) => attempt.status === "passed" || (attempt.scorePercent != null && attempt.scorePercent >= 70),
  ).length;

  const questionHits: Record<string, { correct: number; total: number }> = {};
  const missionHits: Record<HcmMissionCode, { correct: number; total: number }> = {
    "M8-M01": { correct: 0, total: 0 },
    "M8-M02": { correct: 0, total: 0 },
    "M8-M03": { correct: 0, total: 0 },
  };
  const competencyBreakdown: Record<string, { correct: number; total: number }> = {};
  const questionTypeBreakdown: Record<HcmQuestionKind, { correct: number; total: number }> = {
    conceptual: { correct: 0, total: 0 },
    scenario: { correct: 0, total: 0 },
    sequence: { correct: 0, total: 0 },
    interpretation: { correct: 0, total: 0 },
    quantitative: { correct: 0, total: 0 },
    diagnosis_governance: { correct: 0, total: 0 },
  };

  let quantitativeTotal = 0;
  let quantitativeErrors = 0;
  let privacyTotal = 0;
  let privacyErrors = 0;

  for (const attempt of attempts) {
    const byKey = new Map(
      attempt.responses.map((response) => [response.questionKey, response.value]),
    );
    for (const question of HCM_M8_QUESTIONS) {
      const value = byKey.get(question.questionKey);
      if (value == null) {
        continue;
      }
      const selected = typeof value === "string" ? value : null;
      const isCorrect = selected === question.correctKey;
      questionHits[question.questionKey] ??= { correct: 0, total: 0 };
      questionHits[question.questionKey]!.total += 1;
      if (isCorrect) {
        questionHits[question.questionKey]!.correct += 1;
      }
      missionHits[question.mission].total += 1;
      if (isCorrect) {
        missionHits[question.mission].correct += 1;
      }
      competencyBreakdown[question.competency] ??= { correct: 0, total: 0 };
      competencyBreakdown[question.competency]!.total += 1;
      if (isCorrect) {
        competencyBreakdown[question.competency]!.correct += 1;
      }
      questionTypeBreakdown[question.kind].total += 1;
      if (isCorrect) {
        questionTypeBreakdown[question.kind].correct += 1;
      }
      if (question.kind === "quantitative") {
        quantitativeTotal += 1;
        if (!isCorrect) {
          quantitativeErrors += 1;
        }
      }
      const privacyTagged =
        question.tags.includes("privacy") ||
        question.tags.includes("governance") ||
        question.kind === "diagnosis_governance";
      if (privacyTagged) {
        privacyTotal += 1;
        if (!isCorrect) {
          privacyErrors += 1;
        }
      }
    }
  }

  const questionSuccessRate = Object.fromEntries(
    Object.entries(questionHits).map(([key, value]) => [
      key,
      value.total === 0 ? 0 : Math.round((value.correct / value.total) * 10000) / 100,
    ]),
  );

  const mostMissedQuestions = Object.entries(questionSuccessRate)
    .sort((left, right) => left[1] - right[1])
    .slice(0, 5)
    .map(([key]) => key);

  const averageScore =
    scores.length === 0
      ? 0
      : Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100;

  return {
    assessmentCode: HCM_M8_ASSESSMENT_CODE,
    learnerCount: new Set(attempts.map((attempt) => attempt.employeeId)).size,
    attemptCount: attempts.length,
    averageScore,
    medianScore: median(scores),
    successRate:
      attempts.length === 0 ? 0 : Math.round((passed / attempts.length) * 10000) / 100,
    missionBreakdown: {
      "M8-M01": {
        answered: missionHits["M8-M01"].total,
        correctRate:
          missionHits["M8-M01"].total === 0
            ? 0
            : Math.round((missionHits["M8-M01"].correct / missionHits["M8-M01"].total) * 10000) /
              100,
      },
      "M8-M02": {
        answered: missionHits["M8-M02"].total,
        correctRate:
          missionHits["M8-M02"].total === 0
            ? 0
            : Math.round((missionHits["M8-M02"].correct / missionHits["M8-M02"].total) * 10000) /
              100,
      },
      "M8-M03": {
        answered: missionHits["M8-M03"].total,
        correctRate:
          missionHits["M8-M03"].total === 0
            ? 0
            : Math.round((missionHits["M8-M03"].correct / missionHits["M8-M03"].total) * 10000) /
              100,
      },
    },
    questionSuccessRate,
    mostMissedQuestions,
    quantitativeErrorRate:
      quantitativeTotal === 0
        ? 0
        : Math.round((quantitativeErrors / quantitativeTotal) * 10000) / 100,
    privacyGovernanceErrorRate:
      privacyTotal === 0 ? 0 : Math.round((privacyErrors / privacyTotal) * 10000) / 100,
    competencyBreakdown,
    questionTypeBreakdown,
  };
}
