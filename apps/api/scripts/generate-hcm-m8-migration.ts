import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
} from "../src/modules/assessment/hcm/hcm-m8-question-bank.js";

assertHcmM8BankInvariants();

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlJson(value: unknown): string {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const lines: string[] = [];
lines.push("-- V2 official HCM Module 8 assessment bank (HCM_M8).");
lines.push("-- Additive / idempotent. Safe on populated V1 DBs. Does not alter historical attempts.");
lines.push("");
lines.push(
  'INSERT INTO "assessment_definition" ("id","code","title","moduleScope","passThresholdPercent","maxAttempts","timeLimitSeconds","definitionJson","createdAt","updatedAt") VALUES',
);
lines.push(
  `(${[
    sqlString("assess_hcm_m8"),
    sqlString(HCM_M8_ASSESSMENT_CODE),
    sqlString(HCM_M8_TITLE),
    sqlString(HCM_M8_MODULE_SCOPE),
    String(HCM_M8_PASS_THRESHOLD_PERCENT),
    String(HCM_M8_MAX_ATTEMPTS),
    String(HCM_M8_TIME_LIMIT_SECONDS),
    sqlJson(HCM_M8_DEFINITION_JSON),
    "CURRENT_TIMESTAMP",
    "CURRENT_TIMESTAMP",
  ].join(",")})`,
);
lines.push('ON CONFLICT ("code") DO UPDATE SET');
lines.push('  "title" = EXCLUDED."title",');
lines.push('  "moduleScope" = EXCLUDED."moduleScope",');
lines.push('  "passThresholdPercent" = EXCLUDED."passThresholdPercent",');
lines.push('  "maxAttempts" = EXCLUDED."maxAttempts",');
lines.push('  "timeLimitSeconds" = EXCLUDED."timeLimitSeconds",');
lines.push('  "definitionJson" = EXCLUDED."definitionJson",');
lines.push('  "updatedAt" = CURRENT_TIMESTAMP;');
lines.push("");
lines.push(
  'INSERT INTO "assessment_question" ("id","assessmentId","questionKey","sequence","type","prompt","optionsJson","scoringJson") VALUES',
);

const values = HCM_M8_QUESTIONS.map((question) => {
  const seeded = toAssessmentQuestionSeed(question);
  const id = `aq_hcm_m8_${String(question.sequence).padStart(2, "0")}`;
  return `(${[
    sqlString(id),
    sqlString("assess_hcm_m8"),
    sqlString(seeded.questionKey),
    String(seeded.sequence),
    sqlString("SINGLE_CHOICE"),
    sqlString(seeded.prompt),
    sqlJson(seeded.optionsJson),
    sqlJson(seeded.scoringJson),
  ].join(",")})`;
});
lines.push(`${values.join(",\n")}`);
lines.push('ON CONFLICT ("assessmentId","questionKey") DO UPDATE SET');
lines.push('  "sequence" = EXCLUDED."sequence",');
lines.push('  "type" = EXCLUDED."type",');
lines.push('  "prompt" = EXCLUDED."prompt",');
lines.push('  "optionsJson" = EXCLUDED."optionsJson",');
lines.push('  "scoringJson" = EXCLUDED."scoringJson";');
lines.push("");

const out = join(
  root,
  "packages/database-erp/prisma/migrations/20260726120000_v2_hcm_m8_assessment_bank/migration.sql",
);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${out} with ${HCM_M8_QUESTIONS.length} questions`);
