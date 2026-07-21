import { M7_M01 } from "./m7/m7-m01.js";
import { M7_M02 } from "./m7/m7-m02.js";
import { M7_M03 } from "./m7/m7-m03.js";
import { M8_M01 } from "./m8/m8-m01.js";
import { M8_M02 } from "./m8/m8-m02.js";
import { M8_M03 } from "./m8/m8-m03.js";
import { M9_M01 } from "./m9/m9-m01.js";
import { M9_M02 } from "./m9/m9-m02.js";
import { M9_M03 } from "./m9/m9-m03.js";
import { M10_M01 } from "./m10/m10-m01.js";
import { M10_M02 } from "./m10/m10-m02.js";
import { M10_M03 } from "./m10/m10-m03.js";
import type { MissionDefinitionDocument, ModuleCatalogEntry } from "./schema.js";

export const WAVE3_MISSIONS: readonly MissionDefinitionDocument[] = [
  M7_M01,
  M7_M02,
  M7_M03,
  M8_M01,
  M8_M02,
  M8_M03,
  M9_M01,
  M9_M02,
  M9_M03,
  M10_M01,
  M10_M02,
  M10_M03,
];

export const WAVE3_MODULES: readonly ModuleCatalogEntry[] = [
  { moduleCode: "M7", title: "Module 7 — CRM et service client", sequence: 7, missionKeys: WAVE3_MISSIONS.filter((m) => m.moduleCode === "M7").map((m) => m.missionKey) },
  { moduleCode: "M8", title: "Module 8 — Gouvernance et conformite", sequence: 8, missionKeys: WAVE3_MISSIONS.filter((m) => m.moduleCode === "M8").map((m) => m.missionKey) },
  { moduleCode: "M9", title: "Module 9 — BI et intelligence artificielle", sequence: 9, missionKeys: WAVE3_MISSIONS.filter((m) => m.moduleCode === "M9").map((m) => m.missionKey) },
  { moduleCode: "M10", title: "Module 10 — Capstone Equinoxe", sequence: 10, missionKeys: WAVE3_MISSIONS.filter((m) => m.moduleCode === "M10").map((m) => m.missionKey) },
];
