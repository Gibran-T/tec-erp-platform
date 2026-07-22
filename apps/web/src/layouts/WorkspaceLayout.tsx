import { AppShell } from "@tec-platform/ui";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.js";
import { PedagogicalRunBanner } from "../components/workspace/PedagogicalRunBanner.js";
import { WorkspaceContextPanel } from "../components/workspace/WorkspaceContextPanel.js";
import { WorkspaceSidebar } from "../components/workspace/WorkspaceSidebar.js";
import { WorkspaceTopBar } from "../components/workspace/WorkspaceTopBar.js";
import { FirstDayDataProvider } from "../first-day/FirstDayDataContext.js";
import { MissionDataProvider } from "../mission/MissionDataContext.js";

export function WorkspaceLayout(): ReactNode {
  const { employee, logout } = useAuth();

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
            topNav={<WorkspaceTopBar employee={employee} onLogout={() => void logout()} />}
            sidebar={<WorkspaceSidebar />}
            rightPanel={<WorkspaceContextPanel />}
          >
            <div id="contenu-principal" tabIndex={-1} className="workspace-main-content">
              <PedagogicalRunBanner />
              <Outlet />
            </div>
          </AppShell>
        </MissionDataProvider>
      </FirstDayDataProvider>
    </div>
  );
}
