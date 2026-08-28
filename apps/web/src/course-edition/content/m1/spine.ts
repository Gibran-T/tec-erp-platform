/** NordHabitat Canonical Dataset Spine v0 — M1 Course Edition (frozen keys). */

export const M1_SPINE = {
  companyName: "NordHabitat",
  companyCode: "NORDHABITAT",
  currency: "CAD",
  sites: ["HQ-MTL", "DC-MTL", "DC-TRT"] as const,
  materialSku: "SKU-HVAC-4421",
  supplier: "THERMOCONTROL",
  customer: "SACRE-COEUR",
  inventorySystemQty: 40,
  inventoryPhysicalQty: 36,
  inventoryVariance: 4,
  signalOwner: "Tom",
  manager: "Claire Fontaine",
  departments: [
    { key: "dept-direction", label: "Direction" },
    { key: "dept-operations", label: "Opérations" },
    { key: "dept-finance", label: "Finance" },
    { key: "dept-ventes", label: "Ventes" },
    { key: "dept-approvisionnement", label: "Approvisionnement" },
    { key: "dept-entrepot", label: "Entrepôt" },
    { key: "dept-ti", label: "TI" },
  ] as const,
  documentRefs: {
    companyProfile: "NH-ORG-001",
    departmentStructure: "NH-ORG-002",
    inventorySignal: "NH-INV-SIG-4036",
    masterDataExample: "NH-MD-SKU-4421",
    kpiImpact: "NH-KPI-INV-ACC-M1",
  },
  issuedAt: "2026-07-14",
} as const;
