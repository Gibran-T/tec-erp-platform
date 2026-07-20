import type { OrganizationNarrativeContext } from "@tec-platform/contracts";
import type { ReactNode } from "react";

import {
  ACTUAL_VALUE_LABEL,
  EXPECTED_VALUE_LABEL,
  INTERPRETATION_CONSTRAINT_LABEL,
  NARRATIVE_CONTEXT_HEADING,
} from "./organizationCopy.js";

export function NarrativeContextPanel({
  narrativeContext,
}: {
  narrativeContext: OrganizationNarrativeContext;
}): ReactNode {
  return (
    <section
      aria-labelledby="organization-narrative-heading"
      className="rounded-lg border border-gray-200 bg-white p-6"
      data-testid="organization-narrative-context"
    >
      <h2 id="organization-narrative-heading" className="text-lg font-semibold text-gray-900">
        {NARRATIVE_CONTEXT_HEADING}
      </h2>
      <h3 className="mt-1 text-base font-medium text-gray-800">{narrativeContext.title}</h3>
      <p className="mt-2 max-w-prose text-gray-700">{narrativeContext.observation}</p>

      <div className="mt-4 flex flex-wrap gap-6" data-testid="organization-narrative-values">
        <div>
          <p className="text-sm font-medium text-gray-500">{EXPECTED_VALUE_LABEL}</p>
          <p className="text-2xl font-semibold text-gray-900" data-testid="organization-narrative-expected">
            {narrativeContext.expected} {narrativeContext.unit}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{ACTUAL_VALUE_LABEL}</p>
          <p className="text-2xl font-semibold text-gray-900" data-testid="organization-narrative-actual">
            {narrativeContext.actual} {narrativeContext.unit}
          </p>
        </div>
      </div>

      <p className="mt-4 max-w-prose italic text-gray-800">{narrativeContext.analyticalQuestion}</p>

      <p
        className="mt-4 max-w-prose rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600"
        data-testid="organization-narrative-constraint"
      >
        <span className="font-medium text-gray-700">{INTERPRETATION_CONSTRAINT_LABEL} : </span>
        {narrativeContext.interpretationConstraint}
      </p>
    </section>
  );
}
