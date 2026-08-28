import type { MissionStatus } from "./types.js";

/**
 * Frozen allowed status transitions for SO-1048 Mission 1 entry.
 * SESSION_RESUMED is a ledger event, not a status.
 */

const ALLOWED: Readonly<Record<MissionStatus, readonly MissionStatus[]>> = {
  NOT_STARTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["DECISION_RECORDED", "ABANDONED"],
  DECISION_RECORDED: ["CONSEQUENCE_APPLIED", "ABANDONED"],
  CONSEQUENCE_APPLIED: ["COMPLETED", "ABANDONED"],
  ABANDONED: ["IN_PROGRESS"],
  COMPLETED: [],
};

export function canTransition(from: MissionStatus, to: MissionStatus): boolean {
  return ALLOWED[from].includes(to);
}

export function assertTransition(
  from: MissionStatus,
  to: MissionStatus,
): { ok: true } | { ok: false; error: string } {
  if (from === "COMPLETED") {
    return {
      ok: false,
      error: `COMPLETED is terminal; cannot transition to ${to}`,
    };
  }
  if (!canTransition(from, to)) {
    return {
      ok: false,
      error: `Invalid transition ${from} → ${to}`,
    };
  }
  return { ok: true };
}

export function isTerminal(status: MissionStatus): boolean {
  return status === "COMPLETED";
}

/** Evidence may be collected while the mission is actively in progress before decision. */
export function canCollectEvidence(status: MissionStatus): boolean {
  return status === "IN_PROGRESS";
}

export function canRecordDecision(status: MissionStatus): boolean {
  return status === "IN_PROGRESS";
}

export function canApplyConsequence(status: MissionStatus): boolean {
  return status === "DECISION_RECORDED";
}

export function canAcknowledgeDebrief(status: MissionStatus): boolean {
  return status === "CONSEQUENCE_APPLIED";
}

export function canComplete(status: MissionStatus): boolean {
  return status === "CONSEQUENCE_APPLIED";
}

export function canAbandon(status: MissionStatus): boolean {
  return (
    status === "IN_PROGRESS" ||
    status === "DECISION_RECORDED" ||
    status === "CONSEQUENCE_APPLIED"
  );
}

export function canResumeFromAbandoned(status: MissionStatus): boolean {
  return status === "ABANDONED";
}

export function getAllowedTransitions(from: MissionStatus): readonly MissionStatus[] {
  return ALLOWED[from];
}
