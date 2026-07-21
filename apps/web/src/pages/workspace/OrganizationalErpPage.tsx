import type { ReactNode } from "react";
import { useState } from "react";

import { EmptyStateCard } from "../../components/workspace/EmptyStateCard.js";
import { CompanyProfileSection } from "./organization/CompanyProfileSection.js";
import { DepartmentDirectory } from "./organization/DepartmentDirectory.js";
import { FragmentationSignalsSection } from "./organization/FragmentationSignalsSection.js";
import { MissionCenterSoftLink } from "./organization/MissionCenterSoftLink.js";
import { NarrativeContextPanel } from "./organization/NarrativeContextPanel.js";
import {
  ORGANIZATION_EMPTY_DESCRIPTION,
  ORGANIZATION_EMPTY_TITLE,
  ORGANIZATION_ERROR_FALLBACK,
  ORGANIZATION_LOADING_STATUS,
  ORGANIZATION_PAGE_INTRO,
  ORGANIZATION_PAGE_TITLE,
} from "./organization/organizationCopy.js";
import { OrganizationErrorState } from "./organization/OrganizationErrorState.js";
import { OrganizationLockedState } from "./organization/OrganizationLockedState.js";
import { ProcessAwarenessSection } from "./organization/ProcessAwarenessSection.js";
import { RelationshipList } from "./organization/RelationshipList.js";
import { useOrganizationAccess } from "./organization/useOrganizationAccess.js";

export function OrganizationalErpPage(): ReactNode {
  const { response, loading, error, retry } = useOrganizationAccess();
  const [selectedDepartmentKey, setSelectedDepartmentKey] = useState<string | null>(null);

  if (loading && !response) {
    return (
      <section data-testid="organization-erp-page">
        <p
          role="status"
          aria-live="polite"
          className="text-gray-600"
          data-testid="organization-loading"
        >
          {ORGANIZATION_LOADING_STATUS}
        </p>
      </section>
    );
  }

  if (!response) {
    return (
      <section data-testid="organization-erp-page">
        <OrganizationErrorState
          message={error ?? ORGANIZATION_ERROR_FALLBACK}
          onRetry={retry}
        />
      </section>
    );
  }

  if (response.access === "locked") {
    return (
      <section data-testid="organization-erp-page">
        <OrganizationLockedState explanation={response.unlockExplanation} />
      </section>
    );
  }

  const organization = response.organization;

  const isMeaningfullyEmpty =
    organization.departments.length === 0 ||
    (organization.relationships.length === 0 &&
      organization.processAwareness.length === 0 &&
      organization.fragmentationSignals.length === 0);

  if (isMeaningfullyEmpty) {
    return (
      <section data-testid="organization-erp-page">
        <EmptyStateCard
          title={ORGANIZATION_EMPTY_TITLE}
          description={ORGANIZATION_EMPTY_DESCRIPTION}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8" data-testid="organization-erp-page">
      <header className="workspace-erp__header">
        <h1 className="text-2xl font-semibold text-gray-900">{ORGANIZATION_PAGE_TITLE}</h1>
        <p className="mt-1 max-w-prose text-gray-600">{ORGANIZATION_PAGE_INTRO}</p>
      </header>

      <CompanyProfileSection profile={organization.companyProfile} />

      <DepartmentDirectory
        departments={organization.departments}
        selectedKey={selectedDepartmentKey ?? organization.departments[0]?.key ?? ""}
        onSelect={setSelectedDepartmentKey}
      />

      {organization.relationships.length > 0 ? (
        <RelationshipList
          relationships={organization.relationships}
          departments={organization.departments}
        />
      ) : null}

      {organization.processAwareness.length > 0 ? (
        <ProcessAwarenessSection
          items={organization.processAwareness}
          departments={organization.departments}
        />
      ) : null}

      {organization.fragmentationSignals.length > 0 ? (
        <FragmentationSignalsSection
          signals={organization.fragmentationSignals}
          departments={organization.departments}
        />
      ) : null}

      <NarrativeContextPanel narrativeContext={organization.narrativeContext} />

      <MissionCenterSoftLink />
    </section>
  );
}
