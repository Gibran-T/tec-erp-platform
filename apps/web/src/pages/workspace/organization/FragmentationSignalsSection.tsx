import type {
  OrganizationDepartment,
  OrganizationFragmentationSignal,
} from "@tec-platform/contracts";
import type { ReactNode } from "react";

import {
  AFFECTED_DEPARTMENTS_LABEL,
  ANALYTICAL_PROMPT_LABEL,
  BUSINESS_IMPACT_LABEL,
  EVIDENCE_LABEL,
  FRAGMENTATION_HEADING,
  FRAGMENTATION_INTRO,
} from "./organizationCopy.js";

function departmentLabels(
  departments: readonly OrganizationDepartment[],
  keys: readonly string[],
): string {
  return keys
    .map((key) => departments.find((department) => department.key === key)?.label ?? key)
    .join(", ");
}

export function FragmentationSignalsSection({
  signals,
  departments,
}: {
  signals: readonly OrganizationFragmentationSignal[];
  departments: readonly OrganizationDepartment[];
}): ReactNode {
  return (
    <section
      aria-labelledby="organization-fragmentation-heading"
      data-testid="organization-fragmentation-signals"
    >
      <h2 id="organization-fragmentation-heading" className="text-lg font-semibold text-gray-900">
        {FRAGMENTATION_HEADING}
      </h2>
      <p className="mt-1 max-w-prose text-gray-600">{FRAGMENTATION_INTRO}</p>

      <ul className="mt-4 space-y-4">
        {signals.map((signal) => (
          <li key={signal.key}>
            <article
              className="rounded-lg border border-amber-200 bg-amber-50 p-5"
              data-testid={`organization-fragmentation-${signal.key}`}
            >
              <h3 className="text-base font-semibold text-gray-900">{signal.title}</h3>
              <p className="mt-1 max-w-prose text-gray-700">{signal.description}</p>

              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {AFFECTED_DEPARTMENTS_LABEL}
                  </dt>
                  <dd className="mt-1 text-gray-800">
                    {departmentLabels(departments, signal.affectedDepartmentKeys)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{BUSINESS_IMPACT_LABEL}</dt>
                  <dd className="mt-1 text-gray-800">{signal.businessImpact}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{EVIDENCE_LABEL}</dt>
                  <dd className="mt-1 text-gray-800">{signal.evidence}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{ANALYTICAL_PROMPT_LABEL}</dt>
                  <dd className="mt-1 italic text-gray-800">{signal.analyticalPrompt}</dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
