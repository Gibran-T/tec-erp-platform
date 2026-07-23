import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { listMyPedagogicalRuns } from "../../api/pedagogical-runs.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import type { MessageKey } from "../../i18n/messages/fr.js";
import { useTheme } from "../../theme/ThemeProvider.js";
import { NORDHABITAT_TAGLINE } from "../../workspace/workspaceCopy.js";
import { EmployeeBadgeMenu } from "./EmployeeBadgeMenu.js";

export interface WorkspaceTopBarProps {
  readonly employee: AuthenticatedEmployee;
  readonly onLogout: () => void;
  readonly onToggleContext?: () => void;
  readonly contextCollapsed?: boolean;
}

function localizedRunType(
  run: Record<string, unknown>,
  t: (key: MessageKey) => string,
): string {
  const runType = String(run.runType ?? "");
  if (runType === "AUTONOMOUS") return t("run.type.AUTONOMOUS");
  if (runType === "COHORT") return t("run.type.COHORT");
  if (runType === "REMEDIATION") return t("run.type.REMEDIATION");
  const label = typeof run.runTypeLabel === "string" ? run.runTypeLabel : "";
  if (label && !/autonomous zero1/i.test(label)) return label;
  return "";
}

export function WorkspaceTopBar({
  employee,
  onLogout,
  onToggleContext,
  contextCollapsed = false,
}: WorkspaceTopBarProps): ReactNode {
  const { t, locale, setLocale, statusLabel } = useLocale();
  const { preference, setPreference, resolved } = useTheme();
  const [runSequence, setRunSequence] = useState("1");
  const [curriculum, setCurriculum] = useState("—");
  const [stateLabel, setStateLabel] = useState("—");
  const [progress, setProgress] = useState<string | null>(null);
  const [runTypeLabel, setRunTypeLabel] = useState("");
  const [technicalTitle, setTechnicalTitle] = useState("");

  useEffect(() => {
    let cancelled = false;
    void listMyPedagogicalRuns()
      .then((runs) => {
        if (cancelled) return;
        const active = runs.find((run) => run.status === "ACTIVE") ?? runs[runs.length - 1];
        if (!active) return;
        const sequence = Number(active.runSequence ?? 1);
        setRunSequence(String(Number.isFinite(sequence) ? sequence : 1));
        const curriculumRaw = String(
          active.curriculumVersionLabel ?? active.curriculumVersion ?? "—",
        );
        setCurriculum(curriculumRaw.replace(/^Curriculum\s+/i, "").trim() || curriculumRaw);
        const historical =
          Boolean(active.isHistorical) ||
          active.status === "COMPLETED" ||
          active.isWritable === false;
        setStateLabel(
          historical ? t("status.historical") : statusLabel(String(active.status ?? "ACTIVE")),
        );
        if (typeof active.completionPercent === "number") {
          const completed = Math.round((active.completionPercent / 100) * 30);
          setProgress(`${completed}/30`);
        } else {
          setProgress(null);
        }
        setRunTypeLabel(localizedRunType(active as Record<string, unknown>, t));
        setTechnicalTitle(
          String(active.runLabel ?? active.runCode ?? `Run ${sequence}`),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [statusLabel, t]);

  const contextLine = useMemo(() => {
    const parts = [
      employee.displayName,
      `Run ${runSequence}`,
      curriculum,
      stateLabel,
    ];
    if (progress) parts.push(progress);
    return parts.filter(Boolean).join(" · ");
  }, [curriculum, employee.displayName, progress, runSequence, stateLabel]);

  const contextTitle = [technicalTitle, runTypeLabel, curriculum, stateLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="workspace-topbar" data-testid="workplace-topbar" data-resolved-theme={resolved}>
      <div className="workspace-topbar__left">
        <div className="workspace-topbar__brand">
          <span className="workspace-topbar__logo">NordHabitat</span>
          <span className="workspace-topbar__tagline">{NORDHABITAT_TAGLINE}</span>
        </div>
        <div className="workspace-topbar__identity" data-testid="shell-learner-identity">
          <span className="workspace-topbar__identity-name">{employee.displayName}</span>
          <span className="workspace-topbar__identity-meta">{employee.employeeNumber}</span>
        </div>
      </div>

      <p
        className="workspace-topbar__context"
        data-testid="shell-unified-context"
        title={contextTitle}
      >
        <strong>{employee.displayName}</strong>
        {` · Run ${runSequence} · ${curriculum} · ${stateLabel}`}
        {progress ? ` · ${progress}` : ""}
        <span className="sr-only">{contextLine}</span>
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
