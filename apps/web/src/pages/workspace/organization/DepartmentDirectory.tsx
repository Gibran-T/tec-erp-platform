import type { OrganizationDepartment } from "@tec-platform/contracts";
import type { ReactNode } from "react";

import {
  DEPARTMENT_DIRECTORY_HEADING,
  DEPARTMENT_DIRECTORY_INTRO,
  DEPARTMENT_FRAGMENTATION_SIGNALS_LABEL,
  INFORMATION_NEEDS_LABEL,
  PROCESS_CONTRIBUTIONS_LABEL,
  RESPONSIBILITIES_LABEL,
} from "./organizationCopy.js";

function DepartmentDetail({ department }: { department: OrganizationDepartment }): ReactNode {
  return (
    <article
      aria-labelledby={`organization-department-heading-${department.key}`}
      className="rounded-lg border border-gray-200 bg-white p-6"
      data-testid={`organization-department-detail-${department.key}`}
    >
      <h3
        id={`organization-department-heading-${department.key}`}
        className="text-base font-semibold text-gray-900"
      >
        {department.label}
      </h3>
      <p className="mt-1 text-gray-600">{department.shortDescription}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-sm font-medium text-gray-500">{RESPONSIBILITIES_LABEL}</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-gray-800">
            {department.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">{PROCESS_CONTRIBUTIONS_LABEL}</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-gray-800">
            {department.processContributions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">{INFORMATION_NEEDS_LABEL}</h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-gray-800">
            {department.informationNeeds.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">
            {DEPARTMENT_FRAGMENTATION_SIGNALS_LABEL}
          </h4>
          <ul className="mt-1 list-inside list-disc space-y-1 text-gray-800">
            {department.fragmentationSignals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function DepartmentDirectory({
  departments,
  selectedKey,
  onSelect,
}: {
  departments: readonly OrganizationDepartment[];
  selectedKey: string;
  onSelect: (key: string) => void;
}): ReactNode {
  const selectedDepartment =
    departments.find((department) => department.key === selectedKey) ?? departments[0] ?? null;

  return (
    <section
      aria-labelledby="organization-department-directory-heading"
      data-testid="organization-department-directory"
    >
      <h2
        id="organization-department-directory-heading"
        className="text-lg font-semibold text-gray-900"
      >
        {DEPARTMENT_DIRECTORY_HEADING}
      </h2>
      <p className="mt-1 max-w-prose text-gray-600">{DEPARTMENT_DIRECTORY_INTRO}</p>

      <div
        className="mt-4 flex flex-wrap gap-2"
        role="group"
        aria-label={DEPARTMENT_DIRECTORY_HEADING}
        data-testid="organization-department-tabs"
      >
        {departments.map((department) => {
          const isSelected = department.key === selectedDepartment?.key;
          return (
            <button
              key={department.key}
              type="button"
              aria-pressed={isSelected}
              className={`rounded-full border px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6ed1] ${
                isSelected
                  ? "border-[#0a6ed1] bg-[#0a6ed1] text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-[#0a6ed1] hover:text-[#0a6ed1]"
              }`}
              data-testid={`organization-department-tab-${department.key}`}
              onClick={() => onSelect(department.key)}
            >
              {department.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {selectedDepartment ? <DepartmentDetail department={selectedDepartment} /> : null}
      </div>
    </section>
  );
}
