import { Entity } from "./entity.js";

export interface DomainEventRecord {
  readonly occurredAt: Date;
  readonly eventName: string;
}

export abstract class AggregateRoot<
  TId,
  TEvent extends DomainEventRecord = DomainEventRecord,
> extends Entity<TId> {
  private readonly _domainEvents: TEvent[] = [];

  protected addDomainEvent(event: TEvent): void {
    this._domainEvents.push(event);
  }

  pullDomainEvents(): TEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  get domainEvents(): readonly TEvent[] {
    return this._domainEvents;
  }
}
