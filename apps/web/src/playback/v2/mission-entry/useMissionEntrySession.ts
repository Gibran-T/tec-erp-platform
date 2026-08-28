import { useCallback, useEffect, useRef, useState } from "react";

import {
  SessionStorageAdapter,
  createMemoryStorage,
  type MissionServiceDeps,
  type MissionSessionEnvelopeV1,
  type RecoveryNotice,
  type ServiceResult,
  type SessionStorageLike,
} from "./index.js";

function createPlaybackDeps(): MissionServiceDeps {
  let seq = 0;
  return {
    clock: {
      nowIso(): string {
        return new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z");
      },
    },
    ids: {
      nextId(prefix: string): string {
        seq += 1;
        return `pb-${prefix}-${String(seq).padStart(4, "0")}`;
      },
    },
  };
}

function getBrowserSessionStorage(): SessionStorageLike {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage;
  }
  return createMemoryStorage();
}

export function useMissionEntrySession(): {
  ready: boolean;
  snapshot: MissionSessionEnvelopeV1 | null;
  recoveryNotice: RecoveryNotice | null;
  startMission: () => ServiceResult<MissionSessionEnvelopeV1> | { ok: false; error: string };
  collectEvidence: (evidenceId: string) => ServiceResult<MissionSessionEnvelopeV1> | { ok: false; error: string };
  recordDecision: (optionId: string) => ServiceResult<MissionSessionEnvelopeV1> | { ok: false; error: string };
  applyConsequence: () => ServiceResult<MissionSessionEnvelopeV1> | { ok: false; error: string };
  acknowledgeDebrief: () => ServiceResult<MissionSessionEnvelopeV1> | { ok: false; error: string };
  completeMission: () => ServiceResult<MissionSessionEnvelopeV1> | { ok: false; error: string };
  abandonMission: () => ServiceResult<MissionSessionEnvelopeV1> | { ok: false; error: string };
  resumeMission: () => ServiceResult<MissionSessionEnvelopeV1> | { ok: false; error: string };
  resetSession: () => void;
  clearRecoveryNotice: () => void;
} {
  const adapterRef = useRef<SessionStorageAdapter | null>(null);
  const [snapshot, setSnapshot] = useState<MissionSessionEnvelopeV1 | null>(null);
  const [recoveryNotice, setRecoveryNotice] = useState<RecoveryNotice | null>(null);
  const [ready, setReady] = useState(false);

  const syncFromAdapter = useCallback((adapter: SessionStorageAdapter): void => {
    setSnapshot(adapter.getService().getSnapshot());
    setRecoveryNotice(adapter.getService().getRecoveryNotice());
  }, []);

  useEffect(() => {
    const adapter = new SessionStorageAdapter({
      storage: getBrowserSessionStorage(),
      deps: createPlaybackDeps(),
    });
    adapter.hydrate();
    adapterRef.current = adapter;
    syncFromAdapter(adapter);
    setReady(true);
  }, [syncFromAdapter]);

  const mutate = useCallback(
    (
      action: (adapter: SessionStorageAdapter) => ServiceResult<MissionSessionEnvelopeV1>,
    ): ServiceResult<MissionSessionEnvelopeV1> | { ok: false; error: string } => {
      const adapter = adapterRef.current;
      if (!adapter) {
        return { ok: false, error: "Session not ready" };
      }
      const result = action(adapter);
      if (result.ok) {
        adapter.save();
        syncFromAdapter(adapter);
      }
      return result;
    },
    [syncFromAdapter],
  );

  const resetSession = useCallback((): void => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    adapter.getService().createCleanSession();
    adapter.save();
    adapter.getService().clearRecoveryNotice();
    syncFromAdapter(adapter);
    try {
      sessionStorage.removeItem(adapter.getStorageKey());
    } catch {
      // Best-effort clear for playback reset
    }
  }, [syncFromAdapter]);

  const clearRecoveryNotice = useCallback((): void => {
    const adapter = adapterRef.current;
    if (!adapter) return;
    adapter.getService().clearRecoveryNotice();
    syncFromAdapter(adapter);
  }, [syncFromAdapter]);

  return {
    ready,
    snapshot,
    recoveryNotice,
    startMission: () => mutate((a) => a.getService().startMission()),
    collectEvidence: (evidenceId) => mutate((a) => a.getService().collectEvidence(evidenceId)),
    recordDecision: (optionId) => mutate((a) => a.getService().recordDecision(optionId)),
    applyConsequence: () => mutate((a) => a.getService().applyConsequence()),
    acknowledgeDebrief: () => mutate((a) => a.getService().acknowledgeDebrief()),
    completeMission: () => mutate((a) => a.getService().completeMission()),
    abandonMission: () => mutate((a) => a.getService().abandonMission()),
    resumeMission: () => mutate((a) => a.getService().resumeMission()),
    resetSession,
    clearRecoveryNotice,
  };
}
