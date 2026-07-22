import { DomainError } from "@tec-platform/core";

import {
  requireWritableRun,
  resolvePedagogicalRunForEmployee,
} from "./pedagogical-run.resolution.js";
import { runWithPedagogicalRun } from "./run-context.js";

export async function withEmployeeRunContext<T>(input: {
  readonly employeeId: string;
  readonly explicitRunId?: string | null;
  readonly forWrite: boolean;
  readonly fn: () => Promise<T>;
}): Promise<T> {
  const run = input.forWrite
    ? await requireWritableRun({
        employeeId: input.employeeId,
        explicitRunId: input.explicitRunId,
      })
    : await resolvePedagogicalRunForEmployee({
        employeeId: input.employeeId,
        explicitRunId: input.explicitRunId,
        forWrite: false,
      });

  if (!run) {
    // Read path with no runs yet: execute without context (empty progress).
    if (!input.forWrite) {
      return input.fn();
    }
    throw DomainError.conflict("Aucun parcours pédagogique ACTIVE disponible.");
  }

  return runWithPedagogicalRun(run, input.fn);
}

export function extractRunId(req: {
  query?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  body?: unknown;
}): string | null {
  const q = req.query?.runId;
  if (typeof q === "string" && q.length > 0) {
    return q;
  }
  const header = req.headers?.["x-tec-run-id"];
  if (typeof header === "string" && header.length > 0) {
    return header;
  }
  if (
    req.body &&
    typeof req.body === "object" &&
    "runId" in req.body &&
    typeof (req.body as { runId: unknown }).runId === "string"
  ) {
    return (req.body as { runId: string }).runId;
  }
  return null;
}
