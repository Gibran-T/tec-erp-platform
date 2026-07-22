import { describe, expect, it, vi } from "vitest";
import { DomainError, Result } from "@tec-platform/core";

import { createAdminService } from "../admin.service.js";

function createMockClient(seed: {
  actor: { id: string; companyId: string };
  employees?: Array<{
    id: string;
    companyId: string;
    role: string;
    employeeNumber?: string;
    email?: string;
    displayName?: string;
  }>;
  cohorts?: Array<{ id: string; companyId: string; code?: string; name?: string }>;
}) {
  const employees = [...(seed.employees ?? [])];
  const memberships: Array<{ cohortId: string; employeeId: string; roleInCohort: string }> = [];
  const audits: Array<{ action: string; resourceKey: string }> = [];
  const cohorts = [...(seed.cohorts ?? [])];

  return {
    audits,
    memberships,
    employee: {
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => {
        if (where.id === seed.actor.id) {
          return seed.actor;
        }
        return employees.find((row) => row.id === where.id) ?? null;
      }),
      findMany: vi.fn(async () => employees),
      create: vi.fn(async ({ data }: { data: Record<string, string> }) => {
        const created = {
          id: `emp_${employees.length + 1}`,
          employeeNumber: data.employeeNumber,
          email: data.email,
          displayName: data.displayName,
          role: data.role,
          companyId: data.companyId,
        };
        employees.push(created);
        return created;
      }),
      update: vi.fn(async ({ where, data }: { where: { id: string }; data: { role: string } }) => {
        const row = employees.find((item) => item.id === where.id);
        if (!row) {
          throw new Error("missing");
        }
        row.role = data.role;
        return row;
      }),
    },
    cohort: {
      findUnique: vi.fn(async ({ where }: { where: { id: string } }) => {
        return cohorts.find((row) => row.id === where.id) ?? null;
      }),
      findMany: vi.fn(async () =>
        cohorts.map((cohort) => ({
          ...cohort,
          _count: { memberships: memberships.filter((row) => row.cohortId === cohort.id).length },
          memberships: memberships
            .filter((row) => row.cohortId === cohort.id && row.roleInCohort === "professor")
            .map((row) => ({
              employee: employees.find((employee) => employee.id === row.employeeId),
            })),
        })),
      ),
      create: vi.fn(async ({ data }: { data: Record<string, string> }) => {
        const created = {
          id: `cohort_${cohorts.length + 1}`,
          code: data.code,
          name: data.name,
          companyId: data.companyId,
        };
        cohorts.push(created);
        return created;
      }),
    },
    cohortMembership: {
      upsert: vi.fn(
        async ({
          where,
          create,
          update,
        }: {
          where: { cohortId_employeeId: { cohortId: string; employeeId: string } };
          create: { cohortId: string; employeeId: string; roleInCohort: string };
          update: { roleInCohort?: string };
        }) => {
          const existing = memberships.find(
            (row) =>
              row.cohortId === where.cohortId_employeeId.cohortId &&
              row.employeeId === where.cohortId_employeeId.employeeId,
          );
          if (existing) {
            if (update.roleInCohort) {
              existing.roleInCohort = update.roleInCohort;
            }
            return existing;
          }
          memberships.push({ ...create });
          return create;
        },
      ),
      findUnique: vi.fn(
        async ({
          where,
        }: {
          where: { cohortId_employeeId: { cohortId: string; employeeId: string } };
        }) =>
          memberships.find(
            (row) =>
              row.cohortId === where.cohortId_employeeId.cohortId &&
              row.employeeId === where.cohortId_employeeId.employeeId,
          ) ?? null,
      ),
      delete: vi.fn(
        async ({
          where,
        }: {
          where: { cohortId_employeeId: { cohortId: string; employeeId: string } };
        }) => {
          const index = memberships.findIndex(
            (row) =>
              row.cohortId === where.cohortId_employeeId.cohortId &&
              row.employeeId === where.cohortId_employeeId.employeeId,
          );
          if (index >= 0) {
            memberships.splice(index, 1);
          }
        },
      ),
    },
    auditEvent: {
      create: vi.fn(async ({ data }: { data: { action: string; resourceKey: string } }) => {
        audits.push({ action: data.action, resourceKey: data.resourceKey });
        return data;
      }),
    },
  };
}

describe("Z1-003 admin professor assignment", () => {
  it("creates professor, assigns, rejects non-professor, removes with audit", async () => {
    const client = createMockClient({
      actor: { id: "admin_1", companyId: "co_a" },
      employees: [
        {
          id: "stu_1",
          companyId: "co_a",
          role: "JR_BUSINESS_ANALYST",
          displayName: "Student A",
        },
      ],
      cohorts: [{ id: "cohort_1", companyId: "co_a", code: "C1", name: "Cohorte 1" }],
    });
    const service = createAdminService(client as never);

    const created = await service.createEmployee("admin_1", {
      employeeNumber: "#P-1",
      email: "prof.a@institution.example",
      displayName: "Professeur A",
      role: "PROFESSOR",
      password: "TempPass12!",
    });
    expect(Result.isOk(created)).toBe(true);
    if (!Result.isOk(created)) {
      return;
    }

    const assigned = await service.assignProfessor("admin_1", "cohort_1", created.value.id);
    expect(Result.isOk(assigned)).toBe(true);

    const rejectStudent = await service.assignProfessor("admin_1", "cohort_1", "stu_1");
    expect(Result.isFail(rejectStudent)).toBe(true);
    if (Result.isFail(rejectStudent)) {
      expect(rejectStudent.error).toBeInstanceOf(DomainError);
    }

    const removed = await service.removeProfessor("admin_1", "cohort_1", created.value.id);
    expect(Result.isOk(removed)).toBe(true);

    expect(client.audits.map((row) => row.action)).toEqual(
      expect.arrayContaining([
        "admin.employee.create",
        "admin.cohort.assign_professor",
        "admin.cohort.remove_professor",
      ]),
    );
  });
});
