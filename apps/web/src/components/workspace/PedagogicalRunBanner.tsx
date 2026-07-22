import { useEffect, useState, type ReactElement } from "react";

import { listMyPedagogicalRuns } from "../../api/pedagogical-runs.js";

const STORAGE_KEY = "tec.erp.activeRunId";

export function PedagogicalRunBanner(): ReactElement | null {
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

  return (
    <section className="pedagogical-run-banner" data-testid="pedagogical-run-banner" aria-label="Parcours pédagogique">
      <div>
        <strong>{String(selected?.runLabel ?? "Parcours")}</strong>
        <span>
          {" "}
          · {String(selected?.statusLabel ?? selected?.status ?? "")} ·{" "}
          {String(selected?.runTypeLabel ?? selected?.runType ?? "")}
          {selected?.curriculumVersionLabel || selected?.curriculumVersion
            ? ` · ${String(selected.curriculumVersionLabel ?? selected.curriculumVersion)}`
            : ""}
        </span>
        {typeof selected?.completionPercent === "number" ? (
          <span> · {selected.completionPercent} %</span>
        ) : null}
        {isHistorical ? (
          <span data-testid="pedagogical-run-historical-badge"> · Historique (lecture seule)</span>
        ) : null}
        {isCurrent ? (
          <span data-testid="pedagogical-run-current-badge"> · Parcours courant</span>
        ) : null}
      </div>
      <label>
        Parcours
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
              {String(run.runCode)} — {String(run.statusLabel ?? run.status)}
              {run.isHistorical ? " (historique)" : ""}
              {run.isWritable ? " (courant)" : ""}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
