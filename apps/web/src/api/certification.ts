import type { CertificateView } from "@tec-platform/contracts";

import { loadStoredTokens } from "./auth.js";
import { getApiBaseUrl } from "./health.js";
import { safeFetch } from "./http.js";

function requireAccessToken(): string {
  const tokens = loadStoredTokens();
  if (!tokens?.accessToken) {
    throw new Error("Authentification requise.");
  }
  return tokens.accessToken;
}

async function parseJson<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    let detail = fallback;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) {
        detail = body.error.message;
      }
    } catch {
      // keep fallback
    }
    throw new Error(detail);
  }
  return (await response.json()) as T;
}

export interface CertificateWithVerification extends CertificateView {
  readonly verificationToken?: string | null;
  readonly verificationUrl?: string | null;
}

export interface PublicCertificateVerification {
  readonly found: boolean;
  readonly status?: "valid" | "revoked" | "expired";
  readonly certificateNumber?: string;
  readonly certificateType?: string;
  readonly studentName?: string;
  readonly issuedAt?: string;
  readonly revokedAt?: string | null;
  readonly message?: string;
}

export async function getGoldEligibility() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/certificates/gold-eligibility`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<GoldEligibilityView>(
    response,
    "Impossible de charger l'éligibilité Or.",
  );
}

export interface GoldEligibilityView {
  readonly eligibleForProfessorIssue: boolean;
  readonly studentReadyChecklist: {
    readonly missionsComplete: boolean;
    readonly goldAssessmentPassed: boolean;
    readonly capstoneSubmitted: boolean;
    readonly capstoneProfessorApproved: boolean;
  };
  readonly reasons: readonly string[];
  readonly nextStepHint: string;
}

export async function listMyCertificates() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/certificates`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ certificates: CertificateWithVerification[] }>(
    response,
    "Impossible de charger les certificats.",
  );
}

export async function verifyPublicCertificate(tokenOrNumber: string) {
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/public/certificates/verify/${encodeURIComponent(tokenOrNumber)}`,
    { method: "GET" },
  );
  if (response.status === 404) {
    return { found: false, message: "Certificat introuvable." } satisfies PublicCertificateVerification;
  }
  return parseJson<PublicCertificateVerification>(
    response,
    "Verification du certificat impossible.",
  );
}

export async function issueProfessorGoldCertificate(studentId: string, reason: string) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/professor/certificates/gold/issue`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, reason, confirm: true }),
  });
  return parseJson<CertificateView>(response, "Impossible d'emettre le certificat Gold.");
}
