import type { AuthenticatedEmployee } from "@tec-platform/contracts";
import { DomainError } from "@tec-platform/core";
import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { createRequireEmployee } from "../require-employee.js";
import { issueToken } from "../../modules/auth/auth.tokens.js";
import { createAuthService } from "../../modules/auth/auth.service.js";
import {
  buildDemoEmployeeRecord,
  createInMemoryEmployeeRepository,
} from "../../modules/auth/__tests__/auth.fixtures.js";

const authConfig = {
  jwtAccessSecret: "test-access-secret",
  jwtRefreshSecret: "test-refresh-secret",
  accessTokenTtlSeconds: 900,
  refreshTokenTtlSeconds: 1_209_600,
};

function createMiddlewareStack(employeeRecords: ReturnType<typeof buildDemoEmployeeRecord>[]) {
  const employeeRepository = createInMemoryEmployeeRepository(employeeRecords);
  const authService = createAuthService({ employeeRepository, config: authConfig });
  const requireEmployee = createRequireEmployee(authService);

  return { authService, requireEmployee, employeeRepository };
}

function invokeMiddleware(
  requireEmployee: ReturnType<typeof createRequireEmployee>,
  req: Partial<Request>,
): Promise<{ status?: number; error?: unknown; employee?: AuthenticatedEmployee }> {
  const response = {} as Response;
  let statusCode: number | undefined;
  let capturedError: unknown;
  let nextCalled = false;

  response.status = vi.fn((code: number) => {
    statusCode = code;
    return response;
  }) as Response["status"];

  const next: NextFunction = (error?: unknown) => {
    nextCalled = true;
    capturedError = error;
  };

  return new Promise((resolve) => {
    void requireEmployee(req as Request, response, (error?: unknown) => {
      next(error);
      resolve({
        status: statusCode,
        error: capturedError,
        employee: (req as Request & { employee?: AuthenticatedEmployee }).employee,
      });
      if (!nextCalled && !error) {
        resolve({
          employee: (req as Request & { employee?: AuthenticatedEmployee }).employee,
        });
      }
    });
  });
}

describe("requireEmployee middleware", () => {
  const demoRecord = buildDemoEmployeeRecord();

  it("rejects a missing authorization header", async () => {
    const { requireEmployee } = createMiddlewareStack([demoRecord]);
    const outcome = await invokeMiddleware(requireEmployee, { header: () => undefined });

    expect(outcome.error).toBeInstanceOf(DomainError);
    expect((outcome.error as DomainError).code).toBe("UNAUTHORIZED");
  });

  it("rejects a malformed authorization header", async () => {
    const { requireEmployee } = createMiddlewareStack([demoRecord]);
    const outcome = await invokeMiddleware(requireEmployee, {
      header: () => "Token abc",
    });

    expect((outcome.error as DomainError).code).toBe("UNAUTHORIZED");
  });

  it("rejects an invalid token", async () => {
    const { requireEmployee } = createMiddlewareStack([demoRecord]);
    const outcome = await invokeMiddleware(requireEmployee, {
      header: () => "Bearer not-a-valid-jwt",
    });

    expect((outcome.error as DomainError).code).toBe("UNAUTHORIZED");
  });

  it("rejects an expired token", async () => {
    const { requireEmployee } = createMiddlewareStack([demoRecord]);
    const expired = issueToken(
      { sub: demoRecord.id, typ: "access" },
      authConfig.jwtAccessSecret,
      -60,
      Date.now() - 120_000,
    );

    const outcome = await invokeMiddleware(requireEmployee, {
      header: () => `Bearer ${expired.token}`,
    });

    expect((outcome.error as DomainError).code).toBe("UNAUTHORIZED");
  });

  it("rejects a token for a deleted employee", async () => {
    const { requireEmployee } = createMiddlewareStack([]);
    const token = issueToken(
      { sub: "missing-employee", typ: "access" },
      authConfig.jwtAccessSecret,
      authConfig.accessTokenTtlSeconds,
    );

    const outcome = await invokeMiddleware(requireEmployee, {
      header: () => `Bearer ${token.token}`,
    });

    expect((outcome.error as DomainError).code).toBe("UNAUTHORIZED");
  });

  it("attaches the authenticated employee for a valid token", async () => {
    const { requireEmployee } = createMiddlewareStack([demoRecord]);
    const token = issueToken(
      { sub: demoRecord.id, typ: "access" },
      authConfig.jwtAccessSecret,
      authConfig.accessTokenTtlSeconds,
    );

    const outcome = await invokeMiddleware(requireEmployee, {
      header: () => `Bearer ${token.token}`,
    });

    expect(outcome.error).toBeUndefined();
    expect(outcome.employee).toMatchObject({
      id: demoRecord.id,
      email: demoRecord.email,
      employeeNumber: "#NHE-DEMO",
    });
  });

  it("derives identity from the token only and ignores spoofed request input", async () => {
    const attacker = {
      ...demoRecord,
      id: "emp_attacker",
      email: "attacker@example.com",
      employeeNumber: "#NHE-ATK",
    };
    const { requireEmployee } = createMiddlewareStack([demoRecord, attacker]);
    const token = issueToken(
      { sub: demoRecord.id, typ: "access" },
      authConfig.jwtAccessSecret,
      authConfig.accessTokenTtlSeconds,
    );

    const spoofed = {
      header: (name: string) =>
        name.toLowerCase() === "authorization"
          ? `Bearer ${token.token}`
          : "emp_attacker",
      body: { employee: { id: "emp_attacker" }, sub: "emp_attacker" },
      query: { sub: "emp_attacker", employeeId: "emp_attacker" },
      // Pre-set employee must be overwritten by the token-derived identity.
      employee: attacker,
    } as unknown as Partial<Request>;

    const outcome = await invokeMiddleware(requireEmployee, spoofed);

    expect(outcome.error).toBeUndefined();
    expect(outcome.employee?.id).toBe(demoRecord.id);
    expect(outcome.employee?.email).toBe(demoRecord.email);
  });

  it("resolves the identity of the token subject, not a spoofed subject claim", async () => {
    const other = {
      ...demoRecord,
      id: "emp_other",
      email: "other@example.com",
      employeeNumber: "#NHE-OTHER",
    };
    const { requireEmployee } = createMiddlewareStack([demoRecord, other]);
    const token = issueToken(
      { sub: other.id, typ: "access" },
      authConfig.jwtAccessSecret,
      authConfig.accessTokenTtlSeconds,
    );

    const outcome = await invokeMiddleware(requireEmployee, {
      header: (name: string) =>
        name.toLowerCase() === "authorization"
          ? `Bearer ${token.token}`
          : "emp_demo",
      body: { sub: demoRecord.id },
    } as unknown as Partial<Request>);

    expect(outcome.employee?.id).toBe(other.id);
  });
});
