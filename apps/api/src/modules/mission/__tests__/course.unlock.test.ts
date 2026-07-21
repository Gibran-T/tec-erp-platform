import { describe, expect, it } from "vitest";
import { Result } from "@tec-platform/core";

import { FIRST_TASK_KEY, MANAGER_MESSAGE_KEY } from "../../first-day/first-day.catalog.js";
import { createInMemoryFirstDayStateRepository } from "../../first-day/__tests__/first-day.fixtures.js";
import { createMissionUnlockStateReader } from "../mission.unlock.js";
import { createMissionService } from "../mission.service.js";
import {
  createInMemoryCourseProgressRepository,
  createInMemoryMissionAttemptRepository,
  createInMemoryUnlockStateRepository,
} from "./mission.fixtures.js";

function createUnlockedReader(employeeId: string) {
  return createMissionUnlockStateReader(
    createInMemoryFirstDayStateRepository({
      messages: [
        {
          employeeId,
          messageKey: MANAGER_MESSAGE_KEY,
          readAt: new Date("2026-07-10T10:00:00.000Z"),
        },
      ],
      tasks: [
        {
          employeeId,
          taskKey: FIRST_TASK_KEY,
          completedAt: new Date("2026-07-10T11:00:00.000Z"),
        },
      ],
    }),
  );
}

describe("course unlock ordering", () => {
  it("keeps M02/M03 locked until prior missions complete", async () => {
    const attempts = createInMemoryMissionAttemptRepository();
    const unlockStates = createInMemoryUnlockStateRepository();
    const courseProgress = createInMemoryCourseProgressRepository();
    const service = createMissionService({
      attemptRepository: attempts,
      unlockReader: createUnlockedReader("emp_1"),
      unlockStates,
      courseProgress,
      now: () => new Date("2026-07-21T12:00:00.000Z"),
    });

    const initial = await service.listMissions("emp_1");
    expect(initial.missions.map((mission) => mission.status)).toEqual([
      "available",
      "locked",
      "locked",
    ]);

    await service.startMission("emp_1", "m1-m01-decouvrir-entreprise");
    await service.submitMission("emp_1", "m1-m01-decouvrir-entreprise", {
      acknowledgedInputKeys: ["ctx-nordhabitat-overview", "ctx-tom-40-36"],
      departmentProblemMappings: [
        { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
        { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
      ],
      justification:
        "L’écart 40 versus 36 illustre une fragmentation d’information entre l’entrepôt et les systèmes TI.",
    });

    const afterM01 = await service.listMissions("emp_1");
    expect(afterM01.missions.map((mission) => mission.status)).toEqual([
      "completed",
      "available",
      "locked",
    ]);
    expect(await unlockStates.isUnlocked("emp_1", "mission", "m1-m02-connecter-departements")).toBe(
      true,
    );
  });

  it("marks module M1 complete and M2 ready after all three missions", async () => {
    const attempts = createInMemoryMissionAttemptRepository([
      {
        id: "a1",
        employeeId: "emp_1",
        missionKey: "m1-m01-decouvrir-entreprise",
        status: "completed",
        startedAt: new Date("2026-07-21T10:00:00.000Z"),
        completedAt: new Date("2026-07-21T10:30:00.000Z"),
        acknowledgedInputKeys: [],
        departmentProblemMappings: [],
        justification: null,
        feedbackKey: null,
        attemptNumber: 1,
        scorePercent: 100,
      },
      {
        id: "a2",
        employeeId: "emp_1",
        missionKey: "m1-m02-connecter-departements",
        status: "completed",
        startedAt: new Date("2026-07-21T11:00:00.000Z"),
        completedAt: new Date("2026-07-21T11:30:00.000Z"),
        acknowledgedInputKeys: [],
        departmentProblemMappings: [],
        justification: null,
        feedbackKey: null,
        attemptNumber: 1,
        scorePercent: 90,
      },
    ]);
    const unlockStates = createInMemoryUnlockStateRepository([
      {
        employeeId: "emp_1",
        resourceType: "mission",
        resourceKey: "m1-m02-connecter-departements",
      },
      {
        employeeId: "emp_1",
        resourceType: "mission",
        resourceKey: "m1-m03-diagnostiquer-preparation",
      },
    ]);
    const courseProgress = createInMemoryCourseProgressRepository();
    const service = createMissionService({
      attemptRepository: attempts,
      unlockReader: createUnlockedReader("emp_1"),
      unlockStates,
      courseProgress,
      now: () => new Date("2026-07-21T15:00:00.000Z"),
    });

    await service.startMission("emp_1", "m1-m03-diagnostiquer-preparation");
    const submit = await service.submitMission("emp_1", "m1-m03-diagnostiquer-preparation", {
      responses: [
        { interactionId: "readiness-level", value: "partial" },
        {
          interactionId: "blockers",
          value: ["data-fragmentation", "unclear-ownership", "isolated-decisions"],
        },
        {
          interactionId: "priority-order",
          value: ["clarify-owner", "align-data", "share-impact", "automate-later"],
        },
        {
          interactionId: "diagnosis",
          value: [
            { leftKey: "sym-gap", rightKey: "rec-verify" },
            { leftKey: "sym-silo", rightKey: "rec-coordinate" },
          ],
        },
        {
          interactionId: "closing-note",
          value:
            "La préparation est partielle : la fragmentation et les processus flous freinent encore NordHabitat.",
        },
      ],
    });

    expect(Result.isOk(submit)).toBe(true);
    if (Result.isOk(submit)) {
      expect(submit.value.score?.passed).toBe(true);
    }

    const moduleProgress = await courseProgress.getModuleProgress("emp_1", "M1");
    expect(moduleProgress?.status).toBe("completed");
    expect(await unlockStates.isUnlocked("emp_1", "module_ready", "M2")).toBe(true);
  });
});
