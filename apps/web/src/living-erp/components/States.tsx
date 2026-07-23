import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  testId = "living-empty-state",
}: {
  readonly title: string;
  readonly description?: string;
  readonly testId?: string;
}): ReactNode {
  return (
    <div className="living-empty" data-testid={testId} role="status">
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function ErrorState({
  message,
  testId = "living-error-state",
}: {
  readonly message: string;
  readonly testId?: string;
}): ReactNode {
  return (
    <div className="living-error" data-testid={testId} role="alert">
      {message}
    </div>
  );
}

export function SkeletonBlock({ testId = "living-skeleton" }: { readonly testId?: string }): ReactNode {
  return <div className="living-skeleton" data-testid={testId} aria-hidden="true" />;
}
