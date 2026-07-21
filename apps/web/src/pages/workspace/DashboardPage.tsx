import { useEffect, useState, type ReactElement } from "react";

import {
  getAnalyticsDashboards,
  getAnalyticsExceptions,
  getAnalyticsKpis,
  type AnalyticsExceptionRow,
  type AnalyticsKpiCard,
} from "../../api/analytics.js";

export function DashboardPage(): ReactElement {
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
        setDashboardTitle(dashboardResponse.dashboards[0]?.title ?? "Tableaux de bord");
        setKpis(kpiResponse.kpis);
        setExceptions(exceptionResponse.exceptions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Chargement impossible.");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <main className="workspace-page" data-testid="dashboard-page">
      <h1>Tableaux de bord</h1>
      <p>Indicateurs operationnels NordHabitat — lecture seule.</p>
      {error ? (
        <p role="alert" data-testid="dashboard-error">
          {error}
        </p>
      ) : null}
      {loading ? <p role="status">Chargement des indicateurs…</p> : null}

      {!loading && !error ? (
        <>
          <section aria-label="Resume analytique" data-testid="dashboard-summary">
            <h2>{dashboardTitle}</h2>
            <p>{summaryText || "Aucun resume disponible pour le moment."}</p>
          </section>

          <section aria-label="Indicateurs cles" data-testid="dashboard-kpis">
            <h2>Indicateurs cles</h2>
            {kpis.length === 0 ? <p>Aucun indicateur calcule.</p> : null}
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))" }}>
              {kpis.map((kpi) => (
                <article key={kpi.key} data-testid={`dashboard-kpi-${kpi.key}`}>
                  <h3>{kpi.label}</h3>
                  <p>
                    <strong>{kpi.formattedValue}</strong>
                    {kpi.stale ? " (donnees anciennes)" : ""}
                  </p>
                  <p>Tendance : {kpi.trend}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-label="Exceptions" data-testid="dashboard-exceptions">
            <h2>Exceptions detectees</h2>
            {exceptions.length === 0 ? <p>Aucune exception active.</p> : null}
            <table>
              <thead>
                <tr>
                  <th scope="col">Categorie</th>
                  <th scope="col">Severite</th>
                  <th scope="col">Resume</th>
                  <th scope="col">Source</th>
                  <th scope="col">Detectee le</th>
                </tr>
              </thead>
              <tbody>
                {exceptions.map((row) => (
                  <tr key={row.id} data-testid={`dashboard-exception-${row.id}`}>
                    <td>{row.category}</td>
                    <td>{row.severity}</td>
                    <td>{row.summary}</td>
                    <td>{row.sourceType}</td>
                    <td>{row.detectedAt}</td>
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
