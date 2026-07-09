import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { ACCESS_PREPARING_LABEL } from "../../workspace/workspaceCopy.js";
import { getAppPath, getSidebarApps } from "../../workspace/appRegistry.js";

export function WorkspaceSidebar(): ReactNode {
  const location = useLocation();
  const apps = getSidebarApps();

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
              <span>{app.label}</span>
              {app.access === "preparing" ? (
                <span className="workspace-sidebar__preparing">{ACCESS_PREPARING_LABEL}</span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
