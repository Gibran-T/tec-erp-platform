import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

import {
  assertStatusTransitionAllowed,
  computeQualityScore,
  detectSoftDuplicate,
  isMasterDataEntityType,
  normalizeBusinessKey,
  validateMasterDataRecord,
  type MasterDataValidationResult,
} from "./master-data.validation.js";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function asPayloadJson(value: Prisma.JsonValue): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export interface MasterDataRecordView {
  readonly id: string;
  readonly entityType: string;
  readonly businessKey: string;
  readonly payloadJson: Record<string, unknown>;
  readonly status: string;
  readonly qualityScore: number | null;
  readonly updatedAt: string;
}

export interface MasterDataUpsertInput {
  readonly entityType: string;
  readonly businessKey: string;
  readonly payloadJson: Record<string, unknown>;
  readonly status?: string;
}

export interface MasterDataListQuery {
  readonly entityType?: string;
}

export function createMasterDataService(client = getPrismaClient()) {
  async function resolveCompanyId(employeeId: string): Promise<ResultType<string>> {
    const employee = await client.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      return Result.fail(DomainError.notFound("Employe introuvable."));
    }
    return Result.ok(employee.companyId);
  }

  async function listCompanyRecords(companyId: string, query: MasterDataListQuery) {
    return client.masterDataRecord.findMany({
      where: {
        companyId,
        ...(query.entityType ? { entityType: query.entityType } : {}),
      },
      orderBy: [{ entityType: "asc" }, { businessKey: "asc" }],
    });
  }

  function mapRecord(record: {
    id: string;
    entityType: string;
    businessKey: string;
    payloadJson: Prisma.JsonValue;
    status: string;
    qualityScore: number | null;
    updatedAt: Date;
  }): MasterDataRecordView {
    return {
      id: record.id,
      entityType: record.entityType,
      businessKey: record.businessKey,
      payloadJson: asPayloadJson(record.payloadJson),
      status: record.status,
      qualityScore: record.qualityScore,
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  return {
    async list(
      employeeId: string,
      query: MasterDataListQuery = {},
    ): Promise<ResultType<{ records: MasterDataRecordView[] }>> {
      const companyOutcome = await resolveCompanyId(employeeId);
      if (Result.isFail(companyOutcome)) {
        return companyOutcome;
      }
      const records = await listCompanyRecords(companyOutcome.value, query);
      return Result.ok({ records: records.map(mapRecord) });
    },

    validate(input: MasterDataUpsertInput): MasterDataValidationResult {
      return validateMasterDataRecord(input);
    },

    async upsert(
      employeeId: string,
      input: MasterDataUpsertInput,
    ): Promise<ResultType<MasterDataRecordView>> {
      if (!isMasterDataEntityType(input.entityType)) {
        return Result.fail(DomainError.validation("Type d'entite master data non supporte."));
      }

      const companyOutcome = await resolveCompanyId(employeeId);
      if (Result.isFail(companyOutcome)) {
        return companyOutcome;
      }
      const companyId = companyOutcome.value;
      const businessKey = normalizeBusinessKey(input.businessKey);
      const nextStatus =
        input.status ??
        (typeof input.payloadJson.status === "string" ? input.payloadJson.status : "active");

      const validation = validateMasterDataRecord({
        entityType: input.entityType,
        businessKey,
        payloadJson: input.payloadJson,
        status: nextStatus,
      });

      const { qualityScore, missingFields } = computeQualityScore(
        input.entityType,
        input.payloadJson,
      );

      const existingRecords = await listCompanyRecords(companyId, {
        entityType: input.entityType,
      });
      const existing = existingRecords.find(
        (record) => normalizeBusinessKey(record.businessKey) === businessKey,
      );

      const transitionIssue = assertStatusTransitionAllowed({
        currentStatus: existing?.status ?? null,
        nextStatus,
        qualityScore,
        missingFields,
      });
      if (transitionIssue) {
        return Result.fail(DomainError.conflict(transitionIssue));
      }

      const softDuplicate = detectSoftDuplicate(
        input.entityType,
        input.payloadJson,
        existingRecords.map((record) => ({
          businessKey: record.businessKey,
          payloadJson: asPayloadJson(record.payloadJson),
        })),
        businessKey,
      );
      if (softDuplicate) {
        return Result.fail(
          DomainError.conflict(
            `Doublon detecte: un enregistrement similaire existe deja (${softDuplicate}).`,
          ),
        );
      }

      if (!validation.valid && nextStatus === "active") {
        return Result.fail(
          DomainError.validation(validation.issues.join(" ") || "Fiche master data invalide."),
        );
      }

      const payloadWithStatus = {
        ...input.payloadJson,
        status: nextStatus,
      };

      if (existing) {
        const updated = await client.$transaction(async (tx) => {
          const saved = await tx.masterDataRecord.update({
            where: { id: existing.id },
            data: {
              payloadJson: toInputJson(payloadWithStatus),
              status: nextStatus,
              qualityScore,
            },
          });
          await tx.masterDataAudit.create({
            data: {
              recordId: saved.id,
              employeeId,
              action: "update",
              beforeJson: toInputJson({
                businessKey: existing.businessKey,
                status: existing.status,
                payloadJson: asPayloadJson(existing.payloadJson),
                qualityScore: existing.qualityScore,
              }),
              afterJson: toInputJson({
                businessKey: saved.businessKey,
                status: saved.status,
                payloadJson: payloadWithStatus,
                qualityScore,
              }),
            },
          });
          return saved;
        });
        return Result.ok(mapRecord(updated));
      }

      try {
        const created = await client.$transaction(async (tx) => {
          const saved = await tx.masterDataRecord.create({
            data: {
              companyId,
              entityType: input.entityType,
              businessKey,
              payloadJson: toInputJson(payloadWithStatus),
              status: nextStatus,
              qualityScore,
            },
          });
          await tx.masterDataAudit.create({
            data: {
              recordId: saved.id,
              employeeId,
              action: "create",
              beforeJson: undefined,
              afterJson: toInputJson({
                businessKey: saved.businessKey,
                status: saved.status,
                payloadJson: payloadWithStatus,
                qualityScore,
              }),
            },
          });
          return saved;
        });
        return Result.ok(mapRecord(created));
      } catch {
        return Result.fail(
          DomainError.conflict("Enregistrement master data deja existant pour cette cle metier."),
        );
      }
    },
  };
}

export type MasterDataService = ReturnType<typeof createMasterDataService>;
