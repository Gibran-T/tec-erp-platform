import type { CourseEditionModulePack } from "../types.js";
import { M1_COURSE_EDITION_PACK } from "./m1/index.js";
import { GENERATED_MODULE_PACKS } from "./modulePackFactory.js";

export { M1_COURSE_EDITION_PACK, M1_ANALYST_ROLE, M1_SPINE } from "./m1/index.js";
export { GENERATED_MODULE_PACKS, buildGeneratedModulePack } from "./modulePackFactory.js";

export const COURSE_EDITION_MODULE_CODES = [
  "M1",
  "M2",
  "M3",
  "M4",
  "M5",
  "M6",
  "M7",
  "M8",
  "M9",
  "M10",
] as const;

const PACK_REGISTRY: Readonly<Record<string, CourseEditionModulePack>> = {
  M1: M1_COURSE_EDITION_PACK,
  ...GENERATED_MODULE_PACKS,
};

export function getCourseEditionPack(moduleCode: string): CourseEditionModulePack | null {
  return PACK_REGISTRY[moduleCode.toUpperCase()] ?? null;
}

export function listCourseEditionPacks(): readonly CourseEditionModulePack[] {
  return COURSE_EDITION_MODULE_CODES.map((code) => PACK_REGISTRY[code]!);
}
