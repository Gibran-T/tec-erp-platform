import {
  DECISION_ID,
  DECISION_OPTION_IDS,
  type DecisionId,
  type DecisionOptionId,
} from "./types.js";

/**
 * Four-option diagnostic decision — no score, grade, or public correct flag.
 */

export type DecisionOption = {
  id: DecisionOptionId;
  label: string;
  meaning: string;
};

export type DecisionCatalog = {
  decisionId: DecisionId;
  question: string;
  options: readonly DecisionOption[];
};

export const PRIMARY_THREAT_DECISION: DecisionCatalog = {
  decisionId: DECISION_ID,
  question: "What is the primary threat to the Friday customer promise?",
  options: [
    {
      id: "DEMAND_QUANTITY",
      label: "Demand quantity",
      meaning: "Demand quantity (140 units) threatens the promise",
    },
    {
      id: "SUPPLIER_DELAY",
      label: "Supplier delay",
      meaning: "Supplier delay threatens the promise",
    },
    {
      id: "STOCK_AVAILABILITY",
      label: "Stock availability",
      meaning: "Stock availability (Family A) threatens the promise",
    },
    {
      id: "WAREHOUSE_CAPACITY",
      label: "Warehouse capacity",
      meaning: "Warehouse capacity / quai constraint threatens the promise",
    },
  ],
};

export function isDecisionOptionId(value: string): value is DecisionOptionId {
  return (DECISION_OPTION_IDS as readonly string[]).includes(value);
}

export function getDecisionOption(optionId: DecisionOptionId): DecisionOption {
  const found = PRIMARY_THREAT_DECISION.options.find((o) => o.id === optionId);
  if (!found) {
    throw new Error(`Unknown decision option: ${optionId}`);
  }
  return found;
}
