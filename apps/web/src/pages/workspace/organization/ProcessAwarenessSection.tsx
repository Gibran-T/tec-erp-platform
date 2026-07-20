import type {
  OrganizationDepartment,
  OrganizationProcessAwarenessItem,
} from "@tec-platform/contracts";
import type { ReactNode } from "react";

import {
  ANALYTICAL_QUESTION_LABEL,
  EXPECTED_CONTROL_LABEL,
  PARTICIPATING_DEPARTMENTS_LABEL,
  PROCESS_AWARENESS_HEADING,
  PROCESS_AWARENESS_INTRO,
  SOURCE_INFORMATION_LABEL,
} from "./organizationCopy.js";

function departmentLabels(
  departments: readonly OrganizationDepartment[],
  keys: readonly string[],
): string {
  return keys
    .map((key) => departments.find((department) => department.key === key)?.label ?? key)
    .join(", ");
}

export function ProcessAwarenessSection({
  items,
  departments,
}: {
  items: readonly OrganizationProcessAwarenessItem[];
  departments: readonly OrganizationDepartment[];
}): ReactNode {
  return (
    <section
      aria-labelledby="organization-process-awareness-heading"
      data-testid="organization-process-awareness"
    >
      <h2
        id="organization-process-awareness-heading"
        className="text-lg font-semibold text-gray-900"
      >
        {PROCESS_AWARENESS_HEADING}
      </h2>
      <p className="mt-1 max-w-prose text-gray-600">{PROCESS_AWARENESS_INTRO}</p>

      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.key}>
            <article
              className="rounded-lg border border-gray-200 bg-white p-5"
              data-testid={`organization-process-${item.key}`}
            >
              <h3 className="text-base font-semibold text-gray-900">{item.label}</h3>
              <p className="mt-1 max-w-prose text-gray-700">{item.description}</p>

              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {PARTICIPATING_DEPARTMENTS_LABEL}
                  </dt>
                  <dd className="mt-1 text-gray-800">
                    {departmentLabels(departments, item.participatingDepartmentKeys)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{SOURCE_INFORMATION_LABEL}</dt>
                  <dd className="mt-1 text-gray-800">{item.sourceInformation}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">{EXPECTED_CONTROL_LABEL}</dt>
                  <dd className="mt-1 text-gray-800">{item.expectedControl}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {ANALYTICAL_QUESTION_LABEL}
                  </dt>
                  <dd className="mt-1 italic text-gray-800">{item.analyticalQuestion}</dd>
                </div>
              </dl>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
