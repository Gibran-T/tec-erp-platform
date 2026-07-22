import { useCallback, useEffect, useState, type FormEvent, type ReactElement } from "react";

import {
  executeTransactionAction,
  getTransactionDocument,
  getTransactionFinance,
  getTransactionInventory,
  listTransactionDocuments,
  type FinanceView,
  type InventoryMovementView,
  type InventoryStockRow,
  type TransactionDocumentDetail,
  type TransactionDocumentListItem,
} from "../../../api/transactions.js";

type WorkspaceTab = "documents" | "inventory" | "finance" | "actions";

const TABS: Array<{ id: WorkspaceTab; label: string }> = [
  { id: "documents", label: "Documents" },
  { id: "inventory", label: "Inventaire" },
  { id: "finance", label: "Finance" },
  { id: "actions", label: "Actions" },
];

function formatDate(value: string): string {
  return new Date(value).toLocaleString("fr-CA");
}

export function TransactionWorkspacePage(): ReactElement {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("documents");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [documents, setDocuments] = useState<TransactionDocumentListItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [documentDetail, setDocumentDetail] = useState<TransactionDocumentDetail | null>(null);
  const [stock, setStock] = useState<InventoryStockRow[]>([]);
  const [movements, setMovements] = useState<InventoryMovementView[]>([]);
  const [finance, setFinance] = useState<FinanceView | null>(null);

  const [actionForm, setActionForm] = useState({
    action: "p2p.create_requisition",
    materialKey: "SKU-HVAC-4421",
    quantity: "10",
    locationKey: "DC-MTL",
    supplierKey: "THERMOCONTROL",
    customerKey: "SACRE-COEUR",
    documentId: "",
    postingKey: "",
  });

  const refreshDocuments = useCallback(async () => {
    const response = await listTransactionDocuments();
    setDocuments(response.documents);
  }, []);

  const refreshInventory = useCallback(async () => {
    const response = await getTransactionInventory();
    setStock(response.stock);
    setMovements(response.recentMovements);
  }, []);

  const refreshFinance = useCallback(async () => {
    const response = await getTransactionFinance();
    setFinance(response);
  }, []);

  const loadTabData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "documents") {
        await refreshDocuments();
      } else if (activeTab === "inventory") {
        await refreshInventory();
      } else if (activeTab === "finance") {
        await refreshFinance();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, refreshDocuments, refreshFinance, refreshInventory]);

  useEffect(() => {
    void loadTabData();
  }, [loadTabData]);

  useEffect(() => {
    if (!selectedDocumentId) {
      setDocumentDetail(null);
      return;
    }
    void getTransactionDocument(selectedDocumentId)
      .then((response: { document: TransactionDocumentDetail }) =>
        setDocumentDetail(response.document),
      )
      .catch((err: Error) => setError(err.message));
  }, [selectedDocumentId]);

  async function handleActionSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const quantity = Number(actionForm.quantity);
    const postingKey =
      actionForm.postingKey.trim().length > 0
        ? actionForm.postingKey.trim()
        : `ui:${actionForm.action}:${Date.now()}`;

    const payloadByAction: Record<string, Record<string, unknown>> = {
      "p2p.create_requisition": {
        materialKey: actionForm.materialKey,
        quantity,
        unitPrice: 125,
      },
      "p2p.create_po": {
        supplierKey: actionForm.supplierKey,
        materialKey: actionForm.materialKey,
        quantity,
        unitPrice: 125,
      },
      "p2p.goods_receipt": {
        poDocumentId: actionForm.documentId,
        materialKey: actionForm.materialKey,
        locationKey: actionForm.locationKey,
        quantity,
        postingKey,
      },
      "o2c.create_sales_order": {
        customerKey: actionForm.customerKey,
        materialKey: actionForm.materialKey,
        locationKey: actionForm.locationKey,
        quantity,
        unitPrice: 1250,
      },
      "o2c.check_availability": {
        materialKey: actionForm.materialKey,
        locationKey: actionForm.locationKey,
        requestedQty: quantity,
      },
      "o2c.deliver": {
        salesOrderDocumentId: actionForm.documentId,
        materialKey: actionForm.materialKey,
        locationKey: actionForm.locationKey,
        quantity,
        postingKey,
      },
      "inv.transfer": {
        materialKey: actionForm.materialKey,
        sourceLocation: "DC-MTL",
        destLocation: "DC-TRT",
        quantity,
        postingKey,
      },
      "p2p.approve": {
        documentId: actionForm.documentId,
        amount: quantity * 125,
        isApprover: true,
      },
      "p2p.post_invoice": {
        poDocumentId: actionForm.documentId,
        quantity,
        unitPrice: 125,
        postingKey,
      },
      "o2c.bill": {
        deliveryDocumentId: actionForm.documentId,
        amount: quantity * 1250,
        postingKey,
      },
      "inv.count_adjust": {
        materialKey: actionForm.materialKey,
        locationKey: actionForm.locationKey,
        countedQty: quantity,
        reason: "Ecart inventaire pedagogique",
        postingKey,
      },
      "fin.clear_open_item": {
        openItemId: actionForm.documentId,
        postingKey,
      },
    };

    try {
      const payload = payloadByAction[actionForm.action] ?? {};
      const response = await executeTransactionAction(actionForm.action, payload);
      setMessage(`Action executee : ${JSON.stringify(response.result)}`);
      await loadTabData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible.");
    }
  }

  return (
    <main className="workspace-page" data-testid="transaction-workspace-page">
      <h1>Flux documentaire et transactions</h1>
      <p>
        Vue métier du flux ERP — les identifiants techniques restent disponibles en détail, mais ne
        sont pas le point d’entrée.
      </p>

      <section className="living-home-section" data-testid="document-flow-view" aria-label="Vue flux">
        <h2>Vue flux</h2>
        <div className="living-flow">
          {[
            "Demande d’achat",
            "Commande d’achat",
            "Réception",
            "Facture",
            "Paiement",
          ].map((node, index, arr) => (
            <div key={node} style={{ display: "contents" }}>
              <span className="living-flow__node">{node}</span>
              {index < arr.length - 1 ? <span className="living-flow__arrow">→</span> : null}
            </div>
          ))}
        </div>
        <p>
          Relations amont/aval, exceptions et rapprochement sont visibles dans la fiche document et
          l’onglet finance.
        </p>
      </section>

      <div role="tablist" aria-label="Sections transactionnelles" data-testid="transaction-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            data-testid={`transaction-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p role="status" data-testid="transaction-loading">
          Chargement...
        </p>
      ) : null}
      {error ? (
        <p role="alert" data-testid="transaction-error">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" data-testid="transaction-message">
          {message}
        </p>
      ) : null}

      {activeTab === "documents" ? (
        <section aria-label="Documents metier" data-testid="transaction-documents-panel">
          {documents.length === 0 && !loading ? (
            <p data-testid="transaction-documents-empty">Aucun document pour le moment.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Numero</th>
                  <th scope="col">Statut</th>
                  <th scope="col">Mission</th>
                  <th scope="col">Cree le</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id} data-testid={`document-row-${document.id}`}>
                    <td>{document.documentType}</td>
                    <td>{document.documentNumber}</td>
                    <td>{document.status}</td>
                    <td>{document.missionKey ?? "—"}</td>
                    <td>{formatDate(document.createdAt)}</td>
                    <td>
                      <button
                        type="button"
                        data-testid={`document-detail-${document.id}`}
                        onClick={() => setSelectedDocumentId(document.id)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {documentDetail ? (
            <article data-testid="transaction-document-detail">
              <h2>
                {documentDetail.documentType} — {documentDetail.documentNumber}
              </h2>
              <p>Statut : {documentDetail.status}</p>
              <h3>Lignes</h3>
              {documentDetail.lines.length === 0 ? <p>Aucune ligne.</p> : null}
              <ul>
                {documentDetail.lines.map((line: TransactionDocumentDetail["lines"][number]) => (
                  <li key={line.id}>
                    Ligne {line.lineNumber} — {JSON.stringify(line.payloadJson)}
                  </li>
                ))}
              </ul>
              <h3>Approbations</h3>
              {documentDetail.approvals.length === 0 ? <p>Aucune approbation.</p> : null}
              <ul>
                {documentDetail.approvals.map(
                  (approval: TransactionDocumentDetail["approvals"][number]) => (
                  <li key={approval.id}>
                    {approval.decision} — {formatDate(approval.decidedAt)}
                  </li>
                ))}
              </ul>
              <h3>Chronologie</h3>
              {documentDetail.timeline.length === 0 ? <p>Aucun evenement lie.</p> : null}
              <ul data-testid="transaction-document-timeline">
                {documentDetail.timeline.map(
                  (event: TransactionDocumentDetail["timeline"][number]) => (
                  <li key={event.id}>
                    #{event.sequence} {event.eventType} — {formatDate(event.createdAt)}
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>
      ) : null}

      {activeTab === "inventory" ? (
        <section aria-label="Inventaire" data-testid="transaction-inventory-panel">
          <h2>Stock disponible</h2>
          {stock.length === 0 && !loading ? (
            <p data-testid="transaction-inventory-empty">Aucun stock enregistre.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th scope="col">Article</th>
                  <th scope="col">Entrepot</th>
                  <th scope="col">Quantite</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((row) => (
                  <tr key={`${row.materialKey}-${row.locationKey}`}>
                    <td>{row.materialKey}</td>
                    <td>{row.locationKey}</td>
                    <td>{row.quantityOnHand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <h2>Mouvements recents</h2>
          {movements.length === 0 ? <p>Aucun mouvement recent.</p> : null}
          <ul>
            {movements.map((movement) => (
              <li key={movement.id}>
                {movement.direction} {movement.quantity} {movement.materialKey} @ {movement.locationKey}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {activeTab === "finance" ? (
        <section aria-label="Finance" data-testid="transaction-finance-panel">
          {!finance ? (
            <p data-testid="transaction-finance-empty">Aucune ecriture financiere.</p>
          ) : (
            <>
              <h2>Balance auxiliaire</h2>
              <table data-testid="transaction-trial-balance">
                <thead>
                  <tr>
                    <th scope="col">Compte</th>
                    <th scope="col">Debit</th>
                    <th scope="col">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {finance.trialBalance.map((row: FinanceView["trialBalance"][number]) => (
                    <tr key={row.accountCode}>
                      <td>{row.accountCode}</td>
                      <td>{row.totalDebit}</td>
                      <td>{row.totalCredit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2>Postes ouverts</h2>
              {finance.openItems.length === 0 ? <p>Aucun poste ouvert.</p> : null}
              <ul>
                {finance.openItems.map((item: FinanceView["openItems"][number]) => (
                  <li key={item.id}>
                    {item.kind} — {item.openAmount} / {item.amount} ({item.status})
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      ) : null}

      {activeTab === "actions" ? (
        <section aria-label="Actions transactionnelles" data-testid="transaction-actions-panel">
          <form onSubmit={(event) => void handleActionSubmit(event)}>
            <label htmlFor="transaction-action-select">Action</label>
            <select
              id="transaction-action-select"
              data-testid="transaction-action-select"
              value={actionForm.action}
              onChange={(event) =>
                setActionForm((current) => ({ ...current, action: event.target.value }))
              }
            >
              <option value="p2p.create_requisition">Demande d&apos;achat (PR)</option>
              <option value="p2p.approve">Approbation PR/PO</option>
              <option value="p2p.create_po">Commande fournisseur (PO)</option>
              <option value="p2p.goods_receipt">Reception marchandises (GR)</option>
              <option value="p2p.post_invoice">Facture fournisseur / 3-way</option>
              <option value="o2c.create_sales_order">Commande client (SO)</option>
              <option value="o2c.check_availability">Verifier disponibilite (ATP)</option>
              <option value="o2c.deliver">Livraison / goods issue</option>
              <option value="o2c.bill">Facturation client / AR</option>
              <option value="inv.transfer">Transfert inventaire</option>
              <option value="inv.count_adjust">Inventaire physique / ecart</option>
              <option value="fin.clear_open_item">Clearing poste ouvert</option>
            </select>

            <label htmlFor="transaction-material">Article</label>
            <input
              id="transaction-material"
              data-testid="transaction-material-input"
              value={actionForm.materialKey}
              onChange={(event) =>
                setActionForm((current) => ({ ...current, materialKey: event.target.value }))
              }
            />

            <label htmlFor="transaction-quantity">Quantite</label>
            <input
              id="transaction-quantity"
              data-testid="transaction-quantity-input"
              value={actionForm.quantity}
              onChange={(event) =>
                setActionForm((current) => ({ ...current, quantity: event.target.value }))
              }
            />

            <label htmlFor="transaction-location">Entrepot</label>
            <select
              id="transaction-location"
              data-testid="transaction-location-select"
              value={actionForm.locationKey}
              onChange={(event) =>
                setActionForm((current) => ({ ...current, locationKey: event.target.value }))
              }
            >
              <option value="DC-MTL">DC-MTL</option>
              <option value="DC-TRT">DC-TRT</option>
            </select>

            <label htmlFor="transaction-document-id">Document lie (PO/SO)</label>
            <input
              id="transaction-document-id"
              data-testid="transaction-document-id-input"
              value={actionForm.documentId}
              onChange={(event) =>
                setActionForm((current) => ({ ...current, documentId: event.target.value }))
              }
            />

            <button type="submit" data-testid="transaction-action-submit">
              Executer
            </button>
          </form>
        </section>
      ) : null}
    </main>
  );
}
