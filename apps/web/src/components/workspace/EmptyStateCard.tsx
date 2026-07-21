import type { ReactNode } from "react";

export interface EmptyStateCardProps {
  readonly title: string;
  readonly description: string;
  readonly badge?: string;
}

export function EmptyStateCard({ title, description, badge }: EmptyStateCardProps): ReactNode {
  return (
    <section className="workspace-empty-state" data-testid="workspace-empty-state">
      {badge ? (
        <span className="workspace-empty-state__badge" data-testid="workspace-empty-state-badge">
          {badge}
        </span>
      ) : null}
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
