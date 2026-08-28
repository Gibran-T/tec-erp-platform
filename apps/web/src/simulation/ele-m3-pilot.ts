export interface EleM3StakeholderEvent {
  readonly id: string;
  readonly stakeholder: string;
  readonly role: string;
  readonly moduleCode: "M3";
  readonly processArea: "P2P";
  readonly occurredAt: string;
  readonly note: string;
  readonly authored: true;
}

export const ELE_M3_PILOT_EVENTS: readonly EleM3StakeholderEvent[] = [
  {
    id: "ele-m3-supplier-delay",
    stakeholder: "Fournisseur NordSteel",
    role: "supplier",
    moduleCode: "M3",
    processArea: "P2P",
    occurredAt: "2026-08-12T09:15:00Z",
    note:
      "Confirmation partielle PO-4471 : deux références en rupture chez le sous-traitant. Délai estimé +5 jours ouvrés sans pénalité contractuelle si réception avant le 20.",
    authored: true,
  },
  {
    id: "ele-m3-buyer-supervisor",
    stakeholder: "Superviseur achats — Camille Roy",
    role: "buyer_supervisor",
    moduleCode: "M3",
    processArea: "P2P",
    occurredAt: "2026-08-13T14:40:00Z",
    note:
      "Prioriser la ligne critique pour le chantier Rive-Sud. Autoriser un split delivery si le fournisseur confirme l’expédition partielle sous 48 h.",
    authored: true,
  },
  {
    id: "ele-m3-warehouse-gr",
    stakeholder: "Réception entrepôt — Entrepôt Laval",
    role: "warehouse",
    moduleCode: "M3",
    processArea: "P2P",
    occurredAt: "2026-08-14T11:05:00Z",
    note:
      "Réception partielle GR-882 : quantité conforme mais étiquetage palette non conforme au standard NordHabitat. Mettre en quarantaine qualité avant mise en stock libre.",
    authored: true,
  },
  {
    id: "ele-m3-finance-match",
    stakeholder: "Contrôle factures — Finance",
    role: "finance",
    moduleCode: "M3",
    processArea: "P2P",
    occurredAt: "2026-08-15T16:20:00Z",
    note:
      "Facture INV-9912 reçue avant GR complet sur PO-4471. Bloquer le paiement jusqu’au three-way match ; signaler l’écart au superviseur achats pour décision sur pénalités.",
    authored: true,
  },
  {
    id: "ele-m3-supplier-quality",
    stakeholder: "Fournisseur NordSteel",
    role: "supplier",
    moduleCode: "M3",
    processArea: "P2P",
    occurredAt: "2026-08-16T08:30:00Z",
    note:
      "Certificat matière pour lot B-204 disponible. Propose un crédit note de 2 % si NordHabitat accepte la livraison partielle sans requalification complète.",
    authored: true,
  },
] as const;

export function getEleM3PilotEvents(moduleCode: string): readonly EleM3StakeholderEvent[] {
  if (moduleCode.toUpperCase() !== "M3") {
    return [];
  }
  return ELE_M3_PILOT_EVENTS;
}

export function isEleM3PilotModule(moduleCode: string): boolean {
  return moduleCode.toUpperCase() === "M3";
}
