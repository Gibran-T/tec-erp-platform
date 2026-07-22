import type { CurriculumVersion } from "@tec-platform/mission-catalog";
import { listRegularMissionsForCurriculum } from "@tec-platform/mission-catalog";

export type CapstoneLifecycleStatus =
  | "LOCKED"
  | "AVAILABLE"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REVISION_REQUESTED"
  | "APPROVED"
  | "REJECTED";

export const CAPSTONE_LIFECYCLE_LABEL_FR: Record<CapstoneLifecycleStatus, string> = {
  LOCKED: "Verrouillé",
  AVAILABLE: "Disponible",
  IN_PROGRESS: "En cours",
  SUBMITTED: "Soumis",
  UNDER_REVIEW: "En revue",
  REVISION_REQUESTED: "Révision demandée",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
};

export const CAPSTONE_STAGES_V2 = [
  { code: "S1", title: "Prise en charge du mandat" },
  { code: "S2", title: "Diagnostic transversal" },
  { code: "S3", title: "Analyse des données et des processus" },
  { code: "S4", title: "Gestion de la crise intégrée" },
  { code: "S5", title: "Recommandation exécutive" },
  { code: "S6", title: "Présentation au professeur" },
  { code: "S7", title: "Révision et décision finale" },
] as const;

export function computeCapstoneLifecycle(input: {
  readonly regularMissionsComplete: boolean;
  readonly runEligible: boolean;
  readonly status: string | null | undefined;
  readonly reviewStatus: string | null | undefined;
  readonly professorApproved: boolean;
  readonly hasDraftContent: boolean;
}): CapstoneLifecycleStatus {
  if (!input.runEligible || !input.regularMissionsComplete) {
    return "LOCKED";
  }
  if (input.professorApproved || input.reviewStatus === "approved") {
    return "APPROVED";
  }
  if (input.reviewStatus === "needs_revision") {
    return "REVISION_REQUESTED";
  }
  if (input.reviewStatus === "rejected") {
    return "REJECTED";
  }
  if (input.status === "submitted" && input.reviewStatus === "pending") {
    return "UNDER_REVIEW";
  }
  if (input.status === "submitted") {
    return "SUBMITTED";
  }
  if (input.hasDraftContent || input.status === "draft") {
    return "IN_PROGRESS";
  }
  return "AVAILABLE";
}

export function areRegularMissionsComplete(
  curriculumVersion: CurriculumVersion,
  completedMissionKeys: ReadonlySet<string>,
): boolean {
  const required = listRegularMissionsForCurriculum(curriculumVersion);
  return required.every((mission) => completedMissionKeys.has(mission.missionKey));
}
