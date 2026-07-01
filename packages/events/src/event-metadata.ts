export interface EventMetadata {
  readonly correlationId: string;
  readonly causationId: string;
  readonly productId: string;
  readonly actorId: string;
}

export interface EventMetadataInput {
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly productId: string;
  readonly actorId?: string;
}

export function createEventMetadata(input: EventMetadataInput): EventMetadata {
  return {
    correlationId: input.correlationId ?? input.productId,
    causationId: input.causationId ?? input.productId,
    productId: input.productId,
    actorId: input.actorId ?? "system",
  };
}
