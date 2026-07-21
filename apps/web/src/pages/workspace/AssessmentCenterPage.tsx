import { useEffect, useState, type ReactElement } from "react";

import {
  issueSilver,
  listAssessments,
  listCertificates,
  startAssessment,
  submitAssessment,
} from "../../api/assessment.js";

export function AssessmentCenterPage(): ReactElement {
  const [assessments, setAssessments] = useState<Array<Record<string, unknown>>>([]);
  const [certificates, setCertificates] = useState<Array<Record<string, unknown>>>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([listAssessments(), listCertificates()])
      .then(([assessmentResponse, certificateResponse]) => {
        setAssessments(assessmentResponse.assessments);
        setCertificates(certificateResponse.certificates);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  async function runAssessment(code: string): Promise<void> {
    setError(null);
    setMessage(null);
    try {
      const started = await startAssessment(code);
      const responses = (started.questions ?? []).map((question) => {
        const options = (question.options as Array<{ key: string }> | undefined) ?? [];
        const first = options[0]?.key ?? "";
        return {
          questionKey: String(question.questionKey),
          value:
            question.type === "MULTI_CHOICE"
              ? options.slice(0, 2).map((option) => option.key)
              : first,
        };
      });
      const result = await submitAssessment(code, responses);
      setMessage(
        result.passed ? `Reussi (${result.scorePercent}%).` : `Echec (${result.scorePercent}%).`,
      );
      const refreshed = await listAssessments();
      setAssessments(refreshed.assessments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur evaluation");
    }
  }

  async function claimSilver(): Promise<void> {
    try {
      const certificate = await issueSilver();
      setMessage(`Certificat Silver emis: ${String(certificate.certificateNumber)}`);
      const refreshed = await listCertificates();
      setCertificates(refreshed.certificates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Certification impossible");
    }
  }

  return (
    <main className="workspace-page" data-testid="assessment-center-page">
      <h1>Centre d&apos;evaluation</h1>
      <p>Evaluations Silver (M1–M2) et integree (M3–M6).</p>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
      <ul>
        {assessments.map((assessment) => (
          <li key={String(assessment.code)}>
            <strong>{String(assessment.title)}</strong> — {String(assessment.status)}
            {assessment.status === "available" || assessment.status === "failed" ? (
              <button type="button" onClick={() => void runAssessment(String(assessment.code))}>
                Demarrer / retenter
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => void claimSilver()}>
        Emmettre le certificat Silver
      </button>
      <section aria-label="Certificats">
        <h2>Certificats</h2>
        {certificates.length === 0 ? <p>Aucun certificat emis.</p> : null}
        {certificates.map((certificate) => (
          <article
            key={String(certificate.certificateNumber)}
            data-testid="certificate-view"
            style={{ borderTop: "1px solid #ccc", paddingTop: "1rem", marginTop: "1rem" }}
          >
            <h3>Certificat {String(certificate.certificateType).toUpperCase()}</h3>
            <p>
              <strong>{String(certificate.studentName)}</strong>
            </p>
            <p>Numero: {String(certificate.certificateNumber)}</p>
            <p>Cohorte: {String(certificate.cohortName ?? "—")}</p>
            <p>Emis le: {String(certificate.issuedAt)}</p>
            <p>
              Statut: {String(certificate.status)} / verification{" "}
              {String(certificate.verificationStatus)}
            </p>
            <button type="button" onClick={() => window.print()}>
              Imprimer / telecharger
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
