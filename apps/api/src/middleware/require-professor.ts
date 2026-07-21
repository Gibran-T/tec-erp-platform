import type { NextFunction, Request, Response } from "express";
import { DomainError } from "@tec-platform/core";

import { getAuthenticatedEmployee } from "./require-employee.js";

export function requireProfessor(req: Request, _res: Response, next: NextFunction): void {
  try {
    const employee = getAuthenticatedEmployee(req);
    if (employee.role !== "PROFESSOR") {
      next(DomainError.forbidden("Acces reserve aux professeurs."));
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
}
