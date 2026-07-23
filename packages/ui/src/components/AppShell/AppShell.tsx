import type { ReactNode } from "react";

export interface AppShellProps {
  readonly topNav?: ReactNode;
  readonly sidebar?: ReactNode;
  readonly rightPanel?: ReactNode;
  readonly children: ReactNode;
  readonly rightPanelCollapsed?: boolean;
  readonly navCollapsed?: boolean;
}

export function AppShell({
  topNav,
  sidebar,
  rightPanel,
  children,
  rightPanelCollapsed = false,
  navCollapsed = false,
}: AppShellProps): ReactNode {
  const className = [
    "tec-app-shell",
    rightPanelCollapsed ? "tec-app-shell--context-collapsed" : "",
    navCollapsed ? "tec-app-shell--nav-collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} data-testid="tec-app-shell">
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
          <aside
            className="tec-app-shell__right-panel"
            data-testid="tec-app-shell-right-panel"
            hidden={rightPanelCollapsed}
          >
            {rightPanel}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
