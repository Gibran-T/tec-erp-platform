import { MissionSessionService, type MissionServiceDeps } from "./missionService.js";
import { parseEnvelopeJson, serializeEnvelope } from "./serialization.js";
import {
  SESSION_STORAGE_KEY,
  type MissionSessionEnvelopeV1,
  type RecoveryClass,
  type RecoveryNotice,
  type SessionStorageLike,
} from "./types.js";

export type HydrateResult =
  | {
      ok: true;
      envelope: MissionSessionEnvelopeV1;
      recovered: false;
      recoveryNotice: RecoveryNotice;
    }
  | {
      ok: true;
      envelope: MissionSessionEnvelopeV1;
      recovered: true;
      recoveryClass: RecoveryClass;
      recoveryNotice: RecoveryNotice;
    };

export type SessionStorageAdapterOptions = {
  storage: SessionStorageLike;
  deps: MissionServiceDeps;
  service?: MissionSessionService;
  storageKey?: string;
};

/**
 * sessionStorage-only resume adapter with corruption recovery.
 * Injectable storage — no browser global required for unit tests.
 * Forbidden: browser local storage APIs.
 */
export class SessionStorageAdapter {
  private readonly storage: SessionStorageLike;
  private readonly deps: MissionServiceDeps;
  private readonly storageKey: string;
  private service: MissionSessionService;

  constructor(options: SessionStorageAdapterOptions) {
    this.storage = options.storage;
    this.deps = options.deps;
    this.storageKey = options.storageKey ?? SESSION_STORAGE_KEY;
    this.service = options.service ?? new MissionSessionService(options.deps);
  }

  getService(): MissionSessionService {
    return this.service;
  }

  getStorageKey(): string {
    return this.storageKey;
  }

  save(envelope?: MissionSessionEnvelopeV1): { ok: true } | { ok: false; error: string } {
    const snap = envelope ?? this.service.getSnapshot();
    const serialized = serializeEnvelope(snap);
    try {
      this.storage.setItem(this.storageKey, serialized.json);
      return { ok: true };
    } catch {
      return { ok: false, error: "Failed to write sessionStorage" };
    }
  }

  /**
   * Hydrate from storage into the in-memory service.
   * Missing key → fresh NOT_STARTED (no false recovery history).
   * Corrupt/invalid → discard key, clean session, recovery notice, SESSION_RECOVERY_RESET.
   */
  hydrate(): HydrateResult {
    let raw: string | null;
    try {
      raw = this.storage.getItem(this.storageKey);
    } catch {
      return this.recover("INVALID_ENVELOPE", "Storage read failure");
    }

    if (raw === null || raw === "") {
      this.service.createCleanSession();
      return {
        ok: true,
        envelope: this.service.getSnapshot(),
        recovered: false,
        recoveryNotice: this.service.getRecoveryNotice(),
      };
    }

    const parsed = parseEnvelopeJson(raw);
    if (!parsed.ok) {
      this.discardStored();
      return this.recover(parsed.recoveryClass, parsed.error);
    }

    this.service.replaceWithHydrated(parsed.envelope);
    // Successful restore appends SESSION_RESUMED (ledger event, not a status)
    if (parsed.envelope.status !== "NOT_STARTED" && parsed.envelope.status !== "COMPLETED") {
      const resumed = this.service.resumeFromStorageRestore();
      if (!resumed.ok) {
        // If resume append fails unexpectedly, keep hydrated state without mutation claim
        return {
          ok: true,
          envelope: this.service.getSnapshot(),
          recovered: false,
          recoveryNotice: this.service.getRecoveryNotice(),
        };
      }
    }

    return {
      ok: true,
      envelope: this.service.getSnapshot(),
      recovered: false,
      recoveryNotice: this.service.getRecoveryNotice(),
    };
  }

  private recover(recoveryClass: RecoveryClass, message: string): HydrateResult {
    const envelope = this.service.recoverCleanSession(recoveryClass, message);
    return {
      ok: true,
      envelope,
      recovered: true,
      recoveryClass,
      recoveryNotice: this.service.getRecoveryNotice(),
    };
  }

  private discardStored(): void {
    try {
      this.storage.removeItem(this.storageKey);
    } catch {
      // Quarantine best-effort; in-memory recovery still proceeds
    }
  }
}

/** In-memory sessionStorage stand-in for DOM-free tests. */
export function createMemoryStorage(): SessionStorageLike {
  const map = new Map<string, string>();
  return {
    getItem(key: string): string | null {
      return map.has(key) ? (map.get(key) as string) : null;
    },
    setItem(key: string, value: string): void {
      map.set(key, value);
    },
    removeItem(key: string): void {
      map.delete(key);
    },
  };
}
