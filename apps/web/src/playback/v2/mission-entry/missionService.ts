import { evaluateConsequence } from "./consequenceMap.js";
import { isDecisionOptionId } from "./decisionCatalog.js";
import { isKnownEvidenceId } from "./evidenceCatalog.js";
import { appendLedgerEvent, snapshotLedger } from "./ledger.js";
import { structuredCloneEnvelope } from "./serialization.js";
import {
  canAbandon,
  canAcknowledgeDebrief,
  canApplyConsequence,
  canCollectEvidence,
  canComplete,
  canRecordDecision,
  canResumeFromAbandoned,
  canTransition,
} from "./stateMachine.js";
import {
  LEARNER_ID,
  MISSION_ID,
  type DecisionOptionId,
  type MissionClock,
  type MissionIdFactory,
  type MissionLedgerEvent,
  type MissionSessionEnvelopeV1,
  type MissionStatus,
  type RecoveryClass,
  type RecoveryNotice,
  type ServiceResult,
} from "./types.js";

export type MissionServiceDeps = {
  clock: MissionClock;
  ids: MissionIdFactory;
};

const EMPTY_RECOVERY: RecoveryNotice = {
  active: false,
  recoveryClass: "NONE",
  message: "",
};

/** Deterministic injectable clock/id factory for unit tests. */
export function createStrictTestDeps(seed = "cp1"): MissionServiceDeps {
  let seq = 0;
  let t = Date.UTC(2026, 6, 24, 16, 0, 0);
  return {
    clock: {
      nowIso(): string {
        t += 1000;
        return new Date(t).toISOString().replace(/\.\d{3}Z$/, ".000Z");
      },
    },
    ids: {
      nextId(prefix: string): string {
        seq += 1;
        return `${seed}-${prefix}-${String(seq).padStart(4, "0")}`;
      },
    },
  };
}

export class MissionSessionService {
  private session: MissionSessionEnvelopeV1;
  private recoveryNotice: RecoveryNotice = { ...EMPTY_RECOVERY };
  private readonly clock: MissionClock;
  private readonly ids: MissionIdFactory;

  constructor(deps: MissionServiceDeps, initial?: MissionSessionEnvelopeV1) {
    this.clock = deps.clock;
    this.ids = deps.ids;
    this.session = initial
      ? structuredCloneEnvelope(initial)
      : this.buildCleanSession();
  }

  private buildCleanSession(sessionId?: string): MissionSessionEnvelopeV1 {
    const now = this.clock.nowIso();
    return {
      schemaVersion: 1,
      sessionId: sessionId ?? this.ids.nextId("sess"),
      missionId: MISSION_ID,
      learnerId: LEARNER_ID,
      status: "NOT_STARTED",
      evidenceIds: [],
      decisionId: null,
      consequenceId: null,
      debriefAcknowledged: false,
      ledger: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  private touch(status: MissionStatus): void {
    this.session.status = status;
    this.session.updatedAt = this.clock.nowIso();
  }

  private append(
    type: MissionLedgerEvent["type"],
    actor: MissionLedgerEvent["actor"],
    payload: Record<string, unknown> = {},
  ): ServiceResult<MissionLedgerEvent> {
    const result = appendLedgerEvent({
      sessionId: this.session.sessionId,
      type,
      actor,
      payload,
      existing: this.session.ledger,
      clock: this.clock,
      ids: this.ids,
    });
    if (!result.ok) {
      return { ok: false, error: result.error, code: "INVALID_STATE" };
    }
    this.session.ledger = result.ledger;
    this.session.updatedAt = result.event.timestamp;
    return { ok: true, value: result.event };
  }

  private rejectTransition(to: MissionStatus): ServiceResult<MissionSessionEnvelopeV1> {
    return {
      ok: false,
      error: `Invalid transition ${this.session.status} → ${to}`,
      code: "INVALID_TRANSITION",
    };
  }

  getSnapshot(): MissionSessionEnvelopeV1 {
    return structuredCloneEnvelope(this.session);
  }

  getLedgerSnapshot(): readonly MissionLedgerEvent[] {
    return snapshotLedger(this.session.ledger);
  }

  getRecoveryNotice(): RecoveryNotice {
    return { ...this.recoveryNotice };
  }

  clearRecoveryNotice(): void {
    this.recoveryNotice = { ...EMPTY_RECOVERY };
  }

  /** Replace in-memory state after a valid hydrate (no recovery). */
  replaceWithHydrated(envelope: MissionSessionEnvelopeV1): void {
    this.session = structuredCloneEnvelope(envelope);
    this.recoveryNotice = { ...EMPTY_RECOVERY };
  }

  /**
   * Corruption recovery: discard prior state, start clean NOT_STARTED,
   * append SESSION_RECOVERY_RESET on the new session only (not for missing key).
   */
  recoverCleanSession(recoveryClass: RecoveryClass, message: string): MissionSessionEnvelopeV1 {
    this.session = this.buildCleanSession();
    this.recoveryNotice = {
      active: true,
      recoveryClass,
      message,
    };
    if (recoveryClass !== "MISSING_KEY" && recoveryClass !== "NONE") {
      this.append("SESSION_RECOVERY_RESET", "SYSTEM", {
        recoveryClass,
      });
    }
    return this.getSnapshot();
  }

  createCleanSession(): MissionSessionEnvelopeV1 {
    this.session = this.buildCleanSession();
    this.recoveryNotice = { ...EMPTY_RECOVERY };
    return this.getSnapshot();
  }

  startMission(): ServiceResult<MissionSessionEnvelopeV1> {
    if (this.session.status !== "NOT_STARTED" || !canTransition(this.session.status, "IN_PROGRESS")) {
      return this.rejectTransition("IN_PROGRESS");
    }
    const before = this.getSnapshot();
    const appended = this.append("MISSION_1_STARTED", "LEARNER", {
      missionId: MISSION_ID,
    });
    if (!appended.ok) {
      this.session = before;
      return appended;
    }
    this.touch("IN_PROGRESS");
    return { ok: true, value: this.getSnapshot() };
  }

  collectEvidence(evidenceId: string): ServiceResult<MissionSessionEnvelopeV1> {
    if (!canCollectEvidence(this.session.status)) {
      return {
        ok: false,
        error: `Evidence cannot be collected in status ${this.session.status}`,
        code: "INVALID_STATE",
      };
    }
    if (!isKnownEvidenceId(evidenceId)) {
      return {
        ok: false,
        error: `Unknown evidence id: ${evidenceId}`,
        code: "INVALID_EVIDENCE",
      };
    }
    if (this.session.evidenceIds.includes(evidenceId)) {
      return { ok: true, value: this.getSnapshot() };
    }
    const before = this.getSnapshot();
    const appended = this.append("EVIDENCE_COLLECTED", "LEARNER", { evidenceId });
    if (!appended.ok) {
      this.session = before;
      return appended;
    }
    this.session.evidenceIds = [...this.session.evidenceIds, evidenceId];
    this.session.updatedAt = this.clock.nowIso();
    return { ok: true, value: this.getSnapshot() };
  }

  recordDecision(optionId: string): ServiceResult<MissionSessionEnvelopeV1> {
    if (
      this.session.consequenceId !== null ||
      this.session.status === "CONSEQUENCE_APPLIED" ||
      this.session.status === "COMPLETED"
    ) {
      return {
        ok: false,
        error: "Decision cannot change after consequence",
        code: "DECISION_LOCKED",
      };
    }
    if (!canRecordDecision(this.session.status)) {
      return this.rejectTransition("DECISION_RECORDED");
    }
    if (!isDecisionOptionId(optionId)) {
      return {
        ok: false,
        error: `Invalid decision option: ${optionId}`,
        code: "INVALID_DECISION",
      };
    }
    if (this.session.decisionId !== null) {
      return {
        ok: false,
        error: "Decision already recorded",
        code: "INVALID_DECISION",
      };
    }
    const before = this.getSnapshot();
    const appended = this.append("DECISION_RECORDED", "LEARNER", {
      decisionId: "dec-primary-threat",
      optionId,
    });
    if (!appended.ok) {
      this.session = before;
      return appended;
    }
    this.session.decisionId = optionId as DecisionOptionId;
    this.touch("DECISION_RECORDED");
    return { ok: true, value: this.getSnapshot() };
  }

  applyConsequence(): ServiceResult<MissionSessionEnvelopeV1> {
    if (this.session.status === "CONSEQUENCE_APPLIED" || this.session.consequenceId !== null) {
      return {
        ok: false,
        error: "Consequence already applied",
        code: "CONSEQUENCE_ALREADY_APPLIED",
      };
    }
    if (!canApplyConsequence(this.session.status) || this.session.decisionId === null) {
      return this.rejectTransition("CONSEQUENCE_APPLIED");
    }
    if (this.session.ledger.some((e) => e.type === "CONSEQUENCE_APPLIED")) {
      return {
        ok: false,
        error: "Consequence already applied",
        code: "CONSEQUENCE_ALREADY_APPLIED",
      };
    }
    const view = evaluateConsequence(this.session.decisionId);
    const before = this.getSnapshot();
    const appended = this.append("CONSEQUENCE_APPLIED", "SYSTEM", {
      decisionId: this.session.decisionId,
      consequenceId: view.consequenceId,
      authoredRefs: view.authoredRefs,
      enterprisePulse: view.enterprisePulse,
      stakeholderInbox: view.stakeholderInbox,
      kpiPreview: view.kpiPreview,
      debriefPrompt: view.debriefPrompt,
    });
    if (!appended.ok) {
      this.session = before;
      return appended;
    }
    this.session.consequenceId = view.consequenceId;
    this.touch("CONSEQUENCE_APPLIED");
    return { ok: true, value: this.getSnapshot() };
  }

  acknowledgeDebrief(): ServiceResult<MissionSessionEnvelopeV1> {
    if (!canAcknowledgeDebrief(this.session.status)) {
      return {
        ok: false,
        error: `Debrief cannot be acknowledged in status ${this.session.status}`,
        code: "INVALID_STATE",
      };
    }
    if (this.session.debriefAcknowledged) {
      return { ok: true, value: this.getSnapshot() };
    }
    const before = this.getSnapshot();
    const appended = this.append("DEBRIEF_ACKNOWLEDGED", "LEARNER", {});
    if (!appended.ok) {
      this.session = before;
      return appended;
    }
    this.session.debriefAcknowledged = true;
    this.session.updatedAt = this.clock.nowIso();
    return { ok: true, value: this.getSnapshot() };
  }

  completeMission(): ServiceResult<MissionSessionEnvelopeV1> {
    if (!canComplete(this.session.status)) {
      return this.rejectTransition("COMPLETED");
    }
    const blocked = this.completionBlockReason();
    if (blocked !== null) {
      return {
        ok: false,
        error: blocked,
        code: "COMPLETION_BLOCKED",
      };
    }
    const before = this.getSnapshot();
    if (!this.session.ledger.some((e) => e.type === "DEBRIEF_ACKNOWLEDGED")) {
      const ack = this.append("DEBRIEF_ACKNOWLEDGED", "LEARNER", {});
      if (!ack.ok) {
        this.session = before;
        return ack;
      }
    }
    const completed = this.append("MISSION_1_COMPLETED", "SYSTEM", {
      missionId: MISSION_ID,
    });
    if (!completed.ok) {
      this.session = before;
      return completed;
    }
    this.touch("COMPLETED");
    return { ok: true, value: this.getSnapshot() };
  }

  private completionBlockReason(): string | null {
    if (this.session.evidenceIds.length < 1) {
      return "Completion blocked: at least one evidence item required";
    }
    if (this.session.decisionId === null) {
      return "Completion blocked: decision required";
    }
    if (this.session.consequenceId === null) {
      return "Completion blocked: consequence required";
    }
    if (!this.session.debriefAcknowledged) {
      return "Completion blocked: debrief acknowledgment required";
    }
    return null;
  }

  abandonMission(): ServiceResult<MissionSessionEnvelopeV1> {
    if (!canAbandon(this.session.status)) {
      return this.rejectTransition("ABANDONED");
    }
    const before = this.getSnapshot();
    const appended = this.append("SESSION_ABANDONED", "LEARNER", {
      fromStatus: this.session.status,
    });
    if (!appended.ok) {
      this.session = before;
      return appended;
    }
    this.touch("ABANDONED");
    return { ok: true, value: this.getSnapshot() };
  }

  /**
   * Explicit resume from ABANDONED → IN_PROGRESS (restart policy).
   * SESSION_RESUMED is a ledger event, not a status.
   */
  resumeMission(): ServiceResult<MissionSessionEnvelopeV1> {
    if (!canResumeFromAbandoned(this.session.status)) {
      return {
        ok: false,
        error: `Resume only allowed from ABANDONED (current: ${this.session.status})`,
        code: "INVALID_TRANSITION",
      };
    }
    const before = this.getSnapshot();
    const appended = this.append("SESSION_RESUMED", "SYSTEM", {
      restoredStatus: "IN_PROGRESS",
      policy: "restart",
    });
    if (!appended.ok) {
      this.session = before;
      return appended;
    }
    // Restart policy: keep evidence; clear decision/consequence for re-diagnosis.
    this.session.decisionId = null;
    this.session.consequenceId = null;
    this.session.debriefAcknowledged = false;
    this.touch("IN_PROGRESS");
    return { ok: true, value: this.getSnapshot() };
  }

  /**
   * Browser-session restore: keep last valid status; append SESSION_RESUMED only.
   * Does not change status (SESSION_RESUMED is not a status).
   */
  resumeFromStorageRestore(): ServiceResult<MissionSessionEnvelopeV1> {
    if (this.session.status === "NOT_STARTED" || this.session.status === "COMPLETED") {
      return { ok: true, value: this.getSnapshot() };
    }
    const before = this.getSnapshot();
    const appended = this.append("SESSION_RESUMED", "SYSTEM", {
      restoredStatus: this.session.status,
      policy: "storage-restore",
    });
    if (!appended.ok) {
      this.session = before;
      return appended;
    }
    this.session.updatedAt = this.clock.nowIso();
    return { ok: true, value: this.getSnapshot() };
  }
}
