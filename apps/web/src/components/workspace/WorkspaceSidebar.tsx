import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { getAppPath, getWorkspaceApp } from "../../workspace/appRegistry.js";

const MODULE_CODES = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10"] as const;

interface NavItem {
  readonly id: string;
  readonly labelKey?: string;
  readonly label?: string;
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
  const { employee } = useAuth();
  const { t } = useLocale();
  const role = employee?.role;

  const parcours: NavItem[] = [
    appNav("accueil"),
    { id: "modules", label: t("shell.nav.modules"), path: "/workspace/modules/M1" },
    appNav("evaluations"),
    appNav("capstone", t("shell.capstone")),
  ].filter((item): item is NavItem => item !== null);

  const operations: NavItem[] = [
    appNav("documents"),
    appNav("boite-reception"),
    appNav("taches"),
    appNav("centre-mission"),
    appNav("erp", t("shell.nav.erp")),
    appNav("tableaux-bord"),
    appNav("coach-ia"),
  ].filter((item): item is NavItem => item !== null);

  const results: NavItem[] = [
    appNav("certificats"),
    {
      id: "historique",
      label: t("shell.nav.history"),
      path: getAppPath("documents"),
    },
  ].filter((item): item is NavItem => item !== null);

  const account: NavItem[] = [appNav("profil")].filter((item): item is NavItem => item !== null);

  if (role === "PROFESSOR" || role === "ADMIN") {
    const professor = appNav("portail-professeur");
    if (professor) operations.push(professor);
  }
  if (role === "ADMIN") {
    const admin = appNav("administration");
    if (admin) account.push(admin);
  }

  function isActive(item: NavItem): boolean {
    if (item.id === "accueil") {
      return location.pathname === "/workspace";
    }
    if (item.id === "modules") {
      return location.pathname.startsWith("/workspace/modules/");
    }
    if (item.id === "historique") {
      return false;
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
      {renderGroup(t("shell.nav.parcours"), parcours, "workspace-nav-parcours")}
      <p className="workspace-sidebar__section-title">{t("shell.nav.modules")}</p>
      <ul className="workspace-sidebar__list workspace-sidebar__modules" data-testid="workspace-module-map">
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
      {renderGroup(t("shell.nav.operations"), operations, "workspace-nav-operations")}
      {renderGroup(t("shell.nav.results"), results, "workspace-nav-results")}
      {renderGroup(t("shell.nav.account"), account, "workspace-nav-account")}
    </nav>
  );
}
