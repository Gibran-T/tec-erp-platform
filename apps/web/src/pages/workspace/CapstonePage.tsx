import { useEffect, useState, type ReactElement } from "react";
import { Link } from "react-router-dom";

import {
  getCapstoneSubmission,
  submitCapstoneExecutiveSummary,
  type CapstoneSubmissionView,
} from "../../api/capstone.js";
import { getGoldEligibility, type GoldEligibilityView } from "../../api/certification.js";

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
  const [eligibility, setEligibility] = useState<GoldEligibilityView | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void Promise.all([getCapstoneSubmission(), getGoldEligibility()])
      .then(([loaded, gold]) => {
        setSubmission(loaded);
        setEligibility(gold);
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
      setError("Le résumé exécutif doit contenir au moins 40 caractères.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const saved = await submitCapstoneExecutiveSummary(sections);
      setSubmission(saved);
      setStatus("Dossier Capstone soumis pour revue professeur.");
      const gold = await getGoldEligibility();
      setEligibility(gold);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Soumission impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  const missionsReady = eligibility?.studentReadyChecklist.missionsComplete ?? false;
  const lifecycleLabel =
    submission?.lifecycleStatusLabel ??
    (missionsReady ? "Disponible" : "Verrouillé");
  const lockedHint =
    submission?.lifecycleStatus === "LOCKED" || !missionsReady
      ? "État verrouillé : le Capstone est un projet intégrateur séparé. Complétez les 30 missions régulières M1–M10 du curriculum actif avant soumission. L’Or exige ensuite l’approbation professeur."
      : null;

  return (
    <main className="workspace-page" data-testid="capstone-page">
      <h1>MCapstone — Projet intégrateur Equinoxe</h1>
      <p data-testid="capstone-lifecycle-status">
        État : {lifecycleLabel}
        {submission?.currentStage ? ` · Étape ${submission.currentStage}` : ""}
      </p>
      <p>
        Domaine distinct des 30 missions régulières. Diagnostiquez, priorisez, exécutez, analysez et
        recommandez — puis soumettez votre résumé exécutif pour revue professeur.{" "}
        <Link to="/workspace/apps/certificats">Voir les certificats</Link>
      </p>
      {lockedHint ? (
        <p role="status" data-testid="capstone-locked-hint">
          {lockedHint}
        </p>
      ) : null}
      {submission ? (
        <p role="status" data-testid="capstone-submission-status">
          Statut dossier : {submission.status}
          {submission.reviewStatus ? ` — revue ${submission.reviewStatus}` : ""}
        </p>
      ) : (
        <p role="status">Aucun dossier soumis pour le moment.</p>
      )}
      {eligibility ? (
        <section data-testid="capstone-gold-status">
          <h2>Statut certificat Or</h2>
          <p>{eligibility.nextStepHint}</p>
          {eligibility.reasons.length > 0 ? (
            <ul>
              {eligibility.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          ) : (
            <p>Prérequis étudiants satisfaits — émission Or par le professeur uniquement.</p>
          )}
        </section>
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
          ["execute", "Exécuter"],
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
        <h2>Résumé exécutif</h2>
        <textarea
          value={sections.executiveSummary}
          onChange={(event) => updateField("executiveSummary", event.target.value)}
          rows={6}
        />
        <button type="button" disabled={submitting} onClick={() => void submit()} data-testid="capstone-submit">
          {submitting ? "Soumission…" : "Soumettre le dossier Capstone"}
        </button>
      </section>
    </main>
  );
}
