import type { ReactNode } from "react";

import { useAuth } from "../../auth/AuthContext.js";
import { getLauncherApps } from "../../workspace/appRegistry.js";
import { AppTile } from "./AppTile.js";

export function AppLauncherGrid(): ReactNode {
  const { employee } = useAuth();
  const apps = getLauncherApps(employee?.role).filter((app) => app.id !== "accueil");

  return (
    <section className="workspace-app-launcher" data-testid="workspace-app-launcher">
      <h2>Applications disponibles</h2>
      <div className="workspace-app-launcher__grid">
        {apps.map((app) => (
          <AppTile key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
