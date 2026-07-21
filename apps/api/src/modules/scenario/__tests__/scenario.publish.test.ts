import { describe, expect, it } from "vitest";

import { createScenarioService } from "../scenario.service.js";

describe("scenario publish immutability", () => {
  it("treats published versions as immutable", () => {
    const service = createScenarioService({} as never);
    expect(service.isVersionImmutable({ status: "published" })).toBe(true);
    expect(service.isVersionImmutable({ status: "archived" })).toBe(true);
    expect(service.isVersionImmutable({ status: "draft" })).toBe(false);
  });
});
