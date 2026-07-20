import {
  ORGANIZATION_UNLOCK_FIRST_DAY_REQUIRED_CODE,
  OrganizationResponseSchema,
  type AuthenticatedEmployee,
  type OrganizationResponse,
} from "@tec-platform/contracts";

import type { OrganizationAccessReader } from "./organization.access.js";
import { getOrganizationCatalog } from "./organization.catalog.js";

export interface OrganizationServiceDependencies {
  readonly accessReader: OrganizationAccessReader;
}

export interface OrganizationService {
  getOrganization(employee: AuthenticatedEmployee): Promise<OrganizationResponse>;
}

const FIRST_DAY_REQUIRED_EXPLANATION = {
  code: ORGANIZATION_UNLOCK_FIRST_DAY_REQUIRED_CODE,
  title: "Première journée requise",
  description:
    "Terminez votre première journée avant de consulter l’organisation de l’entreprise.",
} as const;

export function createOrganizationService(
  dependencies: OrganizationServiceDependencies,
): OrganizationService {
  return {
    async getOrganization(employee) {
      const hasCompletedFirstDay =
        await dependencies.accessReader.hasCompletedFirstDay(employee.id);

      if (!hasCompletedFirstDay) {
        return OrganizationResponseSchema.parse({
          access: "locked",
          unlockExplanation: FIRST_DAY_REQUIRED_EXPLANATION,
          organization: null,
        });
      }

      return OrganizationResponseSchema.parse({
        access: "available",
        unlockExplanation: null,
        organization: getOrganizationCatalog(),
      });
    },
  };
}
