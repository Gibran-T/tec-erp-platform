import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function sanitizeConnectionView(connection: {
  id: string;
  companyId: string;
  adapterKey: string;
  name: string;
  configJson: Prisma.JsonValue;
  secretRef: string | null;
  status: string;
}) {
  const config =
    connection.configJson && typeof connection.configJson === "object"
      ? { ...(connection.configJson as Record<string, unknown>) }
      : {};
  delete config.secret;
  delete config.apiKey;
  delete config.password;
  return {
    id: connection.id,
    companyId: connection.companyId,
    adapterKey: connection.adapterKey,
    name: connection.name,
    config,
    secretRef: connection.secretRef ? "[redacted]" : null,
    status: connection.status,
  };
}

export function createIntegrationService(client = getPrismaClient()) {
  async function resolveCompanyId(employeeId: string): Promise<string> {
    const employee = await client.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      throw DomainError.notFound("Employe introuvable.");
    }
    return employee.companyId;
  }

  async function createConnection(
    companyId: string,
    input: { adapterKey: string; name: string; configJson?: Record<string, unknown>; secretRef?: string },
  ) {
    const created = await client.integrationConnection.create({
      data: {
        companyId,
        adapterKey: input.adapterKey,
        name: input.name,
        configJson: toInputJson(input.configJson ?? {}),
        secretRef: input.secretRef ?? null,
      },
    });
    return sanitizeConnectionView(created);
  }

  async function listConnections(companyId: string) {
    const rows = await client.integrationConnection.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(sanitizeConnectionView);
  }

  return {
    async createConnectionForEmployee(
      employeeId: string,
      input: { adapterKey: string; name: string; configJson?: Record<string, unknown>; secretRef?: string },
    ) {
      const companyId = await resolveCompanyId(employeeId);
      return createConnection(companyId, input);
    },

    async listConnectionsForEmployee(employeeId: string) {
      const companyId = await resolveCompanyId(employeeId);
      return listConnections(companyId);
    },

    createConnection,
    listConnections,

    async runJob(
      connectionId: string,
      idempotencyKey: string,
      retry = false,
    ): Promise<ResultType<Record<string, unknown>>> {
      const existing = await client.integrationRun.findUnique({ where: { idempotencyKey } });
      if (existing) {
        return Result.ok({
          idempotent: true,
          runId: existing.id,
          status: existing.status,
          retryCount: existing.retryCount,
          result: existing.resultJson,
        });
      }

      const connection = await client.integrationConnection.findUnique({ where: { id: connectionId } });
      if (!connection) {
        return Result.fail(DomainError.notFound("Connexion d integration introuvable."));
      }

      const run = await client.integrationRun.create({
        data: {
          connectionId,
          idempotencyKey,
          status: "running",
          retryCount: retry ? 1 : 0,
        },
      });

      await client.integrationEvent.create({
        data: {
          runId: run.id,
          eventType: "job.started",
          payloadJson: toInputJson({ adapterKey: connection.adapterKey }),
        },
      });

      const result = {
        processed: 3,
        adapterKey: connection.adapterKey,
        mock: true,
      };

      const completed = await client.integrationRun.update({
        where: { id: run.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          resultJson: toInputJson(result),
        },
      });

      await client.integrationEvent.create({
        data: {
          runId: run.id,
          eventType: "job.completed",
          payloadJson: toInputJson(result),
        },
      });

      return Result.ok({
        idempotent: false,
        runId: completed.id,
        status: completed.status,
        retryCount: completed.retryCount,
        result,
      });
    },

    async listRuns(connectionId: string) {
      const runs = await client.integrationRun.findMany({
        where: { connectionId },
        orderBy: { startedAt: "desc" },
        take: 50,
      });
      return runs.map((run) => ({
        id: run.id,
        status: run.status,
        retryCount: run.retryCount,
        startedAt: run.startedAt.toISOString(),
        completedAt: run.completedAt?.toISOString() ?? null,
        result: run.resultJson,
      }));
    },
  };
}

export type IntegrationService = ReturnType<typeof createIntegrationService>;
