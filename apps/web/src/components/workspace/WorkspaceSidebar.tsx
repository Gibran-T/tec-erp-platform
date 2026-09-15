import type { ReactNode } from "react";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { getAppPath, getWorkspaceApp } from "../../workspace/appRegistry.js";

interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly path: string;
}

function appNav(id: string, label?: string): NavItem | null {
  const app = getWorkspaceApp(id);
  if (!app) return null;
  return {
    id,
    label: label ?? app.label,
    path: getAppPath(id),
  };
}

export function WorkspaceSidebar(): ReactNode {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { employee } = useAuth();
  const { t } = useLocale();
  const role = employee?.role;
  const canTeach = role === "PROFESSOR" || role === "ADMIN";

  const parcours: NavItem[] = [
    appNav("accueil", "Accueil"),
    appNav("parcours-sap-iee2e", "Parcours SAP"),
  ].filter((item): item is NavItem => item !== null);

  if (canTeach) {
    parcours.push({
      id: "suivi-professeur",
      label: t("shell.professorDashboard"),
      path: `${getAppPath("parcours-sap-iee2e")}?vue=professeur`,
    });
  }

  const account: NavItem[] = [appNav("profil")].filter((item): item is NavItem => item !== null);

  if (role === "ADMIN") {
    const admin = appNav("administration");
    if (admin) account.push(admin);
  }

  function isActive(item: NavItem): boolean {
    if (item.id === "accueil") {
      return location.pathname === "/workspace";
    }
    const onParcours = location.pathname === getAppPath("parcours-sap-iee2e");
    if (item.id === "suivi-professeur") {
      return onParcours && searchParams.get("vue") === "professeur";
    }
    if (item.id === "parcours-sap-iee2e") {
      return onParcours && searchParams.get("vue") !== "professeur";
    }
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  }

  function renderGroup(title: string, items: NavItem[], testId: string): ReactNode {
    return (
      <>
        <p className="workspace-sidebar__section-title">{title}</p>
        <ul className="workspace-sidebar__list" data-testid={testId}>
          {items.map((item) => (
            <li key={`${testId}-${item.id}`}>
              <NavLink
                to={item.path}
                className={() =>
                  `workspace-sidebar__link${isActive(item) ? " workspace-sidebar__link--active" : ""}`
                }
                data-testid={`workspace-sidebar-link-${item.id}`}
              >
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <nav className="workspace-sidebar" aria-label={t("shell.nav.aria")} data-testid="workspace-sidebar">
      {renderGroup("Programme", parcours, "workspace-nav-parcours")}
      {renderGroup(t("shell.nav.account"), account, "workspace-nav-account")}
    </nav>
  );
}
