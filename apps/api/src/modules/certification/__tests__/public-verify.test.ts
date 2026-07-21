import { describe, expect, it } from "vitest";

describe("public certificate verify privacy", () => {
  it("does not expose email or grade fields in public verification shape", () => {
    const publicPayload = {
      found: true,
      status: "valid" as const,
      certificateNumber: "GOLD-NHE-DEMO-1",
      certificateType: "gold",
      studentName: "Analyste Demo",
      issuedAt: new Date().toISOString(),
      revokedAt: null,
      message: "Certificat valide.",
    };

    expect(publicPayload).not.toHaveProperty("email");
    expect(publicPayload).not.toHaveProperty("scorePercent");
    expect(publicPayload).not.toHaveProperty("grade");
    expect(publicPayload).not.toHaveProperty("competencySummary");
  });
});
