import { randomUUID } from "node:crypto";

import { getPrismaClient, disconnectPrismaClient } from "@tec-platform/database-erp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databaseUrl = process.env.DATABASE_URL;
const describeIntegration = databaseUrl ? describe : describe.skip;

describeIntegration("first-day foundation database integration", () => {
  beforeAll(async () => {
    const client = getPrismaClient();
    await client.$connect();
  });

  afterAll(async () => {
    await disconnectPrismaClient();
  });

  it("exposes employee_message_state and employee_task_state tables", async () => {
    const client = getPrismaClient();
    const tables = await client.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('employee_message_state', 'employee_task_state')
      ORDER BY table_name
    `;

    expect(tables.map((row) => row.table_name)).toEqual([
      "employee_message_state",
      "employee_task_state",
    ]);
  });

  it("enforces unique employee/message and employee/task pairs", async () => {
    const client = getPrismaClient();
    const suffix = randomUUID();
    const messageKey = `itest-message-${suffix}`;
    const taskKey = `itest-task-${suffix}`;

    const company = await client.company.findUnique({
      where: { code: "NORDHABITAT" },
    });
    expect(company).not.toBeNull();

    let employeeId: string | null = null;

    try {
      const employee = await client.employee.create({
        data: {
          employeeNumber: `#ITEST-${suffix}`,
          email: `itest.${suffix}@example.test`,
          displayName: `Integration Test Employee ${suffix}`,
          passwordHash: "scrypt$itest$not-a-real-credential",
          role: "JR_BUSINESS_ANALYST",
          companyId: company!.id,
        },
      });
      employeeId = employee.id;

      const readAt = new Date("2026-07-09T12:00:00.000Z");
      const completedAt = new Date("2026-07-09T13:00:00.000Z");

      await client.employeeMessageState.create({
        data: {
          employeeId,
          messageKey,
          readAt,
        },
      });

      await expect(
        client.employeeMessageState.create({
          data: {
            employeeId,
            messageKey,
            readAt,
          },
        }),
      ).rejects.toThrow();

      await client.employeeTaskState.create({
        data: {
          employeeId,
          taskKey,
          completedAt,
        },
      });

      await expect(
        client.employeeTaskState.create({
          data: {
            employeeId,
            taskKey,
            completedAt,
          },
        }),
      ).rejects.toThrow();
    } finally {
      if (employeeId !== null) {
        await client.employeeMessageState.deleteMany({
          where: { employeeId, messageKey },
        });
        await client.employeeTaskState.deleteMany({
          where: { employeeId, taskKey },
        });
        await client.employee.delete({
          where: { id: employeeId },
        });
      }
    }
  });
});
