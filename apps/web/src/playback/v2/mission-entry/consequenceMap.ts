import type { ConsequenceId, DecisionOptionId } from "./types.js";

/**
 * Deterministic authored consequence map.
 * Pure data only — no network, randomness, generative AI, or ELE.
 */

export type ConsequenceViewModel = {
  consequenceId: ConsequenceId;
  decisionId: DecisionOptionId;
  enterprisePulse: string;
  stakeholderInbox: string;
  kpiPreview: string;
  debriefPrompt: string;
  authoredRefs: {
    pulseId: string;
    inboxId: string;
    kpiId: string;
    debriefId: string;
  };
};

const CONSEQUENCE_BY_DECISION: Readonly<
  Record<DecisionOptionId, ConsequenceViewModel>
> = {
  DEMAND_QUANTITY: {
    consequenceId: "cns-demand-01",
    decisionId: "DEMAND_QUANTITY",
    enterprisePulse: "Demand 140 vs Friday promise pressure",
    stakeholderInbox: "Marc Tremblay urgency framing",
    kpiPreview: "Demand pressure on Friday OTIF commitment",
    debriefPrompt: "What evidence best supports demand as primary?",
    authoredRefs: {
      pulseId: "pulse-demand-01",
      inboxId: "inbox-marc-urgency-01",
      kpiId: "kpi-demand-otif-01",
      debriefId: "debrief-demand-01",
    },
  },
  SUPPLIER_DELAY: {
    consequenceId: "cns-supplier-01",
    decisionId: "SUPPLIER_DELAY",
    enterprisePulse: "Supplier +4 days / qty>120 dependency",
    stakeholderInbox: "NordLog / buyer supervisor note",
    kpiPreview: "Supplier lead-time risk to Friday promise",
    debriefPrompt: "What breaks if supplier delay is primary?",
    authoredRefs: {
      pulseId: "pulse-supplier-01",
      inboxId: "inbox-nordlog-01",
      kpiId: "kpi-supplier-lead-01",
      debriefId: "debrief-supplier-01",
    },
  },
  STOCK_AVAILABILITY: {
    consequenceId: "cns-stock-01",
    decisionId: "STOCK_AVAILABILITY",
    enterprisePulse: "Family A stock tension / OTIF framing",
    stakeholderInbox: "Warehouse / ops stock note",
    kpiPreview: "Family A availability constraint signal",
    debriefPrompt: "How does stock availability limit promise keeping?",
    authoredRefs: {
      pulseId: "pulse-stock-01",
      inboxId: "inbox-warehouse-stock-01",
      kpiId: "kpi-stock-family-a-01",
      debriefId: "debrief-stock-01",
    },
  },
  WAREHOUSE_CAPACITY: {
    consequenceId: "cns-warehouse-01",
    decisionId: "WAREHOUSE_CAPACITY",
    enterprisePulse: "Quai / capacity bottleneck signal",
    stakeholderInbox: "Warehouse capacity constraint note",
    kpiPreview: "Quai throughput bottleneck vs Friday window",
    debriefPrompt: "How does capacity constrain fulfillment timing?",
    authoredRefs: {
      pulseId: "pulse-warehouse-01",
      inboxId: "inbox-warehouse-capacity-01",
      kpiId: "kpi-quai-capacity-01",
      debriefId: "debrief-warehouse-01",
    },
  },
};

/** Pure deterministic evaluation. twinSnapshot reserved for future authored context; unused in CP1. */
export function evaluateConsequence(
  decisionId: DecisionOptionId,
  _twinSnapshot?: Readonly<Record<string, unknown>>,
): ConsequenceViewModel {
  return Object.freeze({
    ...CONSEQUENCE_BY_DECISION[decisionId],
    authoredRefs: Object.freeze({ ...CONSEQUENCE_BY_DECISION[decisionId].authoredRefs }),
  });
}

export function consequenceIdForDecision(decisionId: DecisionOptionId): ConsequenceId {
  return CONSEQUENCE_BY_DECISION[decisionId].consequenceId;
}

export function isConsequenceId(value: string): value is ConsequenceId {
  return (
    value === "cns-demand-01" ||
    value === "cns-supplier-01" ||
    value === "cns-stock-01" ||
    value === "cns-warehouse-01"
  );
}
