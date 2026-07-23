import { useEffect, useState, type ReactElement } from "react";

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

export function DashboardPage(): ReactElement {
  const { t, statusLabel, formatDate } = useLocale();
  const [summaryText, setSummaryText] = useState<string>("");
  const [dashboardTitle, setDashboardTitle] = useState<string>("");
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

  return (
    <main className="workspace-page" data-testid="dashboard-page">
      <h1>{t("shell.dashboard")}</h1>
      <p>Indicateurs opérationnels NordHabitat — chaque chiffre est expliqué.</p>
      {error ? (
        <p role="alert" data-testid="dashboard-error">
          {error}
        </p>
      ) : null}
      {loading ? <p role="status">{t("loading.generic")}</p> : null}

      {!loading && !error ? (
        <>
          <section aria-label="Résumé analytique" data-testid="dashboard-summary">
            <h2>{dashboardTitle}</h2>
            <p>{summaryText || t("empty.generic")}</p>
          </section>

          <section aria-label="Indicateurs expliqués" data-testid="dashboard-kpis">
            <h2>Indicateurs expliqués</h2>
            {kpis.length === 0 ? <p>{t("empty.generic")}</p> : null}
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))" }}>
              {kpis.map((kpi) => (
                <KpiExplainedCard key={kpi.key} {...explainKpi(kpi)} />
              ))}
            </div>
          </section>

          <section aria-label="Exceptions" data-testid="dashboard-exceptions">
            <h2>Exceptions détectées</h2>
            {exceptions.length === 0 ? <p>Aucune exception active.</p> : null}
            <table>
              <thead>
                <tr>
                  <th scope="col">Catégorie</th>
                  <th scope="col">Sévérité</th>
                  <th scope="col">Résumé</th>
                  <th scope="col">Source</th>
                  <th scope="col">Détectée le</th>
                </tr>
              </thead>
              <tbody>
                {exceptions.map((row) => (
                  <tr key={row.id} data-testid={`dashboard-exception-${row.id}`}>
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
    </main>
  );
}
