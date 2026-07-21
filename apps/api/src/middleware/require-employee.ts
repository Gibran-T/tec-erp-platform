import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { DomainError, Result } from "@tec-platform/core";
import type { NextFunction, Request, Response } from "express";

import type { AuthService } from "../modules/auth/auth.service.js";
import { extractBearerToken } from "../modules/auth/bearer-token.js";

export interface AuthenticatedRequest extends Request {
  employee: AuthenticatedEmployee;
}

export function createRequireEmployee(authService: AuthService) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = extractBearerToken(req);

      if (!token) {
        throw DomainError.unauthorized("Authentication is required.");
      }

      const outcome = await authService.session(token);

      if (Result.isFail(outcome)) {
        next(outcome.error);
        return;
      }

      (req as AuthenticatedRequest).employee = outcome.value.employee;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function getAuthenticatedEmployee(req: Request): AuthenticatedEmployee {
  const employee = (req as Partial<AuthenticatedRequest>).employee;

  if (!employee) {
    throw DomainError.internal("Authenticated employee context is missing.");
  }

  return employee;
}
