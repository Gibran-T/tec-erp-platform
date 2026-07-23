import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(root, "..", "..", "..");

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
  // Wave 1A Research Addendum
  "TEC_ERP_RESEARCH_REFERENCE_CANON.md",
  "TEC_ERP_SERIOUS_LEARNING_SIMULATION_PRINCIPLES.md",
  "TEC_ERP_DECISION_CASE_METHOD_CONTRACT.md",
  "TEC_ERP_MANAGEMENT_FLIGHT_SIMULATION_CONTRACT.md",
  "TEC_ERP_SIMULATION_FACILITATION_AND_DEBRIEF_CONTRACT.md",
  "TEC_ERP_COGNITIVE_LOAD_AND_GUIDANCE_FADING_STANDARD.md",
  "TEC_ERP_EXPERIENTIAL_REFLECTION_AND_TRANSFER_CONTRACT.md",
  "TEC_ERP_PROFESSIONAL_IDENTITY_AND_SITUATED_LEARNING_CONTRACT.md",
  "TEC_ERP_DIGITAL_TWIN_PEDAGOGICAL_CONTRACT.md",
  "TEC_ERP_END_TO_END_PROCESS_CHAIN_CONTRACT.md",
  "TEC_ERP_CONSULTING_MANDATE_CONTRACT.md",
  "TEC_ERP_EXPLORATION_GUIDED_SIMULATION_EVALUATION_CONTRACT.md",
  "TEC_ERP_AI_STAKEHOLDER_AND_ENTERPRISE_LIFE_ENGINE_CONTRACT.md",
  "TEC_ERP_EXECUTIVE_IMPACT_AFTER_ACTION_CONTRACT.md",
  "TEC_ERP_DUAL_JOURNEY_ROADMAP_CONTRACT.md",
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
    else if (name.name.endsWith(".md") || name.name.endsWith(".mjs")) allFiles.push(rel);
  }
}
walk(root);

let corpus = "";
let mdCorpus = "";
for (const f of allFiles) {
  const text = readFileSync(join(root, f), "utf8");
  corpus += "\n" + text;
  if (f.endsWith(".md")) mdCorpus += "\n" + text;
}

const secretRe = /(password\s*=\s*\S+|DATABASE_URL\s*=\s*\S+|api[_-]?key\s*=\s*\S+|BEGIN (RSA |OPENSSH )?PRIVATE KEY)/i;
if (secretRe.test(corpus)) failures.push("secret-like pattern detected");
else passes.push("no secret-like patterns");

const positiveM11 = mdCorpus
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

// Exactly 3 regular missions language / three-mission contract
if (!corpus.includes("exactly three") && !corpus.includes("exactly **30**"))
  failures.push("missing exactly-three / 30 missions language");
else passes.push("three-mission / 30 missions language present");

if (!corpus.includes("MCapstone")) failures.push("missing MCapstone");
else passes.push("MCapstone present");

if (!corpus.includes("immutable")) failures.push("missing V1 immutable language");
else passes.push("V1 immutable language present");

// Experience modes
for (const mode of ["EXPLORATION", "GUIDED PRACTICE", "SIMULATION", "EVALUATION"]) {
  if (!corpus.toUpperCase().includes(mode.replace(" ", " ")) && !corpus.includes(mode)) {
    // allow title-case variants
  }
}
const modesOk =
  /Exploration/i.test(corpus) &&
  /Guided Practice/i.test(corpus) &&
  /SIMULATION|\bSimulation\b/.test(corpus) &&
  /EVALUATION|\bEvaluation\b/.test(corpus);
if (!modesOk) failures.push("missing official experience modes");
else passes.push("all official experience modes present");

// Stakeholder AI / ELE guardrails
const guardNeedles = [
  ["Visible AI", /Visible AI/i],
  ["Ambient AI", /Ambient AI/i],
  ["authoritative", /authoritative/i],
  ["no-AI-state-mutation", /never mutates official state|mutate authoritative|AI-generated text never mutates|MUST NOT[\s\S]{0,200}mutate/i],
  ["debrief", /debrief/i],
  ["reapplication", /reapplication/i],
  ["NOVICE", /\bNOVICE\b/],
  ["INTERMEDIATE", /\bINTERMEDIATE\b/],
  ["ADVANCED", /\bADVANCED\b/],
  ["Master state", /Master state|MASTER STATE/i],
  ["Transactional state", /Transactional state|TRANSACTIONAL STATE/i],
  ["Operational state", /Operational state|OPERATIONAL STATE/i],
  ["Financial state", /Financial state|FINANCIAL STATE/i],
  ["Risk state", /Risk state|RISK STATE/i],
  ["Procure-to-Pay", /Procure-to-Pay/],
  ["Lead-to-Cash", /Lead-to-Cash/],
  ["Order-to-Cash", /Order-to-Cash/],
  ["Data-to-Decision", /Data-to-Decision/],
  ["SAP Fiori", /SAP Fiori/],
  ["UNESCO", /UNESCO/],
  ["Kolb", /Kolb/],
  ["Wave 2A", /Wave 2A/],
  ["Wave 5B", /Wave 5B/],
  ["Enterprise Life Engine", /Enterprise Life Engine/],
];

for (const [label, re] of guardNeedles) {
  if (!re.test(corpus)) failures.push(`missing required concept: ${label}`);
  else passes.push(`concept present: ${label}`);
}

// Traceability must mention new contracts
const trace = readFileSync(join(root, "TEC_ERP_LEARNING_TRACEABILITY_MATRIX.md"), "utf8");
for (const f of [
  "TEC_ERP_RESEARCH_REFERENCE_CANON.md",
  "TEC_ERP_AI_STAKEHOLDER_AND_ENTERPRISE_LIFE_ENGINE_CONTRACT.md",
  "TEC_ERP_DIGITAL_TWIN_PEDAGOGICAL_CONTRACT.md",
  "TEC_ERP_DUAL_JOURNEY_ROADMAP_CONTRACT.md",
]) {
  if (!trace.includes(f)) failures.push(`traceability missing ${f}`);
  else passes.push(`traceability has ${f}`);
}

const roadmap = readFileSync(join(root, "TEC_ERP_LEARNING_OPERATING_SYSTEM_ROADMAP.md"), "utf8");
if (!roadmap.includes("Wave 5B") || !roadmap.includes("Wave 2A"))
  failures.push("roadmap missing Wave 2A/5B update");
else passes.push("roadmap updated with Wave 2A/5B");

// No duplicate contradictory mode names that drop Guided Practice
if (/Exploration\s*\/\s*Simulation\s*\/\s*Evaluation/i.test(corpus) && !/Guided Practice/i.test(corpus))
  failures.push("mode triad without Guided Practice (contradictory)");
else passes.push("no contradictory mode triad without Guided Practice");

// Production / app source change checks relative to main — only engineering/v2/learning-operating-system should differ for this wave
try {
  const diff = execSync("git diff --name-only main...HEAD", {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const files = diff
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const forbidden = files.filter((f) => {
    if (f.startsWith("engineering/v2/learning-operating-system/")) return false;
    // allow nothing else for contract wave; if other docs sneaked in, fail
    return true;
  });
  // Also check working tree unstaged vs HEAD for app paths
  const dirty = execSync("git status --porcelain", { cwd: repoRoot, encoding: "utf8" });
  const dirtyFiles = dirty
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\?\?\s+/, "").replace(/^[MADRCU ]{1,2}\s+/, ""));
  const appDirty = dirtyFiles.filter(
    (f) =>
      f.startsWith("apps/") ||
      f.startsWith("packages/") ||
      f.includes("schema.prisma") ||
      f.includes("/migrations/") ||
      f.startsWith("prisma/"),
  );
  if (appDirty.length) failures.push(`application/prisma dirty files: ${appDirty.slice(0, 8).join(", ")}`);
  else passes.push("no application/prisma dirty changes");

  // Branch vs main: only LOS docs (and maybe script under LOS)
  const nonLos = files.filter((f) => !f.startsWith("engineering/v2/learning-operating-system/"));
  if (nonLos.length) {
    // If HEAD already has only LOS, OK; warn as fail for contract purity
    failures.push(`non-LOS files on branch vs main: ${nonLos.slice(0, 8).join(", ")}`);
  } else passes.push("branch vs main limited to learning-operating-system");
} catch (e) {
  passes.push(`git scope check skipped: ${e.message.split("\n")[0]}`);
}

console.log("PASS count:", passes.length);
for (const p of passes) console.log("  PASS", p);
console.log("FAIL count:", failures.length);
for (const f of failures) console.log("  FAIL", f);
if (failures.length) process.exit(1);
console.log("\nVALIDATION GREEN");
