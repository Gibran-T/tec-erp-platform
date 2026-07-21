import { M1_M01 } from "./m1/m1-m01.js";
import { M1_M02 } from "./m1/m1-m02.js";
import { M1_M03 } from "./m1/m1-m03.js";
import {
  MissionDefinitionDocumentSchema,
  type MissionDefinitionDocument,
  type ModuleCatalogEntry,
} from "./schema.js";
import { WAVE2_MISSIONS, WAVE2_MODULES } from "./wave2.js";

const MISSIONS: readonly MissionDefinitionDocument[] = [
  MissionDefinitionDocumentSchema.parse(M1_M01),
  MissionDefinitionDocumentSchema.parse(M1_M02),
  MissionDefinitionDocumentSchema.parse(M1_M03),
  ...WAVE2_MISSIONS.map((mission) => MissionDefinitionDocumentSchema.parse(mission)),
];

const MODULES: readonly ModuleCatalogEntry[] = [
  {
    moduleCode: "M1",
    title: "Module 1 — Découverte organisationnelle",
    sequence: 1,
    missionKeys: MISSIONS.filter((mission) => mission.moduleCode === "M1").map(
      (mission) => mission.missionKey,
    ),
  },
  ...WAVE2_MODULES,
];

const byKey = new Map(MISSIONS.map((mission) => [mission.missionKey, mission]));

export function getMissionByKey(missionKey: string): MissionDefinitionDocument | undefined {
  return byKey.get(missionKey);
}

export function listMissionsForModule(moduleCode: string): readonly MissionDefinitionDocument[] {
  return MISSIONS.filter((mission) => mission.moduleCode === moduleCode).sort(
    (left, right) => left.sequence - right.sequence,
  );
}

export function listModules(): readonly ModuleCatalogEntry[] {
  return MODULES;
}

export function listAllMissions(): readonly MissionDefinitionDocument[] {
  return MISSIONS;
}

export function isKnownCatalogMissionKey(missionKey: string): boolean {
  return byKey.has(missionKey);
}
