import type { AuthenticatedEmployee, EmployeeRole } from "@tec-platform/contracts";

/**
 * Persistence-facing employee record. Includes the credential hash, which never
 * crosses the HTTP boundary and is therefore absent from the contracts DTO.
 */
export interface EmployeeRecord {
  readonly id: string;
  readonly employeeNumber: string;
  readonly email: string;
  readonly displayName: string;
  readonly passwordHash: string;
  readonly role: EmployeeRole;
  readonly companyName: string;
}

/**
 * Read-only gateway to employee identities. Implemented by a Prisma-backed
 * repository in production and by in-memory fakes in tests (ADR §12).
 */
export interface EmployeeRepository {
  findByEmail(email: string): Promise<EmployeeRecord | null>;
  findById(id: string): Promise<EmployeeRecord | null>;
}

export function toAuthenticatedEmployee(record: EmployeeRecord): AuthenticatedEmployee {
  return {
    id: record.id,
    employeeNumber: record.employeeNumber,
    email: record.email,
    displayName: record.displayName,
    role: record.role,
    companyName: record.companyName,
  };
}
