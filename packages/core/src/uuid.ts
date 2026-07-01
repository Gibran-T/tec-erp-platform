import { randomUUID } from "node:crypto";

export interface UuidGenerator {
  generate(): string;
  fromString(value: string): string;
}

class CryptoUuidGenerator implements UuidGenerator {
  generate(): string {
    return randomUUID();
  }

  fromString(value: string): string {
    const normalized = value.trim();
    if (!isValidUuid(normalized)) {
      throw new Error(`Invalid UUID: ${value}`);
    }
    return normalized;
  }
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

let generator: UuidGenerator = new CryptoUuidGenerator();

export const Uuid = {
  generate(): string {
    return generator.generate();
  },

  fromString(value: string): string {
    return generator.fromString(value);
  },

  useGenerator(nextGenerator: UuidGenerator): void {
    generator = nextGenerator;
  },

  resetGenerator(): void {
    generator = new CryptoUuidGenerator();
  },
};
