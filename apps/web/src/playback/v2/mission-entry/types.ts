/**
 * Frozen SO-1048 Mission 1 entry domain contracts (Wave 2B Checkpoint 1).
 * Pure types only — no DOM, auth, network, or persistence side effects.
 */

export const MISSION_ID = "SO-1048-M1" as const;
export const LEARNER_ID = "playback-demo" as const;
export const SCHEMA_VERSION = 1 as const;
export const DECISION_ID = "dec-primary-threat" as const;
export const SESSION_STORAGE_KEY = "tec.erp.playback.v2.so1048.m1.session.v1" as const;

export type MissionId = typeof MISSION_ID;
export type LearnerId = typeof LEARNER_ID;
export type SchemaVersion = typeof SCHEMA_VERSION;
export type DecisionId = typeof DECISION_ID;

export type MissionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "DECISION_RECORDED"
  | "CONSEQUENCE_APPLIED"
  | "COMPLETED"
  | "ABANDONED";

export const MISSION_STATUSES: readonly MissionStatus[] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "DECISION_RECORDED",
  "CONSEQUENCE_APPLIED",
  "COMPLETED",
  "ABANDONED",
] as const;

export type DecisionOptionId =
  | "DEMAND_QUANTITY"
  | "SUPPLIER_DELAY"
  | "STOCK_AVAILABILITY"
  | "WAREHOUSE_CAPACITY";

export const DECISION_OPTION_IDS: readonly DecisionOptionId[] = [
  "DEMAND_QUANTITY",
  "SUPPLIER_DELAY",
  "STOCK_AVAILABILITY",
  "WAREHOUSE_CAPACITY",
] as const;

export type ConsequenceId =
  | "cns-demand-01"
  | "cns-supplier-01"
  | "cns-stock-01"
  | "cns-warehouse-01";

export const CONSEQUENCE_IDS: readonly ConsequenceId[] = [
  "cns-demand-01",
  "cns-supplier-01",
  "cns-stock-01",
  "cns-warehouse-01",
] as const;

export type MissionLedgerEventType =
  | "MISSION_1_STARTED"
  | "EVIDENCE_COLLECTED"
  | "DECISION_RECORDED"
  | "CONSEQUENCE_APPLIED"
  | "DEBRIEF_ACKNOWLEDGED"
  | "MISSION_1_COMPLETED"
  | "SESSION_RESUMED"
  | "SESSION_ABANDONED"
  | "SESSION_RECOVERY_RESET";

export const MISSION_LEDGER_EVENT_TYPES: readonly MissionLedgerEventType[] = [
  "MISSION_1_STARTED",
  "EVIDENCE_COLLECTED",
  "DECISION_RECORDED",
  "CONSEQUENCE_APPLIED",
  "DEBRIEF_ACKNOWLEDGED",
  "MISSION_1_COMPLETED",
  "SESSION_RESUMED",
  "SESSION_ABANDONED",
  "SESSION_RECOVERY_RESET",
] as const;

export type MissionLedgerActor =
  | "LEARNER"
  | "SYSTEM"
  | "VISIBLE_AI"
  | "AMBIENT_STAKEHOLDER";

export const MISSION_LEDGER_ACTORS: readonly MissionLedgerActor[] = [
  "LEARNER",
  "SYSTEM",
  "VISIBLE_AI",
  "AMBIENT_STAKEHOLDER",
] as const;

export type MissionLedgerEvent = {
  id: string;
  sessionId: string;
  timestamp: string;
  type: MissionLedgerEventType;
  actor: MissionLedgerActor;
  payload: Record<string, unknown>;
  version: 1;
};

export type MissionSessionEnvelopeV1 = {
  schemaVersion: 1;
  sessionId: string;
  missionId: MissionId;
  learnerId: LearnerId;
  status: MissionStatus;
  evidenceIds: string[];
  decisionId: DecisionOptionId | null;
  consequenceId: ConsequenceId | null;
  debriefAcknowledged: boolean;
  ledger: MissionLedgerEvent[];
  createdAt: string;
  updatedAt: string;
};

export type ServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; code: MissionServiceErrorCode };

export type MissionServiceErrorCode =
  | "INVALID_TRANSITION"
  | "INVALID_EVIDENCE"
  | "INVALID_DECISION"
  | "CONSEQUENCE_ALREADY_APPLIED"
  | "DECISION_LOCKED"
  | "COMPLETION_BLOCKED"
  | "INVALID_STATE"
  | "TERMINAL_STATE";

export type RecoveryClass =
  | "MISSING_KEY"
  | "INVALID_JSON"
  | "UNSUPPORTED_SCHEMA"
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_STATUS"
  | "MALFORMED_LEDGER"
  | "DUPLICATE_EVENT_IDS"
  | "INVALID_ENVELOPE"
  | "NONE";

export type RecoveryNotice = {
  active: boolean;
  recoveryClass: RecoveryClass;
  message: string;
};

export type MissionClock = {
  nowIso(): string;
};

export type MissionIdFactory = {
  nextId(prefix: string): string;
};

export type SessionStorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};
