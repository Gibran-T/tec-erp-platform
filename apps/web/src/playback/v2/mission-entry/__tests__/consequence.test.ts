import { describe, expect, it } from "vitest";

import {
  consequenceIdForDecision,
  evaluateConsequence,
} from "../consequenceMap.js";
import { DECISION_OPTION_IDS, type DecisionOptionId } from "../types.js";
import { advanceToConsequence, createService } from "./helpers.js";
import { EVIDENCE_IDS } from "../evidenceCatalog.js";

describe("Decision / consequence (DC-01 … DC-05)", () => {
  it("DC-01 four deterministic mappings to unique consequence IDs", () => {
    const ids = DECISION_OPTION_IDS.map((d) => consequenceIdForDecision(d));
    expect(ids).toEqual([
      "cns-demand-01",
      "cns-supplier-01",
      "cns-stock-01",
      "cns-warehouse-01",
    ]);
    expect(new Set(ids).size).toBe(4);
  });

  it("DC-02 same decision → same consequence outputs (determinism)", () => {
    for (const option of DECISION_OPTION_IDS) {
      const a = evaluateConsequence(option);
      const b = evaluateConsequence(option);
      expect(a).toEqual(b);
    }

    const { service: s1 } = createService("dc02a");
    const { service: s2 } = createService("dc02b");
    advanceToConsequence(s1, "SUPPLIER_DELAY");
    advanceToConsequence(s2, "SUPPLIER_DELAY");
    expect(s1.getSnapshot().consequenceId).toBe(s2.getSnapshot().consequenceId);
    expect(s1.getSnapshot().consequenceId).toBe("cns-supplier-01");
  });

  it("DC-03 consequence applies exactly once (one CONSEQUENCE_APPLIED)", () => {
    const { service } = createService("dc03");
    advanceToConsequence(service, "STOCK_AVAILABILITY");
    const count = service
      .getLedgerSnapshot()
      .filter((e) => e.type === "CONSEQUENCE_APPLIED").length;
    expect(count).toBe(1);
  });

  it("DC-04 re-apply rejected; ledger count unchanged", () => {
    const { service } = createService("dc04");
    advanceToConsequence(service, "WAREHOUSE_CAPACITY");
    const before = service.getLedgerSnapshot().length;
    const again = service.applyConsequence();
    expect(again.ok).toBe(false);
    if (!again.ok) {
      expect(again.code).toBe("CONSEQUENCE_ALREADY_APPLIED");
    }
    expect(service.getLedgerSnapshot().length).toBe(before);
    expect(
      service.getLedgerSnapshot().filter((e) => e.type === "CONSEQUENCE_APPLIED"),
    ).toHaveLength(1);
  });

  it("DC-05 decision immutable after consequence", () => {
    const { service } = createService("dc05");
    advanceToConsequence(service, "DEMAND_QUANTITY");
    const before = service.getSnapshot();
    const change = service.recordDecision("SUPPLIER_DELAY" satisfies DecisionOptionId);
    expect(change.ok).toBe(false);
    if (!change.ok) {
      expect(change.code).toBe("DECISION_LOCKED");
    }
    expect(service.getSnapshot().decisionId).toBe(before.decisionId);
    expect(service.getSnapshot().ledger.length).toBe(before.ledger.length);
  });

  it("evidence duplicate collection does not duplicate id or ledger event", () => {
    const { service } = createService("dc-ev");
    expect(service.startMission().ok).toBe(true);
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    const mid = service.getSnapshot();
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    const after = service.getSnapshot();
    expect(after.evidenceIds).toEqual(mid.evidenceIds);
    expect(
      after.ledger.filter((e) => e.type === "EVIDENCE_COLLECTED"),
    ).toHaveLength(1);
  });
});
