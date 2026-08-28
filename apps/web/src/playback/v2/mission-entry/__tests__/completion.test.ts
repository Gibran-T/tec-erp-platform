import { describe, expect, it } from "vitest";

import { createService } from "./helpers.js";
import { EVIDENCE_IDS } from "../evidenceCatalog.js";

describe("Completion guards (CM-01 … CM-05)", () => {
  it("CM-01 blocked without evidence", () => {
    const { service } = createService("cm01");
    expect(service.startMission().ok).toBe(true);
    expect(service.recordDecision("DEMAND_QUANTITY").ok).toBe(true);
    expect(service.applyConsequence().ok).toBe(true);
    expect(service.acknowledgeDebrief().ok).toBe(true);
    const before = service.getSnapshot();
    const result = service.completeMission();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("COMPLETION_BLOCKED");
    expect(service.getSnapshot().status).toBe(before.status);
    expect(service.getSnapshot().ledger.length).toBe(before.ledger.length);
  });

  it("CM-02 blocked without decision", () => {
    const { service } = createService("cm02");
    expect(service.startMission().ok).toBe(true);
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    // Cannot reach CONSEQUENCE_APPLIED / complete without decision
    const complete = service.completeMission();
    expect(complete.ok).toBe(false);
    expect(service.getSnapshot().status).toBe("IN_PROGRESS");
  });

  it("CM-03 blocked without consequence", () => {
    const { service } = createService("cm03");
    expect(service.startMission().ok).toBe(true);
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    expect(service.recordDecision("DEMAND_QUANTITY").ok).toBe(true);
    const before = service.getSnapshot();
    const result = service.completeMission();
    expect(result.ok).toBe(false);
    expect(service.getSnapshot().status).toBe(before.status);
    expect(service.getSnapshot().ledger.length).toBe(before.ledger.length);
  });

  it("CM-04 blocked without debrief acknowledgment", () => {
    const { service } = createService("cm04");
    expect(service.startMission().ok).toBe(true);
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    expect(service.recordDecision("DEMAND_QUANTITY").ok).toBe(true);
    expect(service.applyConsequence().ok).toBe(true);
    const before = service.getSnapshot();
    const result = service.completeMission();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("COMPLETION_BLOCKED");
    expect(service.getSnapshot().status).toBe("CONSEQUENCE_APPLIED");
    expect(service.getSnapshot().ledger.length).toBe(before.ledger.length);
  });

  it("CM-05 allowed only with every criterion → COMPLETED + MISSION_1_COMPLETED", () => {
    const { service } = createService("cm05");
    expect(service.startMission().ok).toBe(true);
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    expect(service.recordDecision("DEMAND_QUANTITY").ok).toBe(true);
    expect(service.applyConsequence().ok).toBe(true);
    expect(service.acknowledgeDebrief().ok).toBe(true);
    const result = service.completeMission();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.status).toBe("COMPLETED");
    expect(result.value.evidenceIds.length).toBeGreaterThanOrEqual(1);
    expect(result.value.decisionId).not.toBeNull();
    expect(result.value.consequenceId).not.toBeNull();
    expect(result.value.debriefAcknowledged).toBe(true);
    expect(result.value.ledger.map((e) => e.type)).toContain("MISSION_1_COMPLETED");
  });
});
