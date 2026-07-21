import { DomainError, Result, type ResultType } from "@tec-platform/core";
import { getPrismaClient, type Prisma } from "@tec-platform/database-erp";

import {
  createSimulationPostingService,
  type SimulationPostingService,
} from "../simulation/engine/posting-service.js";
import type { TransactionAction } from "./transactions.validation.js";

const VALID_LOCATIONS = ["DC-MTL", "DC-TRT"] as const;
const APPROVAL_LIMIT_CAD = 5000;
const DEFAULT_CREDIT_LIMIT_CAD = 100_000;

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function asPayloadJson(value: Prisma.JsonValue): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function nextDocumentNumber(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function isLocationValid(locationKey: string): boolean {
  return (VALID_LOCATIONS as readonly string[]).includes(locationKey);
}

function isSupplierBlocked(payload: Record<string, unknown>): boolean {
  const status = payload.status ?? payload.supplierStatus;
  return status === "blocked";
}

function isCustomerCreditBlocked(payload: Record<string, unknown>): boolean {
  return payload.creditBlocked === true;
}

function summarizePayload(payload: Record<string, unknown>): Record<string, unknown> {
  const summary: Record<string, unknown> = {};
  for (const key of [
    "supplierKey",
    "customerKey",
    "materialKey",
    "locationKey",
    "quantity",
    "amount",
    "poNumber",
    "status",
  ]) {
    if (payload[key] !== undefined) {
      summary[key] = payload[key];
    }
  }
  return summary;
}

export interface DocumentListItem {
  readonly id: string;
  readonly documentType: string;
  readonly documentNumber: string;
  readonly status: string;
  readonly missionKey: string | null;
  readonly createdAt: string;
  readonly payloadSummary: Record<string, unknown>;
}

export interface DocumentDetail extends DocumentListItem {
  readonly payloadJson: Record<string, unknown>;
  readonly lines: Array<{
    readonly id: string;
    readonly lineNumber: number;
    readonly payloadJson: Record<string, unknown>;
  }>;
  readonly approvals: Array<{
    readonly id: string;
    readonly employeeId: string;
    readonly decision: string;
    readonly reason: string | null;
    readonly decidedAt: string;
  }>;
  readonly timeline: Array<{
    readonly id: string;
    readonly eventType: string;
    readonly sequence: number;
    readonly createdAt: string;
    readonly payloadJson: Record<string, unknown>;
  }>;
}

export interface InventoryStockRow {
  readonly materialKey: string;
  readonly locationKey: string;
  readonly quantityOnHand: number;
}

export interface InventoryMovementView {
  readonly id: string;
  readonly materialKey: string;
  readonly locationKey: string;
  readonly quantity: number;
  readonly direction: string;
  readonly sourceDocumentId: string | null;
  readonly createdAt: string;
}

export interface FinanceView {
  readonly postings: Array<{
    readonly id: string;
    readonly accountCode: string;
    readonly debit: number;
    readonly credit: number;
    readonly sourceDocumentId: string | null;
    readonly createdAt: string;
  }>;
  readonly openItems: Array<{
    readonly id: string;
    readonly kind: string;
    readonly documentId: string;
    readonly amount: number;
    readonly openAmount: number;
    readonly status: string;
  }>;
  readonly trialBalance: Array<{
    readonly accountCode: string;
    readonly totalDebit: number;
    readonly totalCredit: number;
  }>;
}

export function createTransactionsService(
  client = getPrismaClient(),
  postingFactory: (db: typeof client) => SimulationPostingService = createSimulationPostingService,
) {
  const posting = postingFactory(client);

  async function resolveCompanyId(employeeId: string): Promise<ResultType<string>> {
    const employee = await client.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      return Result.fail(DomainError.notFound("Employe introuvable."));
    }
    return Result.ok(employee.companyId);
  }

  async function resolveCompanyContext(employeeId: string) {
    const companyOutcome = await resolveCompanyId(employeeId);
    if (Result.isFail(companyOutcome)) {
      return companyOutcome;
    }
    return Result.ok({ companyId: companyOutcome.value, employeeId });
  }

  async function findMasterData(
    companyId: string,
    entityType: "supplier" | "customer",
    businessKey: string,
  ) {
    return client.masterDataRecord.findFirst({
      where: { companyId, entityType, businessKey: businessKey.toUpperCase() },
    });
  }

  async function getDocumentForCompany(companyId: string, documentId: string) {
    return client.businessDocument.findFirst({
      where: { id: documentId, companyId },
      include: { lines: { orderBy: { lineNumber: "asc" } }, approvals: true },
    });
  }

  async function recordActionTrail(input: {
    readonly companyId: string;
    readonly employeeId: string;
    readonly action: string;
    readonly resourceKey: string;
    readonly payloadJson: Record<string, unknown>;
    readonly reason?: string;
  }): Promise<void> {
    await posting.appendTransactionEvent({
      companyId: input.companyId,
      employeeId: input.employeeId,
      eventType: input.action,
      payloadJson: input.payloadJson,
    });
    await posting.appendAuditEvent({
      companyId: input.companyId,
      actorEmployeeId: input.employeeId,
      action: input.action,
      resourceType: "transaction_action",
      resourceKey: input.resourceKey,
      reason: input.reason,
      payloadJson: input.payloadJson,
    });
  }

  async function sumCustomerOpenAr(companyId: string, customerKey: string): Promise<number> {
    const openItems = await client.openItem.findMany({
      where: { companyId, kind: "AR", status: "open" },
      include: { document: true },
    });
    return openItems.reduce((total, item) => {
      const payload = asPayloadJson(item.document.payloadJson);
      if (readString(payload.customerKey)?.toUpperCase() === customerKey.toUpperCase()) {
        return total + item.openAmount;
      }
      return total;
    }, 0);
  }

  function mapDocument(document: {
    id: string;
    documentType: string;
    documentNumber: string;
    status: string;
    missionKey: string | null;
    createdAt: Date;
    payloadJson: Prisma.JsonValue;
  }): DocumentListItem {
    const payload = asPayloadJson(document.payloadJson);
    return {
      id: document.id,
      documentType: document.documentType,
      documentNumber: document.documentNumber,
      status: document.status,
      missionKey: document.missionKey,
      createdAt: document.createdAt.toISOString(),
      payloadSummary: summarizePayload(payload),
    };
  }

  async function executeP2pCreateRequisition(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ documentId: string; documentNumber: string }>> {
    const materialKey = readString(payload.materialKey);
    const quantity = readNumber(payload.quantity);
    if (!materialKey || quantity <= 0) {
      return Result.fail(DomainError.validation("Materiel et quantite positifs requis."));
    }
    const unitPrice = readNumber(payload.unitPrice, 125);
    const amount = quantity * unitPrice;
    const documentNumber = nextDocumentNumber("PR");
    const docResult = await posting.createBusinessDocument({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      documentType: "purchase_requisition",
      documentNumber,
      status: "pending_approval",
      payloadJson: {
        materialKey,
        quantity,
        unitPrice,
        amount,
        reason: readString(payload.reason),
      },
      missionKey: readString(payload.missionKey) ?? undefined,
    });
    if (Result.isFail(docResult)) {
      return docResult;
    }
    await client.documentLine.create({
      data: {
        documentId: docResult.value.id,
        lineNumber: 1,
        payloadJson: toInputJson({ materialKey, quantity, unitPrice, amount }),
      },
    });
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "p2p.create_requisition",
      resourceKey: docResult.value.id,
      payloadJson: { documentId: docResult.value.id, documentNumber, amount },
    });
    return Result.ok({ documentId: docResult.value.id, documentNumber });
  }

  async function executeP2pApprove(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ documentId: string; status: string }>> {
    const documentId = readString(payload.documentId);
    const decision = readString(payload.decision);
    if (!documentId || (decision !== "approve" && decision !== "reject")) {
      return Result.fail(DomainError.validation("Document et decision (approve/reject) requis."));
    }
    const document = await getDocumentForCompany(ctx.companyId, documentId);
    if (!document) {
      return Result.fail(DomainError.notFound("Document introuvable."));
    }
    const docPayload = asPayloadJson(document.payloadJson);
    const amount = readNumber(docPayload.amount);
    const isApprover = payload.isApprover === true;
    if (decision === "approve" && amount > APPROVAL_LIMIT_CAD && !isApprover) {
      return Result.fail(
        DomainError.forbidden(
          `Montant ${amount} CAD depasse la limite d'approbation (${APPROVAL_LIMIT_CAD} CAD) sans habilitation approbateur.`,
        ),
      );
    }
    const nextStatus = decision === "approve" ? "approved" : "rejected";
    await client.approvalDecision.create({
      data: {
        documentId: document.id,
        employeeId: ctx.employeeId,
        decision,
        reason: readString(payload.reason),
        decidedAt: new Date(),
      },
    });
    await client.businessDocument.update({
      where: { id: document.id },
      data: { status: nextStatus },
    });
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "p2p.approve",
      resourceKey: document.id,
      payloadJson: { documentId: document.id, decision, amount },
      reason: readString(payload.reason) ?? undefined,
    });
    return Result.ok({ documentId: document.id, status: nextStatus });
  }

  async function executeP2pCreatePo(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ documentId: string; documentNumber: string }>> {
    const supplierKey = readString(payload.supplierKey);
    const materialKey = readString(payload.materialKey);
    const quantity = readNumber(payload.quantity);
    if (!supplierKey || !materialKey || quantity <= 0) {
      return Result.fail(
        DomainError.validation("Fournisseur, materiel et quantite positifs requis."),
      );
    }
    const supplier = await findMasterData(ctx.companyId, "supplier", supplierKey);
    if (!supplier) {
      return Result.fail(DomainError.notFound("Fournisseur introuvable dans les donnees de reference."));
    }
    if (isSupplierBlocked(asPayloadJson(supplier.payloadJson))) {
      return Result.fail(
        DomainError.conflict(
          "Commande refusee : le fournisseur est bloque dans les donnees de reference.",
        ),
      );
    }
    const unitPrice = readNumber(payload.unitPrice, 125);
    const amount = quantity * unitPrice;
    const documentNumber = nextDocumentNumber("PO");
    const docResult = await posting.createBusinessDocument({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      documentType: "purchase_order",
      documentNumber,
      status: "approved",
      payloadJson: {
        supplierKey: supplierKey.toUpperCase(),
        materialKey,
        quantity,
        unitPrice,
        amount,
        requisitionId: readString(payload.requisitionId),
      },
    });
    if (Result.isFail(docResult)) {
      return docResult;
    }
    await client.documentLine.create({
      data: {
        documentId: docResult.value.id,
        lineNumber: 1,
        payloadJson: toInputJson({ materialKey, quantity, unitPrice, amount }),
      },
    });
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "p2p.create_po",
      resourceKey: docResult.value.id,
      payloadJson: { documentId: docResult.value.id, documentNumber, supplierKey },
    });
    return Result.ok({ documentId: docResult.value.id, documentNumber });
  }

  async function executeP2pGoodsReceipt(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ documentId: string; movementId: string }>> {
    const poDocumentId = readString(payload.poDocumentId);
    const materialKey = readString(payload.materialKey);
    const locationKey = readString(payload.locationKey);
    const quantity = readNumber(payload.quantity);
    const postingKey = readString(payload.postingKey);
    if (!poDocumentId || !materialKey || !locationKey || !postingKey) {
      return Result.fail(
        DomainError.validation("PO, materiel, entrepot et postingKey sont obligatoires."),
      );
    }
    if (!isLocationValid(locationKey)) {
      return Result.fail(DomainError.validation("Entrepot invalide (DC-MTL ou DC-TRT attendu)."));
    }
    const po = await getDocumentForCompany(ctx.companyId, poDocumentId);
    if (!po) {
      return Result.fail(DomainError.notFound("Commande fournisseur introuvable."));
    }
    const grNumber = nextDocumentNumber("GR");
    const docResult = await posting.createBusinessDocument({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      documentType: "goods_receipt",
      documentNumber: grNumber,
      status: "posted",
      payloadJson: {
        poDocumentId,
        poNumber: po.documentNumber,
        materialKey,
        locationKey,
        quantity,
      },
    });
    if (Result.isFail(docResult)) {
      return docResult;
    }
    const movementResult = await posting.createInventoryMovement({
      companyId: ctx.companyId,
      materialKey,
      locationKey,
      quantity,
      direction: "in",
      sourceDocumentId: docResult.value.id,
      postingKey,
    });
    if (Result.isFail(movementResult)) {
      return movementResult;
    }
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "p2p.goods_receipt",
      resourceKey: docResult.value.id,
      payloadJson: { documentId: docResult.value.id, postingKey, quantity, locationKey },
    });
    return Result.ok({ documentId: docResult.value.id, movementId: movementResult.value.id });
  }

  async function executeP2pPostInvoice(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ documentId: string; status: string }>> {
    const poDocumentId = readString(payload.poDocumentId);
    const quantity = readNumber(payload.quantity);
    const amount = readNumber(payload.amount);
    const postingKey = readString(payload.postingKey);
    if (!poDocumentId || quantity <= 0 || amount <= 0 || !postingKey) {
      return Result.fail(
        DomainError.validation("PO, quantite, montant et postingKey sont obligatoires."),
      );
    }
    const po = await getDocumentForCompany(ctx.companyId, poDocumentId);
    if (!po) {
      return Result.fail(DomainError.notFound("Commande fournisseur introuvable."));
    }
    const poPayload = asPayloadJson(po.payloadJson);
    const poQty = readNumber(poPayload.quantity);
    const grDocumentId = readString(payload.grDocumentId);
    let grQty = quantity;
    if (grDocumentId) {
      const gr = await getDocumentForCompany(ctx.companyId, grDocumentId);
      if (gr) {
        grQty = readNumber(asPayloadJson(gr.payloadJson).quantity, quantity);
      }
    }
    const qtyMismatch = quantity !== grQty || quantity !== poQty;
    const status = qtyMismatch ? "exception" : "matched";
    const invoiceNumber = nextDocumentNumber("SINV");
    const docResult = await posting.createBusinessDocument({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      documentType: "supplier_invoice",
      documentNumber: invoiceNumber,
      status,
      payloadJson: {
        poDocumentId,
        poNumber: po.documentNumber,
        grDocumentId,
        quantity,
        poQty,
        grQty,
        amount,
        variance: poQty - quantity,
      },
    });
    if (Result.isFail(docResult)) {
      return docResult;
    }
    const apResult = await posting.createFinancialPosting({
      companyId: ctx.companyId,
      accountCode: "2000-AP",
      debit: 0,
      credit: amount,
      sourceDocumentId: docResult.value.id,
      postingKey: `${postingKey}:ap`,
    });
    if (Result.isFail(apResult)) {
      return apResult;
    }
    const invResult = await posting.createFinancialPosting({
      companyId: ctx.companyId,
      accountCode: "1400-INVENTORY",
      debit: amount,
      credit: 0,
      sourceDocumentId: docResult.value.id,
      postingKey: `${postingKey}:inv`,
    });
    if (Result.isFail(invResult)) {
      return invResult;
    }
    await client.openItem.create({
      data: {
        companyId: ctx.companyId,
        kind: "AP",
        documentId: docResult.value.id,
        amount,
        openAmount: amount,
        status: "open",
      },
    });
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "p2p.post_invoice",
      resourceKey: docResult.value.id,
      payloadJson: { documentId: docResult.value.id, status, qtyMismatch },
    });
    return Result.ok({ documentId: docResult.value.id, status });
  }

  async function executeO2cCreateSalesOrder(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ documentId: string; documentNumber: string }>> {
    const customerKey = readString(payload.customerKey);
    const materialKey = readString(payload.materialKey);
    const locationKey = readString(payload.locationKey);
    const quantity = readNumber(payload.quantity);
    if (!customerKey || !materialKey || !locationKey || quantity <= 0) {
      return Result.fail(
        DomainError.validation("Client, materiel, entrepot et quantite positifs requis."),
      );
    }
    if (!isLocationValid(locationKey)) {
      return Result.fail(DomainError.validation("Entrepot invalide (DC-MTL ou DC-TRT attendu)."));
    }
    const customer = await findMasterData(ctx.companyId, "customer", customerKey);
    if (!customer) {
      return Result.fail(DomainError.notFound("Client introuvable dans les donnees de reference."));
    }
    const customerPayload = asPayloadJson(customer.payloadJson);
    if (isCustomerCreditBlocked(customerPayload)) {
      return Result.fail(
        DomainError.conflict("Commande client refusee : le credit client est bloque."),
      );
    }
    const unitPrice = readNumber(payload.unitPrice, 1250);
    const orderAmount = quantity * unitPrice;
    const creditLimit = readNumber(customerPayload.creditLimit, DEFAULT_CREDIT_LIMIT_CAD);
    const openAr = await sumCustomerOpenAr(ctx.companyId, customerKey);
    if (openAr + orderAmount > creditLimit) {
      return Result.fail(
        DomainError.conflict(
          `Commande client refusee : plafond credit depasse (${openAr + orderAmount} > ${creditLimit} CAD).`,
        ),
      );
    }
    const documentNumber = nextDocumentNumber("SO");
    const docResult = await posting.createBusinessDocument({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      documentType: "sales_order",
      documentNumber,
      status: "approved",
      payloadJson: {
        customerKey: customerKey.toUpperCase(),
        materialKey,
        locationKey,
        quantity,
        unitPrice,
        amount: orderAmount,
      },
    });
    if (Result.isFail(docResult)) {
      return docResult;
    }
    await client.documentLine.create({
      data: {
        documentId: docResult.value.id,
        lineNumber: 1,
        payloadJson: toInputJson({ materialKey, quantity, unitPrice, amount: orderAmount }),
      },
    });
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "o2c.create_sales_order",
      resourceKey: docResult.value.id,
      payloadJson: { documentId: docResult.value.id, documentNumber, orderAmount },
    });
    return Result.ok({ documentId: docResult.value.id, documentNumber });
  }

  async function executeO2cCheckAvailability(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ materialKey: string; locationKey: string; available: number; requested: number; sufficient: boolean }>> {
    const materialKey = readString(payload.materialKey);
    const locationKey = readString(payload.locationKey);
    const requested = readNumber(payload.requestedQty ?? payload.quantity);
    if (!materialKey || !locationKey || requested <= 0) {
      return Result.fail(
        DomainError.validation("Materiel, entrepot et quantite demandee requis."),
      );
    }
    if (!isLocationValid(locationKey)) {
      return Result.fail(DomainError.validation("Entrepot invalide (DC-MTL ou DC-TRT attendu)."));
    }
    const available = await posting.stockOnHand(ctx.companyId, materialKey, locationKey);
    return Result.ok({
      materialKey,
      locationKey,
      available,
      requested,
      sufficient: available >= requested,
    });
  }

  async function executeO2cDeliver(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ documentId: string; movementId: string }>> {
    const salesOrderDocumentId = readString(payload.salesOrderDocumentId);
    const materialKey = readString(payload.materialKey);
    const locationKey = readString(payload.locationKey);
    const quantity = readNumber(payload.quantity);
    const postingKey = readString(payload.postingKey);
    if (!salesOrderDocumentId || !materialKey || !locationKey || !postingKey || quantity <= 0) {
      return Result.fail(
        DomainError.validation("Commande client, materiel, entrepot, quantite et postingKey requis."),
      );
    }
    if (!isLocationValid(locationKey)) {
      return Result.fail(DomainError.validation("Entrepot invalide (DC-MTL ou DC-TRT attendu)."));
    }
    const so = await getDocumentForCompany(ctx.companyId, salesOrderDocumentId);
    if (!so) {
      return Result.fail(DomainError.notFound("Commande client introuvable."));
    }
    const stock = await posting.stockOnHand(ctx.companyId, materialKey, locationKey);
    if (stock < quantity) {
      return Result.fail(
        DomainError.conflict(
          `Livraison refusee : stock insuffisant (${stock} disponible, ${quantity} demande).`,
        ),
      );
    }
    const deliveryNumber = nextDocumentNumber("DN");
    const docResult = await posting.createBusinessDocument({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      documentType: "delivery",
      documentNumber: deliveryNumber,
      status: "posted",
      payloadJson: {
        salesOrderDocumentId,
        salesOrderNumber: so.documentNumber,
        materialKey,
        locationKey,
        quantity,
      },
    });
    if (Result.isFail(docResult)) {
      return docResult;
    }
    const movementResult = await posting.createInventoryMovement({
      companyId: ctx.companyId,
      materialKey,
      locationKey,
      quantity,
      direction: "out",
      sourceDocumentId: docResult.value.id,
      postingKey,
    });
    if (Result.isFail(movementResult)) {
      return movementResult;
    }
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "o2c.deliver",
      resourceKey: docResult.value.id,
      payloadJson: { documentId: docResult.value.id, postingKey, quantity },
    });
    return Result.ok({ documentId: docResult.value.id, movementId: movementResult.value.id });
  }

  async function executeO2cBill(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ documentId: string }>> {
    const deliveryDocumentId = readString(payload.deliveryDocumentId);
    const amount = readNumber(payload.amount);
    const postingKey = readString(payload.postingKey);
    if (!deliveryDocumentId || amount <= 0 || !postingKey) {
      return Result.fail(
        DomainError.validation("Livraison, montant et postingKey sont obligatoires."),
      );
    }
    const delivery = await getDocumentForCompany(ctx.companyId, deliveryDocumentId);
    if (!delivery) {
      return Result.fail(DomainError.notFound("Bon de livraison introuvable."));
    }
    const deliveryPayload = asPayloadJson(delivery.payloadJson);
    const invoiceNumber = nextDocumentNumber("CINV");
    const docResult = await posting.createBusinessDocument({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      documentType: "customer_invoice",
      documentNumber: invoiceNumber,
      status: "posted",
      payloadJson: {
        deliveryDocumentId,
        deliveryNumber: delivery.documentNumber,
        customerKey: deliveryPayload.customerKey ?? readString(payload.customerKey),
        amount,
      },
    });
    if (Result.isFail(docResult)) {
      return docResult;
    }
    const arResult = await posting.createFinancialPosting({
      companyId: ctx.companyId,
      accountCode: "1100-AR",
      debit: amount,
      credit: 0,
      sourceDocumentId: docResult.value.id,
      postingKey: `${postingKey}:ar`,
    });
    if (Result.isFail(arResult)) {
      return arResult;
    }
    const revResult = await posting.createFinancialPosting({
      companyId: ctx.companyId,
      accountCode: "4000-REVENUE",
      debit: 0,
      credit: amount,
      sourceDocumentId: docResult.value.id,
      postingKey: `${postingKey}:rev`,
    });
    if (Result.isFail(revResult)) {
      return revResult;
    }
    await client.openItem.create({
      data: {
        companyId: ctx.companyId,
        kind: "AR",
        documentId: docResult.value.id,
        amount,
        openAmount: amount,
        status: "open",
      },
    });
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "o2c.bill",
      resourceKey: docResult.value.id,
      payloadJson: { documentId: docResult.value.id, amount },
    });
    return Result.ok({ documentId: docResult.value.id });
  }

  async function executeInvTransfer(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ outMovementId: string; inMovementId: string }>> {
    const materialKey = readString(payload.materialKey);
    const sourceLocation = readString(payload.sourceLocation);
    const destLocation = readString(payload.destLocation);
    const quantity = readNumber(payload.quantity);
    const postingKey = readString(payload.postingKey);
    if (!materialKey || !sourceLocation || !destLocation || !postingKey || quantity <= 0) {
      return Result.fail(
        DomainError.validation("Materiel, entrepots source/destination, quantite et postingKey requis."),
      );
    }
    if (!isLocationValid(sourceLocation) || !isLocationValid(destLocation)) {
      return Result.fail(DomainError.validation("Entrepots invalides (DC-MTL ou DC-TRT attendus)."));
    }
    if (sourceLocation === destLocation) {
      return Result.fail(DomainError.validation("Source et destination doivent etre differentes."));
    }
    const stock = await posting.stockOnHand(ctx.companyId, materialKey, sourceLocation);
    if (stock < quantity) {
      return Result.fail(
        DomainError.conflict(
          `Transfert refuse : stock source insuffisant (${stock} disponible, ${quantity} demande).`,
        ),
      );
    }
    const outResult = await posting.createInventoryMovement({
      companyId: ctx.companyId,
      materialKey,
      locationKey: sourceLocation,
      quantity,
      direction: "out",
      postingKey: `${postingKey}:out`,
    });
    if (Result.isFail(outResult)) {
      return outResult;
    }
    const inResult = await posting.createInventoryMovement({
      companyId: ctx.companyId,
      materialKey,
      locationKey: destLocation,
      quantity,
      direction: "in",
      postingKey: `${postingKey}:in`,
    });
    if (Result.isFail(inResult)) {
      return inResult;
    }
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "inv.transfer",
      resourceKey: postingKey,
      payloadJson: { materialKey, sourceLocation, destLocation, quantity },
    });
    return Result.ok({ outMovementId: outResult.value.id, inMovementId: inResult.value.id });
  }

  async function executeInvCountAdjust(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ movementId: string }>> {
    const materialKey = readString(payload.materialKey);
    const locationKey = readString(payload.locationKey);
    const quantity = readNumber(payload.quantity);
    const direction = readString(payload.direction);
    const reason = readString(payload.reason);
    const postingKey = readString(payload.postingKey);
    if (!materialKey || !locationKey || !postingKey || quantity <= 0) {
      return Result.fail(
        DomainError.validation("Materiel, entrepot, quantite positive et postingKey requis."),
      );
    }
    if (direction !== "in" && direction !== "out") {
      return Result.fail(DomainError.validation("Direction invalide (in ou out attendu)."));
    }
    if (direction === "out" && !reason) {
      return Result.fail(
        DomainError.validation("Un ecart negatif exige une justification (reason)."),
      );
    }
    if (!isLocationValid(locationKey)) {
      return Result.fail(DomainError.validation("Entrepot invalide (DC-MTL ou DC-TRT attendu)."));
    }
    if (direction === "out") {
      const stock = await posting.stockOnHand(ctx.companyId, materialKey, locationKey);
      if (stock < quantity) {
        return Result.fail(
          DomainError.conflict(
            `Ajustement refuse : stock insuffisant (${stock} disponible, ${quantity} demande).`,
          ),
        );
      }
    }
    const movementResult = await posting.createInventoryMovement({
      companyId: ctx.companyId,
      materialKey,
      locationKey,
      quantity,
      direction,
      postingKey,
    });
    if (Result.isFail(movementResult)) {
      return movementResult;
    }
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "inv.count_adjust",
      resourceKey: movementResult.value.id,
      payloadJson: { materialKey, locationKey, quantity, direction, reason },
      reason: reason ?? undefined,
    });
    return Result.ok({ movementId: movementResult.value.id });
  }

  async function executeFinClearOpenItem(
    ctx: { companyId: string; employeeId: string },
    payload: Record<string, unknown>,
  ): Promise<ResultType<{ openItemId: string; status: string }>> {
    const openItemId = readString(payload.openItemId);
    const postingKey = readString(payload.postingKey);
    if (!openItemId || !postingKey) {
      return Result.fail(DomainError.validation("Open item et postingKey sont obligatoires."));
    }
    const openItem = await client.openItem.findFirst({
      where: { id: openItemId, companyId: ctx.companyId },
      include: { document: true },
    });
    if (!openItem) {
      return Result.fail(DomainError.notFound("Poste ouvert introuvable."));
    }
    if (openItem.status === "cleared") {
      return Result.fail(DomainError.conflict("Poste ouvert deja solde."));
    }
    const accountCode = openItem.kind === "AP" ? "2000-AP" : "1100-AR";
    const balancing =
      openItem.kind === "AP"
        ? { debit: openItem.openAmount, credit: 0 }
        : { debit: 0, credit: openItem.openAmount };
    const postingResult = await posting.createFinancialPosting({
      companyId: ctx.companyId,
      accountCode,
      debit: balancing.debit,
      credit: balancing.credit,
      sourceDocumentId: openItem.documentId,
      postingKey,
    });
    if (Result.isFail(postingResult)) {
      return postingResult;
    }
    await client.openItem.update({
      where: { id: openItem.id },
      data: { status: "cleared", openAmount: 0 },
    });
    await recordActionTrail({
      companyId: ctx.companyId,
      employeeId: ctx.employeeId,
      action: "fin.clear_open_item",
      resourceKey: openItem.id,
      payloadJson: { openItemId: openItem.id, amount: openItem.amount },
    });
    return Result.ok({ openItemId: openItem.id, status: "cleared" });
  }

  return {
    async listDocuments(employeeId: string): Promise<ResultType<{ documents: DocumentListItem[] }>> {
      const ctx = await resolveCompanyContext(employeeId);
      if (Result.isFail(ctx)) {
        return ctx;
      }
      const documents = await client.businessDocument.findMany({
        where: { companyId: ctx.value.companyId },
        orderBy: { createdAt: "desc" },
      });
      return Result.ok({ documents: documents.map(mapDocument) });
    },

    async getDocument(
      employeeId: string,
      documentId: string,
    ): Promise<ResultType<{ document: DocumentDetail }>> {
      const ctx = await resolveCompanyContext(employeeId);
      if (Result.isFail(ctx)) {
        return ctx;
      }
      const document = await client.businessDocument.findFirst({
        where: { id: documentId, companyId: ctx.value.companyId },
        include: {
          lines: { orderBy: { lineNumber: "asc" } },
          approvals: { orderBy: { decidedAt: "asc" } },
        },
      });
      if (!document) {
        return Result.fail(DomainError.notFound("Document introuvable."));
      }
      const events = await client.transactionEvent.findMany({
        where: { companyId: ctx.value.companyId },
        orderBy: { sequence: "asc" },
      });
      const timeline = events
        .filter((event) => {
          const eventPayload = asPayloadJson(event.payloadJson);
          return (
            eventPayload.documentId === document.id ||
            eventPayload.poDocumentId === document.id ||
            eventPayload.deliveryDocumentId === document.id ||
            eventPayload.salesOrderDocumentId === document.id
          );
        })
        .map((event) => ({
          id: event.id,
          eventType: event.eventType,
          sequence: event.sequence,
          createdAt: event.createdAt.toISOString(),
          payloadJson: asPayloadJson(event.payloadJson),
        }));
      const base = mapDocument(document);
      return Result.ok({
        document: {
          ...base,
          payloadJson: asPayloadJson(document.payloadJson),
          lines: document.lines.map((line) => ({
            id: line.id,
            lineNumber: line.lineNumber,
            payloadJson: asPayloadJson(line.payloadJson),
          })),
          approvals: document.approvals.map((approval) => ({
            id: approval.id,
            employeeId: approval.employeeId,
            decision: approval.decision,
            reason: approval.reason,
            decidedAt: approval.decidedAt.toISOString(),
          })),
          timeline,
        },
      });
    },

    async getInventory(
      employeeId: string,
    ): Promise<ResultType<{ stock: InventoryStockRow[]; recentMovements: InventoryMovementView[] }>> {
      const ctx = await resolveCompanyContext(employeeId);
      if (Result.isFail(ctx)) {
        return ctx;
      }
      const movements = await client.inventoryMovement.findMany({
        where: { companyId: ctx.value.companyId },
        orderBy: { createdAt: "desc" },
      });
      const stockMap = new Map<string, InventoryStockRow>();
      for (const movement of movements) {
        const key = `${movement.materialKey}::${movement.locationKey}`;
        const current = stockMap.get(key) ?? {
          materialKey: movement.materialKey,
          locationKey: movement.locationKey,
          quantityOnHand: 0,
        };
        const delta = movement.direction === "out" ? -movement.quantity : movement.quantity;
        stockMap.set(key, { ...current, quantityOnHand: current.quantityOnHand + delta });
      }
      const recentMovements = movements.slice(0, 20).map((movement) => ({
        id: movement.id,
        materialKey: movement.materialKey,
        locationKey: movement.locationKey,
        quantity: movement.quantity,
        direction: movement.direction,
        sourceDocumentId: movement.sourceDocumentId,
        createdAt: movement.createdAt.toISOString(),
      }));
      return Result.ok({
        stock: [...stockMap.values()].sort((a, b) =>
          `${a.materialKey}${a.locationKey}`.localeCompare(`${b.materialKey}${b.locationKey}`),
        ),
        recentMovements,
      });
    },

    async getFinance(employeeId: string): Promise<ResultType<FinanceView>> {
      const ctx = await resolveCompanyContext(employeeId);
      if (Result.isFail(ctx)) {
        return ctx;
      }
      const [postings, openItems] = await Promise.all([
        client.financialPosting.findMany({
          where: { companyId: ctx.value.companyId },
          orderBy: { createdAt: "desc" },
        }),
        client.openItem.findMany({
          where: { companyId: ctx.value.companyId },
          orderBy: { createdAt: "desc" },
        }),
      ]);
      const trialMap = new Map<string, { accountCode: string; totalDebit: number; totalCredit: number }>();
      for (const postingRow of postings) {
        const current = trialMap.get(postingRow.accountCode) ?? {
          accountCode: postingRow.accountCode,
          totalDebit: 0,
          totalCredit: 0,
        };
        trialMap.set(postingRow.accountCode, {
          accountCode: postingRow.accountCode,
          totalDebit: current.totalDebit + postingRow.debit,
          totalCredit: current.totalCredit + postingRow.credit,
        });
      }
      return Result.ok({
        postings: postings.map((row) => ({
          id: row.id,
          accountCode: row.accountCode,
          debit: row.debit,
          credit: row.credit,
          sourceDocumentId: row.sourceDocumentId,
          createdAt: row.createdAt.toISOString(),
        })),
        openItems: openItems.map((row) => ({
          id: row.id,
          kind: row.kind,
          documentId: row.documentId,
          amount: row.amount,
          openAmount: row.openAmount,
          status: row.status,
        })),
        trialBalance: [...trialMap.values()].sort((a, b) =>
          a.accountCode.localeCompare(b.accountCode),
        ),
      });
    },

    async executeAction(
      employeeId: string,
      action: TransactionAction,
      payload: Record<string, unknown>,
    ): Promise<ResultType<Record<string, unknown>>> {
      const ctx = await resolveCompanyContext(employeeId);
      if (Result.isFail(ctx)) {
        return ctx;
      }
      const context = ctx.value;
      switch (action) {
        case "p2p.create_requisition":
          return executeP2pCreateRequisition(context, payload);
        case "p2p.approve":
          return executeP2pApprove(context, payload);
        case "p2p.create_po":
          return executeP2pCreatePo(context, payload);
        case "p2p.goods_receipt":
          return executeP2pGoodsReceipt(context, payload);
        case "p2p.post_invoice":
          return executeP2pPostInvoice(context, payload);
        case "o2c.create_sales_order":
          return executeO2cCreateSalesOrder(context, payload);
        case "o2c.check_availability":
          return executeO2cCheckAvailability(context, payload);
        case "o2c.deliver":
          return executeO2cDeliver(context, payload);
        case "o2c.bill":
          return executeO2cBill(context, payload);
        case "inv.transfer":
          return executeInvTransfer(context, payload);
        case "inv.count_adjust":
          return executeInvCountAdjust(context, payload);
        case "fin.clear_open_item":
          return executeFinClearOpenItem(context, payload);
        default:
          return Result.fail(DomainError.validation("Action transactionnelle non supportee."));
      }
    },
  };
}

export type TransactionsService = ReturnType<typeof createTransactionsService>;
