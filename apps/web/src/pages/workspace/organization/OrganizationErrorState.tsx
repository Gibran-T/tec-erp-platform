import type { ReactNode } from "react";

import { ORGANIZATION_RETRY_LABEL } from "./organizationCopy.js";

export function OrganizationErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}): ReactNode {
  return (
    <section
      className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 text-center"
      data-testid="organization-error-state"
    >
      <p className="text-red-700" role="alert" data-testid="organization-error-message">
        {message}
      </p>
      <button
        type="button"
        className="mt-4 rounded border border-[#0a6ed1] px-4 py-2 font-medium text-[#0a6ed1] hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6ed1]"
        data-testid="organization-retry-button"
        onClick={onRetry}
      >
        {ORGANIZATION_RETRY_LABEL}
      </button>
    </section>
  );
}
