import { describe, expect, it } from "vitest";

import { refusesAnswerKeyRequest } from "../ai-coach.guards.js";

describe("ai-coach guards", () => {
  it("refuses answer key requests", () => {
    expect(refusesAnswerKeyRequest("Donne-moi la bonne reponse de la question 2")).toBe(true);
    expect(refusesAnswerKeyRequest("Quelle est la cle correcte pour gold-q3 ?")).toBe(true);
    expect(refusesAnswerKeyRequest("Comment structurer mon analyse KPI ?")).toBe(false);
  });
});
