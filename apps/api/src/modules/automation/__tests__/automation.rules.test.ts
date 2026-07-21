import { describe, expect, it } from "vitest";

import { isPredefinedAutomationRule, PREDEFINED_AUTOMATION_RULES } from "../automation.rules.js";

describe("automation predefined-only", () => {
  it("accepts only seeded predefined rule keys", () => {
    for (const key of PREDEFINED_AUTOMATION_RULES) {
      expect(isPredefinedAutomationRule(key)).toBe(true);
    }
    expect(isPredefinedAutomationRule("custom_user_rule")).toBe(false);
  });
});
