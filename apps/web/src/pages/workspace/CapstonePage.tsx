import { useEffect, useState, type ReactElement } from "react";

import {
  getCapstoneSubmission,
  submitCapstoneExecutiveSummary,
  type CapstoneSubmissionView,
} from "../../api/capstone.js";

const EMPTY_SECTIONS = {
  diagnose: "",
  prioritize: "",
  execute: "",
  analyze: "",
  recommend: "",
  executiveSummary: "",
};

export function CapstonePage(): ReactElement {
  const [sections, setSections] = useState(EMPTY_SECTIONS);
  const [submission, setSubmission] = useState<CapstoneSubmissionView | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void getCapstoneSubmission()
      .then((loaded) => {
        setSubmission(loaded);
        setSections({
          diagnose: loaded.diagnose,
          prioritize: loaded.prioritize,
          execute: loaded.execute,
          analyze: loaded.analyze,
          recommend: loaded.recommend,
          executiveSummary: loaded.executiveSummary ?? "",
        });
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  function updateField(field: keyof typeof EMPTY_SECTIONS, value: string): void {
    setSections((current) => ({ ...current, [field]: value }));
  }

  async function submit(): Promise<void> {
    if (sections.executiveSummary.trim().length < 40) {
      setError("Le resume executif doit contenir au moins 40 caracteres.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const saved = await submitCapstoneExecutiveSummary(sections);
      setSubmission(saved);
      setStatus("Dossier capstone soumis pour revue professeur.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Soumission impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="workspace-page" data-testid="capstone-page">
      <h1>Capstone Equinoxe</h1>
      <p>
        Diagnostiquez, priorisez, executez, analysez et recommandez — puis soumettez votre resume
        executif.
      </p>
      {submission ? (
        <p role="status">
          Statut dossier : {submission.status}
          {submission.reviewStatus ? ` — revue ${submission.reviewStatus}` : ""}
        </p>
      ) : null}
      {error ? (
        <p role="alert" data-testid="capstone-error">
          {error}
        </p>
      ) : null}
      {status ? (
        <p role="status" data-testid="capstone-status">
          {status}
        </p>
      ) : null}

      {(
        [
          ["diagnose", "Diagnostiquer"],
          ["prioritize", "Prioriser"],
          ["execute", "Executer"],
          ["analyze", "Analyser"],
          ["recommend", "Recommander"],
        ] as const
      ).map(([field, label]) => (
        <section key={field} data-testid={`capstone-section-${field}`}>
          <h2>{label}</h2>
          <textarea
            value={sections[field]}
            onChange={(event) => updateField(field, event.target.value)}
            rows={4}
          />
        </section>
      ))}

      <section data-testid="capstone-executive-summary">
        <h2>Resume executif</h2>
        <textarea
          value={sections.executiveSummary}
          onChange={(event) => updateField("executiveSummary", event.target.value)}
          rows={6}
        />
        <button type="button" disabled={submitting} onClick={() => void submit()} data-testid="capstone-submit">
          {submitting ? "Soumission…" : "Soumettre le dossier capstone"}
        </button>
      </section>
    </main>
  );
}
