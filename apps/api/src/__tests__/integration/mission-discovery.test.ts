import { randomUUID } from "node:crypto";

import { getPrismaClient, disconnectPrismaClient } from "@tec-platform/database-erp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databaseUrl = process.env.DATABASE_URL;
const describeIntegration = databaseUrl ? describe : describe.skip;

describeIntegration("mission discovery database integration", () => {
  beforeAll(async () => {
    const client = getPrismaClient();
    await client.$connect();
  });

  afterAll(async () => {
    await disconnectPrismaClient();
  });

  it("exposes employee_mission_attempt table", async () => {
    const client = getPrismaClient();
    const tables = await client.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'employee_mission_attempt'
    `;

    expect(tables.map((row) => row.table_name)).toEqual(["employee_mission_attempt"]);
  });

  it("persists attempt evidence and enforces unique employee/mission pairs", async () => {
    const client = getPrismaClient();
    const suffix = randomUUID();
    const missionKey = `itest-mission-${suffix}`;

    const company = await client.company.findUnique({
      where: { code: "NORDHABITAT" },
    });
    expect(company).not.toBeNull();

    let employeeId: string | null = null;

    try {
      const employee = await client.employee.create({
        data: {
          employeeNumber: `#ITEST-M-${suffix}`,
          email: `itest.mission.${suffix}@example.test`,
          displayName: `Mission Integration ${suffix}`,
          passwordHash: "scrypt$itest$not-a-real-credential",
          role: "JR_BUSINESS_ANALYST",
          companyId: company!.id,
        },
      });
      employeeId = employee.id;

      const startedAt = new Date("2026-07-13T12:00:00.000Z");
      const completedAt = new Date("2026-07-13T13:00:00.000Z");
      const acknowledgedInputKeys = ["ctx-nordhabitat-overview", "ctx-tom-40-36"];
      const departmentProblemMappings = [
        { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
        { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
      ];
      const justification =
        "L’écart 40 versus 36 montre une fragmentation entre l’observation terrain et le système.";

      await client.employeeMissionAttempt.create({
        data: {
          employeeId,
          missionKey,
          status: "in_progress",
          startedAt,
          acknowledgedInputKeys,
          departmentProblemMappings,
        },
      });

      await expect(
        client.employeeMissionAttempt.create({
          data: {
            employeeId,
            missionKey,
            status: "in_progress",
            startedAt,
          },
        }),
      ).rejects.toThrow();

      const completed = await client.employeeMissionAttempt.update({
        where: {
          employeeId_missionKey: { employeeId, missionKey },
        },
        data: {
          status: "completed",
          completedAt,
          acknowledgedInputKeys,
          departmentProblemMappings,
          justification,
          feedbackKey: "fb-discovery-complete",
        },
      });

      expect(completed.status).toBe("completed");
      expect(completed.completedAt?.toISOString()).toBe(completedAt.toISOString());
      expect(completed.justification).toBe(justification);
      expect(completed.feedbackKey).toBe("fb-discovery-complete");
      expect(completed.acknowledgedInputKeys).toEqual(acknowledgedInputKeys);
      expect(completed.departmentProblemMappings).toEqual(departmentProblemMappings);
    } finally {
      if (employeeId !== null) {
        await client.employeeMissionAttempt.deleteMany({ where: { employeeId } });
        await client.employee.delete({ where: { id: employeeId } });
      }
    }
  });
});
