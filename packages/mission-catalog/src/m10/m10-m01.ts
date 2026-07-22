import type { MissionDefinitionDocument } from "../schema.js";

export const M10_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m10-m01-diapositive-conseil",
  "missionCode": "M10-M01",
  "moduleCode": "M10",
  "title": "Diapositive conseil et synthese executive",
  "preview": "Preparez la diapositive conseil pour le DG : synthese M1-M9 en une page.",
  "briefing": "Bonjour,\n\nLe DG Equinoxe veut une diapositive conseil — une seule page — avant le defi final. Pas de detail operationnel : vision, risques, opportunites, recommandation.\n\nVous avez parcouru PO-88421, Sacre-Coeur, CAS-7701, gouvernance, KPI et IA. Condensez en message executive que Marc, Patrick et le DG comprennent en 60 secondes.\n\nLa synthese distingue les leaders des executants.\n\nDirecteur General\nEquinoxe — NordHabitat",
  "unlockExplanation": "Complétez d'abord le Module 9 (frontières IA validees) pour débloquer le Capstone.",
  "sequence": 1,
  "estimatedMinutes": 45,
  "difficulty": "advanced",
  "competencyCodes": [
    "C-EXEC-01"
  ],
  "contextItems": [
    {
      "key": "ctx-executive-brief",
      "title": "Cadrage diapositive conseil",
      "body": "Format : Situation → Risques → Opportunités → Recommandation. Max 5 bullet points. Audience : DG, Marc, Patrick. Duree presentation : 3 min.",
      "required": true
    },
    {
      "key": "ctx-key-facts",
      "title": "Faits cles M1-M9",
      "body": "Chaine P2P-O2C-CRM documentee; NPS 9; reliquat 500 CAD jaune; marge -3,1 % frets; SoD remedie; ThermoRival plus rapide mais moins trace.",
      "required": true
    },
    {
      "key": "ctx-strategic-ask",
      "title": "Question strategique DG",
      "body": "Investir dans tracabilite qualite lot vs accelerer delais comme ThermoRival ? Budget capstone : decision requise avant defi final.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "exec-structure",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle structure adoptez-vous pour la diapositive conseil ?",
      "options": [
        {
          "key": "sora",
          "label": "Situation → Risques → Opportunités → Recommandation"
        },
        {
          "key": "detail",
          "label": "Liste exhaustive de toutes les transactions M1-M9"
        },
        {
          "key": "vague",
          "label": "Generalites sans faits ni recommandation"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "sora"
        ]
      }
    },
    {
      "id": "exec-elements",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements le DG attend sur la diapositive conseil ?",
      "options": [
        {
          "key": "situation",
          "label": "Situation synthetique M1-M9"
        },
        {
          "key": "risks",
          "label": "Risques identifies (reliquat, marge, concurrence)"
        },
        {
          "key": "opportunities",
          "label": "Opportunités (NPS, tracabilite, gouvernance)"
        },
        {
          "key": "recommendation",
          "label": "Recommandation claire et actionnable"
        },
        {
          "key": "raw-data",
          "label": "Export brut ERP sans synthese"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "situation",
          "risks",
          "opportunities",
          "recommendation"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "exec-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la construction de la synthese executive.",
      "options": [
        {
          "key": "gather",
          "label": "Rassembler les faits cles M1-M9"
        },
        {
          "key": "prioritize",
          "label": "Prioriser risques et opportunités"
        },
        {
          "key": "recommend",
          "label": "Formuler la recommandation strategique"
        },
        {
          "key": "validate",
          "label": "Valider clarte en 60 secondes"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "gather",
          "prioritize",
          "recommend",
          "validate"
        ]
      }
    },
    {
      "id": "bullet-limit",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien de bullet points maximum la diapositive conseil autorise-t-elle ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 5,
        "numericTolerance": 0
      }
    },
    {
      "id": "exec-recommendation",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "Recommandez au DG : investir tracabilite qualite ou accelerer delais comme ThermoRival ? Justifiez avec les faits M1-M9.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "tracabilite",
          "NPS",
          "concurrence",
          "recommandation"
        ]
      }
    }
  ],
  "completionFeedback": "Diapositive conseil validee par le DG. Synthese executive M1-M9 acceptee. Defi final Equinoxe debloque.\n\nDirecteur General"
} as const satisfies MissionDefinitionDocument;
