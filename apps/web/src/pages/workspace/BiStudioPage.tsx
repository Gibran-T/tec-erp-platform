import { useEffect, useMemo, useState, type ReactElement } from "react";

import {
  getAnalyticsDashboards,
  getAnalyticsExceptions,
  getAnalyticsKpis,
  type AnalyticsExceptionRow,
  type AnalyticsKpiCard,
} from "../../api/analytics.js";
import { useLocale } from "../../i18n/LocaleProvider.js";
import { KpiExplainedCard } from "../../living-erp/components/KpiExplainedCard.js";
import { StatusChip, toneForStatus } from "../../living-erp/components/StatusChip.js";
import { explainKpi } from "../../living-erp/kpiCatalog.js";
import {
  ELE_M3_PILOT_EVENTS,
  getEleM3PilotEvents,
} from "../../simulation/ele-m3-pilot.js";

const INTERPRETATION_STEPS = [
  "biStudio.step.observe",
  "biStudio.step.filter",
  "biStudio.step.compare",
  "biStudio.step.explain",
  "biStudio.step.diagnose",
  "biStudio.step.recommend",
] as const;

const STEP_DETAIL_KEYS = {
  "biStudio.step.observe": "biStudio.step.observe.detail",
  "biStudio.step.filter": "biStudio.step.filter.detail",
  "biStudio.step.compare": "biStudio.step.compare.detail",
  "biStudio.step.explain": "biStudio.step.explain.detail",
  "biStudio.step.diagnose": "biStudio.step.diagnose.detail",
  "biStudio.step.recommend": "biStudio.step.recommend.detail",
} as const;

const DEMO_SERIES = [
  { label: "S1", actual: 72, target: 80 },
  { label: "S2", actual: 78, target: 80 },
  { label: "S3", actual: 81, target: 80 },
  { label: "S4", actual: 76, target: 80 },
] as const;

const FORECAST_SERIES = [
  { label: "S5", value: 83 },
  { label: "S6", value: 85 },
] as const;

function parseNumericValue(raw: string | number | null | undefined): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw !== "string") {
    return null;
  }
  const normalized = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  if (normalized.length === 0) {
    return null;
  }
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildKpiBars(kpis: AnalyticsKpiCard[]): Array<{ key: string; label: string; actual: number; target: number }> {
  const bars: Array<{ key: string; label: string; actual: number; target: number }> = [];
  for (const kpi of kpis) {
    const actual = parseNumericValue(kpi.value ?? kpi.formattedValue);
    const explained = explainKpi(kpi);
    const target = parseNumericValue(explained.target);
    if (actual !== null && target !== null && target > 0) {
      bars.push({ key: kpi.key, label: kpi.label, actual, target });
    }
  }
  return bars;
}

export interface BiStudioPageProps {
  readonly showEleM3Pilot?: boolean;
  readonly historicalRun?: boolean;
}

export function BiStudioPage({
  showEleM3Pilot = true,
  historicalRun = false,
}: BiStudioPageProps): ReactElement {
  const { t, statusLabel, formatDate } = useLocale();
  const [activeStep, setActiveStep] = useState(0);
  const [summaryText, setSummaryText] = useState("");
  const [dashboardTitle, setDashboardTitle] = useState("");
  const [kpis, setKpis] = useState<AnalyticsKpiCard[]>([]);
  const [exceptions, setExceptions] = useState<AnalyticsExceptionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const [dashboardResponse, kpiResponse, exceptionResponse] = await Promise.all([
          getAnalyticsDashboards(),
          getAnalyticsKpis(),
          getAnalyticsExceptions(),
        ]);
        setSummaryText(dashboardResponse.summaryText);
        setDashboardTitle(dashboardResponse.dashboards[0]?.title ?? t("shell.dashboard"));
        setKpis(kpiResponse.kpis);
        setExceptions(exceptionResponse.exceptions);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error.generic"));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [t]);

  const kpiBars = useMemo(() => buildKpiBars(kpis), [kpis]);
  const useDemoSeries = kpiBars.length === 0;
  const eleEvents = showEleM3Pilot ? getEleM3PilotEvents("M3") : [];
  const currentStepKey = INTERPRETATION_STEPS[activeStep] ?? INTERPRETATION_STEPS[0];

  return (
    <main className="workspace-page bi-studio-page" data-testid="bi-studio-page">
      <header>
        <h1>{t("biStudio.title")}</h1>
        <p>{t("biStudio.subtitle")}</p>
        <div className="living-shell-controls" data-testid="bi-studio-sources">
          <StatusChip label={t("biStudio.source.nordHabitat")} tone="pale" testId="bi-studio-source-lab" />
          <StatusChip label={t("biStudio.source.sapCourse")} tone="green" testId="bi-studio-source-sap" />
        </div>
      </header>

      <section aria-label={t("biStudio.interpretationPath")} data-testid="bi-studio-interpretation-path">
        <h2>{t("biStudio.interpretationPath")}</h2>
        <ol className="bi-studio-path" data-testid="bi-studio-path-steps">
          {INTERPRETATION_STEPS.map((stepKey, index) => (
            <li key={stepKey}>
              <button
                type="button"
                aria-current={activeStep === index ? "step" : undefined}
                data-testid={`bi-studio-step-${index}`}
                onClick={() => setActiveStep(index)}
              >
                {t(stepKey)}
              </button>
            </li>
          ))}
        </ol>
        <p data-testid="bi-studio-step-detail">{t(STEP_DETAIL_KEYS[currentStepKey])}</p>
      </section>

      {error ? (
        <p role="alert" data-testid="bi-studio-error">
          {error}
        </p>
      ) : null}
      {loading ? <p role="status">{t("loading.generic")}</p> : null}

      {!loading && !error ? (
        <>
          <section aria-label={t("biStudio.dashboardSummary")} data-testid="bi-studio-summary">
            <h2>{dashboardTitle}</h2>
            <p>{summaryText || t("empty.generic")}</p>
          </section>

          <section aria-label={t("biStudio.kpis")} data-testid="bi-studio-kpis">
            <h2>{t("biStudio.kpis")}</h2>
            {kpis.length === 0 ? <p>{t("empty.generic")}</p> : null}
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
              }}
            >
              {kpis.map((kpi) => (
                <KpiExplainedCard key={kpi.key} {...explainKpi(kpi)} />
              ))}
            </div>
          </section>

          <section aria-label={t("biStudio.visualization")} data-testid="bi-studio-visualization">
            <h2>{t("biStudio.visualization")}</h2>
            {useDemoSeries ? (
              <p data-testid="bi-studio-demo-series-label">{t("biStudio.demoSeries")}</p>
            ) : null}
            <div className="bi-studio-bars" role="img" aria-label={t("biStudio.visualization")}>
              {(useDemoSeries ? DEMO_SERIES : kpiBars).map((item) => {
                const actual = item.actual;
                const target = item.target;
                const max = Math.max(actual, target, 1);
                const rowKey = "key" in item ? item.key : item.label;
                return (
                  <div key={rowKey} data-testid="bi-studio-bar-row">
                    <span>{item.label}</span>
                    <div style={{ display: "flex", gap: "0.25rem", alignItems: "flex-end", height: "4rem" }}>
                      <div
                        title={`${t("kpi.actual")}: ${actual}`}
                        style={{
                          width: "1.5rem",
                          height: `${(actual / max) * 100}%`,
                          background: "var(--tec-accent, #2563eb)",
                        }}
                      />
                      <div
                        title={`${t("kpi.target")}: ${target}`}
                        style={{
                          width: "1.5rem",
                          height: `${(target / max) * 100}%`,
                          background: "var(--tec-muted, #94a3b8)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-label={t("biStudio.forecast.label")} data-testid="bi-studio-forecast">
            <h2>
              {t("biStudio.forecast.label")}{" "}
              <StatusChip label={t("biStudio.forecast.badge")} tone="purple" testId="bi-studio-forecast-badge" />
            </h2>
            <p data-testid="bi-studio-forecast-disclaimer">{t("biStudio.forecast.disclaimer")}</p>
            <div className="bi-studio-bars" data-testid="bi-studio-forecast-series">
              {FORECAST_SERIES.map((point) => (
                <div key={point.label} data-testid="bi-studio-forecast-point">
                  <span>
                    {point.label} — {t("biStudio.forecast.badge")}
                  </span>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "12rem",
                      height: "0.75rem",
                      background: "repeating-linear-gradient(90deg, #7c3aed 0 0.5rem, transparent 0.5rem 1rem)",
                    }}
                  />
                  <span>{point.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section aria-label={t("biStudio.exceptions")} data-testid="bi-studio-exceptions">
            <h2>{t("biStudio.exceptions")}</h2>
            {exceptions.length === 0 ? <p>{t("biStudio.noExceptions")}</p> : null}
            <table>
              <thead>
                <tr>
                  <th scope="col">{t("biStudio.exceptionCategory")}</th>
                  <th scope="col">{t("biStudio.exceptionSeverity")}</th>
                  <th scope="col">{t("biStudio.exceptionSummary")}</th>
                  <th scope="col">{t("biStudio.exceptionSource")}</th>
                  <th scope="col">{t("biStudio.exceptionDetected")}</th>
                </tr>
              </thead>
              <tbody>
                {exceptions.map((row) => (
                  <tr key={row.id} data-testid={`bi-studio-exception-${row.id}`}>
                    <td>{row.category}</td>
                    <td>
                      <StatusChip label={statusLabel(row.severity)} tone={toneForStatus(row.severity)} />
                    </td>
                    <td>{row.summary}</td>
                    <td>{row.sourceType}</td>
                    <td>{formatDate(row.detectedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : null}

      {showEleM3Pilot && eleEvents.length > 0 ? (
        <section className="living-home-section" data-testid="bi-studio-ele-m3-pilot">
          <h2>{t("ele.m3.title")}</h2>
          <p data-testid="ele-m3-pilot-note">{t("ele.m3.pilotNote")}</p>
          <StatusChip label={t("ele.m3.ambientAi")} tone="purple" testId="ele-m3-ambient-badge" />
          {historicalRun ? (
            <p role="note" data-testid="ele-m3-historical-note">
              {t("ele.m3.historicalNote")}
            </p>
          ) : null}
          <ul data-testid="ele-m3-event-list">
            {eleEvents.map((event) => (
              <li key={event.id} data-testid={`ele-m3-event-${event.id}`}>
                <strong>{event.stakeholder}</strong> ({event.role}) — {formatDate(event.occurredAt)}
                <p>{event.note}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

export function hasEleM3PilotContent(): boolean {
  return ELE_M3_PILOT_EVENTS.length >= 3;
}
