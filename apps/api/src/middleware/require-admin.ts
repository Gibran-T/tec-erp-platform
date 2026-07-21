import type { NextFunction, Request, Response } from "express";
import { DomainError } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "./require-employee.js";

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  try {
    const employee = getAuthenticatedEmployee(req);
    if (employee.role !== "ADMIN") {
      next(DomainError.forbidden("Acces reserve aux administrateurs."));
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}
