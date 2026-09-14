import type { ReactNode } from "react";

import { useAuth } from "../../auth/AuthContext.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { getLauncherApps } from "../../workspace/appRegistry.js";
import { AppTile } from "./AppTile.js";

export function AppLauncherGrid(): ReactNode {
  const { employee } = useAuth();
  const { t } = useLocale();
  const apps = getLauncherApps(employee?.role).filter((app) => app.id !== "accueil");

  return (
    <section
      className="workspace-app-launcher workspace-app-launcher--compact living-card living-card--l3"
      data-testid="workspace-app-launcher"
    >
      <h2>{t("shell.quickAccess")}</h2>
      <div className="workspace-app-launcher__grid">
        {apps.map((app) => (
          <AppTile key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
