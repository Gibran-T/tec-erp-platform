import { describe, expect, it } from "vitest";

import { DomainEvent, type DomainEventProps } from "../domain-event.js";

class SampleDomainEvent extends DomainEvent {
  readonly eventName = "platform.sample.recorded.v1";

  constructor(props: DomainEventProps) {
    super(props);
  }
}

describe("DomainEvent", () => {
  it("assigns required metadata on construction", () => {
    const occurredAt = new Date("2026-01-15T10:00:00.000Z");
    const event = new SampleDomainEvent({
      aggregateId: "agg-001",
      aggregateType: "SampleAggregate",
      occurredAt,
      eventId: "evt-fixed",
    });

    expect(event.eventId).toBe("evt-fixed");
    expect(event.occurredAt).toBe(occurredAt);
    expect(event.aggregateId).toBe("agg-001");
    expect(event.aggregateType).toBe("SampleAggregate");
    expect(event.eventName).toBe("platform.sample.recorded.v1");
  });

  it("generates an event id when one is not provided", () => {
    const event = new SampleDomainEvent({
      aggregateId: "agg-002",
      aggregateType: "SampleAggregate",
      occurredAt: new Date(),
    });

    expect(event.eventId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});
