export interface EventRegistryEntry {
  readonly eventName: string;
  readonly schemaVersion: number;
  readonly owner: string;
  readonly description: string;
}

export const PLATFORM_EVENT_NAMES = {
  PLATFORM_HEALTH_CHECKED: "platform.health.checked.v1",
} as const;

export type PlatformEventName =
  (typeof PLATFORM_EVENT_NAMES)[keyof typeof PLATFORM_EVENT_NAMES];

const registry = new Map<string, EventRegistryEntry>();

export function registerEvent(entry: EventRegistryEntry): void {
  if (registry.has(entry.eventName)) {
    throw new Error(`Event already registered: ${entry.eventName}`);
  }

  registry.set(entry.eventName, entry);
}

export function getRegisteredEvent(eventName: string): EventRegistryEntry | undefined {
  return registry.get(eventName);
}

export function listRegisteredEvents(): readonly EventRegistryEntry[] {
  return [...registry.values()];
}

export function isRegisteredEvent(eventName: string): boolean {
  return registry.has(eventName);
}

export function clearEventRegistry(): void {
  registry.clear();
}

registerEvent({
  eventName: PLATFORM_EVENT_NAMES.PLATFORM_HEALTH_CHECKED,
  schemaVersion: 1,
  owner: "platform",
  description: "Platform health connectivity verified",
});
