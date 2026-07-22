import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { ACCESS_PREPARING_LABEL } from "../../workspace/workspaceCopy.js";
import { getAppPath, getSidebarApps } from "../../workspace/appRegistry.js";

const MODULE_CODES = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10"] as const;

export function WorkspaceSidebar(): ReactNode {
  const location = useLocation();
  const { employee } = useAuth();
  const { t } = useLocale();
  const apps = getSidebarApps(employee?.role);

  function isActive(appId: string): boolean {
    const path = getAppPath(appId);
    if (appId === "accueil") {
      return location.pathname === "/workspace";
    }
    return location.pathname === path;
  }

  return (
    <nav className="workspace-sidebar" aria-label="Applications" data-testid="workspace-sidebar">
      <p className="workspace-sidebar__heading">Applications</p>
      <ul className="workspace-sidebar__list">
        {apps.map((app) => (
          <li key={app.id}>
            <NavLink
              to={getAppPath(app.id)}
              className={() =>
                `workspace-sidebar__link${isActive(app.id) ? " workspace-sidebar__link--active" : ""}`
              }
              data-testid={`workspace-sidebar-link-${app.id}`}
            >
              <span>
                {app.label}
              </span>
              {app.access === "preparing" ? (
                <span className="workspace-sidebar__preparing">{ACCESS_PREPARING_LABEL}</span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>

      <p className="workspace-sidebar__section-title">{t("shell.modules")}</p>
      <ul className="workspace-sidebar__list" data-testid="workspace-module-map">
        {MODULE_CODES.map((code) => (
          <li key={code}>
            <NavLink
              to={`/workspace/modules/${code}`}
              className={({ isActive: active }) =>
                `workspace-sidebar__link${active ? " workspace-sidebar__link--active" : ""}`
              }
              data-testid={`workspace-sidebar-module-${code}`}
            >
              {code}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
