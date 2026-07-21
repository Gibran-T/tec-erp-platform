import type { NextFunction, Request, Response } from "express";
import { DomainError } from "@tec-platform/core";
import { describe, expect, it, vi } from "vitest";

import type { AuthenticatedRequest } from "../../../middleware/require-employee.js";
import { requireAdmin } from "../../../middleware/require-admin.js";

describe("requireAdmin", () => {
  it("forbids non-admin employees", () => {
    const req = {
      employee: {
        id: "emp_student",
        employeeNumber: "#NHE-1",
        email: "student@nordhabitat.ca",
        displayName: "Student",
        role: "JR_BUSINESS_ANALYST",
        companyName: "NordHabitat",
      },
    } as AuthenticatedRequest;
    const next = vi.fn();

    requireAdmin(req as Request, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledTimes(1);
    const error = next.mock.calls[0]?.[0];
    expect(error).toBeInstanceOf(DomainError);
    expect((error as DomainError).code).toBe("FORBIDDEN");
  });
});
