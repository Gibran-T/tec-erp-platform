import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import {
  listMyCertificates,
  type CertificateWithVerification,
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

export function CertificatesPage(): ReactElement {
  const [certificates, setCertificates] = useState<CertificateWithVerification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  useEffect(() => {
    void listMyCertificates()
      .then((response) => setCertificates(response.certificates))
      .catch((err: Error) => setError(err.message));
  }, []);

  async function copyVerifyLink(certificate: CertificateWithVerification): Promise<void> {
    const url = buildVerifyUrl(certificate);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedNumber(certificate.certificateNumber);
    } catch {
      setError("Copie du lien de verification impossible.");
    }
  }

  return (
    <main className="workspace-page" data-testid="certificates-page">
      <h1>Certificats</h1>
      <p>Certificats Silver et Gold — verification publique sans note ni courriel.</p>
      {error ? (
        <p role="alert" data-testid="certificates-error">
          {error}
        </p>
      ) : null}
      {copiedNumber ? (
        <p role="status" data-testid="certificates-copy-status">
          Lien de verification copie pour {copiedNumber}.
        </p>
      ) : null}

      {certificates.length === 0 ? <p>Aucun certificat emis.</p> : null}
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
            <p>Numero : {certificate.certificateNumber}</p>
            <p>Cohorte : {certificate.cohortName ?? "—"}</p>
            <p>Emis le : {certificate.issuedAt}</p>
            {revoked ? (
              <p role="alert" data-testid="certificate-revoked-banner">
                REVOQUE — ne pas presenter comme valide.
                {certificate.revokedAt ? ` (${certificate.revokedAt})` : ""}
              </p>
            ) : (
              <p>
                Statut : {certificate.status} / verification {certificate.verificationStatus}
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
                  Copier le lien public de verification
                </button>
              </>
            ) : null}
          </article>
        );
      })}
    </main>
  );
}
