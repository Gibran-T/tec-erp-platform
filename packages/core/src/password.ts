import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Platform password primitive — scrypt-based hashing with per-hash salt.
 *
 * Cross-cutting security primitive shared by any product that authenticates
 * an identity. No product coupling, no external dependencies. The stored
 * format is self-describing so verification never needs external parameters:
 *
 *   scrypt$<keylen>$<saltHex>$<hashHex>
 *
 * A caller may supply a deterministic salt (e.g. for reproducible demo seeds).
 * Production credentials must always use a random salt (the default).
 */
const ALGORITHM = "scrypt";
const KEY_LENGTH = 64;
const SALT_BYTES = 16;

function derive(plain: string, saltHex: string): string {
  const salt = Buffer.from(saltHex, "hex");
  return scryptSync(plain, salt, KEY_LENGTH).toString("hex");
}

export const Password = {
  hash(plain: string, salt?: string): string {
    const saltHex = salt ?? randomBytes(SALT_BYTES).toString("hex");
    const hashHex = derive(plain, saltHex);
    return `${ALGORITHM}$${KEY_LENGTH}$${saltHex}$${hashHex}`;
  },

  verify(plain: string, stored: string): boolean {
    const parts = stored.split("$");

    if (parts.length !== 4 || parts[0] !== ALGORITHM) {
      return false;
    }

    const [, keyLength, saltHex, expectedHashHex] = parts;

    if (keyLength !== String(KEY_LENGTH) || !saltHex || !expectedHashHex) {
      return false;
    }

    const actualHashHex = derive(plain, saltHex);
    const actual = Buffer.from(actualHashHex, "hex");
    const expected = Buffer.from(expectedHashHex, "hex");

    if (actual.length !== expected.length) {
      return false;
    }

    return timingSafeEqual(actual, expected);
  },
};
