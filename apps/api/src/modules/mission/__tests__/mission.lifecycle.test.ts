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

describe("mission lifecycle", () => {
  it("supports start → submit → complete for M1-M01", async () => {
    const service = createMissionService({
      attemptRepository: createInMemoryMissionAttemptRepository(),
      unlockReader: createMissionUnlockStateReader(
        createInMemoryFirstDayStateRepository({
          messages: [
            {
              employeeId: "emp_1",
              messageKey: MANAGER_MESSAGE_KEY,
              readAt: new Date(),
            },
          ],
          tasks: [
            {
              employeeId: "emp_1",
              taskKey: FIRST_TASK_KEY,
              completedAt: new Date(),
            },
          ],
        }),
      ),
      unlockStates: createInMemoryUnlockStateRepository(),
      courseProgress: createInMemoryCourseProgressRepository(),
    });

    const start = await service.startMission("emp_1", "m1-m01-decouvrir-entreprise");
    expect(Result.isOk(start)).toBe(true);
    if (Result.isOk(start)) {
      expect(start.value.created).toBe(true);
      expect(start.value.attempt.status).toBe("in_progress");
    }

    const submit = await service.submitMission("emp_1", "m1-m01-decouvrir-entreprise", {
      acknowledgedInputKeys: ["ctx-nordhabitat-overview", "ctx-tom-40-36"],
      departmentProblemMappings: [
        { departmentKey: "dept-entrepot", problemKey: "prob-inventaire-divergent" },
        { departmentKey: "dept-ti", problemKey: "prob-coherence-donnees" },
      ],
      justification:
        "L’écart 40 versus 36 illustre une fragmentation d’information entre l’entrepôt et les systèmes TI.",
    });

    expect(Result.isOk(submit)).toBe(true);
    if (Result.isOk(submit)) {
      expect(submit.value.attempt.status).toBe("completed");
      expect(submit.value.attempt.feedbackKey).toBe("fb-discovery-complete");
    }

    const detail = await service.getMission("emp_1", "m1-m01-decouvrir-entreprise");
    expect(Result.isOk(detail)).toBe(true);
    if (Result.isOk(detail)) {
      expect(detail.value.status).toBe("completed");
    }
  });
});
