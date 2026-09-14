import type { ReactNode } from "react";

export type SignalTone =
  | "green"
  | "yellow"
  | "red"
  | "blue"
  | "purple"
  | "gold"
  | "gray";

export interface SignalLightProps {
  readonly tone: SignalTone;
  /** Localized accessible label — never communicate with color alone. */
  readonly label: string;
  readonly showLabel?: boolean;
  readonly title?: string;
  readonly testId?: string;
}

/**
 * TEC.ERP Living Signal System indicator.
 * Neon is semantic (status), never decorative full-surface fill.
 */
export function SignalLight({
  tone,
  label,
  showLabel = true,
  title,
  testId = "living-signal-light",
}: SignalLightProps): ReactNode {
  return (
    <span
      className={`living-signal living-signal--${tone}`}
      title={title ?? label}
      data-testid={testId}
      data-signal-tone={tone}
      role="status"
      aria-label={label}
    >
      <span className="living-signal__light" aria-hidden="true" />
      {showLabel ? <span className="living-signal__label">{label}</span> : null}
    </span>
  );
}

export function signalToneForStatus(raw: string | null | undefined): SignalTone {
  const value = (raw ?? "").toLowerCase();
  if (
    ["completed", "approved", "issued", "resolved", "passed", "valid", "compliant", "healthy"].includes(
      value,
    )
  ) {
    return "green";
  }
  if (
    [
      "paused",
      "revision_requested",
      "needs_revision",
      "stale",
      "warning",
      "pending",
      "attention",
      "under_review",
      "submitted",
    ].includes(value)
  ) {
    return "yellow";
  }
  if (
    ["failed", "rejected", "revoked", "cancelled", "error", "locked", "blocked", "critical"].includes(
      value,
    )
  ) {
    return "red";
  }
  if (["active", "in_progress", "available", "sent", "current"].includes(value)) {
    return "blue";
  }
  if (["ai", "coach", "purple", "assisted"].includes(value)) {
    return "purple";
  }
  if (["gold", "silver", "certified", "certified_gold"].includes(value)) {
    return "gold";
  }
  return "gray";
}
