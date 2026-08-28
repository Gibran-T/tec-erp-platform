import { describe, expect, it } from "vitest";

import {
  ELE_M3_PILOT_EVENTS,
  getEleM3PilotEvents,
  isEleM3PilotModule,
} from "../ele-m3-pilot.js";

describe("ele-m3-pilot", () => {
  it("defines authored stakeholder events for M3 P2P", () => {
    expect(ELE_M3_PILOT_EVENTS.length).toBeGreaterThanOrEqual(3);
    for (const event of ELE_M3_PILOT_EVENTS) {
      expect(event.moduleCode).toBe("M3");
      expect(event.processArea).toBe("P2P");
      expect(event.authored).toBe(true);
      expect(event.note.length).toBeGreaterThan(10);
    }
  });

  it("returns events only for M3 module code", () => {
    expect(getEleM3PilotEvents("M3")).toHaveLength(ELE_M3_PILOT_EVENTS.length);
    expect(getEleM3PilotEvents("m3")).toHaveLength(ELE_M3_PILOT_EVENTS.length);
    expect(getEleM3PilotEvents("M2")).toHaveLength(0);
    expect(getEleM3PilotEvents("M4")).toHaveLength(0);
  });

  it("scopes pilot flag to M3", () => {
    expect(isEleM3PilotModule("M3")).toBe(true);
    expect(isEleM3PilotModule("M1")).toBe(false);
  });
});
