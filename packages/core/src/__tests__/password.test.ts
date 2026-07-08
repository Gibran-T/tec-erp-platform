import { describe, expect, it } from "vitest";

import { Password } from "../password.js";

describe("Password", () => {
  it("verifies a correct password against its hash", () => {
    const stored = Password.hash("Bienvenue2025!");

    expect(Password.verify("Bienvenue2025!", stored)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    const stored = Password.hash("Bienvenue2025!");

    expect(Password.verify("wrong-password", stored)).toBe(false);
  });

  it("produces different hashes for random salts", () => {
    const first = Password.hash("same-password");
    const second = Password.hash("same-password");

    expect(first).not.toBe(second);
  });

  it("is deterministic when an explicit salt is provided", () => {
    const salt = "00112233445566778899aabbccddeeff";
    const first = Password.hash("demo-password", salt);
    const second = Password.hash("demo-password", salt);

    expect(first).toBe(second);
    expect(Password.verify("demo-password", first)).toBe(true);
  });

  it("rejects malformed stored values", () => {
    expect(Password.verify("x", "not-a-valid-hash")).toBe(false);
    expect(Password.verify("x", "")).toBe(false);
  });
});
