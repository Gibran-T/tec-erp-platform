import { useEffect, useState, type ReactElement } from "react";

import {
  createAdminPedagogicalRun,
  listAdminPedagogicalRuns,
  listRunReflectionsForAdmin,
  transitionAdminPedagogicalRun,
} from "../../api/pedagogical-runs.js";

export function PedagogicalRunsAdminPanel(): ReactElement {
  const [runs, setRuns] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    employeeId: "",
    runType: "INSTRUCTOR_LED",
    runLabel: "",
    reason: "",
    professorId: "",
    sourceRunId: "",
    runCode: "",
    reflectionsEnabled: false,
  });
  const [reflectionRunId, setReflectionRunId] = useState("");
  const [reflectionSummary, setReflectionSummary] = useState<Record<string, unknown> | null>(null);
  async function refresh(): Promise<void> {
    setRuns(await listAdminPedagogicalRuns());
  }

  useEffect(() => {
    void refresh().catch((err: Error) => setError(err.message));
  }, []);

  async function createRun(): Promise<void> {
    try {
      await createAdminPedagogicalRun({
        employeeId: form.employeeId,
        runType: form.runType,
        runLabel: form.runLabel,
        reason: form.reason,
        professorId: form.professorId || undefined,
        sourceRunId: form.sourceRunId || undefined,
        runCode: form.runCode || undefined,
        reflectionsEnabled: form.reflectionsEnabled,
      });
      setStatus("Parcours créé (PLANNED). Aucune progression copiée.");
      setError(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création impossible.");
    }
  }

  async function loadReflections(): Promise<void> {
    try {
      setReflectionSummary(await listRunReflectionsForAdmin(reflectionRunId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lecture réflexions impossible.");
    }
  }

  async function transition(runId: string, action: string): Promise<void> {
    try {
      await transitionAdminPedagogicalRun(runId, action, "Action administrative audité");
      setStatus(`Transition ${action} enregistrée.`);
      setError(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transition refusée.");
    }
  }

  return (
    <section data-testid="admin-runs">
      <h2>Parcours pédagogiques versionnés</h2>
      <p>
        Création et cycle de vie sans écraser l&apos;historique. Pas de suppression dure des
        apprentissages.
      </p>
      {error ? (
        <p role="alert" data-testid="admin-runs-error">
          {error}
        </p>
      ) : null}
      {status ? (
        <p role="status" data-testid="admin-runs-status">
          {status}
        </p>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void createRun();
        }}
        data-testid="admin-runs-create-form"
      >
        <h3>Créer un parcours</h3>
        <label>
          Étudiant (id)
          <input
            value={form.employeeId}
            onChange={(event) => setForm((current) => ({ ...current, employeeId: event.target.value }))}
            data-testid="admin-run-employee-id"
            required
          />
        </label>
        <label>
          Type
          <select
            value={form.runType}
            onChange={(event) => setForm((current) => ({ ...current, runType: event.target.value }))}
            data-testid="admin-run-type"
          >
            <option value="AUTONOMOUS">Parcours autonome</option>
            <option value="INSTRUCTOR_LED">Parcours accompagné par le professeur</option>
            <option value="REMEDIATION">Parcours de remédiation</option>
            <option value="DEMONSTRATION">Parcours de démonstration</option>
          </select>
        </label>
        <label>
          Libellé
          <input
            value={form.runLabel}
            onChange={(event) => setForm((current) => ({ ...current, runLabel: event.target.value }))}
            data-testid="admin-run-label"
            required
          />
        </label>
        <label>
          Raison
          <input
            value={form.reason}
            onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
            data-testid="admin-run-reason"
            required
          />
        </label>
        <label>
          Professeur (id, optionnel)
          <input
            value={form.professorId}
            onChange={(event) =>
              setForm((current) => ({ ...current, professorId: event.target.value }))
            }
            data-testid="admin-run-professor-id"
          />
        </label>
        <label>
          Parcours source (id, optionnel)
          <input
            value={form.sourceRunId}
            onChange={(event) =>
              setForm((current) => ({ ...current, sourceRunId: event.target.value }))
            }
            data-testid="admin-run-source-id"
          />
        </label>
        <label>
          Code (optionnel)
          <input
            value={form.runCode}
            onChange={(event) => setForm((current) => ({ ...current, runCode: event.target.value }))}
            data-testid="admin-run-code"
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.reflectionsEnabled}
            onChange={(event) =>
              setForm((current) => ({ ...current, reflectionsEnabled: event.target.checked }))
            }
            data-testid="admin-run-reflections-enabled"
          />{" "}
          Activer les réflexions post-mission
        </label>
        <button type="submit" data-testid="admin-run-create">
          Créer (PLANNED)
        </button>
      </form>

      <section data-testid="admin-runs-reflections">
        <h3>Inspection des réflexions (lecture seule)</h3>
        <label>
          Run id
          <input value={reflectionRunId} onChange={(event) => setReflectionRunId(event.target.value)} />
        </label>
        <button type="button" onClick={() => void loadReflections()}>
          Charger
        </button>
        {reflectionSummary ? (
          <pre data-testid="admin-runs-reflection-summary">
            {JSON.stringify(reflectionSummary, null, 2)}
          </pre>
        ) : null}
      </section>

      <table data-testid="admin-runs-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Libellé</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Progression</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={String(run.id)}>
              <td>{String(run.runCode)}</td>
              <td>{String(run.runLabel)}</td>
              <td>{String(run.runTypeLabel ?? run.runType)}</td>
              <td>{String(run.statusLabel ?? run.status)}</td>
              <td>{String(run.completionPercent ?? 0)} %</td>
              <td>
                {(["start", "pause", "resume", "cancel", "archive"] as const).map((action) => (
                  <button
                    key={action}
                    type="button"
                    data-testid={`admin-run-${action}-${String(run.id)}`}
                    onClick={() => void transition(String(run.id), action)}
                  >
                    {action}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
