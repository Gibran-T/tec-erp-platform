import type { ReactNode } from "react";

import { SignalLight, signalToneForStatus, type SignalTone } from "./SignalLight.js";

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

const STATUS_TO_SIGNAL: Record<StatusTone, SignalTone> = {
  pale: "blue",
  strong: "blue",
  green: "green",
  amber: "yellow",
  red: "red",
  purple: "purple",
  gold: "gold",
  gray: "gray",
};

/** Meaningful exceptional states only — never use for normal “Accès actif”. */
export const EXCEPTIONAL_STATUS_KEYS = [
  "action_required",
  "pending",
  "locked",
  "historical",
  "revision_requested",
  "completed",
  "approved",
  "blocked",
  "failed",
] as const;

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
      data-status-tone={tone}
      role="status"
    >
      <span className="living-status-chip__icon" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function StatusChipFromSignal({
  label,
  tone,
  testId = "living-status-chip",
}: {
  readonly label: string;
  readonly tone: SignalTone;
  readonly testId?: string;
}): ReactNode {
  return <SignalLight tone={tone} label={label} testId={testId} />;
}

export function toneForStatus(raw: string | null | undefined): StatusTone {
  const signal = signalToneForStatus(raw);
  if (signal === "yellow") return "amber";
  if (signal === "blue") {
    const value = (raw ?? "").toLowerCase();
    if (["active", "in_progress", "available", "sent", "current"].includes(value)) return "strong";
    return "pale";
  }
  return signal;
}

export function signalToneFromStatusTone(tone: StatusTone): SignalTone {
  return STATUS_TO_SIGNAL[tone];
}
