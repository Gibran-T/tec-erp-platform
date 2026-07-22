import type { MissionDefinitionDocument } from "../schema.js";

export const M5_M03 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m5-m03-presentation-sop",
  "missionCode": "M5-M03",
  "moduleCode": "M5",
  "title": "Présenter la recommandation S&OP",
  "preview": "Defendez la recommandation de reapprovisionnement devant Finance, Ventes et Supply Chain.",
  "briefing": "Bonjour,\n\nC'est le S&OP mensuel. Tu presentes la recommandation complete : analyse stockout DC-TRT, transfert STO-4512 et commande de reappro 40 unites ThermoControl.\n\nMarc va challenger le cout cumule du fret (680 + 850 CAD des missions precedentes). Patrick veut garantir le service client. Karim attend des chiffres MAPE solides.\n\nClaire observe en silence — c'est ton moment de montrer que tu maitrises les chiffres.\n\nDenise Roy\nSupply Chain — NordHabitat",
  "unlockExplanation": "Complétez d'abord « Décider un transfert inter-DC » (STO-4512 execute).",
  "sequence": 3,
  "estimatedMinutes": 45,
  "difficulty": "advanced",
  "competencyCodes": [
    "C-SC-03"
  ],
  "contextItems": [
    {
      "key": "ctx-sop-pack",
      "title": "Pack S&OP aout",
      "body": "Recommandation : reappro 40 unités ThermoControl + transfert STO-4512 (20 unités). KPI cibles : fill rate 95 %, MAPE < 15 %, couverture TRT 14 jours.",
      "required": true
    },
    {
      "key": "ctx-freight-total",
      "title": "Cumul fret urgence",
      "body": "Fret Sacre-Coeur STO-4408 : 850 CAD. Fret STO-4512 : 680 CAD. Total urgence aout : 1 530 CAD. Impact marge a documenter pour Marc.",
      "required": true
    },
    {
      "key": "ctx-audience",
      "title": "Participants S&OP",
      "body": "Denise (Supply Chain), Patrick (Ventes), Karim (Previsions), Marc (Finance), Claire Fontaine (Gestionnaire, observatrice).",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "prepare-first",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle preparation est essentielle avant la presentation S&OP ?",
      "options": [
        {
          "key": "prepare",
          "label": "Consolider chiffres, evidence et recommandation"
        },
        {
          "key": "wing-it",
          "label": "Improviser sans pack de données"
        },
        {
          "key": "skip-marc",
          "label": "Eviter les questions de Finance"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "prepare"
        ]
      }
    },
    {
      "id": "sop-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements doivent figurer dans votre presentation S&OP ?",
      "options": [
        {
          "key": "stock-analysis",
          "label": "Analyse stockout et desequilibre inter-DC"
        },
        {
          "key": "recommendation",
          "label": "Recommandation reappro 40 unités + transfert"
        },
        {
          "key": "freight-impact",
          "label": "Impact fret cumule (1 530 CAD) sur marge"
        },
        {
          "key": "kpi-targets",
          "label": "KPI cibles (fill rate, MAPE, couverture)"
        },
        {
          "key": "hide-costs",
          "label": "Omettre les coûts de fret a Marc"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "stock-analysis",
          "recommendation",
          "freight-impact",
          "kpi-targets"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "sop-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez le deroulement de votre intervention S&OP.",
      "options": [
        {
          "key": "prepare",
          "label": "Preparer le pack avec chiffres consolides"
        },
        {
          "key": "present",
          "label": "Présenter diagnostic et recommandation"
        },
        {
          "key": "defend",
          "label": "Defendre sous challenge Marc (fret/marge)"
        },
        {
          "key": "log",
          "label": "Consigner la decision S&OP dans le systeme"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "prepare",
          "present",
          "defend",
          "log"
        ]
      }
    },
    {
      "id": "freight-total",
      "type": "NUMERIC_INPUT",
      "prompt": "Quel est le total des frets d'urgence aout (CAD) : STO-4408 (850) + STO-4512 (680) ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 1530,
        "numericTolerance": 0
      }
    },
    {
      "id": "sop-defense",
      "type": "TEXT_ANALYSIS",
      "prompt": "Comment repondez-vous au challenge de Marc sur l'impact marge du fret cumule de 1 530 CAD ?",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "marge",
          "service",
          "decision",
          "sop"
        ]
      }
    }
  ],
  "completionFeedback": "Recommandation S&OP acceptee. Denise : « Tu as les chiffres. » Decision consignee pour le reappro ThermoControl.\n\nClaire Fontaine — Gestionnaire"
} as const satisfies MissionDefinitionDocument;
