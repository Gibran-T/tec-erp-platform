import type { MissionDefinitionDocument } from "../schema.js";

export const M3_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m3-m01-identifier-besoin-achat",
  "missionCode": "M3-M01",
  "moduleCode": "M3",
  "title": "Identifier un besoin d'achat",
  "preview": "Transformez un besoin operationnel en demande d'achat controlee.",
  "briefing": "Bonjour,\n\nDenise signale un besoin de pieces HVAC apres tension de stock. Identifiez le besoin, le demandeur et le fournisseur eligible ThermoControl.\n\nJulie Chen\nApprovisionnements — NordHabitat",
  "unlockExplanation": "Completez le Module 2 pour debloquer Procure-to-Pay.",
  "sequence": 1,
  "estimatedMinutes": 30,
  "difficulty": "intro",
  "competencyCodes": [
    "C-P2P-01"
  ],
  "contextItems": [
    {
      "key": "ctx-pr-need",
      "title": "Signal besoin",
      "body": "SKU-HVAC-4421 sous seuil; fournisseur actif ThermoControl; budget Operations.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "need-owner",
      "type": "SINGLE_CHOICE",
      "prompt": "Qui porte le besoin d'achat initial ?",
      "options": [
        {
          "key": "ops",
          "label": "Operations / entrepot"
        },
        {
          "key": "marketing",
          "label": "Marketing"
        },
        {
          "key": "hr",
          "label": "RH"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "ops"
        ]
      }
    },
    {
      "id": "pr-controls",
      "type": "MULTI_CHOICE",
      "prompt": "Quels controles avant creation de la demande ?",
      "options": [
        {
          "key": "supplier-active",
          "label": "Fournisseur actif"
        },
        {
          "key": "budget",
          "label": "Budget disponible"
        },
        {
          "key": "material",
          "label": "Article valide"
        },
        {
          "key": "skip",
          "label": "Aucun controle"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctKeys": [
          "supplier-active",
          "budget",
          "material"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "pr-order",
      "type": "ORDERING",
      "prompt": "Ordonnez le demarrage P2P.",
      "options": [
        {
          "key": "signal",
          "label": "Recueillir le signal"
        },
        {
          "key": "validate-md",
          "label": "Valider les donnees maitre"
        },
        {
          "key": "create-pr",
          "label": "Creer la demande d'achat"
        },
        {
          "key": "route-approval",
          "label": "Router l'approbation"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "signal",
          "validate-md",
          "create-pr",
          "route-approval"
        ]
      }
    },
    {
      "id": "qty",
      "type": "NUMERIC_INPUT",
      "prompt": "Quantite minimale a demander si stock critique (unites) ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 40,
        "numericTolerance": 0
      }
    },
    {
      "id": "why-pr",
      "type": "TEXT_ANALYSIS",
      "prompt": "Pourquoi une demande d'achat precede la commande ?",
      "scoring": {
        "maxPoints": 10,
        "requiredConcepts": [
          "approbation",
          "controle",
          "achat"
        ]
      }
    }
  ],
  "completionFeedback": "Besoin formalise. Passez a la commande d'achat.\n\nJulie Chen"
} as const satisfies MissionDefinitionDocument;
