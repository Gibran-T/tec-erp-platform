import {
  buildDemoSeed,
  DEMO_EMPLOYEE_PASSWORD,
  NORDHABITAT_COMPANY,
} from "@tec-platform/database-erp";

import type { EmployeeRecord, EmployeeRepository } from "../auth.types.js";

export const DEMO_PASSWORD = DEMO_EMPLOYEE_PASSWORD;

export function buildDemoEmployeeRecord(): EmployeeRecord {
  const seed = buildDemoSeed();

  return {
    id: "emp_demo",
    employeeNumber: seed.employee.employeeNumber,
    email: seed.employee.email,
    displayName: seed.employee.displayName,
    passwordHash: seed.employee.passwordHash,
    role: seed.employee.role,
    companyName: NORDHABITAT_COMPANY.name,
  };
}

export function createInMemoryEmployeeRepository(
  records: readonly EmployeeRecord[],
): EmployeeRepository {
  const byEmail = new Map(records.map((record) => [record.email.toLowerCase(), record]));
  const byId = new Map(records.map((record) => [record.id, record]));

  return {
    findByEmail(email) {
      return Promise.resolve(byEmail.get(email.toLowerCase()) ?? null);
    },
    findById(id) {
      return Promise.resolve(byId.get(id) ?? null);
    },
  };
}
