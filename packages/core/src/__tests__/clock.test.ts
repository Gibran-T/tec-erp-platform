import { afterEach, describe, expect, it } from "vitest";

import { Clock } from "../clock.js";

describe("Clock", () => {
  afterEach(() => {
    Clock.reset();
  });

  it("returns a fixed timestamp", () => {
    const fixed = new Date("2026-07-01T12:00:00.000Z");
    Clock.use(Clock.fixed(fixed));

    expect(Clock.now().toISOString()).toBe("2026-07-01T12:00:00.000Z");
  });

  it("uses system clock by default", () => {
    const before = Date.now();
    const now = Clock.now().getTime();
    const after = Date.now();

    expect(now).toBeGreaterThanOrEqual(before);
    expect(now).toBeLessThanOrEqual(after);
  });
});
