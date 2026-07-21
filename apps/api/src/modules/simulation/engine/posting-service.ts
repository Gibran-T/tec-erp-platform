import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export interface CreateDocumentInput {
  readonly companyId: string;
  readonly employeeId?: string;
  readonly documentType: string;
  readonly documentNumber: string;
  readonly status: string;
  readonly payloadJson: Record<string, unknown>;
  readonly missionKey?: string;
  readonly missionAttemptId?: string;
}

export interface InventoryMovementInput {
  readonly companyId: string;
  readonly materialKey: string;
  readonly locationKey: string;
  readonly quantity: number;
  readonly direction: "in" | "out" | "transfer";
  readonly sourceDocumentId?: string;
  readonly missionAttemptId?: string;
  readonly postingKey: string;
}

export interface FinancialPostingInput {
  readonly companyId: string;
  readonly accountCode: string;
  readonly debit: number;
  readonly credit: number;
  readonly currency?: string;
  readonly sourceDocumentId?: string;
  readonly missionAttemptId?: string;
  readonly postingKey: string;
}

export interface AuditEventInput {
  readonly companyId: string;
  readonly actorEmployeeId: string;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceKey: string;
  readonly reason?: string;
  readonly payloadJson?: Record<string, unknown>;
}

export function createSimulationPostingService(client = getPrismaClient()) {
  return {
    async createBusinessDocument(input: CreateDocumentInput): Promise<ResultType<{ id: string }>> {
      try {
        const created = await client.businessDocument.create({
          data: {
            companyId: input.companyId,
            employeeId: input.employeeId,
            documentType: input.documentType,
            documentNumber: input.documentNumber,
            status: input.status,
            payloadJson: toInputJson(input.payloadJson),
            missionKey: input.missionKey,
            missionAttemptId: input.missionAttemptId,
          },
        });
        return Result.ok({ id: created.id });
      } catch {
        return Result.fail(
          DomainError.conflict("Ce document metier existe deja pour l'entreprise."),
        );
      }
    },

    async createInventoryMovement(
      input: InventoryMovementInput,
    ): Promise<ResultType<{ id: string }>> {
      if (input.quantity <= 0) {
        return Result.fail(DomainError.validation("La quantite de mouvement doit etre positive."));
      }
      try {
        const created = await client.inventoryMovement.create({
          data: {
            companyId: input.companyId,
            materialKey: input.materialKey,
            locationKey: input.locationKey,
            quantity: input.quantity,
            direction: input.direction,
            sourceDocumentId: input.sourceDocumentId,
            missionAttemptId: input.missionAttemptId,
            postingKey: input.postingKey,
          },
        });
        return Result.ok({ id: created.id });
      } catch {
        return Result.fail(
          DomainError.conflict("Mouvement d'inventaire en double refuse (idempotence)."),
        );
      }
    },

    async createFinancialPosting(
      input: FinancialPostingInput,
    ): Promise<ResultType<{ id: string }>> {
      if (input.debit < 0 || input.credit < 0) {
        return Result.fail(DomainError.validation("Debit/credit ne peuvent pas etre negatifs."));
      }
      try {
        const created = await client.financialPosting.create({
          data: {
            companyId: input.companyId,
            accountCode: input.accountCode,
            debit: input.debit,
            credit: input.credit,
            currency: input.currency ?? "CAD",
            sourceDocumentId: input.sourceDocumentId,
            missionAttemptId: input.missionAttemptId,
            postingKey: input.postingKey,
          },
        });
        return Result.ok({ id: created.id });
      } catch {
        return Result.fail(
          DomainError.conflict("Ecriture financiere en double refusee (idempotence)."),
        );
      }
    },

    async appendAuditEvent(input: AuditEventInput): Promise<ResultType<{ id: string }>> {
      const created = await client.auditEvent.create({
        data: {
          companyId: input.companyId,
          actorEmployeeId: input.actorEmployeeId,
          action: input.action,
          resourceType: input.resourceType,
          resourceKey: input.resourceKey,
          reason: input.reason,
          payloadJson: input.payloadJson === undefined ? undefined : toInputJson(input.payloadJson),
        },
      });
      return Result.ok({ id: created.id });
    },

    async appendTransactionEvent(input: {
      readonly companyId: string;
      readonly employeeId?: string;
      readonly eventType: string;
      readonly payloadJson: Record<string, unknown>;
    }): Promise<ResultType<{ id: string; sequence: number }>> {
      const latest = await client.transactionEvent.findFirst({
        where: { companyId: input.companyId },
        orderBy: { sequence: "desc" },
      });
      const sequence = (latest?.sequence ?? 0) + 1;
      const created = await client.transactionEvent.create({
        data: {
          companyId: input.companyId,
          employeeId: input.employeeId,
          eventType: input.eventType,
          payloadJson: toInputJson(input.payloadJson),
          sequence,
        },
      });
      return Result.ok({ id: created.id, sequence: created.sequence });
    },

    async stockOnHand(
      companyId: string,
      materialKey: string,
      locationKey: string,
    ): Promise<number> {
      const movements = await client.inventoryMovement.findMany({
        where: { companyId, materialKey, locationKey },
      });
      return movements.reduce((total, movement) => {
        if (movement.direction === "out") {
          return total - movement.quantity;
        }
        return total + movement.quantity;
      }, 0);
    },
  };
}

export type SimulationPostingService = ReturnType<typeof createSimulationPostingService>;
