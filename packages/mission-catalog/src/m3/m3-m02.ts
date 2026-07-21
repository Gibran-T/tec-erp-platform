import type { MissionDefinitionDocument } from "../schema.js";

export const M3_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m3-m02-creer-traiter-commande-achat",
  "missionCode": "M3-M02",
  "moduleCode": "M3",
  "title": "Creer et traiter une commande d'achat",
  "preview": "Creez PO-88421 avec approbation, prix et tolerances.",
  "briefing": "Bonjour,\n\nConvertissez la demande en commande d'achat PO-88421 vers ThermoControl. Respectez limites d'approbation et segregation des taches.\n\nJulie Chen",
  "unlockExplanation": "Completez d'abord l'identification du besoin d'achat.",
  "sequence": 2,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-P2P-02"
  ],
  "contextItems": [
    {
      "key": "ctx-po",
      "title": "Regles PO",
      "body": "Limite auto-approbation 5000 CAD; au-dela Marc doit approuver; fournisseur bloque interdit.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "po-block",
      "type": "SINGLE_CHOICE",
      "prompt": "Que faire si le fournisseur est bloque ?",
      "options": [
        {
          "key": "stop",
          "label": "Bloquer la PO"
        },
        {
          "key": "force",
          "label": "Forcer la creation"
        },
        {
          "key": "email",
          "label": "Envoyer un email seulement"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "stop"
        ]
      }
    },
    {
      "id": "approval-path",
      "type": "MULTI_CHOICE",
      "prompt": "Elements requis pour une PO valide ?",
      "options": [
        {
          "key": "price",
          "label": "Prix coherent"
        },
        {
          "key": "qty",
          "label": "Quantite"
        },
        {
          "key": "approver",
          "label": "Approbateur selon limite"
        },
        {
          "key": "emoji",
          "label": "Emoji dans le libelle"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctKeys": [
          "price",
          "qty",
          "approver"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "po-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez le traitement PO.",
      "options": [
        {
          "key": "draft",
          "label": "Creer le brouillon"
        },
        {
          "key": "approve",
          "label": "Approuver"
        },
        {
          "key": "release",
          "label": "Liberer au fournisseur"
        },
        {
          "key": "await-gr",
          "label": "Attendre la reception"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "draft",
          "approve",
          "release",
          "await-gr"
        ]
      }
    },
    {
      "id": "po-amount",
      "type": "NUMERIC_INPUT",
      "prompt": "Montant PO (CAD) pour 40 unites a 125 CAD ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 5000,
        "numericTolerance": 0
      }
    },
    {
      "id": "sod",
      "type": "TEXT_ANALYSIS",
      "prompt": "Expliquez la segregation des taches entre demandeur et approbateur.",
      "scoring": {
        "maxPoints": 10,
        "requiredConcepts": [
          "segregation",
          "approbation",
          "fraude"
        ]
      }
    }
  ],
  "completionFeedback": "PO-88421 liberee. Preparez la reception.\n\nJulie Chen"
} as const satisfies MissionDefinitionDocument;
