export const CURRICULUM_VERSIONS = ["V1", "V2"] as const;
export type CurriculumVersion = (typeof CURRICULUM_VERSIONS)[number];

/** Historical default for existing pedagogical runs (James Run 1). */
export const DEFAULT_CURRICULUM_VERSION: CurriculumVersion = "V1";

/** Version assigned to newly created pedagogical runs. */
export const CURRENT_CURRICULUM_VERSION: CurriculumVersion = "V2";

export function isCurriculumVersion(value: string): value is CurriculumVersion {
  return (CURRICULUM_VERSIONS as readonly string[]).includes(value);
}

export function parseCurriculumVersion(
  value: string | null | undefined,
  fallback: CurriculumVersion = DEFAULT_CURRICULUM_VERSION,
): CurriculumVersion {
  if (value && isCurriculumVersion(value)) {
    return value;
  }
  return fallback;
}
