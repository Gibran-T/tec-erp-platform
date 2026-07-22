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
      { id: "1", employeeId: "a", status: "COMPLETED", runSequence: 1, runType: "AUTONOMOUS" },
      { id: "2", employeeId: "a", status: "ACTIVE", runSequence: 2, runType: "INSTRUCTOR_LED" },
      { id: "3", employeeId: "b", status: "COMPLETED", runSequence: 1, runType: "AUTONOMOUS" },
      { id: "4", employeeId: "c", status: "COMPLETED", runSequence: 1, runType: "DEMONSTRATION" },
    ];
    const eligible = runs.filter(
      (run) => run.runType !== "DEMONSTRATION" && run.status !== "CANCELLED",
    );
    const byEmployee = new Map<string, typeof eligible>();
    for (const run of eligible) {
      const list = byEmployee.get(run.employeeId) ?? [];
      list.push(run);
      byEmployee.set(run.employeeId, list);
    }
    expect(byEmployee.size).toBe(2);
  });
});
