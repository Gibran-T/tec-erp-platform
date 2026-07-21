import { M2_M01 } from "./m2/m2-m01.js";
import { M2_M02 } from "./m2/m2-m02.js";
import { M2_M03 } from "./m2/m2-m03.js";
import { M3_M01 } from "./m3/m3-m01.js";
import { M3_M02 } from "./m3/m3-m02.js";
import { M3_M03 } from "./m3/m3-m03.js";
import { M4_M01 } from "./m4/m4-m01.js";
import { M4_M02 } from "./m4/m4-m02.js";
import { M4_M03 } from "./m4/m4-m03.js";
import { M5_M01 } from "./m5/m5-m01.js";
import { M5_M02 } from "./m5/m5-m02.js";
import { M5_M03 } from "./m5/m5-m03.js";
import { M6_M01 } from "./m6/m6-m01.js";
import { M6_M02 } from "./m6/m6-m02.js";
import { M6_M03 } from "./m6/m6-m03.js";
import type { MissionDefinitionDocument, ModuleCatalogEntry } from "./schema.js";

export const WAVE2_MISSIONS: readonly MissionDefinitionDocument[] = [
  M2_M01,
  M2_M02,
  M2_M03,
  M3_M01,
  M3_M02,
  M3_M03,
  M4_M01,
  M4_M02,
  M4_M03,
  M5_M01,
  M5_M02,
  M5_M03,
  M6_M01,
  M6_M02,
  M6_M03,
];

export const WAVE2_MODULES: readonly ModuleCatalogEntry[] = [
  { moduleCode: "M2", title: "Module 2 — Donnees de reference et structure", sequence: 2, missionKeys: WAVE2_MISSIONS.filter((m) => m.moduleCode === "M2").map((m) => m.missionKey) },
  { moduleCode: "M3", title: "Module 3 — Procure-to-Pay", sequence: 3, missionKeys: WAVE2_MISSIONS.filter((m) => m.moduleCode === "M3").map((m) => m.missionKey) },
  { moduleCode: "M4", title: "Module 4 — Order-to-Cash", sequence: 4, missionKeys: WAVE2_MISSIONS.filter((m) => m.moduleCode === "M4").map((m) => m.missionKey) },
  { moduleCode: "M5", title: "Module 5 — Supply Chain et inventaire", sequence: 5, missionKeys: WAVE2_MISSIONS.filter((m) => m.moduleCode === "M5").map((m) => m.missionKey) },
  { moduleCode: "M6", title: "Module 6 — Finance et comptabilite", sequence: 6, missionKeys: WAVE2_MISSIONS.filter((m) => m.moduleCode === "M6").map((m) => m.missionKey) },
];
