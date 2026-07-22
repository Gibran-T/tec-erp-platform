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
  const lifecycleStatus = submission?.lifecycleStatus ?? (missionsReady ? "AVAILABLE" : "LOCKED");
  const isLocked = lifecycleStatus === "LOCKED" || !missionsReady;
  const isHistoricalReadOnly =
    lifecycleStatus === "APPROVED" ||
    lifecycleStatus === "REJECTED" ||
    submission?.status === "approved" ||
    submission?.status === "rejected";
  const canSubmit = !isLocked && !isHistoricalReadOnly && !submitting;
  const lifecycleLabel =
    submission?.lifecycleStatusLabel ??
    (missionsReady ? "Disponible" : "Verrouillé");
  const lockedHint = isLocked
      ? "État verrouillé : le Capstone est un projet intégrateur séparé. Complétez les 30 missions régulières M1–M10 du curriculum actif avant soumission. L’Or exige ensuite l’approbation professeur."
      : null;

  const stages: ReadonlyArray<{ code: string; label: string }> = [
    { code: "S1", label: "Prise en charge du mandat" },
    { code: "S2", label: "Diagnostic transversal" },
    { code: "S3", label: "Analyse des données et des processus" },
    { code: "S4", label: "Gestion de la crise intégrée" },
    { code: "S5", label: "Recommandation exécutive" },
    { code: "S6", label: "Présentation au professeur" },
    { code: "S7", label: "Révision et décision finale" },
  ];
  const currentStage = submission?.currentStage ?? (isLocked ? null : "S1");

  const unmetRequirements: string[] = [];
  if (!missionsReady) {
    unmetRequirements.push("30 missions régulières M1–M10 complétées");
  }
  if (eligibility?.reasons?.length) {
    for (const reason of eligibility.reasons) {
      if (!unmetRequirements.includes(reason)) {
        unmetRequirements.push(reason);
      }
    }
  }

  return (
    <main className="workspace-page living-capstone" data-testid="capstone-page">
      <h1>MCapstone — Projet intégrateur Equinoxe</h1>
      <p data-testid="capstone-lifecycle-status">
        État : {lifecycleLabel}
        {currentStage ? ` · Étape ${currentStage}` : ""}
      </p>
      <p>
        Domaine distinct des 30 missions régulières. Diagnostiquez, priorisez, exécutez, analysez et
        recommandez — puis soumettez votre résumé exécutif pour revue professeur.{" "}
        <Link to="/workspace/apps/certificats">Voir les certificats</Link>
      </p>

      <ol className="living-capstone__stepper" data-testid="capstone-stage-stepper">
        {stages.map((stage) => {
          const active = currentStage === stage.code;
          return (
            <li
              key={stage.code}
              data-testid={`capstone-stage-${stage.code}`}
              className={active ? "living-capstone__stage--current" : undefined}
              aria-current={active ? "step" : undefined}
            >
              <span className="living-capstone__stage-code">{stage.code}</span>
              <span>{stage.label}</span>
            </li>
          );
        })}
      </ol>

      {lockedHint ? (
        <div role="status" data-testid="capstone-locked-hint" className="living-capstone__locked">
          <p>{lockedHint}</p>
          {unmetRequirements.length > 0 ? (
            <ul data-testid="capstone-unmet-requirements">
              {unmetRequirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      {submission ? (
        <p role="status" data-testid="capstone-submission-status">
          Statut dossier :{" "}
          <span data-testid="capstone-submission-status-label">
            {submission.status === "draft"
              ? "Brouillon"
              : submission.status === "submitted"
                ? "Soumis"
                : submission.status === "approved"
                  ? "Approuvé"
                  : submission.status === "rejected"
                    ? "Refusé"
                    : submission.status}
          </span>
          {submission.reviewStatus ? (
            <>
              {" — revue "}
              <span data-testid="capstone-review-status-label">
                {submission.reviewStatus === "pending"
                  ? "en attente"
                  : submission.reviewStatus === "approved"
                    ? "approuvée"
                    : submission.reviewStatus === "revision_requested"
                      ? "révision demandée"
                      : submission.reviewStatus}
              </span>
            </>
          ) : null}
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
            disabled={isLocked || isHistoricalReadOnly}
            readOnly={isLocked || isHistoricalReadOnly}
          />
        </section>
      ))}

      <section data-testid="capstone-executive-summary">
        <h2>Résumé exécutif</h2>
        <textarea
          value={sections.executiveSummary}
          onChange={(event) => updateField("executiveSummary", event.target.value)}
          rows={6}
          disabled={isLocked || isHistoricalReadOnly}
          readOnly={isLocked || isHistoricalReadOnly}
        />
        {canSubmit ? (
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submit()}
            data-testid="capstone-submit"
          >
            {submitting ? "Soumission…" : "Soumettre le dossier Capstone"}
          </button>
        ) : (
          <p role="status" data-testid="capstone-submit-unavailable">
            {isLocked
              ? "Soumission indisponible tant que le Capstone est verrouillé."
              : "Soumission indisponible — dossier en lecture seule."}
          </p>
        )}
      </section>
    </main>
  );
}
