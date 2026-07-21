import {
  getMissionByKey,
  listAllMissions,
  type MissionDefinitionDocument,
} from "@tec-platform/mission-catalog";
import type { MissionKey } from "@tec-platform/contracts";

export const ENTERPRISE_DISCOVERY_MISSION_KEY =
  "m1-m01-decouvrir-entreprise" satisfies MissionKey;

export const MISSION_FEEDBACK_COMPLETE_KEY = "fb-discovery-complete";

export const MISSION_COMPETENCY_CODES = ["C-ORG-01", "C-BUS-01"] as const;

export const REQUIRED_ACKNOWLEDGED_INPUT_KEYS = [
  "ctx-nordhabitat-overview",
  "ctx-tom-40-36",
] as const;

export const JUSTIFICATION_MIN_LENGTH = 40;
export const JUSTIFICATION_MAX_LENGTH = 1000;
export const MINIMUM_MAPPING_COUNT = 2;

export interface MissionCatalogEntry {
  readonly missionKey: MissionKey;
  readonly title: string;
  readonly preview: string;
  readonly briefing: string;
  readonly unlockExplanation: string;
  readonly competencyCodes: readonly string[];
}

export interface MissionContextCatalogItem {
  readonly key: string;
  readonly title: string;
  readonly body: string;
  readonly required: boolean;
}

export interface MissionDepartmentCatalogItem {
  readonly key: string;
  readonly label: string;
  readonly description: string;
}

export interface MissionProblemCatalogItem {
  readonly key: string;
  readonly label: string;
  readonly description: string;
}

export interface AllowedDepartmentProblemPair {
  readonly departmentKey: string;
  readonly problemKey: string;
}

function toCatalogEntry(doc: MissionDefinitionDocument): MissionCatalogEntry {
  return {
    missionKey: doc.missionKey as MissionKey,
    title: doc.title,
    preview: doc.preview,
    briefing: doc.briefing,
    unlockExplanation: doc.unlockExplanation,
    competencyCodes: doc.competencyCodes,
  };
}

export const MISSION_CATALOG: readonly MissionCatalogEntry[] = listAllMissions().map(toCatalogEntry);

const m01 = getMissionByKey(ENTERPRISE_DISCOVERY_MISSION_KEY);

export const MISSION_CONTEXT_CATALOG: readonly MissionContextCatalogItem[] = (
  m01?.contextItems ?? []
).map((item) => ({
  key: item.key,
  title: item.title,
  body: item.body,
  required: item.required,
}));

const mappingInteraction = m01?.interactions.find((item) => item.id === "dept-problem-mapping");

function isDepartmentOption(key: string): boolean {
  return key.startsWith("dept-");
}

function isProblemOption(key: string): boolean {
  return key.startsWith("prob-");
}

export const MISSION_DEPARTMENT_CATALOG: readonly MissionDepartmentCatalogItem[] = (
  mappingInteraction?.options ?? []
)
  .filter((option) => isDepartmentOption(option.key))
  .map((option) => ({
    key: option.key,
    label: option.label,
    description: option.description ?? option.label,
  }));

export const MISSION_PROBLEM_CATALOG: readonly MissionProblemCatalogItem[] = (
  mappingInteraction?.options ?? []
)
  .filter((option) => isProblemOption(option.key))
  .map((option) => ({
    key: option.key,
    label: option.label,
    description: option.description ?? option.label,
  }));

export const ALLOWED_DEPARTMENT_PROBLEM_PAIRS: readonly AllowedDepartmentProblemPair[] = (
  mappingInteraction?.scoring.allowedPairs ?? []
).map((pair) => ({
  departmentKey: pair.leftKey,
  problemKey: pair.rightKey,
}));

export const MISSION_FEEDBACK_CATALOG: Readonly<Record<string, string>> = {
  [MISSION_FEEDBACK_COMPLETE_KEY]: m01?.completionFeedback ?? "",
};

export function getMissionCatalogEntry(missionKey: string): MissionCatalogEntry | undefined {
  return MISSION_CATALOG.find((mission) => mission.missionKey === missionKey);
}

export function isKnownMissionKey(missionKey: string): missionKey is MissionKey {
  return MISSION_CATALOG.some((mission) => mission.missionKey === missionKey);
}

export function isAllowedDepartmentProblemPair(
  departmentKey: string,
  problemKey: string,
): boolean {
  return ALLOWED_DEPARTMENT_PROBLEM_PAIRS.some(
    (pair) => pair.departmentKey === departmentKey && pair.problemKey === problemKey,
  );
}

export function pairKey(departmentKey: string, problemKey: string): string {
  return `${departmentKey}::${problemKey}`;
}
