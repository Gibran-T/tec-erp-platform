export const PREDEFINED_AUTOMATION_RULES = [
  "notify_professor_repeated_failure",
  "flag_data_quality",
  "certificate_eligibility_notify",
] as const;

export type PredefinedAutomationRuleKey = (typeof PREDEFINED_AUTOMATION_RULES)[number];

export function isPredefinedAutomationRule(ruleKey: string): ruleKey is PredefinedAutomationRuleKey {
  return (PREDEFINED_AUTOMATION_RULES as readonly string[]).includes(ruleKey);
}

export function buildAutomationResult(ruleKey: PredefinedAutomationRuleKey): Record<string, unknown> {
  switch (ruleKey) {
    case "notify_professor_repeated_failure":
      return { action: "notify", target: "professor", reason: "repeated_mission_failure" };
    case "flag_data_quality":
      return { action: "flag", target: "master_data", reason: "quality_threshold" };
    case "certificate_eligibility_notify":
      return { action: "notify", target: "professor", reason: "gold_eligibility" };
    default:
      return { action: "noop" };
  }
}
