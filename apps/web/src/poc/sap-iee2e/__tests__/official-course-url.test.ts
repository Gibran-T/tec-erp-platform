import { afterEach, describe, expect, it, vi } from "vitest";

import { SAP_SUITE_E2E_OFFICIAL_URL } from "@tec-platform/contracts";

import {
  officialSapLearningHrefIgnoringIdentifiers,
  officialSapLearningLaunchHref,
  sanitizeOfficialSapLearningHref,
  SAP_IEE2E_OFFICIAL_FR_URL,
} from "../officialCourse.js";

const OFFICIAL = SAP_SUITE_E2E_OFFICIAL_URL;

describe("official SAP Learning launch URL", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns only the stable official course URL", () => {
    expect(officialSapLearningLaunchHref()).toBe(OFFICIAL);
    expect(SAP_IEE2E_OFFICIAL_FR_URL).toBe(OFFICIAL);
    expect(officialSapLearningLaunchHref()).not.toMatch(/\/null/);
  });

  it("never concatenates null identifiers into a SAP route", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const naiveDeepLink = `${OFFICIAL}/${null as unknown as string}`;
    expect(naiveDeepLink).toMatch(/\/null$/);

    expect(sanitizeOfficialSapLearningHref(naiveDeepLink)).toBe(OFFICIAL);
    expect(sanitizeOfficialSapLearningHref(null)).toBe(OFFICIAL);
    expect(sanitizeOfficialSapLearningHref("null")).toBe(OFFICIAL);
    expect(
      sanitizeOfficialSapLearningHref(`${OFFICIAL}/lessons/${null as unknown as string}`),
    ).toBe(OFFICIAL);
    expect(
      officialSapLearningHrefIgnoringIdentifiers({
        lessonId: null,
        slug: null,
        unitId: null,
      }),
    ).toBe(OFFICIAL);
    expect(
      officialSapLearningHrefIgnoringIdentifiers({
        lessonId: "abc-lesson",
        slug: "unit-1-lesson",
      }),
    ).toBe(OFFICIAL);
    expect(warn).toHaveBeenCalled();
  });

  it("refuses SAP internal or content-update deep links", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(
      sanitizeOfficialSapLearningHref(
        `${OFFICIAL}/identification-des-processus-de-gestion`,
      ),
    ).toBe(OFFICIAL);
    expect(sanitizeOfficialSapLearningHref(`${OFFICIAL}?lessonId=`)).toBe(OFFICIAL);
  });
});
