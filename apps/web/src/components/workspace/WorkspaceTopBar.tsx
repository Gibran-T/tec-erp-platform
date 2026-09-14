import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { useMemo, type ReactNode } from "react";

import { useLocale } from "../../i18n/LocaleProvider.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import {
  SAP_ANALYSTE_PROGRAM_SUBTITLE,
  SAP_ANALYSTE_PROGRAM_TITLE,
} from "../../workspace/sapAnalysteProduct.js";
import { EmployeeBadgeMenu } from "./EmployeeBadgeMenu.js";

export interface WorkspaceTopBarProps {
  readonly employee: AuthenticatedEmployee;
  readonly onLogout: () => void;
  readonly onToggleContext?: () => void;
  readonly contextCollapsed?: boolean;
}

export function WorkspaceTopBar({
  employee,
  onLogout,
  onToggleContext,
  contextCollapsed = false,
}: WorkspaceTopBarProps): ReactNode {
  const { t, locale, setLocale } = useLocale();
  const { preference, setPreference, resolved } = useTheme();

  const contextLine = useMemo(() => {
    return [employee.displayName, SAP_ANALYSTE_PROGRAM_TITLE].join(" · ");
  }, [employee.displayName]);

  return (
    <div className="workspace-topbar" data-testid="workplace-topbar" data-resolved-theme={resolved}>
      <div className="workspace-topbar__left">
        <div className="workspace-topbar__brand">
          <span className="workspace-topbar__logo">{SAP_ANALYSTE_PROGRAM_TITLE}</span>
          <span className="workspace-topbar__tagline">{SAP_ANALYSTE_PROGRAM_SUBTITLE}</span>
        </div>
        <div className="workspace-topbar__identity" data-testid="shell-learner-identity">
          <span className="workspace-topbar__identity-name">{employee.displayName}</span>
          <span className="workspace-topbar__identity-meta">{employee.employeeNumber}</span>
        </div>
      </div>

      <p
        className="workspace-topbar__context"
        data-testid="shell-unified-context"
        title={contextLine}
        aria-label={contextLine}
      >
        {contextLine}
      </p>

      <div className="workspace-topbar__actions living-shell-controls" data-testid="living-shell-controls">
        <label>
          <span className="sr-only">{t("shell.language")}</span>
          <select
            data-testid="locale-switch"
            value={locale}
            onChange={(event) => setLocale(event.target.value === "en" ? "en" : "fr")}
            aria-label={t("shell.language")}
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        </label>
        <label>
          <span className="sr-only">{t("shell.theme")}</span>
          <select
            data-testid="theme-switch"
            value={preference}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "light" || value === "dark" || value === "system") {
                setPreference(value);
              }
            }}
            aria-label={t("shell.theme")}
          >
            <option value="light">{t("shell.theme.light")}</option>
            <option value="dark">{t("shell.theme.dark")}</option>
            <option value="system">{t("shell.theme.system")}</option>
          </select>
        </label>
        {onToggleContext ? (
          <button
            type="button"
            data-testid="toggle-context-panel"
            onClick={onToggleContext}
            aria-expanded={!contextCollapsed}
          >
            {contextCollapsed ? t("shell.expandContext") : t("shell.collapseContext")}
          </button>
        ) : null}
        <EmployeeBadgeMenu employee={employee} onLogout={() => void onLogout()} compact />
      </div>
    </div>
  );
}
