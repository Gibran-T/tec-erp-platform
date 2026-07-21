import { useEffect, useState, type ReactElement } from "react";

import {
  getAdminConfiguration,
  listAdminCohorts,
  listAdminCompanies,
  listAdminFeatureFlags,
  listAdminScenarioDrafts,
  publishAdminScenarioDraft,
  runAdminAutomation,
  runAdminIntegration,
  updateAdminAiEnabled,
  updateAdminFeatureFlag,
} from "../../api/admin.js";
import { useAuth } from "../../auth/AuthContext.js";

type AdminTab =
  | "companies"
  | "cohorts"
  | "ai"
  | "flags"
  | "scenarios"
  | "integration"
  | "automation";

export function AdminPortalPage(): ReactElement {
  const { employee } = useAuth();
  const [tab, setTab] = useState<AdminTab>("companies");
  const [companies, setCompanies] = useState<Array<Record<string, unknown>>>([]);
  const [cohorts, setCohorts] = useState<Array<Record<string, unknown>>>([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [flags, setFlags] = useState<Array<Record<string, unknown>>>([]);
  const [drafts, setDrafts] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function refresh(): Promise<void> {
    const [companyResponse, cohortResponse, configResponse, flagResponse, draftResponse] =
      await Promise.all([
        listAdminCompanies(),
        listAdminCohorts(),
        getAdminConfiguration(),
        listAdminFeatureFlags(),
        listAdminScenarioDrafts(),
      ]);
    setCompanies(companyResponse.companies);
    setCohorts(cohortResponse.cohorts);
    setAiEnabled(configResponse.aiEnabled);
    setFlags(flagResponse.flags);
    setDrafts(draftResponse.drafts);
  }

  useEffect(() => {
    if (employee?.role !== "ADMIN") {
      return;
    }
    void refresh().catch((err: Error) => setError(err.message));
  }, [employee?.role]);

  if (employee?.role !== "ADMIN") {
    return (
      <main className="workspace-page" data-testid="admin-portal-page">
        <h1>Administration</h1>
        <p role="alert" data-testid="admin-forbidden">
          Acces reserve aux comptes administrateur.
        </p>
      </main>
    );
  }

  async function toggleAi(): Promise<void> {
    try {
      const next = await updateAdminAiEnabled(!aiEnabled);
      setAiEnabled(next.aiEnabled);
      setStatus(`Coach IA ${next.aiEnabled ? "active" : "desactive"}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise a jour IA impossible.");
    }
  }

  async function toggleFlag(key: string, enabled: boolean): Promise<void> {
    try {
      await updateAdminFeatureFlag(key, !enabled);
      await refresh();
      setStatus(`Indicateur ${key} mis a jour.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise a jour indicateur impossible.");
    }
  }

  async function publishDraft(draftId: string): Promise<void> {
    if (!window.confirm("Publier ce brouillon de scenario ?")) {
      return;
    }
    try {
      await publishAdminScenarioDraft(draftId);
      await refresh();
      setStatus("Scenario publie.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publication impossible.");
    }
  }

  async function runIntegration(): Promise<void> {
    try {
      await runAdminIntegration("default");
      setStatus("Integration lancee.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Integration impossible.");
    }
  }

  async function runAutomation(): Promise<void> {
    try {
      await runAdminAutomation("notify_professor_repeated_failure");
      setStatus("Automatisation lancee.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Automatisation impossible.");
    }
  }

  return (
    <main className="workspace-page" data-testid="admin-portal-page">
      <h1>Administration</h1>
      <p>Gestion institutionnelle NordHabitat — operations auditees.</p>
      {error ? (
        <p role="alert" data-testid="admin-error">
          {error}
        </p>
      ) : null}
      {status ? (
        <p role="status" data-testid="admin-status">
          {status}
        </p>
      ) : null}

      <nav aria-label="Sections administration">
        {(
          [
            ["companies", "Entreprises"],
            ["cohorts", "Cohortes"],
            ["ai", "Coach IA"],
            ["flags", "Indicateurs"],
            ["scenarios", "Scenarios"],
            ["integration", "Integration"],
            ["automation", "Automatisation"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-current={tab === id ? "page" : undefined}
            onClick={() => setTab(id)}
            data-testid={`admin-tab-${id}`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "companies" ? (
        <section data-testid="admin-companies">
          <h2>Entreprises</h2>
          <ul>
            {companies.map((company) => (
              <li key={String(company.id ?? company.code)}>
                {String(company.name ?? company.code)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "cohorts" ? (
        <section data-testid="admin-cohorts">
          <h2>Cohortes</h2>
          <ul>
            {cohorts.map((cohort) => (
              <li key={String(cohort.id ?? cohort.code)}>
                {String(cohort.name ?? cohort.code)} — {String(cohort.studentCount ?? "—")} etudiants
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "ai" ? (
        <section data-testid="admin-ai-toggle">
          <h2>Coach IA</h2>
          <p>Etat actuel : {aiEnabled ? "active" : "desactivee"}</p>
          <button type="button" onClick={() => void toggleAi()} data-testid="admin-toggle-ai">
            {aiEnabled ? "Desactiver le coach IA" : "Activer le coach IA"}
          </button>
        </section>
      ) : null}

      {tab === "flags" ? (
        <section data-testid="admin-feature-flags">
          <h2>Indicateurs fonctionnels</h2>
          <ul>
            {flags.map((flag) => {
              const key = String(flag.key);
              const enabled = Boolean(flag.enabled);
              return (
                <li key={key}>
                  {key} — {enabled ? "active" : "inactif"}
                  <button type="button" onClick={() => void toggleFlag(key, enabled)}>
                    Basculer
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {tab === "scenarios" ? (
        <section data-testid="admin-scenario-drafts">
          <h2>Brouillons de scenario</h2>
          <ul>
            {drafts.map((draft) => (
              <li key={String(draft.id)}>
                {String(draft.title ?? draft.missionKey)} — {String(draft.status ?? "draft")}
                <button type="button" onClick={() => void publishDraft(String(draft.id))}>
                  Publier
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "integration" ? (
        <section data-testid="admin-integration">
          <h2>Integration</h2>
          <button type="button" onClick={() => void runIntegration()} data-testid="admin-run-integration">
            Lancer une execution d&apos;integration
          </button>
        </section>
      ) : null}

      {tab === "automation" ? (
        <section data-testid="admin-automation">
          <h2>Automatisation</h2>
          <button type="button" onClick={() => void runAutomation()} data-testid="admin-run-automation">
            Executer une regle predefinie
          </button>
        </section>
      ) : null}
    </main>
  );
}
