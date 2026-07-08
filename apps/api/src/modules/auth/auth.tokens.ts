import { createHmac, timingSafeEqual } from "node:crypto";

import { DomainError, Result, type Result as ResultType } from "@tec-platform/core";

/**
 * Minimal HS256 JWT implementation using Node's built-in crypto — no external
 * dependency, Railway-friendly, fully testable. Sufficient for RC01 Slice A
 * (stateless access + refresh tokens, single role). Not a general JWT library.
 */
export type TokenType = "access" | "refresh";

export interface TokenClaims {
  readonly sub: string;
  readonly typ: TokenType;
  readonly iat: number;
  readonly exp: number;
}

export interface IssuedToken {
  readonly token: string;
  readonly expiresAt: Date;
}

interface JwtHeader {
  readonly alg: "HS256";
  readonly typ: "JWT";
}

function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64");
}

function sign(data: string, secret: string): string {
  return base64UrlEncode(createHmac("sha256", secret).update(data).digest());
}

export function issueToken(
  claims: Pick<TokenClaims, "sub" | "typ">,
  secret: string,
  ttlSeconds: number,
  nowMs: number = Date.now(),
): IssuedToken {
  const issuedAt = Math.floor(nowMs / 1000);
  const expiresAt = issuedAt + ttlSeconds;

  const header: JwtHeader = { alg: "HS256", typ: "JWT" };
  const payload: TokenClaims = {
    sub: claims.sub,
    typ: claims.typ,
    iat: issuedAt,
    exp: expiresAt,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = sign(signingInput, secret);

  return {
    token: `${signingInput}.${signature}`,
    expiresAt: new Date(expiresAt * 1000),
  };
}

export function verifyToken(
  token: string,
  secret: string,
  expectedType: TokenType,
  nowMs: number = Date.now(),
): ResultType<TokenClaims> {
  const segments = token.split(".");

  if (segments.length !== 3) {
    return Result.fail(DomainError.unauthorized("Malformed token."));
  }

  const [encodedHeader, encodedPayload, providedSignature] = segments;
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = sign(signingInput, secret);

  const provided = base64UrlDecode(providedSignature ?? "");
  const expected = base64UrlDecode(expectedSignature);

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return Result.fail(DomainError.unauthorized("Invalid token signature."));
  }

  let claims: TokenClaims;

  try {
    claims = JSON.parse(base64UrlDecode(encodedPayload ?? "").toString("utf8")) as TokenClaims;
  } catch {
    return Result.fail(DomainError.unauthorized("Unreadable token payload."));
  }

  if (claims.typ !== expectedType) {
    return Result.fail(DomainError.unauthorized("Unexpected token type."));
  }

  if (Math.floor(nowMs / 1000) >= claims.exp) {
    return Result.fail(DomainError.unauthorized("Token has expired."));
  }

  return Result.ok(claims);
}
