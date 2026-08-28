import { describe, expect, it } from "vitest";

import {
  canTransition,
  getAllowedTransitions,
  isTerminal,
} from "../stateMachine.js";
import { advanceToCompleted, createService } from "./helpers.js";
import { EVIDENCE_IDS } from "../evidenceCatalog.js";

describe("State machine (SM-01 … SM-04)", () => {
  it("SM-01 valid transitions per frozen table", () => {
    expect(canTransition("NOT_STARTED", "IN_PROGRESS")).toBe(true);
    expect(canTransition("IN_PROGRESS", "DECISION_RECORDED")).toBe(true);
    expect(canTransition("IN_PROGRESS", "ABANDONED")).toBe(true);
    expect(canTransition("DECISION_RECORDED", "CONSEQUENCE_APPLIED")).toBe(true);
    expect(canTransition("DECISION_RECORDED", "ABANDONED")).toBe(true);
    expect(canTransition("CONSEQUENCE_APPLIED", "COMPLETED")).toBe(true);
    expect(canTransition("CONSEQUENCE_APPLIED", "ABANDONED")).toBe(true);
    expect(canTransition("ABANDONED", "IN_PROGRESS")).toBe(true);
    expect(getAllowedTransitions("COMPLETED")).toEqual([]);
  });

  it("SM-02 invalid transitions rejected without mutation or ledger append", () => {
    const { service } = createService("sm02");
    const before = service.getSnapshot();
    const result = service.completeMission();
    expect(result.ok).toBe(false);
    const after = service.getSnapshot();
    expect(after.status).toBe(before.status);
    expect(after.ledger).toHaveLength(before.ledger.length);
    expect(canTransition("NOT_STARTED", "COMPLETED")).toBe(false);
    expect(canTransition("IN_PROGRESS", "COMPLETED")).toBe(false);
    expect(canTransition("CONSEQUENCE_APPLIED", "DECISION_RECORDED")).toBe(false);
  });

  it("SM-03 COMPLETED is terminal — no further status transition", () => {
    const { service } = createService("sm03");
    advanceToCompleted(service);
    expect(service.getSnapshot().status).toBe("COMPLETED");
    expect(isTerminal("COMPLETED")).toBe(true);
    const abandoned = service.abandonMission();
    expect(abandoned.ok).toBe(false);
    const resumed = service.resumeMission();
    expect(resumed.ok).toBe(false);
    const started = service.startMission();
    expect(started.ok).toBe(false);
    expect(service.getSnapshot().status).toBe("COMPLETED");
  });

  it("SM-04 ABANDONED resume → IN_PROGRESS with SESSION_RESUMED event (not a status)", () => {
    const { service } = createService("sm04");
    expect(service.startMission().ok).toBe(true);
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    expect(service.abandonMission().ok).toBe(true);
    expect(service.getSnapshot().status).toBe("ABANDONED");
    const ledgerLen = service.getLedgerSnapshot().length;
    const resumed = service.resumeMission();
    expect(resumed.ok).toBe(true);
    if (!resumed.ok) return;
    expect(resumed.value.status).toBe("IN_PROGRESS");
    expect(resumed.value.status).not.toBe("SESSION_RESUMED" as never);
    const types = service.getLedgerSnapshot().map((e) => e.type);
    expect(types).toContain("SESSION_RESUMED");
    expect(service.getLedgerSnapshot().length).toBe(ledgerLen + 1);
  });
});
