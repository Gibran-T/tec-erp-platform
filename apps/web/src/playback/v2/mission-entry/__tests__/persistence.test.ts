import { describe, expect, it } from "vitest";

import { EVIDENCE_IDS } from "../evidenceCatalog.js";
import { createStrictTestDeps, MissionSessionService } from "../missionService.js";
import {
  parseEnvelopeJson,
  serializeEnvelope,
  validateEnvelope,
} from "../serialization.js";
import {
  createMemoryStorage,
  SessionStorageAdapter,
} from "../sessionStorageAdapter.js";
import { SESSION_STORAGE_KEY } from "../types.js";
import { advanceToConsequence, createService } from "./helpers.js";

describe("Persistence (PS-01 … PS-12)", () => {
  it("PS-01 valid serialize/hydrate round-trip", () => {
    const { service, deps } = createService("ps01");
    advanceToConsequence(service);
    const snap = service.getSnapshot();
    const serialized = serializeEnvelope(snap);
    expect(serialized.ok).toBe(true);
    const parsed = parseEnvelopeJson(serialized.json);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.envelope.status).toBe(snap.status);
    expect(parsed.envelope.sessionId).toBe(snap.sessionId);
    expect(parsed.envelope.evidenceIds).toEqual(snap.evidenceIds);
    expect(parsed.envelope.decisionId).toBe(snap.decisionId);
    expect(parsed.envelope.consequenceId).toBe(snap.consequenceId);
    expect(parsed.envelope.ledger).toHaveLength(snap.ledger.length);

    const storage = createMemoryStorage();
    const adapter = new SessionStorageAdapter({ storage, deps, service });
    expect(adapter.save().ok).toBe(true);
    const service2 = new MissionSessionService(createStrictTestDeps("ps01b"));
    const adapter2 = new SessionStorageAdapter({ storage, deps: createStrictTestDeps("ps01c"), service: service2 });
    const hydrated = adapter2.hydrate();
    expect(hydrated.ok).toBe(true);
    expect(hydrated.recovered).toBe(false);
    expect(hydrated.envelope.sessionId).toBe(snap.sessionId);
    expect(hydrated.envelope.status).toBe(snap.status);
  });

  it("PS-02 invalid JSON → safe recovery", () => {
    const storage = createMemoryStorage();
    storage.setItem(SESSION_STORAGE_KEY, "{not-json");
    const deps = createStrictTestDeps("ps02");
    const adapter = new SessionStorageAdapter({ storage, deps });
    const priorId = adapter.getService().getSnapshot().sessionId;
    const result = adapter.hydrate();
    expect(result.ok).toBe(true);
    expect(result.recovered).toBe(true);
    if (!result.recovered) return;
    expect(result.recoveryClass).toBe("INVALID_JSON");
    expect(result.envelope.status).toBe("NOT_STARTED");
    expect(result.envelope.sessionId).not.toBe(priorId);
    expect(result.envelope.ledger.every((e) => e.type !== "MISSION_1_STARTED")).toBe(true);
    expect(storage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    expect(result.recoveryNotice.active).toBe(true);
  });

  it("PS-03 unsupported schemaVersion → safe recovery", () => {
    const { service } = createService("ps03");
    const snap = service.getSnapshot();
    const bad = { ...snap, schemaVersion: 99 };
    const storage = createMemoryStorage();
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(bad));
    const adapter = new SessionStorageAdapter({
      storage,
      deps: createStrictTestDeps("ps03a"),
    });
    const result = adapter.hydrate();
    expect(result.recovered).toBe(true);
    if (!result.recovered) return;
    expect(result.recoveryClass).toBe("UNSUPPORTED_SCHEMA");
    expect(result.envelope.status).toBe("NOT_STARTED");
  });

  it("PS-04 missing required fields → safe recovery", () => {
    const storage = createMemoryStorage();
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ schemaVersion: 1 }));
    const adapter = new SessionStorageAdapter({
      storage,
      deps: createStrictTestDeps("ps04"),
    });
    const result = adapter.hydrate();
    expect(result.recovered).toBe(true);
    if (!result.recovered) return;
    expect(result.recoveryClass).toBe("MISSING_REQUIRED_FIELD");
  });

  it("PS-05 invalid status → safe recovery", () => {
    const { service } = createService("ps05");
    const snap = service.getSnapshot();
    const storage = createMemoryStorage();
    storage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ ...snap, status: "HACKED" }),
    );
    const adapter = new SessionStorageAdapter({
      storage,
      deps: createStrictTestDeps("ps05a"),
    });
    const result = adapter.hydrate();
    expect(result.recovered).toBe(true);
    if (!result.recovered) return;
    expect(result.recoveryClass).toBe("INVALID_STATUS");
  });

  it("PS-06 malformed ledger → safe recovery", () => {
    const { service } = createService("ps06");
    expect(service.startMission().ok).toBe(true);
    const snap = service.getSnapshot();
    const storage = createMemoryStorage();
    storage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ ...snap, ledger: [{ id: "x" }] }),
    );
    const adapter = new SessionStorageAdapter({
      storage,
      deps: createStrictTestDeps("ps06a"),
    });
    const result = adapter.hydrate();
    expect(result.recovered).toBe(true);
    if (!result.recovered) return;
    expect(result.recoveryClass).toBe("MALFORMED_LEDGER");
  });

  it("PS-07 duplicate event IDs → safe recovery", () => {
    const { service } = createService("ps07");
    expect(service.startMission().ok).toBe(true);
    const snap = service.getSnapshot();
    const dup = {
      ...snap,
      ledger: [
        snap.ledger[0],
        { ...snap.ledger[0], timestamp: "2026-07-24T16:00:02.000Z" },
      ],
    };
    const storage = createMemoryStorage();
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(dup));
    const adapter = new SessionStorageAdapter({
      storage,
      deps: createStrictTestDeps("ps07a"),
    });
    const result = adapter.hydrate();
    expect(result.recovered).toBe(true);
    if (!result.recovered) return;
    expect(result.recoveryClass).toBe("DUPLICATE_EVENT_IDS");
  });

  it("PS-08 safe reset: new sessionId; no corrupt payload copied", () => {
    const storage = createMemoryStorage();
    storage.setItem(SESSION_STORAGE_KEY, '{"evil":true,"schemaVersion":1}');
    const adapter = new SessionStorageAdapter({
      storage,
      deps: createStrictTestDeps("ps08"),
    });
    const result = adapter.hydrate();
    expect(result.recovered).toBe(true);
    if (!result.recovered) return;
    expect(result.envelope.status).toBe("NOT_STARTED");
    const reset = result.envelope.ledger.find((e) => e.type === "SESSION_RECOVERY_RESET");
    expect(reset).toBeDefined();
    expect(JSON.stringify(reset?.payload)).not.toContain("evil");
    expect(result.envelope.ledger.some((e) => e.type === "MISSION_1_STARTED")).toBe(false);
  });

  it("PS-09 recovery notice state exposed", () => {
    const storage = createMemoryStorage();
    storage.setItem(SESSION_STORAGE_KEY, "null");
    const adapter = new SessionStorageAdapter({
      storage,
      deps: createStrictTestDeps("ps09"),
    });
    const result = adapter.hydrate();
    expect(result.recoveryNotice.active).toBe(true);
    expect(result.recoveryNotice.recoveryClass).not.toBe("NONE");
    expect(result.recoveryNotice.message.length).toBeGreaterThan(0);
  });

  it("PS-10 no localStorage usage", () => {
    const calls: string[] = [];
    const storage = createMemoryStorage();
    const proxied = {
      getItem: (k: string) => {
        calls.push(`get:${k}`);
        return storage.getItem(k);
      },
      setItem: (k: string, v: string) => {
        calls.push(`set:${k}`);
        storage.setItem(k, v);
      },
      removeItem: (k: string) => {
        calls.push(`remove:${k}`);
        storage.removeItem(k);
      },
    };
    const fakeLocal = {
      getItem: () => {
        throw new Error("localStorage must not be used");
      },
      setItem: () => {
        throw new Error("localStorage must not be used");
      },
      removeItem: () => {
        throw new Error("localStorage must not be used");
      },
    };
    // Ensure global localStorage would throw if touched
    const g = globalThis as { localStorage?: typeof fakeLocal };
    const prev = g.localStorage;
    g.localStorage = fakeLocal;
    try {
      const { service, deps } = createService("ps10");
      expect(service.startMission().ok).toBe(true);
      const adapter = new SessionStorageAdapter({ storage: proxied, deps, service });
      expect(adapter.save().ok).toBe(true);
      expect(adapter.hydrate().ok).toBe(true);
      expect(calls.every((c) => c.includes(SESSION_STORAGE_KEY))).toBe(true);
    } finally {
      g.localStorage = prev;
    }
  });

  it("PS-11 storage key exactly tec.erp.playback.v2.so1048.m1.session.v1", () => {
    expect(SESSION_STORAGE_KEY).toBe("tec.erp.playback.v2.so1048.m1.session.v1");
    const storage = createMemoryStorage();
    const { service, deps } = createService("ps11");
    const adapter = new SessionStorageAdapter({ storage, deps, service });
    expect(adapter.getStorageKey()).toBe(SESSION_STORAGE_KEY);
    expect(service.startMission().ok).toBe(true);
    expect(adapter.save().ok).toBe(true);
    expect(storage.getItem(SESSION_STORAGE_KEY)).not.toBeNull();
  });

  it("PS-12 timestamps ISO-8601 UTC ending in Z", () => {
    const { service } = createService("ps12");
    expect(service.startMission().ok).toBe(true);
    expect(service.collectEvidence(EVIDENCE_IDS[0]).ok).toBe(true);
    const snap = service.getSnapshot();
    expect(snap.createdAt.endsWith("Z")).toBe(true);
    expect(snap.updatedAt.endsWith("Z")).toBe(true);
    for (const event of snap.ledger) {
      expect(event.timestamp.endsWith("Z")).toBe(true);
      expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
    const validated = validateEnvelope(snap);
    expect(validated.ok).toBe(true);
  });

  it("PS-08b missing key treated as fresh NOT_STARTED without recovery history", () => {
    const storage = createMemoryStorage();
    const adapter = new SessionStorageAdapter({
      storage,
      deps: createStrictTestDeps("ps08b"),
    });
    const result = adapter.hydrate();
    expect(result.recovered).toBe(false);
    expect(result.envelope.status).toBe("NOT_STARTED");
    expect(result.envelope.ledger).toHaveLength(0);
    expect(result.recoveryNotice.active).toBe(false);
  });
});
