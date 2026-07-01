import { AggregateRoot as CoreAggregateRoot } from "@tec-platform/core";

import type { DomainEvent } from "./domain-event.js";

export abstract class AggregateRoot<TId> extends CoreAggregateRoot<TId, DomainEvent> {
  protected recordEvent(event: DomainEvent): void {
    this.addDomainEvent(event);
  }
}
