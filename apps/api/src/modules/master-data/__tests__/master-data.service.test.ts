import { describe, expect, it } from "vitest";

import {
  assertStatusTransitionAllowed,
  computeQualityScore,
  detectDuplicateBusinessKey,
  detectSoftDuplicate,
  validateMasterDataRecord,
} from "../master-data.validation.js";

describe("master data validation", () => {
  it("flags missing mandatory supplier fields", () => {
    const result = validateMasterDataRecord({
      entityType: "supplier",
      businessKey: "THERMOCONTROL",
      payloadJson: {
        name: "ThermoControl",
        status: "active",
      },
    });

    expect(result.valid).toBe(false);
    expect(result.missingFields).toEqual(expect.arrayContaining(["paymentTerms", "bankDetails"]));
    expect(result.qualityScore).toBeLessThan(100);
  });

  it("accepts a complete customer record", () => {
    const result = validateMasterDataRecord({
      entityType: "customer",
      businessKey: "SACRE-COEUR",
      payloadJson: {
        name: "College Sacre-Coeur",
        address: "123 Rue Principale, Montreal",
        paymentTerms: "NET30",
        status: "active",
      },
      status: "active",
    });

    expect(result.valid).toBe(true);
    expect(result.qualityScore).toBe(100);
    expect(result.missingFields).toEqual([]);
  });

  it("computes partial quality score for material missing uom", () => {
    const { qualityScore, missingFields } = computeQualityScore("material", {
      name: "SKU-HVAC-4421",
      status: "active",
    });

    expect(missingFields).toContain("uom");
    expect(qualityScore).toBe(67);
  });
});

describe("master data duplicate detection", () => {
  it("detects normalized business key duplicates", () => {
    expect(detectDuplicateBusinessKey("sacre-coeur", ["SACRE-COEUR"])).toBe(true);
    expect(detectDuplicateBusinessKey("NEW-KEY", ["SACRE-COEUR"])).toBe(false);
  });

  it("detects soft duplicate by partner name", () => {
    const duplicateKey = detectSoftDuplicate(
      "supplier",
      { name: "ThermoControl", status: "active", paymentTerms: "NET30", bankDetails: "123" },
      [
        {
          businessKey: "THERMO-OLD",
          payloadJson: { name: "thermocontrol" },
        },
      ],
    );

    expect(duplicateKey).toBe("THERMO-OLD");
  });
});

describe("master data blocked status integrity", () => {
  it("blocks reactivation of blocked record with low quality", () => {
    const issue = assertStatusTransitionAllowed({
      currentStatus: "blocked",
      nextStatus: "active",
      qualityScore: 50,
      missingFields: ["bankDetails"],
    });

    expect(issue).toMatch(/Deblocage refuse/);
  });

  it("allows reactivation when quality threshold is met", () => {
    const issue = assertStatusTransitionAllowed({
      currentStatus: "blocked",
      nextStatus: "active",
      qualityScore: 80,
      missingFields: [],
    });

    expect(issue).toBeNull();
  });

  it("blocks deactivation of active records to preserve referential integrity", () => {
    const issue = assertStatusTransitionAllowed({
      currentStatus: "active",
      nextStatus: "inactive",
      qualityScore: 100,
      missingFields: [],
    });

    expect(issue).toMatch(/Desactivation refusee/);
  });
});
