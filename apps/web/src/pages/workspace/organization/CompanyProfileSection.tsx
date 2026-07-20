import type { OrganizationCompanyProfile } from "@tec-platform/contracts";
import type { ReactNode } from "react";

import { COMPANY_PROFILE_FIELD_LABELS, COMPANY_PROFILE_HEADING } from "./organizationCopy.js";

export function CompanyProfileSection({
  profile,
}: {
  profile: OrganizationCompanyProfile;
}): ReactNode {
  return (
    <section
      aria-labelledby="organization-company-profile-heading"
      className="rounded-lg border border-gray-200 bg-white p-6"
      data-testid="organization-company-profile"
    >
      <h2 id="organization-company-profile-heading" className="text-lg font-semibold text-gray-900">
        {COMPANY_PROFILE_HEADING}
      </h2>
      <p className="mt-1 text-2xl font-semibold text-gray-900" data-testid="organization-company-name">
        {profile.name}
      </p>

      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">
            {COMPANY_PROFILE_FIELD_LABELS.industry}
          </dt>
          <dd className="mt-1 max-w-prose text-gray-800">{profile.industry}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">
            {COMPANY_PROFILE_FIELD_LABELS.operatingContext}
          </dt>
          <dd className="mt-1 max-w-prose text-gray-800">{profile.operatingContext}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-gray-500">
            {COMPANY_PROFILE_FIELD_LABELS.organizationalSummary}
          </dt>
          <dd className="mt-1 max-w-prose text-gray-800">{profile.organizationalSummary}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-sm font-medium text-gray-500">
            {COMPANY_PROFILE_FIELD_LABELS.erpLearningContext}
          </dt>
          <dd className="mt-1 max-w-prose text-gray-800">{profile.erpLearningContext}</dd>
        </div>
      </dl>
    </section>
  );
}
