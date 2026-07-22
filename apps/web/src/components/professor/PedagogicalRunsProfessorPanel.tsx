import { useEffect, useState, type ReactElement } from "react";

import {
  compareProfessorPedagogicalRuns,
  createProfessorIntervention,
  createProfessorPedagogicalRun,
  listProfessorPedagogicalRuns,
  listRunReflectionsForProfessor,
  transitionProfessorPedagogicalRun,
} from "../../api/pedagogical-runs.js";

export function PedagogicalRunsProfessorPanel(): ReactElement {
  const [runs, setRuns] = useState<Array<Record<string, unknown>>>([]);
  const [comparison, setComparison] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    employeeId: "",
    runType: "INSTRUCTOR_LED",
    runLabel: "",
    reason: "",
    sourceRunId: "",
    runCode: "",
  });
  const [compareIds, setCompareIds] = useState({ leftRunId: "", rightRunId: "" });
  const [intervention, setIntervention] = useState({
    runId: "",
    interventionType: "CLARIFICATION",
    reason: "",
    content: "",
  });
  const [reflectionRunId, setReflectionRunId] = useState("");
  const [reflectionSummary, setReflectionSummary] = useState<Record<string, unknown> | null>(null);

  async function refresh(): Promise<void> {
    setRuns(await listProfessorPedagogicalRuns());
  }

  useEffect(() => {
    void refresh().catch((err: Error) => setError(err.message));
  }, []);

  async function createRun(): Promise<void> {
    try {
      await createProfessorPedagogicalRun({
        employeeId: form.employeeId,
        runType: form.runType,
        runLabel: form.runLabel,
        reason: form.reason,
        sourceRunId: form.sourceRunId || undefined,
        runCode: form.runCode || undefined,
      });
      setStatus("Parcours créé. Progression initiale 0 %.");
      setError(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création refusée.");
    }
  }

  async function transition(runId: string, action: string): Promise<void> {
    try {
      await transitionProfessorPedagogicalRun(runId, action, "Action professeur auditée");
      setStatus(`Transition ${action} enregistrée.`);
      setError(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transition refusée.");
    }
  }

  async function compare(): Promise<void> {
    try {
      setComparison(
        await compareProfessorPedagogicalRuns(compareIds.leftRunId, compareIds.rightRunId),
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparaison impossible.");
    }
  }

  async function saveIntervention(): Promise<void> {
    try {
      await createProfessorIntervention(intervention.runId, {
        interventionType: intervention.interventionType,
        reason: intervention.reason,
        content: intervention.content,
      });
      setStatus("Intervention enregistrée (append-only).");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Intervention refusée.");
    }
  }

  return (
    <section data-testid="professor-runs">
      <h2>Parcours pédagogiques</h2>
      <p>Gestion des parcours assignés — historique en lecture seule, écriture sur ACTIVE uniquement.</p>
      {error ? (
        <p role="alert" data-testid="professor-runs-error">
          {error}
        </p>
      ) : null}
      {status ? (
        <p role="status" data-testid="professor-runs-status">
          {status}
        </p>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void createRun();
        }}
        data-testid="professor-runs-create-form"
      >
        <h3>Créer un parcours</h3>
        <label>
          Étudiant (id)
          <input
            value={form.employeeId}
            onChange={(event) => setForm((current) => ({ ...current, employeeId: event.target.value }))}
            required
            data-testid="professor-run-employee-id"
          />
        </label>
        <label>
          Type
          <select
            value={form.runType}
            onChange={(event) => setForm((current) => ({ ...current, runType: event.target.value }))}
          >
            <option value="INSTRUCTOR_LED">Parcours accompagné par le professeur</option>
            <option value="AUTONOMOUS">Parcours autonome</option>
            <option value="REMEDIATION">Parcours de remédiation</option>
          </select>
        </label>
        <label>
          Libellé
          <input
            value={form.runLabel}
            onChange={(event) => setForm((current) => ({ ...current, runLabel: event.target.value }))}
            required
          />
        </label>
        <label>
          Raison
          <input
            value={form.reason}
            onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
            required
          />
        </label>
        <label>
          Source (id optionnel)
          <input
            value={form.sourceRunId}
            onChange={(event) =>
              setForm((current) => ({ ...current, sourceRunId: event.target.value }))
            }
          />
        </label>
        <label>
          Code (optionnel)
          <input
            value={form.runCode}
            onChange={(event) => setForm((current) => ({ ...current, runCode: event.target.value }))}
          />
        </label>
        <button type="submit">Créer (PLANNED)</button>
      </form>

      <table data-testid="professor-runs-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Libellé</th>
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
              <td>{String(run.statusLabel ?? run.status)}</td>
              <td>{String(run.completionPercent ?? 0)} %</td>
              <td>
                {(["start", "pause", "resume"] as const).map((action) => (
                  <button
                    key={action}
                    type="button"
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

      <section data-testid="professor-runs-compare">
        <h3>Comparer deux parcours</h3>
        <label>
          Run A
          <input
            value={compareIds.leftRunId}
            onChange={(event) =>
              setCompareIds((current) => ({ ...current, leftRunId: event.target.value }))
            }
          />
        </label>
        <label>
          Run B
          <input
            value={compareIds.rightRunId}
            onChange={(event) =>
              setCompareIds((current) => ({ ...current, rightRunId: event.target.value }))
            }
          />
        </label>
        <button type="button" onClick={() => void compare()}>
          Comparer
        </button>
        {comparison ? (
          <pre data-testid="professor-runs-comparison">{JSON.stringify(comparison, null, 2)}</pre>
        ) : null}
      </section>

      <section data-testid="professor-runs-intervention">
        <h3>Intervention professeur</h3>
        <label>
          Run id
          <input
            value={intervention.runId}
            onChange={(event) =>
              setIntervention((current) => ({ ...current, runId: event.target.value }))
            }
          />
        </label>
        <label>
          Type
          <select
            value={intervention.interventionType}
            onChange={(event) =>
              setIntervention((current) => ({
                ...current,
                interventionType: event.target.value,
              }))
            }
          >
            <option value="CLARIFICATION">Clarification</option>
            <option value="CONCEPT_EXPLANATION">Explication de concept</option>
            <option value="PROCESS_DEMONSTRATION">Démonstration de processus</option>
            <option value="TERMINOLOGY_SUPPORT">Terminologie</option>
            <option value="ERROR_RECOVERY">Récupération d&apos;erreur</option>
            <option value="FULL_RETEACH">Reprise complète</option>
          </select>
        </label>
        <label>
          Raison
          <input
            value={intervention.reason}
            onChange={(event) =>
              setIntervention((current) => ({ ...current, reason: event.target.value }))
            }
          />
        </label>
        <label>
          Contenu
          <textarea
            value={intervention.content}
            onChange={(event) =>
              setIntervention((current) => ({ ...current, content: event.target.value }))
            }
          />
        </label>
        <button type="button" onClick={() => void saveIntervention()}>
          Enregistrer
        </button>
      </section>

      <section data-testid="professor-runs-reflections">
        <h3>Réflexions du parcours sélectionné</h3>
        <label>
          Run id
          <input
            value={reflectionRunId}
            onChange={(event) => setReflectionRunId(event.target.value)}
            data-testid="professor-reflection-run-id"
          />
        </label>
        <button
          type="button"
          onClick={() => {
            void listRunReflectionsForProfessor(reflectionRunId)
              .then((summary) => {
                setReflectionSummary(summary);
                setError(null);
              })
              .catch((err: Error) => setError(err.message));
          }}
        >
          Charger les réflexions
        </button>
        {reflectionSummary ? (
          <div data-testid="professor-reflection-summary">
            <p>
              Moyennes :{" "}
              {reflectionSummary.averages
                ? JSON.stringify(reflectionSummary.averages)
                : "aucune donnée"}
            </p>
            {reflectionSummary.personaValidationContext ? (
              <p role="note">Contexte de validation par persona — ne pas traiter comme avis humains réels.</p>
            ) : null}
            <pre>{JSON.stringify(reflectionSummary.reflections ?? [], null, 2)}</pre>
          </div>
        ) : (
          <p>Aucune réflexion chargée.</p>
        )}
      </section>
    </section>
  );
}
