import { describe, expect, it, vi } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { advanceToCompleted, createService } from "./helpers.js";
import { createMemoryStorage, SessionStorageAdapter } from "../sessionStorageAdapter.js";

const missionEntryDir = join(dirname(fileURLToPath(import.meta.url)), "..");

function listSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") continue;
      files.push(...listSourceFiles(full));
    } else if (entry.name.endsWith(".ts")) {
      files.push(full);
    }
  }
  return files;
}

describe("Isolation (IS-01 … IS-05)", () => {
  it("IS-01 no fetch usage during mission loop", () => {
    const fetchSpy = vi.fn(() => {
      throw new Error("fetch must not be called");
    });
    const g = globalThis as { fetch?: typeof fetchSpy };
    const prev = g.fetch;
    g.fetch = fetchSpy;
    try {
      const { service, deps } = createService("is01");
      advanceToCompleted(service);
      const adapter = new SessionStorageAdapter({
        storage: createMemoryStorage(),
        deps,
        service,
      });
      expect(adapter.save().ok).toBe(true);
      expect(adapter.hydrate().ok).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      g.fetch = prev;
    }
  });

  it("IS-02 no useAuth import under mission-entry", () => {
    const sources = listSourceFiles(missionEntryDir);
    expect(sources.length).toBeGreaterThan(0);
    for (const file of sources) {
      const text = readFileSync(file, "utf8");
      expect(text).not.toMatch(/useAuth/);
      expect(text).not.toMatch(/AuthContext/);
    }
  });

  it("IS-03 no API / Prisma / database imports", () => {
    const sources = listSourceFiles(missionEntryDir);
    for (const file of sources) {
      const text = readFileSync(file, "utf8");
      expect(text).not.toMatch(/from ["'].*apps\/api/);
      expect(text).not.toMatch(/@prisma\/client/);
      expect(text).not.toMatch(/from ["'].*prisma/);
      expect(text).not.toMatch(/DATABASE_URL/);
      expect(text).not.toMatch(/from ["']pg["']/);
    }
  });

  it("IS-04 no localStorage in mission-entry source", () => {
    const sources = listSourceFiles(missionEntryDir);
    for (const file of sources) {
      const text = readFileSync(file, "utf8");
      // Allow mentioning localStorage only as a forbidden comment/string in docs sense —
      // adapter explicitly documents never touching it; ensure no localStorage. calls.
      expect(text).not.toMatch(/localStorage\./);
      expect(text).not.toMatch(/globalThis\.localStorage/);
    }
  });

  it("IS-05 no production mutation path (no workspace/auth/api side effects)", () => {
    const sources = listSourceFiles(missionEntryDir);
    for (const file of sources) {
      const text = readFileSync(file, "utf8");
      expect(text).not.toMatch(/ProtectedRoute/);
      expect(text).not.toMatch(/WorkspaceLayout/);
      expect(text).not.toMatch(/\/api\//);
      expect(text).not.toMatch(/fetch\s*\(/);
    }
    const { service } = createService("is05");
    advanceToCompleted(service);
    // Completing a playback session must remain in-memory only
    expect(service.getSnapshot().learnerId).toBe("playback-demo");
    expect(service.getSnapshot().missionId).toBe("SO-1048-M1");
  });
});
