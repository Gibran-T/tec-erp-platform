import { Uuid } from "@tec-platform/core";

export interface DomainEventProps {
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly occurredAt: Date;
  readonly eventId?: string;
}

export abstract class DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly aggregateId: string;
  readonly aggregateType: string;

  abstract readonly eventName: string;

  protected constructor(props: DomainEventProps) {
    this.eventId = props.eventId ?? Uuid.generate();
    this.occurredAt = props.occurredAt;
    this.aggregateId = props.aggregateId;
    this.aggregateType = props.aggregateType;
  }
}
