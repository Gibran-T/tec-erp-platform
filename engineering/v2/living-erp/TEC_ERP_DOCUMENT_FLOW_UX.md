# TEC.ERP Document Flow UX

## Surface

`/workspace/apps/documents` → `TransactionWorkspacePage`.

## Living addition — Vue flux

`data-testid="document-flow-view"` presents a business process strip:

**Demande d’achat → Commande d’achat → Réception → Facture → Paiement**

Purpose: enter through **process language**, not technical IDs. Detail panels still expose numbers/IDs when needed.

## Existing tabs (retained)

Documents · Inventaire · Finance · Actions (and related transactional panels already in the page).

Document table columns emphasize type, number, status, mission, created date, detail action.

## Principles

1. Documents are consequences of missions and transactions.
2. Upstream/downstream relations and exceptions remain in detail / finance tabs.
3. Learner home links “Chronologie ERP” to this app.
4. Professor Command Center “Documents” / “Activité” sections reuse audit evidence — not a duplicate transaction engine.

## Partial areas

- Flow strip is pedagogical/canonical P2P path; it is not a dynamic graph computed per open document.
- Some action labels/messages remain French-technical mixed copy from the pre-wave page.
- No production writes implied by this UX; actions still hit local/sim APIs under authenticated session rules.
