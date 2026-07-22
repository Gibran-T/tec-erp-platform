import { useEffect, useState, type ReactElement } from "react";

import {
  assignAdminProfessor,
  createAdminCohort,
  createAdminEmployee,
  enrollAdminStudent,
  getAdminConfiguration,
  listAdminCohorts,
  listAdminCompanies,
  listAdminEmployees,
  listAdminFeatureFlags,
  listAdminScenarioDrafts,
  publishAdminScenarioDraft,
  removeAdminProfessor,
  runAdminAutomation,
  runAdminIntegration,
  updateAdminAiEnabled,
  updateAdminFeatureFlag,
} from "../../api/admin.js";
import { useAuth } from "../../auth/AuthContext.js";

type AdminTab =
  | "companies"
  | "cohorts"
  | "employees"
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
  const [employees, setEmployees] = useState<Array<Record<string, unknown>>>([]);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [flags, setFlags] = useState<Array<Record<string, unknown>>>([]);
  const [drafts, setDrafts] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const [newProfessor, setNewProfessor] = useState({
    employeeNumber: "",
    email: "",
    displayName: "",
    password: "",
  });
  const [newCohort, setNewCohort] = useState({ code: "", name: "" });
  const [assignForm, setAssignForm] = useState({ cohortId: "", employeeId: "" });
  const [enrollForm, setEnrollForm] = useState({ cohortId: "", employeeId: "" });

  async function refresh(): Promise<void> {
    const [companyResponse, cohortResponse, employeeResponse, configResponse, flagResponse, draftResponse] =
      await Promise.all([
        listAdminCompanies(),
        listAdminCohorts(),
        listAdminEmployees(),
        getAdminConfiguration(),
        listAdminFeatureFlags(),
        listAdminScenarioDrafts(),
      ]);
    setCompanies(companyResponse.companies);
    setCohorts(cohortResponse.cohorts);
    setEmployees(employeeResponse.employees);
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
          Accès réservé aux comptes administrateur.
        </p>
      </main>
    );
  }

  async function toggleAi(): Promise<void> {
    try {
      const next = await updateAdminAiEnabled(!aiEnabled);
      setAiEnabled(next.aiEnabled);
      setStatus(`Coach IA ${next.aiEnabled ? "activé" : "désactivé"}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour IA impossible.");
    }
  }

  async function toggleFlag(key: string, enabled: boolean): Promise<void> {
    try {
      await updateAdminFeatureFlag(key, !enabled);
      await refresh();
      setStatus(`Indicateur ${key} mis à jour.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour indicateur impossible.");
    }
  }

  async function publishDraft(draftId: string): Promise<void> {
    if (!window.confirm("Publier ce brouillon de scénario ?")) {
      return;
    }
    try {
      await publishAdminScenarioDraft(draftId);
      await refresh();
      setStatus("Scénario publié.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publication impossible.");
    }
  }

  async function runIntegration(): Promise<void> {
    try {
      await runAdminIntegration("default");
      setStatus("Intégration lancée.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Intégration impossible.");
    }
  }

  async function runAutomation(): Promise<void> {
    try {
      await runAdminAutomation("notify_professor_repeated_failure");
      setStatus("Automatisation lancée.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Automatisation impossible.");
    }
  }

  async function createProfessor(): Promise<void> {
    try {
      await createAdminEmployee({
        ...newProfessor,
        role: "PROFESSOR",
      });
      setNewProfessor({ employeeNumber: "", email: "", displayName: "", password: "" });
      await refresh();
      setStatus("Compte professeur créé (audité).");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création professeur impossible.");
    }
  }

  async function createCohort(): Promise<void> {
    try {
      await createAdminCohort(newCohort);
      setNewCohort({ code: "", name: "" });
      await refresh();
      setStatus("Cohorte créée.");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création cohorte impossible.");
    }
  }

  async function assignProfessor(): Promise<void> {
    try {
      await assignAdminProfessor(assignForm.cohortId, assignForm.employeeId);
      await refresh();
      setStatus("Professeur affecté à la cohorte (audité).");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Affectation impossible.");
    }
  }

  async function removeProfessor(cohortId: string, employeeId: string): Promise<void> {
    try {
      await removeAdminProfessor(cohortId, employeeId);
      await refresh();
      setStatus("Professeur retiré de la cohorte (audité).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Retrait impossible.");
    }
  }

  async function enrollStudent(): Promise<void> {
    try {
      await enrollAdminStudent(enrollForm.cohortId, enrollForm.employeeId);
      await refresh();
      setStatus("Étudiant inscrit à la cohorte.");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inscription impossible.");
    }
  }

  const professors = employees.filter((row) => row.role === "PROFESSOR");

  return (
    <main className="workspace-page" data-testid="admin-portal-page">
      <h1>Administration</h1>
      <p>Gestion institutionnelle NordHabitat — opérations auditées.</p>
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
            ["employees", "Employés / professeurs"],
            ["ai", "Coach IA"],
            ["flags", "Indicateurs"],
            ["scenarios", "Scénarios"],
            ["integration", "Intégration"],
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

      {tab === "employees" ? (
        <section data-testid="admin-employees">
          <h2>Créer un compte professeur</h2>
          <p>Utilisez un courriel institutionnel réel — aucun compte inventé dans le code.</p>
          <label>
            Numéro
            <input
              value={newProfessor.employeeNumber}
              onChange={(event) =>
                setNewProfessor((current) => ({ ...current, employeeNumber: event.target.value }))
              }
              data-testid="admin-professor-number"
            />
          </label>
          <label>
            Courriel
            <input
              value={newProfessor.email}
              onChange={(event) =>
                setNewProfessor((current) => ({ ...current, email: event.target.value }))
              }
              data-testid="admin-professor-email"
            />
          </label>
          <label>
            Nom affiché
            <input
              value={newProfessor.displayName}
              onChange={(event) =>
                setNewProfessor((current) => ({ ...current, displayName: event.target.value }))
              }
              data-testid="admin-professor-name"
            />
          </label>
          <label>
            Mot de passe temporaire
            <input
              type="password"
              value={newProfessor.password}
              onChange={(event) =>
                setNewProfessor((current) => ({ ...current, password: event.target.value }))
              }
              data-testid="admin-professor-password"
            />
          </label>
          <button type="button" onClick={() => void createProfessor()} data-testid="admin-create-professor">
            Créer le professeur
          </button>
          <h3>Employés de l&apos;entreprise</h3>
          <ul>
            {employees.map((row) => (
              <li key={String(row.id)}>
                {String(row.displayName)} — {String(row.role)} — {String(row.email)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "cohorts" ? (
        <section data-testid="admin-cohorts">
          <h2>Cohortes</h2>
          <h3>Créer une cohorte</h3>
          <label>
            Code
            <input
              value={newCohort.code}
              onChange={(event) => setNewCohort((current) => ({ ...current, code: event.target.value }))}
              data-testid="admin-cohort-code"
            />
          </label>
          <label>
            Nom
            <input
              value={newCohort.name}
              onChange={(event) => setNewCohort((current) => ({ ...current, name: event.target.value }))}
              data-testid="admin-cohort-name"
            />
          </label>
          <button type="button" onClick={() => void createCohort()} data-testid="admin-create-cohort">
            Créer la cohorte
          </button>

          <h3>Affecter un professeur</h3>
          <label>
            Cohorte
            <select
              value={assignForm.cohortId}
              onChange={(event) =>
                setAssignForm((current) => ({ ...current, cohortId: event.target.value }))
              }
              data-testid="admin-assign-cohort"
            >
              <option value="">—</option>
              {cohorts.map((cohort) => (
                <option key={String(cohort.id)} value={String(cohort.id)}>
                  {String(cohort.code)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Professeur
            <select
              value={assignForm.employeeId}
              onChange={(event) =>
                setAssignForm((current) => ({ ...current, employeeId: event.target.value }))
              }
              data-testid="admin-assign-professor"
            >
              <option value="">—</option>
              {professors.map((row) => (
                <option key={String(row.id)} value={String(row.id)}>
                  {String(row.displayName)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => void assignProfessor()} data-testid="admin-assign-submit">
            Affecter
          </button>

          <h3>Inscrire un étudiant</h3>
          <label>
            Cohorte
            <select
              value={enrollForm.cohortId}
              onChange={(event) =>
                setEnrollForm((current) => ({ ...current, cohortId: event.target.value }))
              }
              data-testid="admin-enroll-cohort"
            >
              <option value="">—</option>
              {cohorts.map((cohort) => (
                <option key={String(cohort.id)} value={String(cohort.id)}>
                  {String(cohort.code)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Étudiant
            <select
              value={enrollForm.employeeId}
              onChange={(event) =>
                setEnrollForm((current) => ({ ...current, employeeId: event.target.value }))
              }
              data-testid="admin-enroll-employee"
            >
              <option value="">—</option>
              {employees
                .filter((row) => row.role === "JR_BUSINESS_ANALYST")
                .map((row) => (
                  <option key={String(row.id)} value={String(row.id)}>
                    {String(row.displayName)}
                  </option>
                ))}
            </select>
          </label>
          <button type="button" onClick={() => void enrollStudent()} data-testid="admin-enroll-submit">
            Inscrire
          </button>

          <ul>
            {cohorts.map((cohort) => {
              const professorsInCohort = Array.isArray(cohort.professors)
                ? (cohort.professors as Array<Record<string, unknown>>)
                : [];
              return (
                <li key={String(cohort.id ?? cohort.code)}>
                  {String(cohort.name ?? cohort.code)} — {String(cohort.memberCount ?? "—")} membres
                  {professorsInCohort.length > 0 ? (
                    <ul>
                      {professorsInCohort.map((prof) => (
                        <li key={String(prof.id)}>
                          Professeur : {String(prof.displayName)}
                          <button
                            type="button"
                            onClick={() => void removeProfessor(String(cohort.id), String(prof.id))}
                            data-testid={`admin-remove-professor-${String(prof.id)}`}
                          >
                            Retirer
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span> — aucun professeur affecté</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {tab === "ai" ? (
        <section data-testid="admin-ai-toggle">
          <h2>Coach IA</h2>
          <p>État actuel : {aiEnabled ? "activé" : "désactivé"}</p>
          <button type="button" onClick={() => void toggleAi()} data-testid="admin-toggle-ai">
            {aiEnabled ? "Désactiver le coach IA" : "Activer le coach IA"}
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
                  {key} — {enabled ? "actif" : "inactif"}
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
          <h2>Brouillons de scénario</h2>
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
          <h2>Intégration</h2>
          <button type="button" onClick={() => void runIntegration()} data-testid="admin-run-integration">
            Lancer une exécution d&apos;intégration
          </button>
        </section>
      ) : null}

      {tab === "automation" ? (
        <section data-testid="admin-automation">
          <h2>Automatisation</h2>
          <button type="button" onClick={() => void runAutomation()} data-testid="admin-run-automation">
            Exécuter une règle prédéfinie
          </button>
        </section>
      ) : null}
    </main>
  );
}
