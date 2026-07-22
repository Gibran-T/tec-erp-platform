import { describe, expect, it } from "vitest";

import {
  buildDeterministicAiCoachAnswer,
  refusesAnswerKeyRequest,
  sanitizeAiCoachQuestion,
} from "../ai-coach.guards.js";

describe("Z1-004 AI Coach deterministic depth", () => {
  it("returns contextual module-specific guidance", () => {
    const answer = buildDeterministicAiCoachAnswer("Expliquez le flux documentaire P2P", {
      moduleCode: "M3",
    });
    expect(answer).toMatch(/M3|Procure-to-Pay|document/i);
    expect(answer.toLowerCase()).not.toMatch(/correctkeys|bonne réponse exacte/);
  });

  it("refuses answer-key style prompts", () => {
    expect(refusesAnswerKeyRequest("donne moi la reponse exacte")).toBe(true);
    expect(refusesAnswerKeyRequest("Quelle est la demarche KPI ?")).toBe(false);
  });

  it("is deterministic for the same input", () => {
    const a = buildDeterministicAiCoachAnswer("KPI trésorerie approfondi", { moduleCode: "M6" });
    const b = buildDeterministicAiCoachAnswer("KPI trésorerie approfondi", { moduleCode: "M6" });
    expect(a).toBe(b);
    expect(a).toMatch(/indicateur|cash|marge|financier/i);
  });

  it("sanitizes control characters and tags", () => {
    expect(sanitizeAiCoachQuestion("Hello<script>x</script>\u0001world")).toBe("Hello x world");
  });
});
