/**
 * Shared helpers for Wave 2 local runtime smoke scripts.
 * Uses DATABASE_URL / API_BASE_URL from the environment — no secrets committed.
 */

import { getMissionByKey, listAllMissions } from "@tec-platform/mission-catalog";

export const QA_COHORT_CODE = "QA-WAVE2";

export const QA_ACCOUNTS = {
  professor: {
    employeeNumber: "#QA-PROF",
    email: "professor.qa@nordhabitat.ca",
    password: "QaWave2!2026",
    role: "PROFESSOR",
    displayName: "Professeur QA Wave 2",
  },
  studentA: {
    employeeNumber: "#QA-STU-A",
    email: "student.a.qa@nordhabitat.ca",
    password: "QaWave2!2026",
    role: "JR_BUSINESS_ANALYST",
    displayName: "Etudiant QA A",
  },
  studentB: {
    employeeNumber: "#QA-STU-B",
    email: "student.b.qa@nordhabitat.ca",
    password: "QaWave2!2026",
    role: "JR_BUSINESS_ANALYST",
    displayName: "Etudiant QA B",
  },
};

export const MISSION_SEQUENCE = [
  "m1-m01-decouvrir-entreprise",
  "m1-m02-connecter-departements",
  "m1-m03-diagnostiquer-preparation",
  "m2-m01-structurer-organisation",
  "m2-m02-creer-donnees-reference",
  "m2-m03-corriger-qualite-donnees",
  "m3-m01-identifier-besoin-achat",
  "m3-m02-creer-traiter-commande-achat",
  "m3-m03-receptionner-analyser-fournisseur",
  "m4-m01-saisir-commande-institutionnelle",
  "m4-m02-allocation-inter-entrepots",
  "m4-m03-confirmer-livraison-cloture",
  "m5-m01-analyser-stock-reappro",
  "m5-m02-decision-transfert-inter-dc",
  "m5-m03-presentation-sop",
  "m6-m01-reception-facture",
  "m6-m02-exception-rapprochement-trois-voies",
  "m6-m03-expliquer-ecart-finance",
];

export const SILVER_ASSESSMENT_ANSWERS = {
  "silver-q1": "foundation",
  "silver-q2": "block-tx",
  "silver-q3": ["dc", "cc"],
  "silver-q4": "integrity",
};

export const FIRST_DAY = {
  messageKey: "premier-message-gestionnaire",
  taskKey: "decouvrir-nordhabitat",
};

export const LEGACY_M1_M01_SUBMIT = {
  acknowledgedInputKeys: ["ctx-nordhabitat-overview", "ctx-tom-40-36"],
  departmentProblemMappings: [
    { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
    { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
  ],
  justification:
    "La fragmentation de l inventaire entre departements montre un ecart entre systeme et terrain.",
};

export function envOrDefault(name, fallback) {
  return process.env[name]?.trim() || fallback;
}

export function parseArgs(argv) {
  return {
    cleanup: argv.includes("--cleanup"),
    seedOnly: argv.includes("--seed-only"),
  };
}

export class SmokeChecklist {
  /** @param {string} label */
  pass(label) {
    this.results.push({ label, ok: true });
    console.log(`  PASS  ${label}`);
  }

  /** @param {string} label @param {string} [detail] */
  fail(label, detail) {
    this.results.push({ label, ok: false, detail });
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }

  constructor() {
    this.results = [];
  }

  get allPassed() {
    return this.results.every((item) => item.ok);
  }

  printSummary() {
    const passed = this.results.filter((item) => item.ok).length;
    const failed = this.results.length - passed;
    console.log("\n=== Wave 2 Smoke Summary ===");
    console.log(`Total: ${this.results.length}  Passed: ${passed}  Failed: ${failed}`);
    if (failed > 0) {
      console.log("\nFailures:");
      for (const item of this.results.filter((entry) => !entry.ok)) {
        console.log(`  - ${item.label}${item.detail ? `: ${item.detail}` : ""}`);
      }
    }
    console.log(failed === 0 ? "\nRESULT: PASS" : "\nRESULT: FAIL");
    return failed === 0;
  }
}

/**
 * @param {import('@tec-platform/mission-catalog').MissionInteraction} interaction
 */
export function buildInteractionValue(interaction) {
  const scoring = interaction.scoring;

  switch (interaction.type) {
    case "SINGLE_CHOICE":
      return scoring.correctKeys?.[0] ?? "";
    case "MULTI_CHOICE":
      return [...(scoring.correctKeys ?? [])];
    case "ORDERING":
      return [...(scoring.correctOrder ?? [])];
    case "NUMERIC_INPUT":
      return scoring.numericTarget ?? 0;
    case "TEXT_ANALYSIS": {
      const concepts = scoring.requiredConcepts ?? ["analyse"];
      return `${concepts.join(", ")} — reponse smoke complete pour valider la mission.`;
    }
    case "DIAGNOSIS_RECOMMENDATION": {
      const minimum = scoring.minimumSelections ?? 1;
      return (scoring.allowedPairs ?? []).slice(0, minimum).map((pair) => ({
        leftKey: pair.leftKey,
        rightKey: pair.rightKey,
      }));
    }
    case "PROCESS_MAP_ACKNOWLEDGEMENT":
      return [...(scoring.correctKeys ?? [])];
    default:
      return "";
  }
}

/** @param {string} missionKey */
export function buildGenericMissionSubmit(missionKey) {
  const definition = getMissionByKey(missionKey);
  if (!definition) {
    throw new Error(`Unknown mission key: ${missionKey}`);
  }
  return {
    responses: definition.interactions.map((interaction) => ({
      interactionId: interaction.id,
      value: buildInteractionValue(interaction),
    })),
  };
}

/** @param {string} missionKey */
export function buildMissionSubmitBody(missionKey) {
  if (missionKey === "m1-m01-decouvrir-entreprise") {
    return LEGACY_M1_M01_SUBMIT;
  }
  return buildGenericMissionSubmit(missionKey);
}

export function buildSilverAssessmentSubmit() {
  return {
    responses: Object.entries(SILVER_ASSESSMENT_ANSWERS).map(([questionKey, value]) => ({
      questionKey,
      value,
    })),
  };
}

export function createApiClient(baseUrl) {
  /** @type {string | null} */
  let accessToken = null;

  async function request(method, path, body) {
    const headers = { Accept: "application/json" };
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    return { status: response.status, body: payload };
  }

  return {
    setToken(token) {
      accessToken = token;
    },
    async login(email, password) {
      const result = await request("POST", "/api/v1/auth/login", { email, password });
      if (result.status !== 200) {
        throw new Error(`Login failed (${result.status}): ${JSON.stringify(result.body)}`);
      }
      accessToken = result.body.tokens.accessToken;
      return result.body;
    },
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body),
  };
}

export async function completeFirstDay(api, checklist, labelPrefix = "First Day") {
  const inbox = await api.get("/api/v1/me/inbox");
  if (inbox.status !== 200) {
    checklist.fail(`${labelPrefix}: inbox`, `status ${inbox.status}`);
    return false;
  }
  checklist.pass(`${labelPrefix}: inbox`);

  const read = await api.post(`/api/v1/me/inbox/${FIRST_DAY.messageKey}/read`);
  if (read.status !== 200) {
    checklist.fail(`${labelPrefix}: read message`, `status ${read.status}`);
    return false;
  }
  checklist.pass(`${labelPrefix}: read manager message`);

  const tasks = await api.get("/api/v1/me/tasks");
  if (tasks.status !== 200) {
    checklist.fail(`${labelPrefix}: tasks`, `status ${tasks.status}`);
    return false;
  }
  checklist.pass(`${labelPrefix}: tasks`);

  const complete = await api.post(`/api/v1/me/tasks/${FIRST_DAY.taskKey}/complete`);
  if (complete.status !== 200) {
    checklist.fail(`${labelPrefix}: complete task`, `status ${complete.status}`);
    return false;
  }
  checklist.pass(`${labelPrefix}: complete first task`);
  return true;
}

/** @param {ReturnType<typeof createApiClient>} api @param {SmokeChecklist} checklist */
export async function completeMission(api, checklist, missionKey) {
  const detail = await api.get(`/api/v1/me/missions/${missionKey}`);
  if (detail.status !== 200) {
    checklist.fail(`Mission ${missionKey}: detail`, `status ${detail.status}`);
    return false;
  }

  const start = await api.post(`/api/v1/me/missions/${missionKey}/start`);
  if (start.status !== 200 && start.status !== 201) {
    checklist.fail(`Mission ${missionKey}: start`, `status ${start.status}`);
    return false;
  }

  const submit = await api.post(
    `/api/v1/me/missions/${missionKey}/submit`,
    buildMissionSubmitBody(missionKey),
  );
  if (submit.status !== 200) {
    checklist.fail(
      `Mission ${missionKey}: submit`,
      `status ${submit.status} ${JSON.stringify(submit.body)}`,
    );
    return false;
  }

  const passed = submit.body.score?.passed ?? submit.body.attempt?.status === "completed";
  if (!passed) {
    checklist.fail(
      `Mission ${missionKey}: score`,
      `score ${submit.body.score?.scorePercent ?? "n/a"}%`,
    );
    return false;
  }

  checklist.pass(`Mission ${missionKey}: completed`);
  return true;
}

/** @param {ReturnType<typeof createApiClient>} api @param {SmokeChecklist} checklist */
export async function completeAllMissions(api, checklist) {
  for (const missionKey of MISSION_SEQUENCE) {
    const ok = await completeMission(api, checklist, missionKey);
    if (!ok) {
      return false;
    }
  }
  return true;
}

export function listCatalogMissionKeys() {
  return listAllMissions().map((mission) => mission.missionKey);
}
