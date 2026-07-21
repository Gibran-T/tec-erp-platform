import type { MissionDefinitionDocument } from "../schema.js";

export const M3_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m3-m03-receptionner-analyser-fournisseur",
  "missionCode": "M3-M03",
  "moduleCode": "M3",
  "title": "Receptionner et analyser l'impact fournisseur",
  "preview": "Enregistrez la reception, mettez a jour le stock et evaluez OTIF.",
  "briefing": "Bonjour,\n\nThermoControl livre 36 unites sur 40. Receptionnez, analysez l'ecart et preparez l'impact stock/fournisseur.\n\nDenise Roy\nSupply Chain — NordHabitat",
  "unlockExplanation": "Completez d'abord la commande d'achat.",
  "sequence": 3,
  "estimatedMinutes": 35,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-P2P-03",
    "C-QLT-02"
  ],
  "contextItems": [
    {
      "key": "ctx-gr",
      "title": "Bon de livraison",
      "body": "PO 40; livre 36; ecart 4; stock DC-MTL doit augmenter de 36.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "gr-qty",
      "type": "NUMERIC_INPUT",
      "prompt": "Quantite a receptionner (unites) ?",
      "scoring": {
        "maxPoints": 15,
        "numericTarget": 36,
        "numericTolerance": 0
      }
    },
    {
      "id": "gr-effect",
      "type": "MULTI_CHOICE",
      "prompt": "Consequences d'une reception partielle correcte ?",
      "options": [
        {
          "key": "stock-up",
          "label": "Stock augmente de 36"
        },
        {
          "key": "open-qty",
          "label": "Reste ouvert 4"
        },
        {
          "key": "invoice-ready",
          "label": "Base pour facture"
        },
        {
          "key": "auto-pay",
          "label": "Paiement automatique integral"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctKeys": [
          "stock-up",
          "open-qty",
          "invoice-ready"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "gr-order",
      "type": "ORDERING",
      "prompt": "Ordonnez la reception.",
      "options": [
        {
          "key": "check-po",
          "label": "Verifier la PO"
        },
        {
          "key": "count",
          "label": "Compter physiquement"
        },
        {
          "key": "post-gr",
          "label": "Poster la reception"
        },
        {
          "key": "score",
          "label": "Evaluer le fournisseur"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "check-po",
          "count",
          "post-gr",
          "score"
        ]
      }
    },
    {
      "id": "otif",
      "type": "SINGLE_CHOICE",
      "prompt": "La livraison est-elle OTIF ?",
      "options": [
        {
          "key": "no",
          "label": "Non — quantite incomplete"
        },
        {
          "key": "yes",
          "label": "Oui"
        }
      ],
      "scoring": {
        "maxPoints": 15,
        "correctKeys": [
          "no"
        ]
      }
    },
    {
      "id": "impact",
      "type": "TEXT_ANALYSIS",
      "prompt": "Expliquez l'impact business de la reception partielle sur l'hopital.",
      "scoring": {
        "maxPoints": 10,
        "requiredConcepts": [
          "stock",
          "risque",
          "client"
        ]
      }
    }
  ],
  "completionFeedback": "Reception enregistree. Le Module 3 ouvre la voie Order-to-Cash.\n\nDenise Roy"
} as const satisfies MissionDefinitionDocument;
