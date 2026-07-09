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
    const employee = await client.employee.findFirst();

    expect(employee).not.toBeNull();

    const readAt = new Date("2026-07-09T12:00:00.000Z");
    const completedAt = new Date("2026-07-09T13:00:00.000Z");

    await client.employeeMessageState.create({
      data: {
        employeeId: employee!.id,
        messageKey: "premier-message-gestionnaire",
        readAt,
      },
    });

    await expect(
      client.employeeMessageState.create({
        data: {
          employeeId: employee!.id,
          messageKey: "premier-message-gestionnaire",
          readAt,
        },
      }),
    ).rejects.toThrow();

    await client.employeeTaskState.create({
      data: {
        employeeId: employee!.id,
        taskKey: "decouvrir-nordhabitat",
        completedAt,
      },
    });

    await expect(
      client.employeeTaskState.create({
        data: {
          employeeId: employee!.id,
          taskKey: "decouvrir-nordhabitat",
          completedAt,
        },
      }),
    ).rejects.toThrow();

    await client.employeeMessageState.deleteMany({
      where: { employeeId: employee!.id, messageKey: "premier-message-gestionnaire" },
    });
    await client.employeeTaskState.deleteMany({
      where: { employeeId: employee!.id, taskKey: "decouvrir-nordhabitat" },
    });
  });
});
