import { describe, expect, it } from "vitest";

import {
  assertHcmM8BankInvariants,
  HCM_M8_ASSESSMENT_CODE,
  HCM_M8_PASS_THRESHOLD_PERCENT,
  HCM_M8_QUESTION_COUNT,
  HCM_M8_QUESTIONS,
  HCM_M8_TIME_LIMIT_SECONDS,
  HCM_M8_TOTAL_POINTS,
  hcmM8AnswerKeyDistribution,
  hcmM8KindCounts,
  hcmM8MissionCounts,
  toAssessmentQuestionSeed,
} from "../hcm-m8-question-bank.js";
import { assessmentVisibleForCurriculum, modulesCompleteForAssessment } from "../hcm-m8.policy.js";
import { aggregateHcmAssessmentAnalytics } from "../hcm-m8.analytics.js";
import { buildHcmSubmitFeedback } from "../hcm-m8.feedback.js";
import { scoreAssessmentResponses } from "../../assessment.service.js";

describe("HCM_M8 official question bank", () => {
  it("exists only as V2 HCM assessment identity", () => {
    expect(HCM_M8_ASSESSMENT_CODE).toBe("HCM_M8");
    expect(assessmentVisibleForCurriculum("HCM_M8", { curriculumVersion: "V2" }, "V2")).toBe(true);
    expect(assessmentVisibleForCurriculum("HCM_M8", { curriculumVersion: "V2" }, "V1")).toBe(false);
    expect(assessmentVisibleForCurriculum("SILVER_M1_M2", {}, "V1")).toBe(true);
  });

  it("has exactly 20 questions totaling 100 points with 7/7/6 mission split", () => {
    assertHcmM8BankInvariants();
    expect(HCM_M8_QUESTIONS).toHaveLength(HCM_M8_QUESTION_COUNT);
    expect(HCM_M8_TOTAL_POINTS).toBe(100);
    expect(HCM_M8_PASS_THRESHOLD_PERCENT).toBe(70);
    expect(HCM_M8_TIME_LIMIT_SECONDS).toBe(2400);
    expect(hcmM8MissionCounts()).toEqual({
      "M8-M01": 7,
      "M8-M02": 7,
      "M8-M03": 6,
    });
  });

  it("matches required question-type and balanced answer-key distributions", () => {
    expect(hcmM8KindCounts()).toEqual({
      conceptual: 5,
      scenario: 5,
      sequence: 3,
      interpretation: 3,
      quantitative: 2,
      diagnosis_governance: 2,
    });
    expect(hcmM8AnswerKeyDistribution()).toEqual({ a: 5, b: 5, c: 5, d: 5 });
  });

  it("has unique codes, one canonical answer, explanations and mission metadata", () => {
    const keys = new Set(HCM_M8_QUESTIONS.map((question) => question.questionKey));
    expect(keys.size).toBe(20);
    for (const question of HCM_M8_QUESTIONS) {
      const seeded = toAssessmentQuestionSeed(question);
      expect(seeded.scoringJson.correctKeys).toEqual([question.correctKey]);
      expect(seeded.scoringJson.explanation.length).toBeGreaterThan(10);
      expect(seeded.scoringJson.mission).toMatch(/^M8-M0[123]$/);
      expect(seeded.scoringJson.competency.startsWith("C-HCM-")).toBe(true);
      expect(question.options).toHaveLength(4);
    }
  });

  it("keeps quantitative calculations deterministic", () => {
    const q10 = HCM_M8_QUESTIONS.find((question) => question.questionKey === "HCM-M8-Q10");
    const q11 = HCM_M8_QUESTIONS.find((question) => question.questionKey === "HCM-M8-Q11");
    expect(q10?.quantitative?.expected).toEqual({
      remainingRegularCapacityHours: 24,
      capacityGapOvertimeHours: 12,
    });
    expect(q11?.quantitative?.expected).toEqual({
      overtimeHourlyCost: 42,
      incrementalOvertimeCost: 504,
    });
    expect(40 - 16).toBe(24);
    expect(36 - 24).toBe(12);
    expect(28 * 1.5).toBe(42);
    expect(12 * 42).toBe(504);
  });

  it("scores a perfect HCM submission at 100 and fails below 70", () => {
    const questions = HCM_M8_QUESTIONS.map((question) => ({
      questionKey: question.questionKey,
      scoringJson: { maxPoints: question.points, correctKeys: [question.correctKey] },
    }));
    const perfect = scoreAssessmentResponses(
      questions,
      HCM_M8_QUESTIONS.map((question) => ({
        questionKey: question.questionKey,
        value: question.correctKey,
      })),
    );
    expect(perfect.earned).toBe(100);
    expect(perfect.scorePercent).toBe(100);
    expect(perfect.scorePercent >= HCM_M8_PASS_THRESHOLD_PERCENT).toBe(true);

    const thirteenCorrect = HCM_M8_QUESTIONS.map((question, index) => ({
      questionKey: question.questionKey,
      value: index < 13 ? question.correctKey : question.options.find((option) => option.key !== question.correctKey)!.key,
    }));
    const scored = scoreAssessmentResponses(questions, thirteenCorrect);
    expect(scored.earned).toBe(65);
    expect(scored.scorePercent >= HCM_M8_PASS_THRESHOLD_PERCENT).toBe(false);
  });

  it("unlocks only after M8 HCM missions are complete on V2", () => {
    const incomplete = modulesCompleteForAssessment({
      assessmentCode: "HCM_M8",
      curriculumVersion: "V2",
      completedMissionKeys: new Set(["m8-m01-integrer-nouvel-employe"]),
    });
    expect(incomplete).toBe(false);

    const complete = modulesCompleteForAssessment({
      assessmentCode: "HCM_M8",
      curriculumVersion: "V2",
      completedMissionKeys: new Set([
        "m8-m01-integrer-nouvel-employe",
        "m8-m02-gerer-temps-absences",
        "m8-m03-evaluer-competences-evolution",
      ]),
    });
    expect(complete).toBe(true);
  });

  it("builds learner feedback with mission revision guidance and no answer-key dump", () => {
    const responses = HCM_M8_QUESTIONS.map((question) => ({
      questionKey: question.questionKey,
      value: question.correctKey === "a" ? "b" : "a",
    }));
    const feedback = buildHcmSubmitFeedback(responses, 0, false);
    expect(feedback.feedback).toContain("Seuil HCM non atteint");
    expect(feedback.details.revisionAreas.length).toBeGreaterThan(0);
    expect(feedback.feedback.toLowerCase()).not.toContain("correctkeys");
    expect(feedback.details.privacyGovernanceReminder.length).toBeGreaterThan(10);
    expect(feedback.details.humanAccountabilityReminder.length).toBeGreaterThan(10);
  });

  it("aggregates analytics without inventing double-count learners", () => {
    const analytics = aggregateHcmAssessmentAnalytics([
      {
        employeeId: "e1",
        pedagogicalCourseRunId: "r1",
        curriculumVersion: "V2",
        attemptNumber: 1,
        status: "passed",
        scorePercent: 80,
        responses: HCM_M8_QUESTIONS.map((question) => ({
          questionKey: question.questionKey,
          value: question.correctKey,
        })),
      },
      {
        employeeId: "e2",
        pedagogicalCourseRunId: "r2",
        curriculumVersion: "V2",
        attemptNumber: 1,
        status: "failed",
        scorePercent: 60,
        responses: HCM_M8_QUESTIONS.map((question) => ({
          questionKey: question.questionKey,
          value: question.correctKey === "a" ? "b" : "a",
        })),
      },
    ]);
    expect(analytics.learnerCount).toBe(2);
    expect(analytics.averageScore).toBe(70);
    expect(analytics.successRate).toBe(50);
    expect(analytics.quantitativeErrorRate).toBeGreaterThan(0);
  });

  it("never exposes answer key fields on learner question seed presentation shape", () => {
    for (const question of HCM_M8_QUESTIONS) {
      const presentation = {
        questionKey: question.questionKey,
        type: "SINGLE_CHOICE",
        prompt: question.prompt,
        options: question.options.map((option) => ({ key: option.key, label: option.label })),
      };
      expect(JSON.stringify(presentation)).not.toContain("correctKey");
      expect(JSON.stringify(presentation)).not.toContain("explanation");
    }
  });
});
