import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { useEffect, useState, type ReactNode } from "react";

import { listMyPedagogicalRuns } from "../../api/pedagogical-runs.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { CurriculumBadge, RunBadge } from "../../living-erp/components/Badges.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import { NORDHABITAT_TAGLINE } from "../../workspace/workspaceCopy.js";
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
  const { preference, setPreference } = useTheme();
  const [runLabel, setRunLabel] = useState("—");
  const [historical, setHistorical] = useState(false);
  const [curriculum, setCurriculum] = useState("—");

  useEffect(() => {
    let cancelled = false;
    void listMyPedagogicalRuns()
      .then((runs) => {
        if (cancelled) return;
        const active = runs.find((run) => run.status === "ACTIVE") ?? runs[runs.length - 1];
        if (!active) return;
        setRunLabel(String(active.runLabel ?? active.runCode ?? "—"));
        setHistorical(Boolean(active.isHistorical) || active.status === "COMPLETED");
        setCurriculum(
          String(active.curriculumVersionLabel ?? active.curriculumVersion ?? "—"),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="workspace-topbar" data-testid="workplace-topbar">
      <div className="workspace-topbar__brand">
        <span className="workspace-topbar__logo">NordHabitat</span>
        <span className="workspace-topbar__tagline">{NORDHABITAT_TAGLINE}</span>
      </div>
      <div className="living-shell-controls" data-testid="living-shell-controls">
        <RunBadge
          label={`${t("shell.run")}: ${runLabel}`}
          historical={historical}
          active={!historical}
        />
        <CurriculumBadge label={`${t("shell.curriculum")}: ${curriculum}`} />
        <label>
          {t("shell.language")}
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
          {t("shell.theme")}
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
        <EmployeeBadgeMenu employee={employee} onLogout={() => void onLogout()} />
      </div>
    </div>
  );
}
