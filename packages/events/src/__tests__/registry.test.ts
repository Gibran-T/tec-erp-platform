import { beforeEach, describe, expect, it } from "vitest";

import {
  clearEventRegistry,
  getRegisteredEvent,
  isRegisteredEvent,
  listRegisteredEvents,
  PLATFORM_EVENT_NAMES,
  registerEvent,
} from "../registry.js";

describe("EventRegistry", () => {
  beforeEach(() => {
    clearEventRegistry();
  });

  it("registers and retrieves platform events", () => {
    registerEvent({
      eventName: PLATFORM_EVENT_NAMES.PLATFORM_HEALTH_CHECKED,
      schemaVersion: 1,
      owner: "platform",
      description: "Platform health connectivity verified",
    });

    const entry = getRegisteredEvent(PLATFORM_EVENT_NAMES.PLATFORM_HEALTH_CHECKED);

    expect(entry).toEqual({
      eventName: PLATFORM_EVENT_NAMES.PLATFORM_HEALTH_CHECKED,
      schemaVersion: 1,
      owner: "platform",
      description: "Platform health connectivity verified",
    });
    expect(isRegisteredEvent(PLATFORM_EVENT_NAMES.PLATFORM_HEALTH_CHECKED)).toBe(true);
    expect(listRegisteredEvents()).toHaveLength(1);
  });

  it("rejects duplicate event registration", () => {
    const entry = {
      eventName: "platform.duplicate.sample.v1",
      schemaVersion: 1,
      owner: "platform",
      description: "Duplicate registration guard",
    };

    registerEvent(entry);

    expect(() => registerEvent(entry)).toThrow("Event already registered: platform.duplicate.sample.v1");
  });
});
