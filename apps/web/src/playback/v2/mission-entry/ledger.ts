import type {
  MissionIdFactory,
  MissionClock,
  MissionLedgerActor,
  MissionLedgerEvent,
  MissionLedgerEventType,
} from "./types.js";
import { MISSION_LEDGER_EVENT_TYPES } from "./types.js";

export type AppendLedgerEventInput = {
  sessionId: string;
  type: MissionLedgerEventType;
  actor: MissionLedgerActor;
  payload?: Record<string, unknown>;
  existing: readonly MissionLedgerEvent[];
  clock: MissionClock;
  ids: MissionIdFactory;
};

export function isLedgerEventType(value: string): value is MissionLedgerEventType {
  return (MISSION_LEDGER_EVENT_TYPES as readonly string[]).includes(value);
}

export function freezeLedgerEvent(event: MissionLedgerEvent): MissionLedgerEvent {
  return Object.freeze({
    ...event,
    payload: Object.freeze({ ...event.payload }),
  });
}

export function snapshotLedger(
  events: readonly MissionLedgerEvent[],
): readonly MissionLedgerEvent[] {
  return Object.freeze(events.map((e) => freezeLedgerEvent(e)));
}

/**
 * Append-only: returns a new ledger array; never mutates prior events.
 * Rejects duplicate IDs and non-monotonic timestamps.
 */
export function appendLedgerEvent(
  input: AppendLedgerEventInput,
):
  | { ok: true; ledger: MissionLedgerEvent[]; event: MissionLedgerEvent }
  | { ok: false; error: string } {
  const timestamp = input.clock.nowIso();
  if (!timestamp.endsWith("Z")) {
    return { ok: false, error: "Ledger timestamp must be ISO-8601 UTC ending in Z" };
  }

  const id = input.ids.nextId("evt");
  if (input.existing.some((e) => e.id === id)) {
    return { ok: false, error: `Duplicate ledger event id: ${id}` };
  }

  if (input.existing.length > 0) {
    const last = input.existing[input.existing.length - 1];
    if (last !== undefined && timestamp < last.timestamp) {
      return {
        ok: false,
        error: "Ledger timestamps must be monotonically non-decreasing",
      };
    }
  }

  const event = freezeLedgerEvent({
    id,
    sessionId: input.sessionId,
    timestamp,
    type: input.type,
    actor: input.actor,
    payload: input.payload ?? {},
    version: 1,
  });

  const ledger = Object.freeze([...input.existing.map((e) => freezeLedgerEvent(e)), event]);
  return { ok: true, ledger: [...ledger], event };
}

/** AI actors have no API to rewrite existing events — only new appends via SYSTEM/LEARNER paths in service. */
export function assertNoAiRewriteApi(): void {
  // Intentional no-op marker: there is no mutate/delete/rewrite export in this module.
}
