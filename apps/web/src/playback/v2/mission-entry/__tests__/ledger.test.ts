import { describe, expect, it } from "vitest";

import { MISSION_LEDGER_EVENT_TYPES } from "../types.js";
import { advanceToCompleted, createService } from "./helpers.js";
import { EVIDENCE_IDS } from "../evidenceCatalog.js";
describe("Ledger (LD-01 … LD-08)", () => {
  it("LD-01 exact schema fields on every event", () => {
    const { service } = createService("ld01");
    advanceToCompleted(service);
    for (const event of service.getLedgerSnapshot()) {
      expect(event).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          sessionId: expect.any(String),
          timestamp: expect.any(String),
          type: expect.any(String),
          actor: expect.any(String),
          payload: expect.any(Object),
          version: 1,
        }),
      );
    }
  });

  it("LD-02 exact event names only from frozen catalog", () => {
    const { service } = createService("ld02");
    advanceToCompleted(service);
    for (const event of service.getLedgerSnapshot()) {
      expect(MISSION_LEDGER_EVENT_TYPES).toContain(event.type);
    }
  });

  it("LD-03 unique event IDs", () => {
    const { service } = createService("ld03");
    advanceToCompleted(service);
    const ids = service.getLedgerSnapshot().map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("LD-04 immutable returned events", () => {
    const { service } = createService("ld04");
    expect(service.startMission().ok).toBe(true);
    const [event] = service.getLedgerSnapshot();
    expect(() => {
      (event as { type: string }).type = "SESSION_ABANDONED";
    }).toThrow();
  });

  it("LD-05 append-only ordering", () => {
    const { service } = createService("ld05");
    advanceToCompleted(service);
    const ledger = service.getLedgerSnapshot();
    for (let i = 1; i < ledger.length; i += 1) {
      expect(ledger[i].timestamp >= ledger[i - 1].timestamp).toBe(true);
    }
  });

  it("LD-06 event version === 1", () => {
    const { service } = createService("ld06");
    advanceToCompleted(service);
    for (const event of service.getLedgerSnapshot()) {
      expect(event.version).toBe(1);
    }
  });

  it("LD-07 happy-path catalog coverage", () => {
    const { service } = createService("ld07");
    advanceToCompleted(service);
    const types = service.getLedgerSnapshot().map((e) => e.type);
    for (const required of [
      "MISSION_1_STARTED",
      "EVIDENCE_COLLECTED",
      "DECISION_RECORDED",
      "CONSEQUENCE_APPLIED",
      "DEBRIEF_ACKNOWLEDGED",
      "MISSION_1_COMPLETED",
    ] as const) {
      expect(types).toContain(required);
    }
  });

  it("LD-08 SESSION_RESUMED, SESSION_ABANDONED, SESSION_RECOVERY_RESET as applicable", () => {
    const { service } = createService("ld08");
    expect(service.startMission().ok).toBe(true);
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    expect(service.abandonMission().ok).toBe(true);
    expect(service.resumeMission().ok).toBe(true);
    const types = service.getLedgerSnapshot().map((e) => e.type);
    expect(types).toContain("SESSION_ABANDONED");
    expect(types).toContain("SESSION_RESUMED");

    service.recoverCleanSession("INVALID_JSON", "corrupt");
    expect(service.getLedgerSnapshot().map((e) => e.type)).toContain("SESSION_RECOVERY_RESET");

    // Append-only: further collects grow ledger; prior event objects remain unchanged
    expect(service.startMission().ok).toBe(true);
    const beforeCollect = service.getLedgerSnapshot();
    const firstId = beforeCollect[0]?.id;
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    const afterCollect = service.getLedgerSnapshot();
    expect(afterCollect.length).toBe(beforeCollect.length + 1);
    expect(afterCollect[0]?.id).toBe(firstId);
    expect(afterCollect[0]).toEqual(beforeCollect[0]);
  });
});
