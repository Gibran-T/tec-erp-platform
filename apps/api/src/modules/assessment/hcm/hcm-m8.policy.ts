import { listMissionsForModuleInCurriculum, type CurriculumVersion } from "@tec-platform/mission-catalog";

import {
  HCM_M8_ASSESSMENT_CODE,
  HCM_M8_DEFINITION_JSON,
} from "./hcm-m8-question-bank.js";

export function isHcmM8AssessmentCode(code: string): boolean {
  return code === HCM_M8_ASSESSMENT_CODE;
}

export function assessmentVisibleForCurriculum(
  assessmentCode: string,
  definitionJson: unknown,
  curriculumVersion: CurriculumVersion,
): boolean {
  if (!isHcmM8AssessmentCode(assessmentCode)) {
    return true;
  }
  const meta = definitionJson as { curriculumVersion?: string } | null;
  const required = meta?.curriculumVersion ?? HCM_M8_DEFINITION_JSON.curriculumVersion;
  return curriculumVersion === "V2" && required === "V2";
}

export function requiredModulesForAssessment(assessmentCode: string): string[] {
  if (assessmentCode === "SILVER_M1_M2") {
    return ["M1", "M2"];
  }
  if (assessmentCode === "INTEGRATED_M3_M6") {
    return ["M3", "M4", "M5", "M6"];
  }
  if (assessmentCode === "GOLD_M7_M10") {
    return ["M7", "M8", "M9", "M10"];
  }
  if (isHcmM8AssessmentCode(assessmentCode)) {
    return ["M8"];
  }
  return [];
}

export function modulesCompleteForAssessment(input: {
  readonly assessmentCode: string;
  readonly curriculumVersion: CurriculumVersion;
  readonly completedMissionKeys: ReadonlySet<string>;
}): boolean {
  const requiredModules = requiredModulesForAssessment(input.assessmentCode);
  if (requiredModules.length === 0) {
    return true;
  }
  return requiredModules.every((moduleCode) =>
    listMissionsForModuleInCurriculum(input.curriculumVersion, moduleCode).every((mission) =>
      input.completedMissionKeys.has(mission.missionKey),
    ),
  );
}

export function lockReasonForAssessment(input: {
  readonly assessmentCode: string;
  readonly curriculumVersion: CurriculumVersion;
  readonly modulesComplete: boolean;
}): string | null {
  if (input.modulesComplete) {
    return null;
  }
  if (isHcmM8AssessmentCode(input.assessmentCode)) {
    return "Complétez les trois missions HCM du Module 8 (M8-M01, M8-M02, M8-M03) pour débloquer cette évaluation.";
  }
  const modules = requiredModulesForAssessment(input.assessmentCode);
  if (modules.length === 0) {
    return "Évaluation verrouillée jusqu'à complétion des prérequis du parcours.";
  }
  return `Complétez d'abord les modules ${modules.join(", ")} du curriculum ${input.curriculumVersion} pour débloquer cette évaluation.`;
}
