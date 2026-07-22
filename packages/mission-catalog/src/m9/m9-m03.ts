import type { MissionDefinitionDocument } from "../schema.js";

export const M9_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m9-m03-analyse-concurrentielle-ia",
  "missionCode": "M9-M03",
  "moduleCode": "M9",
  "title": "Analyse concurrentielle et frontières IA",
  "preview": "Évaluez la concurrence HVAC institutionnelle et definissez les frontières IA pour Equinoxe.",
  "briefing": "Bonjour,\n\nThermoRival propose des delais 30 % plus courts sur le segment institutionnel. Notre Coach IA peut aider les etudiants — mais pas decider a leur place.\n\nVotre role : analyser le positionnement concurrentiel et definir les frontieres ethiques de l'IA dans Equinoxe. Ou l'IA guide, ou elle recommande, ou elle reste silencieuse — jamais ou elle remplace la decision metier.\n\nL'IA est un outil pedagogique, pas un oracle.\n\nNadia Fontaine\nBusiness Intelligence — NordHabitat",
  "unlockExplanation": "Complétez d'abord « Tableau de bord du comite de direction » (presentation jeudi faite).",
  "sequence": 3,
  "estimatedMinutes": 50,
  "difficulty": "advanced",
  "competencyCodes": [
    "C-ANL-03",
    "C-AI-01"
  ],
  "contextItems": [
    {
      "key": "ctx-competitor",
      "title": "Analyse ThermoRival",
      "body": "ThermoRival : delai moyen institutionnel 18 h vs NordHabitat 22 h; prix +8 %; NPS sectoriel 7,2; faiblesse : tracabilite qualite lot.",
      "required": true
    },
    {
      "key": "ctx-ai-coach",
      "title": "Coach IA Equinoxe",
      "body": "Niveaux : hint (M1-M4), question_first (M5-M8), reflection (M9-M10). Interdit : recommendation directe M1-M8; autorise M9-M10 avec garde-fous.",
      "required": true
    },
    {
      "key": "ctx-ai-boundaries",
      "title": "Frontieres IA institutionnelles",
      "body": "IA ne decide jamais : approbation PO, promesse client, cloture cas. IA peut : expliquer regles, challenger hypotheses, suggerer reflexion post-decision.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "competitive-edge",
      "type": "SINGLE_CHOICE",
      "prompt": "Quel avantage competitif NordHabitat doit mettre en avant face a ThermoRival ?",
      "options": [
        {
          "key": "traceability",
          "label": "Tracabilite qualite lot et gouvernance CRM"
        },
        {
          "key": "speed-only",
          "label": "Delai seul sans tracabilite"
        },
        {
          "key": "price-cut",
          "label": "Baisse de prix sans analyse marge"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "traceability"
        ]
      }
    },
    {
      "id": "ai-boundaries",
      "type": "MULTI_CHOICE",
      "prompt": "Quelles frontières IA Equinoxe devez-vous formaliser ?",
      "options": [
        {
          "key": "no-approval",
          "label": "IA ne decide jamais les approbations PO"
        },
        {
          "key": "no-promise",
          "label": "IA ne promet jamais de delai client"
        },
        {
          "key": "reflection-m9",
          "label": "Reflection autorisee M9-M10 avec garde-fous"
        },
        {
          "key": "replace-decision",
          "label": "IA remplace la decision metier en capstone"
        },
        {
          "key": "hide-rules",
          "label": "IA cache les regles metier aux etudiants"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "no-approval",
          "no-promise",
          "reflection-m9"
        ],
        "minimumSelections": 3
      }
    },
    {
      "id": "analysis-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez l'analyse concurrentielle et définition frontières IA.",
      "options": [
        {
          "key": "benchmark",
          "label": "Benchmarker ThermoRival vs NordHabitat"
        },
        {
          "key": "differentiate",
          "label": "Identifier differenciateurs tracabilite/gouvernance"
        },
        {
          "key": "ai-rules",
          "label": "Formaliser frontières IA par module"
        },
        {
          "key": "validate",
          "label": "Valider avec gouvernance et comite"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "benchmark",
          "differentiate",
          "ai-rules",
          "validate"
        ]
      }
    },
    {
      "id": "rival-nps",
      "type": "NUMERIC_INPUT",
      "prompt": "Quel NPS sectoriel ThermoRival affiche-t-il selon l'analyse ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 7.2,
        "numericTolerance": 0.1
      }
    },
    {
      "id": "ai-ethics",
      "type": "TEXT_ANALYSIS",
      "prompt": "Expliquez pourquoi l'IA Equinoxe ne doit jamais promettre un delai client a la place de l'etudiant.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "decision",
          "responsabilite",
          "pedagogie",
          "frontiere"
        ]
      }
    }
  ],
  "completionFeedback": "Analyse concurrentielle et frontières IA validees. NordHabitat positionne sur tracabilite; Coach IA encadre pour M10 capstone.\n\nNadia Fontaine"
} as const satisfies MissionDefinitionDocument;
