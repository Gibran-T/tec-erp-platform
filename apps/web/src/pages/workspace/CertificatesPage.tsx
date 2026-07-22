import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getGoldEligibility,
  listMyCertificates,
  type CertificateWithVerification,
  type GoldEligibilityView,
} from "../../api/certification.js";

function buildVerifyUrl(certificate: CertificateWithVerification): string {
  if (certificate.verificationUrl) {
    return certificate.verificationUrl;
  }
  if (certificate.verificationToken) {
    return `${window.location.origin}/verify/${certificate.verificationToken}`;
  }
  return `${window.location.origin}/verify/${certificate.certificateNumber}`;
}

function sortCertificates(
  certificates: CertificateWithVerification[],
): CertificateWithVerification[] {
  return [...certificates].sort((left, right) => {
    const leftRevoked = left.status === "revoked" ? 1 : 0;
    const rightRevoked = right.status === "revoked" ? 1 : 0;
    if (leftRevoked !== rightRevoked) {
      return leftRevoked - rightRevoked;
    }
    return String(right.issuedAt).localeCompare(String(left.issuedAt));
  });
}

export function CertificatesPage(): ReactElement {
  const [certificates, setCertificates] = useState<CertificateWithVerification[]>([]);
  const [eligibility, setEligibility] = useState<GoldEligibilityView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCertificates = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const [certs, gold] = await Promise.all([listMyCertificates(), getGoldEligibility()]);
      setCertificates(sortCertificates(certs.certificates));
      setEligibility(gold);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCertificates();

    function onFocus(): void {
      void loadCertificates();
    }
    function onVisibility(): void {
      if (document.visibilityState === "visible") {
        void loadCertificates();
      }
    }

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [loadCertificates]);

  async function copyVerifyLink(certificate: CertificateWithVerification): Promise<void> {
    const url = buildVerifyUrl(certificate);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedNumber(certificate.certificateNumber);
    } catch {
      setError("Copie du lien de vérification impossible.");
    }
  }

  return (
    <main className="workspace-page" data-testid="certificates-page">
      <h1>Certificats</h1>
      <p>
        Certificats Argent et Or — vérification publique sans note ni courriel.{" "}
        <Link to="/workspace/apps/capstone">Ouvrir le Capstone</Link>
      </p>
      {loading ? <p role="status">Actualisation des certificats…</p> : null}
      {error ? (
        <p role="alert" data-testid="certificates-error">
          {error}
        </p>
      ) : null}
      {copiedNumber ? (
        <p role="status" data-testid="certificates-copy-status">
          Lien de vérification copié pour {copiedNumber}.
        </p>
      ) : null}

      {eligibility ? (
        <section data-testid="gold-eligibility-panel">
          <h2>Éligibilité certificat Or</h2>
          <ul>
            <li>
              Missions 30/30 :{" "}
              {eligibility.studentReadyChecklist.missionsComplete ? "complètes" : "incomplètes"}
            </li>
            <li>
              Évaluation Or :{" "}
              {eligibility.studentReadyChecklist.goldAssessmentPassed ? "réussie" : "à réussir"}
            </li>
            {eligibility.studentReadyChecklist.hcmAssessmentPassed !== undefined ? (
              <li data-testid="gold-hcm-checklist">
                Évaluation HCM (V2) :{" "}
                {eligibility.studentReadyChecklist.hcmAssessmentPassed ? "réussie" : "à réussir"}
              </li>
            ) : null}
            <li>
              Capstone soumis :{" "}
              {eligibility.studentReadyChecklist.capstoneSubmitted ? "oui" : "non"}
            </li>
            <li>
              Capstone approuvé :{" "}
              {eligibility.studentReadyChecklist.capstoneProfessorApproved ? "oui" : "en attente"}
            </li>
          </ul>
          <p>{eligibility.nextStepHint}</p>
        </section>
      ) : null}

      {certificates.length === 0 && !loading ? <p>Aucun certificat émis.</p> : null}
      {certificates.map((certificate) => {
        const revoked = certificate.status === "revoked";
        return (
          <article
            key={certificate.certificateNumber}
            data-testid="certificate-card"
            data-certificate-type={certificate.certificateType}
            data-status={certificate.status}
          >
            <h2>Certificat {certificate.certificateType.toUpperCase()}</h2>
            <p>
              <strong>{certificate.studentName}</strong>
            </p>
            <p>Numéro : {certificate.certificateNumber}</p>
            <p>Cohorte : {certificate.cohortName ?? "—"}</p>
            <p>Émis le : {certificate.issuedAt}</p>
            {revoked ? (
              <p role="alert" data-testid="certificate-revoked-banner">
                RÉVOQUÉ — ne pas présenter comme valide.
                {certificate.revokedAt ? ` (${certificate.revokedAt})` : ""}
              </p>
            ) : (
              <p>
                Statut : {certificate.status} / vérification {certificate.verificationStatus}
              </p>
            )}
            {!revoked ? (
              <>
                <button type="button" onClick={() => window.print()} data-testid="certificate-print">
                  Imprimer
                </button>
                <button
                  type="button"
                  onClick={() => void copyVerifyLink(certificate)}
                  data-testid="certificate-copy-verify"
                >
                  Copier le lien public de vérification
                </button>
              </>
            ) : null}
          </article>
        );
      })}
      <button type="button" onClick={() => void loadCertificates()} data-testid="certificates-refresh">
        Actualiser
      </button>
    </main>
  );
}
