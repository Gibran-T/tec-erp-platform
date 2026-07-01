import type { ReactNode } from "react";

export interface AppShellProps {
  readonly topNav?: ReactNode;
  readonly sidebar?: ReactNode;
  readonly rightPanel?: ReactNode;
  readonly children: ReactNode;
}

export function AppShell({
  topNav,
  sidebar,
  rightPanel,
  children,
}: AppShellProps): ReactNode {
  return (
    <div className="tec-app-shell" data-testid="tec-app-shell">
      {topNav ? (
        <header className="tec-app-shell__top-nav" data-testid="tec-app-shell-top-nav">
          {topNav}
        </header>
      ) : null}
      <div className="tec-app-shell__body">
        {sidebar ? (
          <aside className="tec-app-shell__sidebar" data-testid="tec-app-shell-sidebar">
            {sidebar}
          </aside>
        ) : null}
        <main className="tec-app-shell__main" data-testid="tec-app-shell-main">
          {children}
        </main>
        {rightPanel ? (
          <aside className="tec-app-shell__right-panel" data-testid="tec-app-shell-right-panel">
            {rightPanel}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
