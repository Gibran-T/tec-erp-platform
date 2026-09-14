import { useEffect, useState, type ReactElement } from "react";

import { listMyPedagogicalRuns } from "../../api/pedagogical-runs.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import type { MessageKey } from "../../i18n/messages/fr.js";

const STORAGE_KEY = "tec.erp.activeRunId";

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
  return runType || "—";
}

function localizedRunHeading(run: Record<string, unknown>, t: (key: MessageKey) => string): string {
  const sequence = Number(run.runSequence ?? 1);
  const curriculum = String(run.curriculumVersionLabel ?? run.curriculumVersion ?? "");
  const parts = [
    `Run ${Number.isFinite(sequence) ? sequence : 1}`,
    localizedRunType(run, t),
  ];
  if (curriculum) parts.push(curriculum);
  return parts.join(" · ");
}

export function PedagogicalRunBanner({
  selectorOnly = false,
}: {
  readonly selectorOnly?: boolean;
} = {}): ReactElement | null {
  const { t, statusLabel } = useLocale();
  const [runs, setRuns] = useState<Array<Record<string, unknown>>>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void listMyPedagogicalRuns()
      .then((items) => {
        setRuns(items);
        if (!selectedRunId && items.length > 0) {
          const active = items.find((item) => item.status === "ACTIVE") ?? items[items.length - 1];
          if (active && typeof active.id === "string") {
            setSelectedRunId(active.id);
            window.localStorage.setItem(STORAGE_KEY, active.id);
          }
        }
      })
      .catch((err: Error) => setError(err.message));
  }, [selectedRunId]);

  if (error) {
    return (
      <p role="status" data-testid="pedagogical-run-banner-error">
        {error}
      </p>
    );
  }

  if (runs.length === 0) {
    return null;
  }

  const selected = runs.find((run) => run.id === selectedRunId) ?? runs[0];
  const isHistorical =
    Boolean(selected?.isHistorical) || selected?.status === "COMPLETED" || selected?.isWritable === false;
  const isCurrent = Boolean(selected?.isWritable) || selected?.status === "ACTIVE";

  if (selectorOnly && runs.length <= 1) {
    return null;
  }

  return (
    <section
      className={`pedagogical-run-banner${selectorOnly ? " pedagogical-run-banner--selector-only" : ""}`}
      data-testid="pedagogical-run-banner"
      aria-label={t("shell.run")}
    >
      {selectorOnly ? null : (
        <div>
          <strong data-testid="pedagogical-run-heading">{localizedRunHeading(selected ?? {}, t)}</strong>
          <span>
            {" "}
            · {statusLabel(String(selected?.status ?? ""))} · {localizedRunType(selected ?? {}, t)}
            {typeof selected?.completionPercent === "number"
              ? ` · ${selected.completionPercent} %`
              : ""}
          </span>
          {isHistorical ? (
            <span data-testid="pedagogical-run-historical-badge">
              {" "}
              · {t("status.historical")} ({t("status.readOnly")})
            </span>
          ) : null}
          {isCurrent && !isHistorical ? (
            <span data-testid="pedagogical-run-current-badge"> · {t("shell.currentRun")}</span>
          ) : null}
        </div>
      )}
      {runs.length > 1 ? (
        <label>
          {t("shell.run")}
          <select
            data-testid="pedagogical-run-selector"
            value={typeof selected?.id === "string" ? selected.id : ""}
            onChange={(event) => {
              setSelectedRunId(event.target.value);
              window.localStorage.setItem(STORAGE_KEY, event.target.value);
            }}
          >
            {runs.map((run) => (
              <option key={String(run.id)} value={String(run.id)}>
                {localizedRunHeading(run, t)}
                {run.isHistorical ? ` (${t("status.historical")})` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </section>
  );
}
