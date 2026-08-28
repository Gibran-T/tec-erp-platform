/**
 * Authored evidence catalog for SO-1048 Mission 1 entry (playback demo).
 */

export type EvidenceDefinition = {
  id: string;
  label: string;
  summary: string;
};

export const EVIDENCE_CATALOG: readonly EvidenceDefinition[] = [
  {
    id: "ev-otc-process-map",
    label: "OTC process map",
    summary: "Order-to-cash process map for the Friday customer promise path.",
  },
  {
    id: "ev-supplier-delay-note",
    label: "Supplier delay note",
    summary: "NordLog supplier delay note indicating +4 days on qty > 120.",
  },
  {
    id: "ev-stock-tension-kpi",
    label: "Stock tension / KPI signal",
    summary: "Family A stock tension signal with OTIF pressure framing.",
  },
  {
    id: "ev-stakeholder-urgency",
    label: "Stakeholder urgency message",
    summary: "Authored urgency message from the commercial stakeholder channel.",
  },
] as const;

export const EVIDENCE_IDS: readonly string[] = EVIDENCE_CATALOG.map((e) => e.id);

export function isKnownEvidenceId(evidenceId: string): boolean {
  return EVIDENCE_IDS.includes(evidenceId);
}

export function getEvidenceDefinition(evidenceId: string): EvidenceDefinition | undefined {
  return EVIDENCE_CATALOG.find((e) => e.id === evidenceId);
}
