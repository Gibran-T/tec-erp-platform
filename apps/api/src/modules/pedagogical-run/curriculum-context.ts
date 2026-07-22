import {
  DEFAULT_CURRICULUM_VERSION,
  parseCurriculumVersion,
  type CurriculumVersion,
} from "@tec-platform/mission-catalog";

import { getCurrentPedagogicalRun } from "./run-context.js";

export function getRunCurriculumVersion(
  fallback: CurriculumVersion = DEFAULT_CURRICULUM_VERSION,
): CurriculumVersion {
  const run = getCurrentPedagogicalRun();
  return parseCurriculumVersion(run?.curriculumVersion, fallback);
}
