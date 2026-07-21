import { describe, expect, it, vi } from "vitest";
import { DomainError, Result } from "@tec-platform/core";

import { createTransactionsService } from "../transactions.service.js";

function buildMockClient(overrides: Record<string, unknown> = {}) {
  return {
    employee: {
      findUnique: vi.fn().mockResolvedValue({ id: "emp_1", companyId: "co_1" }),
    },
    masterDataRecord: {
      findFirst: vi.fn(),
    },
    businessDocument: {
      findFirst: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn(),
    },
    documentLine: { create: vi.fn() },
    approvalDecision: { create: vi.fn() },
    inventoryMovement: { findMany: vi.fn().mockResolvedValue([]) },
    financialPosting: { findMany: vi.fn().mockResolvedValue([]) },
    openItem: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    transactionEvent: { findMany: vi.fn().mockResolvedValue([]) },
    ...overrides,
  } as never;
}

function buildMockPosting(
  overrides: Partial<{
    createBusinessDocument: ReturnType<typeof vi.fn>;
    createInventoryMovement: ReturnType<typeof vi.fn>;
    createFinancialPosting: ReturnType<typeof vi.fn>;
    appendAuditEvent: ReturnType<typeof vi.fn>;
    appendTransactionEvent: ReturnType<typeof vi.fn>;
    stockOnHand: ReturnType<typeof vi.fn>;
  }> = {},
) {
  return {
    createBusinessDocument: vi.fn().mockResolvedValue(Result.ok({ id: "doc_1" })),
    createInventoryMovement: vi.fn().mockResolvedValue(Result.ok({ id: "mov_1" })),
    createFinancialPosting: vi.fn().mockResolvedValue(Result.ok({ id: "fin_1" })),
    appendAuditEvent: vi.fn().mockResolvedValue(Result.ok({ id: "audit_1" })),
    appendTransactionEvent: vi.fn().mockResolvedValue(Result.ok({ id: "evt_1", sequence: 1 })),
    stockOnHand: vi.fn().mockResolvedValue(10),
    ...overrides,
  };
}

describe("transactions service guardrails", () => {
  it("rejects PO creation when supplier is blocked", async () => {
    const client = buildMockClient({
      masterDataRecord: {
        findFirst: vi.fn().mockResolvedValue({
          businessKey: "THERMOCONTROL",
          payloadJson: { status: "blocked", name: "ThermoControl" },
        }),
      },
    });
    const posting = buildMockPosting();
    const service = createTransactionsService(client, () => posting);

    const result = await service.executeAction("emp_1", "p2p.create_po", {
      supplierKey: "THERMOCONTROL",
      materialKey: "SKU-HVAC-4421",
      quantity: 40,
    });

    expect(Result.isFail(result)).toBe(true);
    if (Result.isFail(result)) {
      expect(result.error.code).toBe("CONFLICT");
      expect(result.error.message).toMatch(/fournisseur est bloque/i);
    }
    expect(posting.createBusinessDocument).not.toHaveBeenCalled();
  });

  it("rejects sales order when customer credit is blocked", async () => {
    const client = buildMockClient({
      masterDataRecord: {
        findFirst: vi.fn().mockResolvedValue({
          businessKey: "SACRE-COEUR",
          payloadJson: { status: "active", creditBlocked: true, creditLimit: 50000 },
        }),
      },
    });
    const posting = buildMockPosting();
    const service = createTransactionsService(client, () => posting);

    const result = await service.executeAction("emp_1", "o2c.create_sales_order", {
      customerKey: "SACRE-COEUR",
      materialKey: "SKU-HVAC-4421",
      locationKey: "DC-TRT",
      quantity: 10,
      unitPrice: 1250,
    });

    expect(Result.isFail(result)).toBe(true);
    if (Result.isFail(result)) {
      expect(result.error.code).toBe("CONFLICT");
      expect(result.error.message).toMatch(/credit client est bloque/i);
    }
  });

  it("rejects delivery when stock would go negative", async () => {
    const client = buildMockClient({
      businessDocument: {
        findFirst: vi.fn().mockResolvedValue({
          id: "so_1",
          companyId: "co_1",
          documentNumber: "SO-001",
          payloadJson: {},
          lines: [],
          approvals: [],
        }),
        findMany: vi.fn().mockResolvedValue([]),
        update: vi.fn(),
      },
    });
    const posting = buildMockPosting({
      stockOnHand: vi.fn().mockResolvedValue(5),
    });
    const service = createTransactionsService(client, () => posting);

    const result = await service.executeAction("emp_1", "o2c.deliver", {
      salesOrderDocumentId: "so_1",
      materialKey: "SKU-HVAC-4421",
      locationKey: "DC-TRT",
      quantity: 12,
      postingKey: "emp_1:deliver:001",
    });

    expect(Result.isFail(result)).toBe(true);
    if (Result.isFail(result)) {
      expect(result.error.code).toBe("CONFLICT");
      expect(result.error.message).toMatch(/stock insuffisant/i);
    }
    expect(posting.createInventoryMovement).not.toHaveBeenCalled();
  });

  it("returns conflict for duplicate goods receipt postingKey (idempotence)", async () => {
    const client = buildMockClient({
      businessDocument: {
        findFirst: vi.fn().mockResolvedValue({
          id: "po_1",
          companyId: "co_1",
          documentNumber: "PO-001",
          payloadJson: { quantity: 40 },
          lines: [],
          approvals: [],
        }),
        findMany: vi.fn().mockResolvedValue([]),
        update: vi.fn(),
      },
    });
    const posting = buildMockPosting({
      createInventoryMovement: vi.fn().mockResolvedValue(
        Result.fail(
          DomainError.conflict("Mouvement d'inventaire en double refuse (idempotence)."),
        ),
      ),
    });
    const service = createTransactionsService(client, () => posting);

    const result = await service.executeAction("emp_1", "p2p.goods_receipt", {
      poDocumentId: "po_1",
      materialKey: "SKU-HVAC-4421",
      locationKey: "DC-MTL",
      quantity: 36,
      postingKey: "emp_1:gr:duplicate",
    });

    expect(Result.isFail(result)).toBe(true);
    if (Result.isFail(result)) {
      expect(result.error.code).toBe("CONFLICT");
      expect(result.error.message).toMatch(/idempotence/i);
    }
  });
});
