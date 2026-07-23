import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "README.md",
  "BASELINE_VERIFICATION.md",
  "TEC_ERP_LEARNING_OPERATING_SYSTEM_PRODUCT_DEFINITION.md",
  "TEC_ERP_V1_V2_HISTORICAL_AND_CURRENT_CONTRACT.md",
  "TEC_ERP_V2_CURRICULUM_MASTER_MAP.md",
  "TEC_ERP_MODULE_LEARNING_CYCLE.md",
  "TEC_ERP_THREE_MISSION_PEDAGOGICAL_CONTRACT.md",
  "TEC_ERP_MODULE_BLUEPRINT.md",
  "TEC_ERP_LEARNING_EVIDENCE_MODEL.md",
  "TEC_ERP_COMPETENCY_AND_MASTERY_CONTRACT.md",
  "TEC_ERP_BI_STUDIO_LEARNING_CONTRACT.md",
  "TEC_ERP_AI_DECISION_WORKSPACE_CONTRACT.md",
  "TEC_ERP_TEACHING_DECK_CONTRACT.md",
  "TEC_ERP_PORTAL_AND_LOGIN_EXPERIENCE_CONTRACT.md",
  "TEC_ERP_VISUAL_LEARNING_LANGUAGE_CONTRACT.md",
  "TEC_ERP_ASSESSMENT_LEARNING_CONTRACT.md",
  "TEC_ERP_CAPSTONE_LEARNING_CONTRACT.md",
  "TEC_ERP_PROFESSOR_TEACHING_CONTRACT.md",
  "TEC_ERP_LEARNER_JOURNEY_CONTRACT.md",
  "TEC_ERP_LEARNING_INFORMATION_ARCHITECTURE.md",
  "TEC_ERP_LEARNING_OPERATING_SYSTEM_ROADMAP.md",
  "TEC_ERP_LEARNING_TRACEABILITY_MATRIX.md",
  "TEC_ERP_LEARNING_OPERATING_SYSTEM_TECHNICAL_IMPACT.md",
  "TEC_ERP_CONTENT_AND_PEDAGOGICAL_QUALITY_STANDARD.md",
  "TEC_ERP_CURRENT_PRODUCT_GAP_ANALYSIS.md",
  "TEC_ERP_LEARNING_OPERATING_SYSTEM_ACCEPTANCE_CRITERIA.md",
];
for (let i = 1; i <= 10; i++) required.push(`modules/M${i}_LEARNING_BLUEPRINT.md`);

const failures = [];
const passes = [];

for (const f of required) {
  if (existsSync(join(root, f))) passes.push(`exists: ${f}`);
  else failures.push(`missing: ${f}`);
}

const mods = readdirSync(join(root, "modules")).filter((x) => x.endsWith("_LEARNING_BLUEPRINT.md"));
if (mods.length !== 10) failures.push(`module blueprint count ${mods.length} != 10`);
else passes.push("exactly 10 module blueprints");

const allFiles = [];
function walk(d, prefix = "") {
  for (const name of readdirSync(d, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${name.name}` : name.name;
    if (name.isDirectory()) walk(join(d, name.name), rel);
    else if (name.name.endsWith(".md")) allFiles.push(rel);
  }
}
walk(root);

let corpus = "";
for (const f of allFiles) corpus += "\n" + readFileSync(join(root, f), "utf8");

const secretRe = /(password\s*=\s*\S+|DATABASE_URL\s*=\s*\S+|api[_-]?key\s*=\s*\S+)/i;
if (secretRe.test(corpus)) failures.push("secret-like pattern detected");
else passes.push("no secret-like patterns");

// M11: allow negation phrases only
const m11Hits = corpus.match(/M11/g) || [];
const m11Neg = (corpus.match(/no M11|not M11|Not M11|pas M11|🚫 M11/gi) || []).length;
// Count lines that assert M11 as a module positively
const positiveM11 = corpus
  .split(/\n/)
  .filter((l) => /M11/.test(l) && !/no M11|not M11|Not M11|pas M11|without M11|🚫/i.test(l) && !/there is no M11/i.test(l));
if (positiveM11.length > 0) failures.push(`positive M11 references: ${positiveM11.slice(0, 5).join(" | ")}`);
else passes.push("no positive M11 module");

const map = readFileSync(join(root, "TEC_ERP_V2_CURRICULUM_MASTER_MAP.md"), "utf8");
for (const needle of [
  ["M8", "Ressources humaines et HCM"],
  ["M9", "Gouvernance"],
  ["M10", "BI, KPI, IA"],
  ["MCapstone", "separate"],
  ["exactly **30**", ""],
]) {
  if (!map.includes(needle[0]) || (needle[1] && !map.includes(needle[1])))
    failures.push(`curriculum map missing ${needle[0]} ${needle[1]}`);
  else passes.push(`curriculum has ${needle[0]}`);
}

if (!corpus.includes("Consulter")) failures.push("missing Consulter historical CTA rule");
else passes.push("Consulter rule present");

if (!corpus.includes("HCM_M8")) failures.push("missing HCM_M8");
else passes.push("HCM_M8 present");

console.log("PASS count:", passes.length);
for (const p of passes) console.log("  PASS", p);
console.log("FAIL count:", failures.length);
for (const f of failures) console.log("  FAIL", f);
if (failures.length) process.exit(1);
console.log("\nVALIDATION GREEN");
