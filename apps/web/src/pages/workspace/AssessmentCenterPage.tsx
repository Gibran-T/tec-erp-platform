import type { AssessmentAttemptView, AssessmentSummary, CertificateView } from "@tec-platform/contracts";
import { useEffect, useMemo, useState, type ReactElement } from "react";

import {
  getActiveAssessmentAttempt,
  issueSilver,
  listAssessments,
  listCertificates,
  saveAssessmentDraft,
  startAssessment,
  submitAssessment,
} from "../../api/assessment.js";

type Phase = "list" | "questions" | "review" | "confirm" | "result";

function responsesFromAnswers(
  answers: Record<string, string | string[]>,
): Array<{ questionKey: string; value: string | string[] }> {
  return Object.entries(answers).map(([questionKey, value]) => ({ questionKey, value }));
}

export function AssessmentCenterPage(): ReactElement {
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [certificates, setCertificates] = useState<CertificateView[]>([]);
  const [phase, setPhase] = useState<Phase>("list");
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<AssessmentAttemptView | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    scorePercent: number;
    passed: boolean;
    feedback: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  async function refreshLists(): Promise<void> {
    const [assessmentResponse, certificateResponse] = await Promise.all([
      listAssessments(),
      listCertificates(),
    ]);
    setAssessments(assessmentResponse.assessments);
    setCertificates(certificateResponse.certificates);
  }

  useEffect(() => {
    void refreshLists().catch((err: Error) => setError(err.message));
  }, []);

  const unanswered = useMemo(() => {
    if (!attempt) {
      return [];
    }
    return attempt.questions.filter((question) => {
      const value = answers[question.questionKey];
      if (value == null) {
        return true;
      }
      if (typeof value === "string") {
        return value.length === 0;
      }
      return value.length === 0;
    });
  }, [answers, attempt]);

  async function persistDraft(
    code: string,
    nextAnswers: Record<string, string | string[]>,
  ): Promise<void> {
    setSaving(true);
    try {
      await saveAssessmentDraft(code, responsesFromAnswers(nextAnswers));
    } finally {
      setSaving(false);
    }
  }

  async function beginAssessment(code: string): Promise<void> {
    setError(null);
    setMessage(null);
    setResult(null);
    try {
      let nextAttempt: AssessmentAttemptView;
      try {
        nextAttempt = await getActiveAssessmentAttempt(code);
      } catch {
        nextAttempt = await startAssessment(code);
      }
      const restored: Record<string, string | string[]> = {};
      for (const response of nextAttempt.draftResponses) {
        restored[response.questionKey] = response.value;
      }
      setActiveCode(code);
      setAttempt(nextAttempt);
      setAnswers(restored);
      setCurrentIndex(0);
      setPhase("questions");
      setMessage("Tentative active — vos reponses sont conservees apres actualisation.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de demarrer l'evaluation.");
    }
  }

  function selectSingle(questionKey: string, optionKey: string): void {
    if (!activeCode) {
      return;
    }
    const next = { ...answers, [questionKey]: optionKey };
    setAnswers(next);
    void persistDraft(activeCode, next).catch((err: Error) => setError(err.message));
  }

  function toggleMulti(questionKey: string, optionKey: string): void {
    if (!activeCode) {
      return;
    }
    const current = answers[questionKey];
    const selected = new Set(Array.isArray(current) ? current : []);
    if (selected.has(optionKey)) {
      selected.delete(optionKey);
    } else {
      selected.add(optionKey);
    }
    const next = { ...answers, [questionKey]: [...selected] };
    setAnswers(next);
    void persistDraft(activeCode, next).catch((err: Error) => setError(err.message));
  }

  async function confirmAndSubmit(): Promise<void> {
    if (!activeCode || !attempt) {
      return;
    }
    if (unanswered.length > 0) {
      setError("Repondez a toutes les questions avant de soumettre.");
      setPhase("review");
      return;
    }
    setError(null);
    try {
      const submitted = await submitAssessment(activeCode, responsesFromAnswers(answers));
      setResult(submitted);
      setPhase("result");
      setMessage(submitted.feedback);
      await refreshLists();
      setAttempt(null);
      setActiveCode(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Soumission impossible.");
    }
  }

  async function claimSilver(): Promise<void> {
    try {
      const certificate = await issueSilver();
      setMessage(`Certificat Silver emis: ${certificate.certificateNumber}`);
      await refreshLists();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Certification impossible");
    }
  }

  const currentQuestion = attempt?.questions[currentIndex] ?? null;

  return (
    <main className="workspace-page" data-testid="assessment-center-page">
      <h1>Centre d&apos;evaluation</h1>
      <p>Evaluations Silver (M1–M2) et integree (M3–M6). Le serveur corrige les reponses.</p>
      {error ? (
        <p role="alert" data-testid="assessment-error">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" data-testid="assessment-status">
          {message}
          {saving ? " (enregistrement…)" : ""}
        </p>
      ) : null}

      {phase === "list" || phase === "result" ? (
        <>
          <ul data-testid="assessment-list">
            {assessments.map((assessment) => (
              <li key={assessment.code}>
                <strong>{assessment.title}</strong> — {assessment.status}
                {assessment.bestScorePercent != null
                  ? ` (meilleur: ${assessment.bestScorePercent}%)`
                  : ""}
                {assessment.status === "available" ||
                assessment.status === "failed" ||
                assessment.status === "in_progress" ? (
                  <button
                    type="button"
                    onClick={() => void beginAssessment(assessment.code)}
                    data-testid={`assessment-start-${assessment.code}`}
                  >
                    {assessment.status === "in_progress" ? "Reprendre" : "Demarrer / retenter"}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => void claimSilver()} data-testid="silver-issue">
            Emmettre le certificat Silver
          </button>
        </>
      ) : null}

      {phase === "questions" && attempt && currentQuestion ? (
        <section data-testid="assessment-question-panel" aria-labelledby="assessment-question-title">
          <p>
            Question {currentIndex + 1} / {attempt.questions.length}
          </p>
          {attempt.timeLimitSeconds != null ? (
            <p data-testid="assessment-timer-foundation">
              Limite serveur: {Math.round(attempt.timeLimitSeconds / 60)} minutes (authoritative
              serveur).
            </p>
          ) : null}
          <h2 id="assessment-question-title">{currentQuestion.prompt}</h2>
          <fieldset>
            <legend>Choisissez votre reponse</legend>
            <ul className="workspace-mission__choice-list">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.questionKey];
                const isSelected =
                  currentQuestion.type === "MULTI_CHOICE"
                    ? Array.isArray(selected) && selected.includes(option.key)
                    : selected === option.key;
                return (
                  <li key={option.key}>
                    <label
                      className="workspace-mission__checkbox"
                      data-selected={isSelected ? "true" : "false"}
                      style={
                        isSelected
                          ? { outline: "2px solid currentColor", outlineOffset: "2px" }
                          : undefined
                      }
                    >
                      <input
                        type={currentQuestion.type === "MULTI_CHOICE" ? "checkbox" : "radio"}
                        name={`q-${currentQuestion.questionKey}`}
                        value={option.key}
                        checked={isSelected}
                        onChange={() => {
                          if (currentQuestion.type === "MULTI_CHOICE") {
                            toggleMulti(currentQuestion.questionKey, option.key);
                          } else {
                            selectSingle(currentQuestion.questionKey, option.key);
                          }
                        }}
                        data-testid={`assessment-option-${currentQuestion.questionKey}-${option.key}`}
                      />
                      <span>{option.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
          <div>
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
            >
              Precedente
            </button>
            <button
              type="button"
              disabled={currentIndex >= attempt.questions.length - 1}
              onClick={() =>
                setCurrentIndex((index) => Math.min(attempt.questions.length - 1, index + 1))
              }
            >
              Suivante
            </button>
            <button type="button" onClick={() => setPhase("review")} data-testid="assessment-go-review">
              Revoir avant soumission
            </button>
          </div>
        </section>
      ) : null}

      {phase === "review" && attempt ? (
        <section data-testid="assessment-review-panel">
          <h2>Revue avant soumission</h2>
          {unanswered.length > 0 ? (
            <p role="alert">Questions sans reponse: {unanswered.map((q) => q.questionKey).join(", ")}</p>
          ) : (
            <p>Toutes les questions ont une reponse selectionnee.</p>
          )}
          <ul>
            {attempt.questions.map((question) => {
              const value = answers[question.questionKey];
              const label =
                typeof value === "string"
                  ? question.options.find((option) => option.key === value)?.label ?? "(aucune)"
                  : Array.isArray(value)
                    ? value
                        .map(
                          (key) =>
                            question.options.find((option) => option.key === key)?.label ?? key,
                        )
                        .join(", ")
                    : "(aucune)";
              return (
                <li key={question.questionKey}>
                  <strong>{question.prompt}</strong>: {label}
                </li>
              );
            })}
          </ul>
          <button type="button" onClick={() => setPhase("questions")}>
            Retour aux questions
          </button>
          <button
            type="button"
            disabled={unanswered.length > 0}
            onClick={() => setPhase("confirm")}
            data-testid="assessment-go-confirm"
          >
            Continuer vers confirmation
          </button>
        </section>
      ) : null}

      {phase === "confirm" && attempt ? (
        <section data-testid="assessment-confirm-panel">
          <h2>Confirmation finale</h2>
          <p>
            La soumission est definitive pour cette tentative. Le score sera calcule uniquement par
            le serveur.
          </p>
          <button type="button" onClick={() => setPhase("review")}>
            Annuler
          </button>
          <button type="button" onClick={() => void confirmAndSubmit()} data-testid="assessment-confirm-submit">
            Confirmer et soumettre
          </button>
        </section>
      ) : null}

      {phase === "result" && result ? (
        <section data-testid="assessment-result-panel" role="status">
          <h2>Resultat serveur</h2>
          <p>
            Score: {result.scorePercent}% — {result.passed ? "Reussi" : "Echec"}
          </p>
          <p>{result.feedback}</p>
          <button type="button" onClick={() => setPhase("list")}>
            Retour a la liste
          </button>
        </section>
      ) : null}

      <section aria-label="Certificats">
        <h2>Certificats</h2>
        {certificates.length === 0 ? <p>Aucun certificat emis.</p> : null}
        {certificates.map((certificate) => {
          const revoked = certificate.status === "revoked";
          return (
            <article
              key={certificate.certificateNumber}
              data-testid="certificate-view"
              data-status={certificate.status}
              style={{ borderTop: "1px solid #ccc", paddingTop: "1rem", marginTop: "1rem" }}
            >
              <h3>Certificat {certificate.certificateType.toUpperCase()}</h3>
              <p>
                <strong>{certificate.studentName}</strong>
              </p>
              <p>Numero: {certificate.certificateNumber}</p>
              <p>Cohorte: {certificate.cohortName ?? "—"}</p>
              <p>Emis le: {certificate.issuedAt}</p>
              {revoked ? (
                <p role="alert" data-testid="certificate-revoked-banner">
                  REVOQUE — ne pas presenter comme valide.
                  {certificate.revokedAt ? ` (${certificate.revokedAt})` : ""}
                </p>
              ) : (
                <p>
                  Statut: {certificate.status} / verification {certificate.verificationStatus}
                </p>
              )}
              {!revoked ? (
                <button type="button" onClick={() => window.print()}>
                  Imprimer / telecharger
                </button>
              ) : null}
            </article>
          );
        })}
      </section>
    </main>
  );
}
