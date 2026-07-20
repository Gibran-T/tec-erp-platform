import { OrganizationResponseSchema } from "@tec-platform/contracts";
import type { NextFunction, Request, Response } from "express";

import { getAuthenticatedEmployee } from "../../middleware/require-employee.js";
import type { OrganizationService } from "./organization.service.js";

export interface OrganizationHandlers {
  getOrganization(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export function createOrganizationHandlers(
  service: OrganizationService,
): OrganizationHandlers {
  return {
    async getOrganization(req, res, next) {
      try {
        const employee = getAuthenticatedEmployee(req);
        const organization = await service.getOrganization(employee);
        res.status(200).json(OrganizationResponseSchema.parse(organization));
      } catch (error) {
        next(error);
      }
    },
  };
}
