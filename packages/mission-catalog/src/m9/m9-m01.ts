import type { MissionDefinitionDocument } from "../schema.js";

export const M9_M01 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m9-m01-atelier-definition-kpi",
  "missionCode": "M9-M01",
  "moduleCode": "M9",
  "title": "Atelier de definition des KPI",
  "preview": "Definissez les KPI directeurs pour le comite Equinoxe a partir des donnees M1-M8.",
  "briefing": "Bonjour,\n\nLe comite de direction Equinoxe veut un tableau de bord fiable — pas 40 indicateurs, mais les KPI qui comptent vraiment. NPS institutionnel, delai P1 CRM, ecart P2P, marge O2C : tout est la, mais rien n'est formalise.\n\nVotre role : animer l'atelier de definition KPI. Chaque indicateur doit avoir une definition, une source de donnees, un seuil et un proprietaire.\n\nUn KPI sans proprietaire est un numero mort.\n\nNadia Fontaine\nBusiness Intelligence — NordHabitat",
  "unlockExplanation": "Completez d'abord le Module 8 (autoevaluation probation) pour debloquer BI.",
  "sequence": 1,
  "estimatedMinutes": 40,
  "difficulty": "intermediate",
  "competencyCodes": [
    "C-BI-01"
  ],
  "contextItems": [
    {
      "key": "ctx-kpi-candidates",
      "title": "Candidats KPI Equinoxe",
      "body": "NPS institutionnel (CAS-7701 : 9); delai resolution P1 CRM (22 h vs 24 h SLA); ecart P2P PO-88421 (500 CAD reliquat); marge O2C Sacre-Coeur (-3,1 % frets); taux SoD remedie (3/3).",
      "required": true
    },
    {
      "key": "ctx-kpi-framework",
      "title": "Cadre definition KPI",
      "body": "Chaque KPI : nom, definition, formule, source ERP, frequence, seuil vert/jaune/rouge, proprietaire metier, audience comite.",
      "required": true
    },
    {
      "key": "ctx-data-sources",
      "title": "Sources de donnees ERP",
      "body": "CRM : CAS-7701, NPS; P2P : PO-88421, GR; O2C : SO-12047, frets; GOV : revue SoD Q3; Finance : rapprochement Marc.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "kpi-priority",
      "type": "SINGLE_CHOICE",
      "prompt": "Quel KPI le comite Equinoxe doit-il prioriser pour le pilotage client institutionnel ?",
      "options": [
        {
          "key": "nps",
          "label": "NPS institutionnel avec seuil >= 8"
        },
        {
          "key": "emoji-count",
          "label": "Nombre d'emojis dans les cas CRM"
        },
        {
          "key": "po-count",
          "label": "Nombre total de PO creees ce trimestre"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "nps"
        ]
      }
    },
    {
      "id": "kpi-definition",
      "type": "MULTI_CHOICE",
      "prompt": "Quels elements sont obligatoires pour un KPI valide dans l'atelier ?",
      "options": [
        {
          "key": "definition",
          "label": "Definition claire et formule"
        },
        {
          "key": "source",
          "label": "Source de donnees ERP identifiee"
        },
        {
          "key": "threshold",
          "label": "Seuils vert/jaune/rouge"
        },
        {
          "key": "owner",
          "label": "Proprietaire metier assigne"
        },
        {
          "key": "vague-name",
          "label": "Nom seul sans definition"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "definition",
          "source",
          "threshold",
          "owner"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "kpi-workshop-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez l'atelier de definition des KPI.",
      "options": [
        {
          "key": "identify",
          "label": "Identifier les besoins du comite"
        },
        {
          "key": "select",
          "label": "Selectionner les KPI candidats pertinents"
        },
        {
          "key": "define",
          "label": "Definir formule, source et seuils"
        },
        {
          "key": "assign",
          "label": "Assigner proprietaire et valider avec le comite"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "identify",
          "select",
          "define",
          "assign"
        ]
      }
    },
    {
      "id": "nps-target",
      "type": "NUMERIC_INPUT",
      "prompt": "Quel seuil NPS (score minimum) Patrick a-t-il fixe pour le comite CRM ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 8,
        "numericTolerance": 0
      }
    },
    {
      "id": "kpi-justification",
      "type": "TEXT_ANALYSIS",
      "prompt": "Justifiez pourquoi le delai resolution P1 CRM (22 h vs SLA 24 h) merite un KPI directeur pour Equinoxe.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "SLA",
          "client",
          "institutionnel",
          "pilotage"
        ]
      }
    }
  ],
  "completionFeedback": "Atelier KPI valide. Cinq indicateurs directeurs definis avec proprietaires et seuils. Pret pour le tableau de bord comite.\n\nNadia Fontaine"
} as const satisfies MissionDefinitionDocument;
