import type { PrismaClient, Prisma } from "@tec-platform/database-erp";

import {
  assertHcmM8BankInvariants,
  HCM_M8_ASSESSMENT_CODE,
  HCM_M8_DEFINITION_JSON,
  HCM_M8_MAX_ATTEMPTS,
  HCM_M8_MODULE_SCOPE,
  HCM_M8_PASS_THRESHOLD_PERCENT,
  HCM_M8_QUESTIONS,
  HCM_M8_TIME_LIMIT_SECONDS,
  HCM_M8_TITLE,
  toAssessmentQuestionSeed,
} from "./hcm-m8-question-bank.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

const DEFINITION_ID = "assess_hcm_m8";

/**
 * Idempotent, non-destructive upsert of the official HCM_M8 bank.
 * Safe on populated V1 databases: does not touch historical attempts.
 */
export async function seedHcmM8AssessmentBank(client: PrismaClient): Promise<{
  readonly assessmentCode: string;
  readonly questionCount: number;
  readonly upserted: boolean;
}> {
  assertHcmM8BankInvariants();

  await client.assessmentDefinition.upsert({
    where: { code: HCM_M8_ASSESSMENT_CODE },
    create: {
      id: DEFINITION_ID,
      code: HCM_M8_ASSESSMENT_CODE,
      title: HCM_M8_TITLE,
      moduleScope: HCM_M8_MODULE_SCOPE,
      passThresholdPercent: HCM_M8_PASS_THRESHOLD_PERCENT,
      maxAttempts: HCM_M8_MAX_ATTEMPTS,
      timeLimitSeconds: HCM_M8_TIME_LIMIT_SECONDS,
      definitionJson: toInputJson(HCM_M8_DEFINITION_JSON),
    },
    update: {
      title: HCM_M8_TITLE,
      moduleScope: HCM_M8_MODULE_SCOPE,
      passThresholdPercent: HCM_M8_PASS_THRESHOLD_PERCENT,
      maxAttempts: HCM_M8_MAX_ATTEMPTS,
      timeLimitSeconds: HCM_M8_TIME_LIMIT_SECONDS,
      definitionJson: toInputJson(HCM_M8_DEFINITION_JSON),
    },
  });

  const definition = await client.assessmentDefinition.findUniqueOrThrow({
    where: { code: HCM_M8_ASSESSMENT_CODE },
  });

  for (const question of HCM_M8_QUESTIONS) {
    const seeded = toAssessmentQuestionSeed(question);
    const id = `aq_hcm_m8_${String(question.sequence).padStart(2, "0")}`;
    await client.assessmentQuestion.upsert({
      where: {
        assessmentId_questionKey: {
          assessmentId: definition.id,
          questionKey: seeded.questionKey,
        },
      },
      create: {
        id,
        assessmentId: definition.id,
        questionKey: seeded.questionKey,
        sequence: seeded.sequence,
        type: seeded.type,
        prompt: seeded.prompt,
        optionsJson: toInputJson(seeded.optionsJson),
        scoringJson: toInputJson(seeded.scoringJson),
      },
      update: {
        sequence: seeded.sequence,
        type: seeded.type,
        prompt: seeded.prompt,
        optionsJson: toInputJson(seeded.optionsJson),
        scoringJson: toInputJson(seeded.scoringJson),
      },
    });
  }

  return {
    assessmentCode: HCM_M8_ASSESSMENT_CODE,
    questionCount: HCM_M8_QUESTIONS.length,
    upserted: true,
  };
}
