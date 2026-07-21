import { loadStoredTokens } from "./auth.js";
import { getApiBaseUrl } from "./health.js";
import { safeFetch } from "./http.js";

function requireAccessToken(): string {
  const tokens = loadStoredTokens();
  if (!tokens?.accessToken) {
    throw new Error("Authentification requise.");
  }
  return tokens.accessToken;
}

async function parseJson<T>(response: Response, fallback: string): Promise<T> {
  if (!response.ok) {
    let message = fallback;
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      if (body.error?.message) {
        message = body.error.message;
      }
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export interface TransactionDocumentListItem {
  readonly id: string;
  readonly documentType: string;
  readonly documentNumber: string;
  readonly status: string;
  readonly missionKey: string | null;
  readonly createdAt: string;
  readonly payloadSummary: Record<string, unknown>;
}

export interface TransactionDocumentDetail extends TransactionDocumentListItem {
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

export async function listTransactionDocuments() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/transactions/documents`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ documents: TransactionDocumentListItem[] }>(
    response,
    "Impossible de charger les documents.",
  );
}

export async function getTransactionDocument(documentId: string) {
  const token = requireAccessToken();
  const response = await safeFetch(
    `${getApiBaseUrl()}/api/v1/me/transactions/documents/${encodeURIComponent(documentId)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return parseJson<{ document: TransactionDocumentDetail }>(
    response,
    "Impossible de charger le detail du document.",
  );
}

export async function getTransactionInventory() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/transactions/inventory`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<{ stock: InventoryStockRow[]; recentMovements: InventoryMovementView[] }>(
    response,
    "Impossible de charger l'inventaire.",
  );
}

export async function getTransactionFinance() {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/transactions/finance`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseJson<FinanceView>(response, "Impossible de charger la finance.");
}

export async function executeTransactionAction(action: string, payload: Record<string, unknown>) {
  const token = requireAccessToken();
  const response = await safeFetch(`${getApiBaseUrl()}/api/v1/me/transactions/actions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  return parseJson<{ result: Record<string, unknown> }>(
    response,
    "Impossible d'executer l'action transactionnelle.",
  );
}
