import { describe, expect, it, vi } from "vitest";
import { Result } from "@tec-platform/core";

import { applyMissionTransactionConsequences } from "../consequences.js";
import type { SimulationPostingService } from "../engine/posting-service.js";

function createPostingMock(): SimulationPostingService {
  return {
    createBusinessDocument: vi.fn().mockResolvedValue(Result.ok({ id: "doc_1" })),
    createInventoryMovement: vi.fn().mockResolvedValue(Result.ok({ id: "inv_1" })),
    createFinancialPosting: vi.fn().mockResolvedValue(Result.ok({ id: "fin_1" })),
    appendAuditEvent: vi.fn().mockResolvedValue(Result.ok({ id: "audit_1" })),
    appendTransactionEvent: vi.fn().mockResolvedValue(Result.ok({ id: "evt_1", sequence: 1 })),
    stockOnHand: vi.fn().mockResolvedValue(0),
  };
}

describe("applyMissionTransactionConsequences", () => {
  it("posts goods receipt and inventory in for m3-m03", async () => {
    const posting = createPostingMock();
    const attemptId = "attempt_12345678";

    await applyMissionTransactionConsequences({
      posting,
      companyId: "co_1",
      employeeId: "emp_1",
      missionKey: "m3-m03-receptionner-analyser-fournisseur",
      attemptId,
    });

    expect(posting.createBusinessDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        documentType: "goods_receipt",
        missionKey: "m3-m03-receptionner-analyser-fournisseur",
      }),
    );
    expect(posting.createInventoryMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        postingKey: `emp_1:m3-m03-receptionner-analyser-fournisseur:${attemptId}:inv-in`,
        direction: "in",
        quantity: 36,
      }),
    );
    expect(posting.appendTransactionEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: "p2p.goods_receipt.posted",
      }),
    );
  });

  it("posts delivery, inventory out, and finance entries for m4-m03", async () => {
    const posting = createPostingMock();
    const attemptId = "attempt_abcd1234";

    await applyMissionTransactionConsequences({
      posting,
      companyId: "co_1",
      employeeId: "emp_2",
      missionKey: "m4-m03-confirmer-livraison-cloture",
      attemptId,
    });

    expect(posting.createInventoryMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        postingKey: `emp_2:m4-m03-confirmer-livraison-cloture:${attemptId}:inv-out`,
        direction: "out",
      }),
    );
    expect(posting.createFinancialPosting).toHaveBeenCalledWith(
      expect.objectContaining({
        postingKey: `emp_2:m4-m03-confirmer-livraison-cloture:${attemptId}:fin-rev`,
        accountCode: "4000-REVENUE",
      }),
    );
    expect(posting.createFinancialPosting).toHaveBeenCalledWith(
      expect.objectContaining({
        postingKey: `emp_2:m4-m03-confirmer-livraison-cloture:${attemptId}:fin-ar`,
        accountCode: "1100-AR",
      }),
    );
  });

  it("posts AP and inventory finance entries for m6-m02", async () => {
    const posting = createPostingMock();
    const attemptId = "attempt_finance01";

    await applyMissionTransactionConsequences({
      posting,
      companyId: "co_1",
      employeeId: "emp_3",
      missionKey: "m6-m02-exception-rapprochement-trois-voies",
      attemptId,
    });

    expect(posting.createFinancialPosting).toHaveBeenCalledWith(
      expect.objectContaining({
        postingKey: `emp_3:m6-m02-exception-rapprochement-trois-voies:${attemptId}:fin-ap`,
        accountCode: "2000-AP",
      }),
    );
    expect(posting.createFinancialPosting).toHaveBeenCalledWith(
      expect.objectContaining({
        postingKey: `emp_3:m6-m02-exception-rapprochement-trois-voies:${attemptId}:fin-inv`,
        accountCode: "1400-INVENTORY",
      }),
    );
  });
});
