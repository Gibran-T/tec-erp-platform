import type { EmployeeRole } from "@tec-platform/contracts";
import { getPrismaClient } from "@tec-platform/database-erp";

import type { EmployeeRecord, EmployeeRepository } from "./auth.types.js";

interface EmployeeWithCompany {
  readonly id: string;
  readonly employeeNumber: string;
  readonly email: string;
  readonly displayName: string;
  readonly passwordHash: string;
  readonly role: string;
  readonly company: { readonly name: string };
}

function mapRecord(row: EmployeeWithCompany): EmployeeRecord {
  return {
    id: row.id,
    employeeNumber: row.employeeNumber,
    email: row.email,
    displayName: row.displayName,
    passwordHash: row.passwordHash,
    role: row.role as EmployeeRole,
    companyName: row.company.name,
  };
}

export function createPrismaEmployeeRepository(): EmployeeRepository {
  return {
    async findByEmail(email) {
      const prisma = getPrismaClient();
      const row = await prisma.employee.findUnique({
        where: { email },
        include: { company: true },
      });

      return row ? mapRecord(row) : null;
    },

    async findById(id) {
      const prisma = getPrismaClient();
      const row = await prisma.employee.findUnique({
        where: { id },
        include: { company: true },
      });

      return row ? mapRecord(row) : null;
    },
  };
}
