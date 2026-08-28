import { isKnownEvidenceId } from "./evidenceCatalog.js";
import { isConsequenceId } from "./consequenceMap.js";
import { isDecisionOptionId } from "./decisionCatalog.js";
import { isLedgerEventType } from "./ledger.js";
import {
  CONSEQUENCE_IDS,
  DECISION_OPTION_IDS,
  LEARNER_ID,
  MISSION_ID,
  MISSION_LEDGER_ACTORS,
  MISSION_STATUSES,
  SCHEMA_VERSION,
  type ConsequenceId,
  type DecisionOptionId,
  type MissionLedgerActor,
  type MissionLedgerEvent,
  type MissionSessionEnvelopeV1,
  type MissionStatus,
  type RecoveryClass,
} from "./types.js";

export type SerializeSuccess = {
  ok: true;
  json: string;
  envelope: MissionSessionEnvelopeV1;
};

export type ParseFailure = {
  ok: false;
  recoveryClass: RecoveryClass;
  error: string;
};

export type ParseSuccess = {
  ok: true;
  envelope: MissionSessionEnvelopeV1;
};

const ISO_UTC_Z = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissionStatus(value: unknown): value is MissionStatus {
  return typeof value === "string" && (MISSION_STATUSES as readonly string[]).includes(value);
}

function isActor(value: unknown): value is MissionLedgerActor {
  return typeof value === "string" && (MISSION_LEDGER_ACTORS as readonly string[]).includes(value);
}

function isIsoUtcZ(value: unknown): value is string {
  return typeof value === "string" && ISO_UTC_Z.test(value);
}

function validateLedgerEvent(
  value: unknown,
  sessionId: string,
  seenIds: Set<string>,
): { ok: true; event: MissionLedgerEvent } | ParseFailure {
  if (!isRecord(value)) {
    return { ok: false, recoveryClass: "MALFORMED_LEDGER", error: "Ledger event is not an object" };
  }

  const required = ["id", "sessionId", "timestamp", "type", "actor", "payload", "version"] as const;
  for (const key of required) {
    if (!(key in value)) {
      return {
        ok: false,
        recoveryClass: "MALFORMED_LEDGER",
        error: `Ledger event missing field: ${key}`,
      };
    }
  }

  if (typeof value.id !== "string" || value.id.length === 0) {
    return { ok: false, recoveryClass: "MALFORMED_LEDGER", error: "Invalid ledger event id" };
  }
  if (seenIds.has(value.id)) {
    return {
      ok: false,
      recoveryClass: "DUPLICATE_EVENT_IDS",
      error: `Duplicate ledger event id: ${value.id}`,
    };
  }
  seenIds.add(value.id);

  if (value.sessionId !== sessionId) {
    return {
      ok: false,
      recoveryClass: "MALFORMED_LEDGER",
      error: "Ledger event sessionId mismatch",
    };
  }

  if (!isIsoUtcZ(value.timestamp)) {
    return {
      ok: false,
      recoveryClass: "MALFORMED_LEDGER",
      error: "Ledger event timestamp must be ISO-8601 UTC ending in Z",
    };
  }

  if (typeof value.type !== "string" || !isLedgerEventType(value.type)) {
    return { ok: false, recoveryClass: "MALFORMED_LEDGER", error: "Invalid ledger event type" };
  }

  if (!isActor(value.actor)) {
    return { ok: false, recoveryClass: "MALFORMED_LEDGER", error: "Invalid ledger actor" };
  }

  if (!isRecord(value.payload)) {
    return { ok: false, recoveryClass: "MALFORMED_LEDGER", error: "Ledger payload must be object" };
  }

  if (value.version !== 1) {
    return {
      ok: false,
      recoveryClass: "MALFORMED_LEDGER",
      error: "Ledger event version must be 1",
    };
  }

  return {
    ok: true,
    event: {
      id: value.id,
      sessionId: value.sessionId as string,
      timestamp: value.timestamp,
      type: value.type,
      actor: value.actor,
      payload: { ...value.payload },
      version: 1,
    },
  };
}

function validateEnvelopeObject(value: unknown): ParseSuccess | ParseFailure {
  if (!isRecord(value)) {
    return { ok: false, recoveryClass: "INVALID_ENVELOPE", error: "Envelope is not an object" };
  }

  const requiredKeys = [
    "schemaVersion",
    "sessionId",
    "missionId",
    "learnerId",
    "status",
    "evidenceIds",
    "decisionId",
    "consequenceId",
    "debriefAcknowledged",
    "ledger",
    "createdAt",
    "updatedAt",
  ] as const;

  for (const key of requiredKeys) {
    if (!(key in value)) {
      return {
        ok: false,
        recoveryClass: "MISSING_REQUIRED_FIELD",
        error: `Missing required field: ${key}`,
      };
    }
  }

  if (value.schemaVersion !== SCHEMA_VERSION) {
    return {
      ok: false,
      recoveryClass: "UNSUPPORTED_SCHEMA",
      error: `Unsupported schemaVersion: ${String(value.schemaVersion)}`,
    };
  }

  if (typeof value.sessionId !== "string" || value.sessionId.length === 0) {
    return {
      ok: false,
      recoveryClass: "INVALID_ENVELOPE",
      error: "Invalid sessionId",
    };
  }

  if (value.missionId !== MISSION_ID) {
    return {
      ok: false,
      recoveryClass: "INVALID_ENVELOPE",
      error: "Invalid missionId",
    };
  }

  if (value.learnerId !== LEARNER_ID) {
    return {
      ok: false,
      recoveryClass: "INVALID_ENVELOPE",
      error: "Invalid learnerId",
    };
  }

  if (!isMissionStatus(value.status)) {
    return {
      ok: false,
      recoveryClass: "INVALID_STATUS",
      error: `Invalid status: ${String(value.status)}`,
    };
  }

  if (!Array.isArray(value.evidenceIds) || !value.evidenceIds.every((id) => typeof id === "string")) {
    return {
      ok: false,
      recoveryClass: "INVALID_ENVELOPE",
      error: "evidenceIds must be string[]",
    };
  }

  for (const evidenceId of value.evidenceIds) {
    if (!isKnownEvidenceId(evidenceId)) {
      return {
        ok: false,
        recoveryClass: "INVALID_ENVELOPE",
        error: `Unknown evidence id: ${evidenceId}`,
      };
    }
  }

  const uniqueEvidence = new Set(value.evidenceIds);
  if (uniqueEvidence.size !== value.evidenceIds.length) {
    return {
      ok: false,
      recoveryClass: "INVALID_ENVELOPE",
      error: "Duplicate evidenceIds",
    };
  }

  let decisionId: DecisionOptionId | null = null;
  if (value.decisionId !== null) {
    if (typeof value.decisionId !== "string" || !isDecisionOptionId(value.decisionId)) {
      return {
        ok: false,
        recoveryClass: "INVALID_ENVELOPE",
        error: "Invalid decisionId",
      };
    }
    decisionId = value.decisionId;
  }

  let consequenceId: ConsequenceId | null = null;
  if (value.consequenceId !== null) {
    if (typeof value.consequenceId !== "string" || !isConsequenceId(value.consequenceId)) {
      return {
        ok: false,
        recoveryClass: "INVALID_ENVELOPE",
        error: "Invalid consequenceId",
      };
    }
    consequenceId = value.consequenceId;
  }

  if (typeof value.debriefAcknowledged !== "boolean") {
    return {
      ok: false,
      recoveryClass: "INVALID_ENVELOPE",
      error: "debriefAcknowledged must be boolean",
    };
  }

  if (!Array.isArray(value.ledger)) {
    return {
      ok: false,
      recoveryClass: "MALFORMED_LEDGER",
      error: "ledger must be an array",
    };
  }

  if (!isIsoUtcZ(value.createdAt) || !isIsoUtcZ(value.updatedAt)) {
    return {
      ok: false,
      recoveryClass: "INVALID_ENVELOPE",
      error: "createdAt/updatedAt must be ISO-8601 UTC ending in Z",
    };
  }

  const seenIds = new Set<string>();
  const ledger: MissionLedgerEvent[] = [];
  let previousTs = "";
  for (const rawEvent of value.ledger) {
    const parsed = validateLedgerEvent(rawEvent, value.sessionId, seenIds);
    if (!parsed.ok) {
      return parsed;
    }
    if (previousTs && parsed.event.timestamp < previousTs) {
      return {
        ok: false,
        recoveryClass: "MALFORMED_LEDGER",
        error: "Ledger timestamps not monotonically non-decreasing",
      };
    }
    previousTs = parsed.event.timestamp;
    ledger.push(parsed.event);
  }

  // Lightweight coherence checks (no overengineering)
  if (value.status === "NOT_STARTED" && (decisionId !== null || consequenceId !== null)) {
    return {
      ok: false,
      recoveryClass: "INVALID_ENVELOPE",
      error: "NOT_STARTED cannot have decision/consequence",
    };
  }
  if (value.status === "COMPLETED") {
    if (value.evidenceIds.length < 1 || decisionId === null || consequenceId === null || !value.debriefAcknowledged) {
      return {
        ok: false,
        recoveryClass: "INVALID_ENVELOPE",
        error: "COMPLETED envelope fails completion coherence",
      };
    }
  }
  if (decisionId !== null && !(DECISION_OPTION_IDS as readonly string[]).includes(decisionId)) {
    return { ok: false, recoveryClass: "INVALID_ENVELOPE", error: "decisionId not in catalog" };
  }
  if (consequenceId !== null && !(CONSEQUENCE_IDS as readonly string[]).includes(consequenceId)) {
    return { ok: false, recoveryClass: "INVALID_ENVELOPE", error: "consequenceId not in catalog" };
  }

  const envelope: MissionSessionEnvelopeV1 = {
    schemaVersion: 1,
    sessionId: value.sessionId,
    missionId: MISSION_ID,
    learnerId: LEARNER_ID,
    status: value.status,
    evidenceIds: [...value.evidenceIds],
    decisionId,
    consequenceId,
    debriefAcknowledged: value.debriefAcknowledged,
    ledger,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };

  return { ok: true, envelope };
}

export function serializeEnvelope(envelope: MissionSessionEnvelopeV1): SerializeSuccess {
  const json = JSON.stringify(envelope);
  return { ok: true, json, envelope: structuredCloneEnvelope(envelope) };
}

export function parseEnvelopeJson(raw: string): ParseSuccess | ParseFailure {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, recoveryClass: "INVALID_JSON", error: "Invalid JSON" };
  }
  return validateEnvelopeObject(parsed);
}

export function validateEnvelope(value: unknown): ParseSuccess | ParseFailure {
  return validateEnvelopeObject(value);
}

export function structuredCloneEnvelope(
  envelope: MissionSessionEnvelopeV1,
): MissionSessionEnvelopeV1 {
  return {
    schemaVersion: 1,
    sessionId: envelope.sessionId,
    missionId: envelope.missionId,
    learnerId: envelope.learnerId,
    status: envelope.status,
    evidenceIds: [...envelope.evidenceIds],
    decisionId: envelope.decisionId,
    consequenceId: envelope.consequenceId,
    debriefAcknowledged: envelope.debriefAcknowledged,
    ledger: envelope.ledger.map((e) => ({
      id: e.id,
      sessionId: e.sessionId,
      timestamp: e.timestamp,
      type: e.type,
      actor: e.actor,
      payload: { ...e.payload },
      version: 1 as const,
    })),
    createdAt: envelope.createdAt,
    updatedAt: envelope.updatedAt,
  };
}
