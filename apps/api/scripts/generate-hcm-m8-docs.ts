import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  assertHcmM8BankInvariants,
  HCM_M8_ASSESSMENT_CODE,
  HCM_M8_MAX_ATTEMPTS,
  HCM_M8_PASS_THRESHOLD_PERCENT,
  HCM_M8_QUESTIONS,
  HCM_M8_TIME_LIMIT_SECONDS,
  HCM_M8_TITLE,
  HCM_M8_TOTAL_POINTS,
  hcmM8AnswerKeyDistribution,
  hcmM8KindCounts,
  hcmM8MissionCounts,
} from "../src/modules/assessment/hcm/hcm-m8-question-bank.js";

assertHcmM8BankInvariants();

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const outDir = join(root, "engineering/v2/hcm-assessment");
mkdirSync(outDir, { recursive: true });

const matrixRows = HCM_M8_QUESTIONS.map(
  (q) =>
    `| ${q.questionKey} | ${q.mission} | ${q.competency} | ${q.kind} | ${q.points} | ${q.difficulty} | ${q.correctKey.toUpperCase()} | ${q.businessRationale.replace(/\|/g, "/")} |`,
).join("\n");

const answerRows = HCM_M8_QUESTIONS.map(
  (q) =>
    `| ${q.questionKey} | ${q.correctKey.toUpperCase()} | ${q.explanation.replace(/\|/g, "/")} |`,
).join("\n");

writeFileSync(
  join(outDir, "TEC_ERP_V2_HCM_ASSESSMENT_CONTRACT.md"),
  `# TEC.ERP V2 — HCM Assessment Contract

## Identity
- Code: \`${HCM_M8_ASSESSMENT_CODE}\`
- Title: ${HCM_M8_TITLE}
- Curriculum: **V2 only**
- Module: M8
- Questions: ${HCM_M8_QUESTIONS.length}
- Total points: ${HCM_M8_TOTAL_POINTS}
- Duration: ${HCM_M8_TIME_LIMIT_SECONDS / 60} minutes
- Pass threshold: ${HCM_M8_PASS_THRESHOLD_PERCENT}%
- Attempt policy: max ${HCM_M8_MAX_ATTEMPTS} (official V2 assessment policy)

## Missions covered
- M8-M01 — Intégrer un nouvel employé (7 / 35)
- M8-M02 — Gérer le temps, les absences et l’impact financier (7 / 35)
- M8-M03 — Évaluer les compétences et préparer l’évolution (6 / 30)

## Unlock
- Selected run \`curriculumVersion = V2\`
- M8 HCM missions completed on that run
- Run status permits assessment activity
- Hidden from V1 learners (not required; no fabricated HCM result)

## Gold / Capstone
- HCM contributes to V2 required assessments
- Gold still requires 30 regular missions + required V2 assessments (incl. HCM_M8 + GOLD_M7_M10) + Capstone professor-approved
- HCM alone never issues Gold
- V1 certification history preserved exactly

## Scoring authority
Server-side only. Learner APIs never expose \`correctKeys\` before submission.
`,
  "utf8",
);

writeFileSync(
  join(outDir, "TEC_ERP_V2_HCM_QUESTION_MATRIX.md"),
  `# TEC.ERP V2 — HCM Question Matrix

Mission counts: ${JSON.stringify(hcmM8MissionCounts())}
Type counts: ${JSON.stringify(hcmM8KindCounts())}
Answer-key distribution: ${JSON.stringify(hcmM8AnswerKeyDistribution())}

| code | mission | competency | type | points | difficulty | correct | rationale |
|------|---------|------------|------|--------|------------|---------|-----------|
${matrixRows}
`,
  "utf8",
);

writeFileSync(
  join(outDir, "TEC_ERP_V2_HCM_ANSWER_KEY.md"),
  `# TEC.ERP V2 — HCM Answer Key (repository-internal)

**Do not expose through learner routes.**

| code | correct | explanation |
|------|---------|-------------|
${answerRows}
`,
  "utf8",
);

writeFileSync(
  join(outDir, "TEC_ERP_V2_HCM_SCORING_POLICY.md"),
  `# TEC.ERP V2 — HCM Scoring Policy

- Each question: 5 points, SINGLE_CHOICE, one canonical correct key
- Total: 100 points; pass at >= 70%
- Max attempts: 2 per selected pedagogical run
- Option order shuffled at attempt start; scoring uses stable option keys
- Failure does not erase M8 mission completion
- Quantitative Q10/Q11 use exact arithmetic (no rounding ambiguity):
  - capacity remaining = 40 − 16 = 24
  - overtime hours = 36 − 24 = 12
  - overtime hourly = 28 × 1.5 = 42
  - incremental cost = 12 × 42 = 504
`,
  "utf8",
);

writeFileSync(
  join(outDir, "TEC_ERP_V2_HCM_ANALYTICS.md"),
  `# TEC.ERP V2 — HCM Analytics

Dimensions: curriculumVersion, assessment code, run, module, mission, competency, question type, difficulty, quantitative flag, privacy/governance tag, attempt number, pass/fail.

Outputs: average, success rate, median, question success rate, competency breakdown, M8-M01/M02/M03 breakdown, most-missed, quantitative error rate, privacy/governance error rate.

Official cohort metrics use one official run per learner (no double-count).
Professor endpoint: \`GET /api/v1/professor/analytics/hcm-assessment\`.
`,
  "utf8",
);

writeFileSync(
  join(outDir, "TEC_ERP_V2_HCM_SECURITY_AND_PRIVACY.md"),
  `# TEC.ERP V2 — HCM Security and Privacy

- Learner sees only own attempts (run-scoped)
- Professor sees assigned cohort students in own company only
- Admin answer key requires ADMIN role
- No learner API answer-key leakage before submission
- No protected/sensitive employee traits in fixtures
- No real personal data
- AI recommendations treated as advisory in bank content
- Server remains scoring authority
`,
  "utf8",
);

console.log(`Wrote HCM assessment docs to ${outDir}`);
