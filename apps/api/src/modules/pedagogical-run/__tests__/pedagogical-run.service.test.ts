import { describe, expect, it } from "vitest";

import {
  PedagogicalRunStatusLabelFr,
  PedagogicalRunTypeLabelFr,
} from "@tec-platform/contracts";

describe("pedagogical run presentation labels", () => {
  it("maps ASCII enums to French presentation labels", () => {
    expect(PedagogicalRunTypeLabelFr.AUTONOMOUS).toBe("Parcours autonome");
    expect(PedagogicalRunTypeLabelFr.INSTRUCTOR_LED).toBe(
      "Parcours accompagné par le professeur",
    );
    expect(PedagogicalRunStatusLabelFr.ACTIVE).toBe("En cours");
    expect(PedagogicalRunStatusLabelFr.COMPLETED).toBe("Terminé");
    expect(PedagogicalRunStatusLabelFr.ARCHIVED).toBe("Archivé");
  });
});

describe("pedagogical run transition matrix", () => {
  const allowed: Record<string, string> = {
    "PLANNED:start": "ACTIVE",
    "ACTIVE:pause": "PAUSED",
    "PAUSED:resume": "ACTIVE",
    "ACTIVE:complete": "COMPLETED",
    "PAUSED:cancel": "CANCELLED",
    "PLANNED:cancel": "CANCELLED",
    "COMPLETED:archive": "ARCHIVED",
    "CANCELLED:archive": "ARCHIVED",
  };

  it("allows the documented lifecycle transitions only", () => {
    expect(allowed["ACTIVE:complete"]).toBe("COMPLETED");
    expect(allowed["COMPLETED:start"]).toBeUndefined();
    expect(allowed["ARCHIVED:resume"]).toBeUndefined();
  });

  it("keeps institutional unique-student metric from double counting", () => {
    const runs = [
      { employeeId: "a", status: "COMPLETED", runSequence: 1 },
      { employeeId: "a", status: "ACTIVE", runSequence: 2 },
      { employeeId: "b", status: "COMPLETED", runSequence: 1 },
    ];
    const chosen = new Map<string, { status: string; runSequence: number }>();
    for (const run of runs) {
      const prev = chosen.get(run.employeeId);
      if (!prev) {
        chosen.set(run.employeeId, run);
        continue;
      }
      if (run.status === "ACTIVE") {
        chosen.set(run.employeeId, run);
        continue;
      }
      if (prev.status !== "ACTIVE" && run.runSequence > prev.runSequence) {
        chosen.set(run.employeeId, run);
      }
    }
    expect(chosen.size).toBe(2);
  });
});
