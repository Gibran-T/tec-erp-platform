import type { SimulationPostingService } from "./engine/posting-service.js";

/**
 * Applies deterministic cross-module consequences after successful mission completion.
 * Idempotent via postingKey uniqueness.
 */
export async function applyMissionTransactionConsequences(input: {
  readonly posting: SimulationPostingService;
  readonly companyId: string;
  readonly employeeId: string;
  readonly missionKey: string;
  readonly attemptId: string;
}): Promise<void> {
  const base = `${input.employeeId}:${input.missionKey}:${input.attemptId}`;

  if (input.missionKey === "m3-m03-receptionner-analyser-fournisseur") {
    const document = await input.posting.createBusinessDocument({
      companyId: input.companyId,
      employeeId: input.employeeId,
      documentType: "goods_receipt",
      documentNumber: `GR-${input.attemptId.slice(-8)}`,
      status: "posted",
      payloadJson: { poNumber: "PO-88421", qty: 36, materialKey: "SKU-HVAC-4421" },
      missionKey: input.missionKey,
      missionAttemptId: input.attemptId,
    });
    if (!document.ok) {
      return;
    }
    await input.posting.createInventoryMovement({
      companyId: input.companyId,
      materialKey: "SKU-HVAC-4421",
      locationKey: "DC-MTL",
      quantity: 36,
      direction: "in",
      sourceDocumentId: document.value.id,
      missionAttemptId: input.attemptId,
      postingKey: `${base}:inv-in`,
    });
    await input.posting.appendTransactionEvent({
      companyId: input.companyId,
      employeeId: input.employeeId,
      eventType: "p2p.goods_receipt.posted",
      payloadJson: { qty: 36, locationKey: "DC-MTL" },
    });
  }

  if (input.missionKey === "m4-m03-confirmer-livraison-cloture") {
    const document = await input.posting.createBusinessDocument({
      companyId: input.companyId,
      employeeId: input.employeeId,
      documentType: "delivery",
      documentNumber: `DN-${input.attemptId.slice(-8)}`,
      status: "posted",
      payloadJson: { customer: "SACRE-COEUR", qty: 20, materialKey: "SKU-HVAC-4421" },
      missionKey: input.missionKey,
      missionAttemptId: input.attemptId,
    });
    if (!document.ok) {
      return;
    }
    await input.posting.createInventoryMovement({
      companyId: input.companyId,
      materialKey: "SKU-HVAC-4421",
      locationKey: "DC-TRT",
      quantity: 20,
      direction: "out",
      sourceDocumentId: document.value.id,
      missionAttemptId: input.attemptId,
      postingKey: `${base}:inv-out`,
    });
    await input.posting.createFinancialPosting({
      companyId: input.companyId,
      accountCode: "4000-REVENUE",
      debit: 0,
      credit: 10000,
      sourceDocumentId: document.value.id,
      missionAttemptId: input.attemptId,
      postingKey: `${base}:fin-rev`,
    });
    await input.posting.createFinancialPosting({
      companyId: input.companyId,
      accountCode: "1100-AR",
      debit: 10000,
      credit: 0,
      sourceDocumentId: document.value.id,
      missionAttemptId: input.attemptId,
      postingKey: `${base}:fin-ar`,
    });
  }

  if (input.missionKey === "m6-m02-exception-rapprochement-trois-voies") {
    const document = await input.posting.createBusinessDocument({
      companyId: input.companyId,
      employeeId: input.employeeId,
      documentType: "supplier_invoice",
      documentNumber: `INV-${input.attemptId.slice(-8)}`,
      status: "matched",
      payloadJson: { poNumber: "PO-88421", qty: 36, variance: 4 },
      missionKey: input.missionKey,
      missionAttemptId: input.attemptId,
    });
    if (!document.ok) {
      return;
    }
    await input.posting.createFinancialPosting({
      companyId: input.companyId,
      accountCode: "2000-AP",
      debit: 0,
      credit: 4500,
      sourceDocumentId: document.value.id,
      missionAttemptId: input.attemptId,
      postingKey: `${base}:fin-ap`,
    });
    await input.posting.createFinancialPosting({
      companyId: input.companyId,
      accountCode: "1400-INVENTORY",
      debit: 4500,
      credit: 0,
      sourceDocumentId: document.value.id,
      missionAttemptId: input.attemptId,
      postingKey: `${base}:fin-inv`,
    });
  }
}
