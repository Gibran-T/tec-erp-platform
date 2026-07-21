import { useEffect, useState, type ReactElement } from "react";
import { useParams } from "react-router-dom";

import { verifyPublicCertificate, type PublicCertificateVerification } from "../../api/certification.js";

export function CertificateVerifyPage(): ReactElement {
  const { token } = useParams<{ token: string }>();
  const [result, setResult] = useState<PublicCertificateVerification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setResult({ found: false, message: "Certificat introuvable." });
      setLoading(false);
      return;
    }
    void verifyPublicCertificate(token)
      .then(setResult)
      .catch(() => setResult({ found: false, message: "Certificat introuvable." }))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <main data-testid="certificate-verify-page">
        <p role="status">Verification en cours…</p>
      </main>
    );
  }

  if (!result?.found) {
    return (
      <main data-testid="certificate-verify-page">
        <h1>Verification de certificat</h1>
        <p role="alert" data-testid="certificate-verify-not-found">
          {result?.message ?? "Certificat introuvable."}
        </p>
      </main>
    );
  }

  return (
    <main data-testid="certificate-verify-page">
      <h1>Verification de certificat</h1>
      <p role="status" data-testid="certificate-verify-valid">
        Certificat {result.certificateNumber} — {result.certificateType?.toUpperCase()} — statut{" "}
        {result.status}
      </p>
      <p>Titulaire : {result.studentName}</p>
      <p>Emis le : {result.issuedAt}</p>
      {result.revokedAt ? <p role="alert">Revoque le {result.revokedAt}</p> : null}
    </main>
  );
}
