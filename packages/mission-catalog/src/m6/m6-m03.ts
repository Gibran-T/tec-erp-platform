import type { MissionDefinitionDocument } from "../schema.js";

export const M6_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m6-m03-expliquer-ecart-finance",
  "missionCode": "M6-M03",
  "moduleCode": "M6",
  "title": "Expliquer l'ecart a la finance",
  "preview": "Expliquez a Marc l'impact tresorerie et marge de la chaine M3-M6 complete.",
  "briefing": "Bonjour,\n\nAvant le comite de pilotage, j'ai besoin d'une narration finance claire sur toute la chaine : PO-88421 (40 vs 36), frets d'urgence Sacre-Coeur et STO-4512, marge Order-to-Cash.\n\nEn trois lignes maximum : trace l'ecart, quantifie l'impact cash et marge, et explique pourquoi nous avons accepte ces decisions.\n\nC'est ta credibilite en jeu pour le steering de septembre.\n\nMarc Tremblay\nFinance — NordHabitat",
  "unlockExplanation": "Completez d'abord « Traiter l'exception de rapprochement trois voies » (paiement 4 500 CAD debloque).",
  "sequence": 3,
  "estimatedMinutes": 40,
  "difficulty": "advanced",
  "competencyCodes": [
    "C-FIN-03"
  ],
  "contextItems": [
    {
      "key": "ctx-p2p-chain",
      "title": "Chaine P2P PO-88421",
      "body": "PO 5 000 CAD (40 x 125) → GR 36 unites → paiement 4 500 CAD. Reliquat 4 unites (500 CAD) en attente ThermoControl. Reception partielle mai.",
      "required": true
    },
    {
      "key": "ctx-freight-margin",
      "title": "Impact fret et marge O2C",
      "body": "Frets urgence cumules : 1 530 CAD (STO-4408 + STO-4512). Revenu Sacre-Coeur SO-12047 : 50 000 CAD. Marge brute estimee reduite de 3,1 % par frets.",
      "required": true
    },
    {
      "key": "ctx-cash-flow",
      "title": "Impact tresorerie septembre",
      "body": "Decaissement ThermoControl : 4 500 CAD (Net-30). Encaissement Sacre-Coeur : 50 000 CAD (Net-30). Ecart cash net positif mais retarde par delais paiement.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "trace-first",
      "type": "SINGLE_CHOICE",
      "prompt": "Par ou commencez-vous l'explication de l'ecart a Marc ?",
      "options": [
        {
          "key": "trace",
          "label": "Retracer la chaine M3-M6 (PO → GR → facture → O2C)"
        },
        {
          "key": "blame",
          "label": "Attribuer l'ecart au systeme ERP"
        },
        {
          "key": "hide",
          "label": "Minimiser l'impact des frets d'urgence"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "trace"
        ]
      }
    },
    {
      "id": "narrative-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements Marc attend dans votre explication finance ?",
      "options": [
        {
          "key": "p2p-variance",
          "label": "Ecart P2P : 4 unites / 500 CAD en reliquat"
        },
        {
          "key": "freight-cost",
          "label": "Cout fret cumule 1 530 CAD documente"
        },
        {
          "key": "margin-impact",
          "label": "Impact marge O2C (-3,1 % frets)"
        },
        {
          "key": "cash-timing",
          "label": "Timing tresorerie Net-30 entrees/sorties"
        },
        {
          "key": "vague",
          "label": "Generalites sans chiffres"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "p2p-variance",
          "freight-cost",
          "margin-impact",
          "cash-timing"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "narrative-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la structure de votre presentation a Marc.",
      "options": [
        {
          "key": "trace",
          "label": "Retracer la chaine transactionnelle M3-M6"
        },
        {
          "key": "quantify",
          "label": "Quantifier ecarts (500 CAD reliquat, 1 530 CAD fret)"
        },
        {
          "key": "narrate",
          "label": "Narrer les decisions metier et leur justification"
        },
        {
          "key": "release",
          "label": "Confirmer credibilite pour le steering septembre"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "trace",
          "quantify",
          "narrate",
          "release"
        ]
      }
    },
    {
      "id": "reliquat-value",
      "type": "NUMERIC_INPUT",
      "prompt": "Quelle est la valeur (CAD) du reliquat 4 unites a 125 CAD sur PO-88421 ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 500,
        "numericTolerance": 0
      }
    },
    {
      "id": "finance-narrative",
      "type": "TEXT_ANALYSIS",
      "prompt": "En trois lignes, expliquez a Marc pourquoi le paiement partiel (4 500 CAD) etait la bonne decision comptable et metier.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "partiel",
          "tresorerie",
          "marge",
          "justification"
        ]
      }
    }
  ],
  "completionFeedback": "Narration finance acceptee par Marc. Credibilite confirmee pour le steering de septembre. Chaine M3-M6 documentee.\n\nMarc Tremblay"
} as const satisfies MissionDefinitionDocument;
