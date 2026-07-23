import type { MessageKey } from "./messages/fr.js";

const STATUS_KEY_MAP: Record<string, MessageKey> = {
  locked: "status.locked",
  available: "status.available",
  in_progress: "status.in_progress",
  completed: "status.completed",
  failed: "status.failed",
  active: "status.active",
  ACTIVE: "run.ACTIVE",
  COMPLETED: "run.COMPLETED",
  PAUSED: "run.PAUSED",
  CANCELLED: "run.CANCELLED",
  paused: "status.paused",
  cancelled: "status.cancelled",
  historical: "status.historical",
  revision_requested: "status.revision_requested",
  needs_revision: "status.revision_requested",
  approved: "status.approved",
  rejected: "status.rejected",
  submitted: "status.submitted",
  draft: "status.draft",
  issued: "status.issued",
  revoked: "status.revoked",
  superseded: "status.superseded",
  DRAFT: "intervention.DRAFT",
  SENT: "intervention.SENT",
  ACKNOWLEDGED: "intervention.ACKNOWLEDGED",
  IN_PROGRESS: "intervention.IN_PROGRESS",
  RESOLVED: "intervention.RESOLVED",
  LOCKED: "status.locked",
  AVAILABLE: "status.available",
  APPROVED: "status.approved",
  REJECTED: "status.rejected",
  SUBMITTED: "status.submitted",
  REVISION_REQUESTED: "status.revision_requested",
  UNDER_REVIEW: "status.under_review",
  under_review: "status.under_review",
  ARCHIVED: "status.archived",
  archived: "status.archived",
  PLANNED: "status.planned",
  planned: "status.planned",
};

export function statusMessageKey(raw: string | null | undefined): MessageKey {
  if (!raw) {
    return "status.unknown";
  }
  return STATUS_KEY_MAP[raw] ?? "status.unknown";
}

export function humanizeTechnicalId(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}
