import type { OrganizationDepartment, OrganizationRelationship } from "@tec-platform/contracts";
import type { ReactNode } from "react";

import {
  COORDINATION_RISK_LABEL,
  EXCHANGED_INFORMATION_LABEL,
  RELATIONSHIPS_HEADING,
  RELATIONSHIPS_INTRO,
} from "./organizationCopy.js";

function departmentLabel(
  departments: readonly OrganizationDepartment[],
  key: string,
): string {
  return departments.find((department) => department.key === key)?.label ?? key;
}

export function RelationshipList({
  relationships,
  departments,
}: {
  relationships: readonly OrganizationRelationship[];
  departments: readonly OrganizationDepartment[];
}): ReactNode {
  return (
    <section
      aria-labelledby="organization-relationships-heading"
      data-testid="organization-relationships"
    >
      <h2 id="organization-relationships-heading" className="text-lg font-semibold text-gray-900">
        {RELATIONSHIPS_HEADING}
      </h2>
      <p className="mt-1 max-w-prose text-gray-600">{RELATIONSHIPS_INTRO}</p>

      <ul className="mt-4 space-y-4">
        {relationships.map((relationship) => (
          <li key={relationship.key}>
            <article
              className="rounded-lg border border-gray-200 bg-white p-5"
              data-testid={`organization-relationship-${relationship.key}`}
            >
              <h3 className="text-base font-semibold text-gray-900">
                <span data-testid={`organization-relationship-endpoints-${relationship.key}`}>
                  {departmentLabel(departments, relationship.fromDepartmentKey)}
                  {" → "}
                  {departmentLabel(departments, relationship.toDepartmentKey)}
                </span>
                <span className="ml-2 font-normal text-gray-500">{relationship.label}</span>
              </h3>
              <p className="mt-1 max-w-prose text-gray-700">{relationship.description}</p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    {EXCHANGED_INFORMATION_LABEL}
                  </h4>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-gray-800">
                    {relationship.exchangedInformation.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">{COORDINATION_RISK_LABEL}</h4>
                  <p className="mt-1 text-gray-800">{relationship.coordinationRisk}</p>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
