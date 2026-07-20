import type { OrganizationUnlockExplanation } from "@tec-platform/contracts";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { getAppPath } from "../../../workspace/appRegistry.js";
import { RETURN_TO_HOME_LABEL } from "./organizationCopy.js";

export function OrganizationLockedState({
  explanation,
}: {
  explanation: OrganizationUnlockExplanation;
}): ReactNode {
  return (
    <section
      className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-8 text-center"
      data-testid="organization-locked-state"
    >
      <h1 className="text-xl font-semibold text-gray-900">{explanation.title}</h1>
      <p className="mt-3 text-gray-600" data-testid="organization-unlock-explanation">
        {explanation.description}
      </p>
      <Link
        className="mt-6 inline-block font-medium text-[#0a6ed1] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6ed1]"
        to={getAppPath("accueil")}
        data-testid="organization-locked-return-link"
      >
        {RETURN_TO_HOME_LABEL}
      </Link>
    </section>
  );
}
