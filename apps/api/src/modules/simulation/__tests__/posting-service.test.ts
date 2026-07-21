import { describe, expect, it, vi } from "vitest";
import { DomainError, Result } from "@tec-platform/core";

import { createSimulationPostingService } from "../engine/posting-service.js";

describe("simulation posting service", () => {
  it("rejects non-positive inventory quantities before persistence", async () => {
    const create = vi.fn();
    const service = createSimulationPostingService({
      inventoryMovement: { create },
    } as never);

    const result = await service.createInventoryMovement({
      companyId: "co_1",
      materialKey: "SKU-HVAC-4421",
      locationKey: "DC-MTL",
      quantity: 0,
      direction: "in",
      postingKey: "emp_1:m3:attempt:inv-in",
    });

    expect(Result.isFail(result)).toBe(true);
    if (Result.isFail(result)) {
      expect(result.error.code).toBe("VALIDATION");
      expect(result.error.message).toMatch(/positive/i);
    }
    expect(create).not.toHaveBeenCalled();
  });

  it("returns conflict when inventory movement persistence fails", async () => {
    const service = createSimulationPostingService({
      inventoryMovement: {
        create: vi.fn().mockRejectedValue(new Error("unique violation")),
      },
    } as never);

    const result = await service.createInventoryMovement({
      companyId: "co_1",
      materialKey: "SKU-HVAC-4421",
      locationKey: "DC-MTL",
      quantity: 12,
      direction: "in",
      postingKey: "emp_1:m3:attempt:inv-in",
    });

    expect(Result.isFail(result)).toBe(true);
    if (Result.isFail(result)) {
      expect(result.error.code).toBe("CONFLICT");
      expect(result.error.message).toMatch(/double refuse/i);
    }
  });

  it("returns conflict when business document persistence fails", async () => {
    const service = createSimulationPostingService({
      businessDocument: {
        create: vi.fn().mockRejectedValue(new Error("unique violation")),
      },
    } as never);

    const result = await service.createBusinessDocument({
      companyId: "co_1",
      documentType: "goods_receipt",
      documentNumber: "GR-12345678",
      status: "posted",
      payloadJson: { qty: 36 },
    });

    expect(Result.isFail(result)).toBe(true);
    if (Result.isFail(result)) {
      expect(result.error.code).toBe("CONFLICT");
      expect(result.error.message).toMatch(/document metier existe deja/i);
    }
  });

  it("defines conflict semantics for duplicate postings", () => {
    const error = DomainError.conflict("Mouvement d'inventaire en double refuse (idempotence).");
    expect(error.code).toBe("CONFLICT");
    expect(Result.isFail(Result.fail(error))).toBe(true);
  });
});
