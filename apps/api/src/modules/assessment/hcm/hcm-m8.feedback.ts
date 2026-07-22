import type { AssessmentSubmitRequest } from "@tec-platform/contracts";

import {
  HCM_M8_QUESTIONS,
  type HcmBankQuestion,
  type HcmMissionCode,
} from "./hcm-m8-question-bank.js";

export interface HcmSubmitFeedbackDetails {
  readonly strengths: string[];
  readonly revisionAreas: string[];
  readonly missionBreakdown: Array<{
    readonly mission: HcmMissionCode;
    readonly earned: number;
    readonly max: number;
    readonly percent: number;
  }>;
  readonly quantitativeNotes: string[];
  readonly privacyGovernanceReminder: string;
  readonly humanAccountabilityReminder: string;
}

function missionMax(mission: HcmMissionCode): number {
  return HCM_M8_QUESTIONS.filter((q) => q.mission === mission).reduce((sum, q) => sum + q.points, 0);
}

export function buildHcmSubmitFeedback(
  responses: AssessmentSubmitRequest["responses"],
  scorePercent: number,
  passed: boolean,
): { readonly feedback: string; readonly details: HcmSubmitFeedbackDetails } {
  const byKey = new Map(responses.map((response) => [response.questionKey, response.value]));
  const correct: HcmBankQuestion[] = [];
  const incorrect: HcmBankQuestion[] = [];

  for (const question of HCM_M8_QUESTIONS) {
    const value = byKey.get(question.questionKey);
    const selected = typeof value === "string" ? value : null;
    if (selected === question.correctKey) {
      correct.push(question);
    } else {
      incorrect.push(question);
    }
  }

  const missionCodes: HcmMissionCode[] = ["M8-M01", "M8-M02", "M8-M03"];
  const missionBreakdown = missionCodes.map((mission) => {
    const missionQuestions = HCM_M8_QUESTIONS.filter((q) => q.mission === mission);
    const earned = missionQuestions
      .filter((q) => correct.some((item) => item.questionKey === q.questionKey))
      .reduce((sum, q) => sum + q.points, 0);
    const max = missionMax(mission);
    return {
      mission,
      earned,
      max,
      percent: max === 0 ? 0 : Math.round((earned / max) * 10000) / 100,
    };
  });

  const strengths = [...new Set(correct.map((q) => `${q.mission} / ${q.competency} — ${q.sourceConcept}`))];
  const revisionAreas = [
    ...new Set(
      incorrect.map(
        (q) => `${q.mission} / ${q.competency}: revoir « ${q.sourceConcept} » — ${q.explanation}`,
      ),
    ),
  ];

  const quantitativeNotes: string[] = [];
  for (const question of incorrect.filter((q) => q.kind === "quantitative")) {
    if (question.questionKey === "HCM-M8-Q10") {
      quantitativeNotes.push(
        "Correction quantitative: capacité restante = 40 − 16 = 24 h; écart = 36 − 24 = 12 h d'heures supplémentaires.",
      );
    }
    if (question.questionKey === "HCM-M8-Q11") {
      quantitativeNotes.push(
        "Correction quantitative: taux HS = 28 × 1,5 = 42 $/h; coût incrémental = 12 × 42 = 504 $.",
      );
    }
  }

  const privacyGovernanceReminder =
    "Rappel confidentialité: minimiser les données sensibles (ex. NAS hors tickets d'accès) et exclure les attributs protégés des décisions d'emploi.";
  const humanAccountabilityReminder =
    "Rappel responsabilité humaine: les recommandations IA sont consultatives; le manager demeure accountable des décisions HCM.";

  const header = passed
    ? `Évaluation HCM réussie (${scorePercent}%).`
    : `Seuil HCM non atteint (${scorePercent}%). Revoyez les concepts ci-dessous; les missions M8 déjà réussies ne sont pas effacées.`;

  const feedback = [
    header,
    strengths.length > 0 ? `Forces: ${strengths.slice(0, 4).join(" | ")}` : null,
    revisionAreas.length > 0 ? `À revoir: ${revisionAreas.slice(0, 5).join(" | ")}` : null,
    ...quantitativeNotes,
    privacyGovernanceReminder,
    humanAccountabilityReminder,
  ]
    .filter((line): line is string => Boolean(line))
    .join(" ");

  return {
    feedback,
    details: {
      strengths,
      revisionAreas,
      missionBreakdown,
      quantitativeNotes,
      privacyGovernanceReminder,
      humanAccountabilityReminder,
    },
  };
}
