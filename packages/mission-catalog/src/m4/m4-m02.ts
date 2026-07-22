import type { MissionDefinitionDocument } from "../schema.js";

export const M4_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m4-m02-allocation-inter-entrepots",
  "missionCode": "M4-M02",
  "moduleCode": "M4",
  "title": "Allouer entre entrepots (DC)",
  "preview": "Organisez le transfert d'urgence DC-MTL vers DC-TRT pour l'aile pediatrique.",
  "briefing": "Bonjour,\n\nElodie vient de confirmer : tu es le owner jusqu'a nouvel ordre pour Sacre-Coeur. Il manque 12 unites a DC-TRT.\n\nDenise propose un transfert d'urgence depuis DC-MTL. Tom peut preparer l'expedition demain matin, mais Marc veut une estimation de fret avant approbation.\n\nPatrick compte sur nous pour jeudi. Documente le plan d'allocation et le cout de fret.\n\nElodie Moreau\nVentes institutionnelles — NordHabitat",
  "unlockExplanation": "Complétez d'abord « Saisir la commande institutionnelle » (conflit ATP documente).",
  "sequence": 2,
  "estimatedMinutes": 40,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-O2C-02"
  ],
  "contextItems": [
    {
      "key": "ctx-allocation",
      "title": "Besoin allocation SO-12047",
      "body": "12 unités SKU-HVAC-4421 requises a DC-TRT; commande Sacre-Coeur 40 unités; stock TRT = 28; echeance livraison jeudi.",
      "required": true
    },
    {
      "key": "ctx-stock-dc",
      "title": "Position stock inter-DC",
      "body": "DC-MTL : 52 unités libres (couverture 47 jours). DC-TRT : 28 unités (couverture 14 jours). Article critique post-canicule.",
      "required": true
    },
    {
      "key": "ctx-freight",
      "title": "Devis fret express",
      "body": "Transporteur NordLog : transfert MTL-TRT express 12 unités = 850 CAD; livraison 24 h; standard 3 jours = 320 CAD mais risque OTIF.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "assess-stock",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle est la premiere action pour resoudre le conflit d'allocation ?",
      "options": [
        {
          "key": "assess",
          "label": "Evaluer le stock disponible par DC"
        },
        {
          "key": "promise",
          "label": "Confirmer jeudi sans verifier MTL"
        },
        {
          "key": "cancel",
          "label": "Annuler la commande Sacre-Coeur"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "assess"
        ]
      }
    },
    {
      "id": "transfer-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements doivent figurer dans le plan de transfert inter-DC ?",
      "options": [
        {
          "key": "qty",
          "label": "Quantite a transferer (12 unités)"
        },
        {
          "key": "freight",
          "label": "Cout de fret documente"
        },
        {
          "key": "commit",
          "label": "Engagement livraison client mis a jour"
        },
        {
          "key": "hide-cost",
          "label": "Masquer le fret a Finance"
        },
        {
          "key": "skip-tom",
          "label": "Ignorer la validation entrepot"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "qty",
          "freight",
          "commit"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "transfer-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez les etapes du transfert d'urgence DC-MTL vers DC-TRT.",
      "options": [
        {
          "key": "assess",
          "label": "Evaluer stock et besoin (12 unités)"
        },
        {
          "key": "transfer",
          "label": "Creer l'ordre de transfert STO"
        },
        {
          "key": "freight",
          "label": "Obtenir approbation fret (850 CAD express)"
        },
        {
          "key": "commit",
          "label": "Mettre a jour l'engagement client Sacre-Coeur"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "assess",
          "transfer",
          "freight",
          "commit"
        ]
      }
    },
    {
      "id": "freight-cost",
      "type": "NUMERIC_INPUT",
      "prompt": "Quel est le cout du fret express MTL-TRT (CAD) selon le devis NordLog ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 850,
        "numericTolerance": 0
      }
    },
    {
      "id": "cross-func",
      "type": "TEXT_ANALYSIS",
      "prompt": "Expliquez pourquoi le transfert inter-DC est preferable a attendre le reappro ThermoControl pour Sacre-Coeur.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "transfert",
          "delai",
          "client",
          "stock"
        ]
      }
    }
  ],
  "completionFeedback": "Transfert STO-4408 approuve. Tom prepare l'expedition; livraison Sacre-Coeur maintenue pour jeudi.\n\nDenise Roy — Supply Chain",
} as const satisfies MissionDefinitionDocument;
