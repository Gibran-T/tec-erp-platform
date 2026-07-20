import type { OrganizationResponse } from "@tec-platform/contracts";
import { useCallback, useEffect, useState } from "react";

import { requestOrganization } from "../../../api/organization.js";
import { ORGANIZATION_ERROR_FALLBACK } from "./organizationCopy.js";

/**
 * Page-local fetch hook for the organizational ERP page.
 * No caching, no persisted attempt state — every mount is a fresh, evergreen consultation.
 */
export interface UseOrganizationAccessResult {
  readonly response: OrganizationResponse | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly retry: () => void;
}

export function useOrganizationAccess(): UseOrganizationAccessResult {
  const [response, setResponse] = useState<OrganizationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    requestOrganization()
      .then((result) => {
        if (!cancelled) {
          setResponse(result);
        }
      })
      .catch((fetchError: unknown) => {
        if (!cancelled) {
          const message =
            fetchError instanceof Error && fetchError.message.trim().length > 0
              ? fetchError.message
              : ORGANIZATION_ERROR_FALLBACK;
          setError(message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return { response, loading, error, retry };
}
