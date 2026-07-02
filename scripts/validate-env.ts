import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  ENV_CATALOG,
  FORBIDDEN_VITE_SECRET_PREFIX,
  REQUIRED_EXAMPLE_KEYS,
} from "./env-catalog.js";

const ROOT = resolve(import.meta.dirname, "..");
const EXAMPLE_PATH = resolve(ROOT, ".env.example");

interface ParsedExampleEntry {
  readonly key: string;
  readonly isCommented: boolean;
}

function parseEnvExample(content: string): ParsedExampleEntry[] {
  const entries: ParsedExampleEntry[] = [];

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      continue;
    }

    const isCommented = trimmed.startsWith("#");
    const activeLine = isCommented ? trimmed.replace(/^#\s?/, "") : trimmed;
    const separatorIndex = activeLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = activeLine.slice(0, separatorIndex).trim();
    entries.push({ key, isCommented });
  }

  return entries;
}

function validateEnvExample(): void {
  const content = readFileSync(EXAMPLE_PATH, "utf8");
  const parsed = parseEnvExample(content);
  const definedKeys = new Set(parsed.map((entry) => entry.key));
  const errors: string[] = [];

  for (const requiredKey of REQUIRED_EXAMPLE_KEYS) {
    if (!definedKeys.has(requiredKey)) {
      errors.push(`Missing required key in .env.example: ${requiredKey}`);
    }
  }

  for (const entry of parsed) {
    if (FORBIDDEN_VITE_SECRET_PREFIX.test(entry.key)) {
      errors.push(`Forbidden secret-like VITE variable: ${entry.key}`);
    }

    const catalogEntry = ENV_CATALOG.find((item) => item.key === entry.key);
    if (!catalogEntry) {
      errors.push(`Undocumented variable in .env.example: ${entry.key}`);
    }
  }

  for (const catalogEntry of ENV_CATALOG) {
    if (!catalogEntry.requiredInExample) {
      const exampleEntry = parsed.find((entry) => entry.key === catalogEntry.key);
      if (exampleEntry && !exampleEntry.isCommented) {
        errors.push(
          `Optional scaffold ${catalogEntry.key} must remain commented in .env.example`,
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error("Environment catalog validation failed:\n");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(
    `Environment catalog validation passed (${REQUIRED_EXAMPLE_KEYS.length} required keys, ${ENV_CATALOG.length} catalog entries).`,
  );
}

validateEnvExample();
