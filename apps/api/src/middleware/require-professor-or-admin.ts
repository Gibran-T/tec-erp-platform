import type { NextFunction, Request, Response } from "express";
import { DomainError } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "./require-employee.js";

export function requireProfessorOrAdmin(req: Request, _res: Response, next: NextFunction): void {
  try {
    const employee = getAuthenticatedEmployee(req);
    if (employee.role !== "PROFESSOR" && employee.role !== "ADMIN") {
      next(DomainError.forbidden("Accès réservé aux professeurs et administrateurs."));
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}
