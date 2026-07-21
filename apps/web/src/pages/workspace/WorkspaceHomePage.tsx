import type { ReactNode } from "react";

import { useAuth } from "../../auth/AuthContext.js";
import { AppLauncherGrid } from "../../components/workspace/AppLauncherGrid.js";
import { DashboardPreview } from "../../components/workspace/DashboardPreview.js";
import { buildWelcomeMessage } from "../../workspace/workspaceCopy.js";

export function WorkspaceHomePage(): ReactNode {
  const { employee } = useAuth();

  if (!employee) {
    return null;
  }

  return (
    <section data-testid="workspace-home-page">
      <header className="workspace-home__header">
        <h1>Poste de travail</h1>
        <p className="workspace-home__welcome" data-testid="workspace-welcome-message">
          {buildWelcomeMessage(employee.displayName)}
        </p>
      </header>

      <DashboardPreview />
      <AppLauncherGrid />
    </section>
  );
}
