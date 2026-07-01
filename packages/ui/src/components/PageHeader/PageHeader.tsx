import type { ReactNode } from "react";

export interface PageHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps): ReactNode {
  return (
    <header className="tec-page-header">
      <div className="tec-page-header__content">
        <h1 className="tec-page-header__title">{title}</h1>
        {subtitle ? <p className="tec-page-header__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="tec-page-header__actions">{actions}</div> : null}
    </header>
  );
}
