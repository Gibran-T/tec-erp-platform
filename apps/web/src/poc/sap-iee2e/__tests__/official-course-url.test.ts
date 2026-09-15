import { afterEach, describe, expect, it, vi } from "vitest";

import { SAP_SUITE_E2E_OFFICIAL_URL, sapLearningHrefIsNullish } from "@tec-platform/contracts";

import {
  officialSapLearningHrefIgnoringIdentifiers,
  officialSapLearningLaunchHref,
  safeExternalSapHref,
  safeOfficialSapLearningHref,
  sanitizeOfficialSapLearningHref,
  SAP_IEE2E_OFFICIAL_FR_URL,
  SAP_OFFICIAL_EXTERNAL_RESOURCES,
} from "../officialCourse.js";

const OFFICIAL = SAP_SUITE_E2E_OFFICIAL_URL;

describe("official SAP Learning launch URL", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns only the stable official course URL", () => {
    expect(officialSapLearningLaunchHref()).toBe(OFFICIAL);
    expect(SAP_IEE2E_OFFICIAL_FR_URL).toBe(OFFICIAL);
    expect(officialSapLearningLaunchHref()).not.toMatch(/\/null|\/undefined/);
    expect(safeOfficialSapLearningHref()).toBe(OFFICIAL);
  });

  it("never concatenates null or undefined identifiers into a SAP route", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const naiveDeepLink = `${OFFICIAL}/${null as unknown as string}`;
    const undefinedDeepLink = `${OFFICIAL}/${undefined as unknown as string}`;
    expect(naiveDeepLink).toMatch(/\/null$/);
    expect(undefinedDeepLink).toMatch(/\/undefined$/);

    expect(sanitizeOfficialSapLearningHref(naiveDeepLink)).toBe(OFFICIAL);
    expect(safeOfficialSapLearningHref(undefinedDeepLink)).toBe(OFFICIAL);
    expect(safeOfficialSapLearningHref(null)).toBe(OFFICIAL);
    expect(safeOfficialSapLearningHref(undefined)).toBe(OFFICIAL);
    expect(safeOfficialSapLearningHref("")).toBe(OFFICIAL);
    expect(safeOfficialSapLearningHref("null")).toBe(OFFICIAL);
    expect(safeOfficialSapLearningHref("undefined")).toBe(OFFICIAL);
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
    expect(sapLearningHrefIsNullish(safeOfficialSapLearningHref(naiveDeepLink))).toBe(false);
  });

  it("discards a dirty API officialUrl instead of rendering it", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const dirty = `${OFFICIAL}/null`;
    expect(safeOfficialSapLearningHref(dirty)).toBe(OFFICIAL);
    expect(safeOfficialSapLearningHref(dirty)).not.toMatch(/\/null|\/undefined/);
  });

  it("refuses SAP internal or content-update deep links", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(
      sanitizeOfficialSapLearningHref(
        `${OFFICIAL}/identification-des-processus-de-gestion`,
      ),
    ).toBe(OFFICIAL);
    expect(sanitizeOfficialSapLearningHref(`${OFFICIAL}?lessonId=`)).toBe(OFFICIAL);
    expect(sanitizeOfficialSapLearningHref(`${OFFICIAL}?lessonId=null`)).toBe(OFFICIAL);
  });

  it("keeps verified external SAP hrefs complete and never nullish", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    for (const resource of SAP_OFFICIAL_EXTERNAL_RESOURCES) {
      expect(resource.href.startsWith("https://")).toBe(true);
      expect(resource.href).not.toMatch(/\/null|\/undefined/);
      expect(safeExternalSapHref(resource.href)).toBe(resource.href);
    }
    expect(safeExternalSapHref(`${OFFICIAL}/null`)).toBe(OFFICIAL);
    expect(safeExternalSapHref("https://example.com/invented")).toBe(OFFICIAL);
  });

  it("does not emit SAP Learning’s content-update toast from TEC.ERP helpers", () => {
    expect(officialSapLearningLaunchHref()).not.toMatch(/learning content has been updated/i);
    expect(SAP_IEE2E_OFFICIAL_FR_URL).not.toMatch(/Refresh the page to reload/i);
  });
});
