import { Result } from "@tec-platform/core";
import { describe, expect, it } from "vitest";

import { issueToken, verifyToken } from "../auth.tokens.js";

const SECRET = "test-access-secret";
const OTHER_SECRET = "different-secret";

describe("auth tokens", () => {
  it("issues a token that verifies and carries its claims", () => {
    const nowMs = 1_000_000_000_000;
    const issued = issueToken({ sub: "emp_1", typ: "access" }, SECRET, 900, nowMs);

    const verified = verifyToken(issued.token, SECRET, "access", nowMs);

    expect(Result.isOk(verified)).toBe(true);
    if (Result.isOk(verified)) {
      expect(verified.value.sub).toBe("emp_1");
      expect(verified.value.typ).toBe("access");
    }
  });

  it("rejects a token signed with a different secret", () => {
    const issued = issueToken({ sub: "emp_1", typ: "access" }, SECRET, 900);
    const verified = verifyToken(issued.token, OTHER_SECRET, "access");

    expect(Result.isFail(verified)).toBe(true);
  });

  it("rejects a token whose type does not match", () => {
    const issued = issueToken({ sub: "emp_1", typ: "refresh" }, SECRET, 900);
    const verified = verifyToken(issued.token, SECRET, "access");

    expect(Result.isFail(verified)).toBe(true);
  });

  it("rejects an expired token", () => {
    const nowMs = 1_000_000_000_000;
    const issued = issueToken({ sub: "emp_1", typ: "access" }, SECRET, 60, nowMs);

    const verified = verifyToken(issued.token, SECRET, "access", nowMs + 61_000);

    expect(Result.isFail(verified)).toBe(true);
    if (Result.isFail(verified)) {
      expect(verified.error.code).toBe("UNAUTHORIZED");
    }
  });

  it("rejects a tampered token", () => {
    const issued = issueToken({ sub: "emp_1", typ: "access" }, SECRET, 900);
    const tampered = `${issued.token}x`;

    expect(Result.isFail(verifyToken(tampered, SECRET, "access"))).toBe(true);
  });

  it("rejects a malformed token", () => {
    expect(Result.isFail(verifyToken("not-a-jwt", SECRET, "access"))).toBe(true);
  });
});
