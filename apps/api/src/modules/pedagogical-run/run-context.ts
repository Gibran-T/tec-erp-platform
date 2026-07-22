import { AsyncLocalStorage } from "node:async_hooks";

import type { ResolvedPedagogicalRun } from "./pedagogical-run.resolution.js";

const storage = new AsyncLocalStorage<ResolvedPedagogicalRun>();

export function runWithPedagogicalRun<T>(
  run: ResolvedPedagogicalRun,
  fn: () => Promise<T>,
): Promise<T> {
  return storage.run(run, fn);
}

export function getCurrentPedagogicalRun(): ResolvedPedagogicalRun | undefined {
  return storage.getStore();
}

export function requireCurrentPedagogicalRunId(): string {
  const run = storage.getStore();
  if (!run) {
    throw new Error("Pedagogical run context missing");
  }
  return run.id;
}
