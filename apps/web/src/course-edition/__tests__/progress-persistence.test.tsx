import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { saveStoredTokens } from "../../api/auth.js";
import {
  emptyProgress,
  hydrateCourseEditionProgress,
  isCourseEditionModuleComplete,
  loadCourseEditionProgress,
  recordConnectionLabResult,
  recordQuizResult,
  saveCourseEditionProgress,
} from "../progress.js";

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("Course Edition progress persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
    saveStoredTokens({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      accessTokenExpiresAt: new Date(Date.now() + 900_000).toISOString(),
      refreshTokenExpiresAt: new Date(Date.now() + 1_000_000).toISOString(),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.includes("/api/v1/me/course-edition/M1") && (!init?.method || init.method === "GET")) {
          return jsonResponse({
            progress: {
              moduleCode: "M1",
              completedSurfaces: ["apprendre"],
              connectionLabPassed: false,
              connectionLabScorePercent: null,
              quizPassed: false,
              quizPercent: null,
              framesViewed: ["frame-01-enterprise-integrated"],
              documentsOpened: [],
              progressPercent: 25,
              moduleComplete: false,
              updatedAt: "2026-07-24T18:00:00.000Z",
            },
          });
        }
        if (url.includes("/api/v1/me/course-edition/M1") && init?.method === "PUT") {
          return jsonResponse(JSON.parse(String(init.body)));
        }
        return jsonResponse({});
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("hydrates server progress over empty local cache", async () => {
    const hydrated = await hydrateCourseEditionProgress("M1");
    expect(hydrated.completedSurfaces).toEqual(["apprendre"]);
    expect(hydrated.framesViewed).toContain("frame-01-enterprise-integrated");
    expect(loadCourseEditionProgress("M1").completedSurfaces).toEqual(["apprendre"]);
  });

  it("keeps newer local progress and queues server sync on save", async () => {
    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
    const next = saveCourseEditionProgress({
      ...emptyProgress("M1"),
      completedSurfaces: ["apprendre", "connecter"],
      connectionLabPassed: true,
      connectionLabScorePercent: 90,
    });
    expect(next.completedSurfaces).toEqual(["apprendre", "connecter"]);
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
    const putCall = fetchMock.mock.calls.find(
      (call) => String(call[0]).includes("/course-edition/M1") && call[1]?.method === "PUT",
    );
    expect(putCall).toBeTruthy();
  });

  it("marks module complete only when surfaces, lab and quiz pass", () => {
    let state = recordConnectionLabResult("M1", 80, true);
    state = saveCourseEditionProgress({
      ...state,
      completedSurfaces: ["apprendre", "connecter", "missions"],
    });
    expect(isCourseEditionModuleComplete(state)).toBe(false);
    state = recordQuizResult("M1", 100, true);
    state = saveCourseEditionProgress({
      ...state,
      completedSurfaces: ["apprendre", "connecter", "missions", "bilan"],
    });
    expect(isCourseEditionModuleComplete(loadCourseEditionProgress("M1"))).toBe(true);
  });
});
