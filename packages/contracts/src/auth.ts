import { z } from "zod";

/**
 * RC01 — Identity & First Day, Slice A (Authentication) cross-boundary contracts.
 *
 * These are the only auth types allowed to cross the HTTP boundary between
 * erp-api and erp-web (ADR-PLATFORM-001 §5.2). No domain logic, schema only.
 *
 * A single institutional role is defined for RC01. Broader RBAC is deferred.
 */
export const EmployeeRoleSchema = z.enum(["JR_BUSINESS_ANALYST", "PROFESSOR", "ADMIN"]);
export type EmployeeRole = z.infer<typeof EmployeeRoleSchema>;

export const AuthenticatedEmployeeSchema = z.object({
  id: z.string().min(1),
  employeeNumber: z.string().min(1),
  email: z.string().email(),
  displayName: z.string().min(1),
  role: EmployeeRoleSchema,
  companyName: z.string().min(1),
});
export type AuthenticatedEmployee = z.infer<typeof AuthenticatedEmployeeSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  accessTokenExpiresAt: z.string().datetime(),
  refreshTokenExpiresAt: z.string().datetime(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  employee: AuthenticatedEmployeeSchema,
  tokens: AuthTokensSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;

export const RefreshResponseSchema = z.object({
  tokens: AuthTokensSchema,
});
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

export const SessionResponseSchema = z.object({
  employee: AuthenticatedEmployeeSchema,
});
export type SessionResponse = z.infer<typeof SessionResponseSchema>;

export const LogoutResponseSchema = z.object({
  success: z.literal(true),
});
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
