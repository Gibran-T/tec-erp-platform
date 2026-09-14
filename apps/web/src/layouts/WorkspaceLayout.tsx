import { AppShell } from "@tec-platform/ui";
import { useState, type ReactNode } from "react";
import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.js";
import { WorkspaceContextPanel } from "../components/workspace/WorkspaceContextPanel.js";
import { WorkspaceSidebar } from "../components/workspace/WorkspaceSidebar.js";
import { WorkspaceTopBar } from "../components/workspace/WorkspaceTopBar.js";
import { FirstDayDataProvider } from "../first-day/FirstDayDataContext.js";
import { useLocale } from "../i18n/LocaleProvider.js";
import { MissionDataProvider } from "../mission/MissionDataContext.js";
import { getAppPath } from "../workspace/appRegistry.js";

export function WorkspaceLayout(): ReactNode {
  const { employee, logout } = useAuth();
  const { t } = useLocale();
  const [contextCollapsed, setContextCollapsed] = useState(true);
  const canTeach = employee?.role === "PROFESSOR" || employee?.role === "ADMIN";

  if (!employee) {
    return null;
  }

  return (
    <div data-testid="workspace-shell">
      <a className="tec-skip-link" href="#contenu-principal" data-testid="skip-to-content-link">
        Passer au contenu principal
      </a>
      <FirstDayDataProvider>
        <MissionDataProvider>
          <AppShell
            topNav={
              <WorkspaceTopBar
                employee={employee}
                onLogout={() => void logout()}
                onToggleContext={() => setContextCollapsed((value) => !value)}
                contextCollapsed={contextCollapsed}
              />
            }
            sidebar={<WorkspaceSidebar />}
            rightPanel={<WorkspaceContextPanel />}
            rightPanelCollapsed={contextCollapsed}
          >
            <div id="contenu-principal" tabIndex={-1} className="workspace-main-content">
              <Outlet />
            </div>
          </AppShell>
          <nav className="living-bottom-nav" aria-label={t("shell.nav.mobile")}>
            <Link to="/workspace">{t("shell.home")}</Link>
            <Link to={getAppPath("parcours-sap-iee2e")}>Parcours SAP</Link>
            {canTeach ? (
              <Link to={`${getAppPath("parcours-sap-iee2e")}?vue=professeur`}>Suivi</Link>
            ) : null}
            <Link to={getAppPath("profil")}>{t("shell.profile")}</Link>
          </nav>
        </MissionDataProvider>
      </FirstDayDataProvider>
    </div>
  );
}
