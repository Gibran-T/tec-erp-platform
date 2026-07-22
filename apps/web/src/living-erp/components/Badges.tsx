import type { ReactNode } from "react";

export function RunBadge({
  label,
  historical = false,
  active = false,
}: {
  readonly label: string;
  readonly historical?: boolean;
  readonly active?: boolean;
}): ReactNode {
  const className = [
    "living-badge",
    historical ? "living-badge--historical" : "",
    active ? "living-badge--active" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={className} data-testid="run-badge">
      {label}
    </span>
  );
}

export function CurriculumBadge({ label }: { readonly label: string }): ReactNode {
  return (
    <span className="living-badge" data-testid="curriculum-badge">
      {label}
    </span>
  );
}

export function ProgressBar({
  value,
  label,
}: {
  readonly value: number;
  readonly label?: string;
}): ReactNode {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div data-testid="living-progress">
      {label ? <p className="living-progress__label">{label}</p> : null}
      <div
        className="living-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={label ?? `${clamped}%`}
      >
        <div className="living-progress__bar" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
