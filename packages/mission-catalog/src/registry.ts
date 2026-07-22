import {
  getMissionPlacement,
  isRegularMissionInCurriculum as isRegularInPlacement,
  listModulePlacements,
  listRegularMissionKeys,
  moduleCodeForMissionInCurriculum as moduleCodeFromPlacement,
  nextUnlockKeyAfterMission as nextUnlockFromPlacement,
  type ModulePlacement,
} from "./curriculum-placement.js";
import {
  DEFAULT_CURRICULUM_VERSION,
  type CurriculumVersion,
} from "./curriculum-version.js";
import { M1_M01 } from "./m1/m1-m01.js";
import { M1_M02 } from "./m1/m1-m02.js";
import { M1_M03 } from "./m1/m1-m03.js";
import { M8_HCM_M01 } from "./m8-hcm/m8-hcm-m01.js";
import { M8_HCM_M02 } from "./m8-hcm/m8-hcm-m02.js";
import { M8_HCM_M03 } from "./m8-hcm/m8-hcm-m03.js";
import {
  MissionDefinitionDocumentSchema,
  type MissionDefinitionDocument,
  type ModuleCatalogEntry,
} from "./schema.js";
import { WAVE2_MISSIONS } from "./wave2.js";
import { WAVE3_MISSIONS } from "./wave3.js";

const HCM_MISSIONS: readonly MissionDefinitionDocument[] = [
  MissionDefinitionDocumentSchema.parse(M8_HCM_M01),
  MissionDefinitionDocumentSchema.parse(M8_HCM_M02),
  MissionDefinitionDocumentSchema.parse(M8_HCM_M03),
];

/** All known mission content definitions (V1 + HCM). Historical keys remain resolvable. */
const ALL_MISSION_DEFINITIONS: readonly MissionDefinitionDocument[] = [
  MissionDefinitionDocumentSchema.parse(M1_M01),
  MissionDefinitionDocumentSchema.parse(M1_M02),
  MissionDefinitionDocumentSchema.parse(M1_M03),
  ...WAVE2_MISSIONS.map((mission) => MissionDefinitionDocumentSchema.parse(mission)),
  ...WAVE3_MISSIONS.map((mission) => MissionDefinitionDocumentSchema.parse(mission)),
  ...HCM_MISSIONS,
];

const byKey = new Map(
  ALL_MISSION_DEFINITIONS.map((mission) => [mission.missionKey, mission]),
);

function toModuleCatalogEntry(placement: ModulePlacement): ModuleCatalogEntry {
  return {
    moduleCode: placement.moduleCode,
    title: placement.title,
    sequence: placement.sequence,
    missionKeys: [...placement.missionKeys],
    competencySummary: placement.competencySummary,
    processTags: [...placement.processTags],
  };
}

function applyPlacement(
  definition: MissionDefinitionDocument,
  version: CurriculumVersion,
): MissionDefinitionDocument {
  const placement = getMissionPlacement(version, definition.missionKey);
  if (!placement) {
    return definition;
  }
  return {
    ...definition,
    moduleCode: placement.moduleCode,
    missionCode: placement.missionCode,
    sequence: placement.sequence,
    title: placement.title ?? definition.title,
  };
}

export function listAllKnownMissionDefinitions(): readonly MissionDefinitionDocument[] {
  return ALL_MISSION_DEFINITIONS;
}

export function getMissionByKey(missionKey: string): MissionDefinitionDocument | undefined {
  return byKey.get(missionKey);
}

export function getMissionForCurriculum(
  version: CurriculumVersion,
  missionKey: string,
): MissionDefinitionDocument | undefined {
  const definition = byKey.get(missionKey);
  if (!definition) {
    return undefined;
  }
  if (!isRegularInPlacement(version, missionKey)) {
    // Historical resolve without pretending the mission is in the active regular set.
    return definition;
  }
  return applyPlacement(definition, version);
}

export function listRegularMissionsForCurriculum(
  version: CurriculumVersion,
): readonly MissionDefinitionDocument[] {
  return listRegularMissionKeys(version).map((missionKey) => {
    const definition = byKey.get(missionKey);
    if (!definition) {
      throw new Error(`Missing mission definition for curriculum ${version}: ${missionKey}`);
    }
    return applyPlacement(definition, version);
  });
}

export function listModulesForCurriculum(version: CurriculumVersion): readonly ModuleCatalogEntry[] {
  return listModulePlacements(version).map(toModuleCatalogEntry);
}

export function listMissionsForModuleInCurriculum(
  version: CurriculumVersion,
  moduleCode: string,
): readonly MissionDefinitionDocument[] {
  const module = listModulePlacements(version).find((entry) => entry.moduleCode === moduleCode);
  if (!module) {
    return [];
  }
  return module.missionKeys.map((missionKey) => {
    const definition = byKey.get(missionKey);
    if (!definition) {
      throw new Error(`Missing mission definition: ${missionKey}`);
    }
    return applyPlacement(definition, version);
  });
}

export function isRegularMissionInCurriculum(
  version: CurriculumVersion,
  missionKey: string,
): boolean {
  return isRegularInPlacement(version, missionKey);
}

export function moduleCodeForMissionInCurriculum(
  version: CurriculumVersion,
  missionKey: string,
): string | undefined {
  return moduleCodeFromPlacement(version, missionKey);
}

export function nextUnlockKeyAfterMissionInCurriculum(
  version: CurriculumVersion,
  missionKey: string,
): string | undefined {
  return nextUnlockFromPlacement(version, missionKey);
}

export function isKnownCatalogMissionKey(missionKey: string): boolean {
  return byKey.has(missionKey);
}

/**
 * Backward-compatible V1 surface.
 * Callers that need V2 must use the *ForCurriculum APIs with the run version.
 */
export function listModules(): readonly ModuleCatalogEntry[] {
  return listModulesForCurriculum(DEFAULT_CURRICULUM_VERSION);
}

export function listMissionsForModule(moduleCode: string): readonly MissionDefinitionDocument[] {
  return listMissionsForModuleInCurriculum(DEFAULT_CURRICULUM_VERSION, moduleCode);
}

export function listAllMissions(): readonly MissionDefinitionDocument[] {
  return listRegularMissionsForCurriculum(DEFAULT_CURRICULUM_VERSION);
}
