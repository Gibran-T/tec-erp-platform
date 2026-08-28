import {
  MissionSessionService,
  createStrictTestDeps,
  type MissionServiceDeps,
} from "../missionService.js";
import { EVIDENCE_IDS } from "../evidenceCatalog.js";
import type { DecisionOptionId } from "../types.js";

export function createService(seed = "cp1"): {
  service: MissionSessionService;
  deps: MissionServiceDeps;
} {
  const deps = createStrictTestDeps(seed);
  return { service: new MissionSessionService(deps), deps };
}

/** Happy path through consequence (debrief not yet acknowledged). */
export function advanceToConsequence(
  service: MissionSessionService,
  option: DecisionOptionId = "DEMAND_QUANTITY",
): void {
  const started = service.startMission();
  if (!started.ok) throw new Error(started.error);
  const evidence = service.collectEvidence(EVIDENCE_IDS[0]);
  if (!evidence.ok) throw new Error(evidence.error);
  const decision = service.recordDecision(option);
  if (!decision.ok) throw new Error(decision.error);
  const consequence = service.applyConsequence();
  if (!consequence.ok) throw new Error(consequence.error);
}

/** Full happy path to COMPLETED. */
export function advanceToCompleted(
  service: MissionSessionService,
  option: DecisionOptionId = "DEMAND_QUANTITY",
): void {
  advanceToConsequence(service, option);
  const debrief = service.acknowledgeDebrief();
  if (!debrief.ok) throw new Error(debrief.error);
  const completed = service.completeMission();
  if (!completed.ok) throw new Error(completed.error);
}
