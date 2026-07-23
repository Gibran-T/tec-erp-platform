import type { ReactNode } from "react";

export type StatusTone =
  | "pale"
  | "strong"
  | "green"
  | "amber"
  | "red"
  | "purple"
  | "gold"
  | "gray";

export interface StatusChipProps {
  readonly label: string;
  readonly tone?: StatusTone;
  readonly title?: string;
  readonly testId?: string;
}

export function StatusChip({
  label,
  tone = "pale",
  title,
  testId = "living-status-chip",
}: StatusChipProps): ReactNode {
  return (
    <span
      className={`living-status-chip living-status-chip--${tone}`}
      title={title ?? label}
      data-testid={testId}
      role="status"
    >
      <span className="living-status-chip__icon" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function toneForStatus(raw: string | null | undefined): StatusTone {
  const value = (raw ?? "").toLowerCase();
  if (["completed", "approved", "issued", "resolved", "passed"].includes(value)) return "green";
  if (["active", "in_progress", "available", "sent"].includes(value)) return "strong";
  if (["paused", "revision_requested", "needs_revision", "stale", "warning"].includes(value)) return "amber";
  if (["failed", "rejected", "revoked", "cancelled", "error", "locked"].includes(value)) return "red";
  if (["gold", "silver"].includes(value)) return "gold";
  if (["ai", "coach", "purple"].includes(value)) return "purple";
  if (["historical", "completed_run", "archived", "draft", "submitted", "under_review"].includes(value)) return "gray";
  return "pale";
}
