import { AppShell } from "@tec-platform/ui";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.js";
import { WorkspaceContextPanel } from "../components/workspace/WorkspaceContextPanel.js";
import { WorkspaceSidebar } from "../components/workspace/WorkspaceSidebar.js";
import { WorkspaceTopBar } from "../components/workspace/WorkspaceTopBar.js";
import { FirstDayDataProvider } from "../first-day/FirstDayDataContext.js";

export function WorkspaceLayout(): ReactNode {
  const { employee, logout } = useAuth();

  if (!employee) {
    return null;
  }

  return (
    <div data-testid="workspace-shell">
      <FirstDayDataProvider>
        <AppShell
          topNav={<WorkspaceTopBar employee={employee} onLogout={() => void logout()} />}
          sidebar={<WorkspaceSidebar />}
          rightPanel={<WorkspaceContextPanel />}
        >
          <Outlet />
        </AppShell>
      </FirstDayDataProvider>
    </div>
  );
}
