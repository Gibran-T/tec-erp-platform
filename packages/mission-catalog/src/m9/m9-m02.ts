import type { MissionDefinitionDocument } from "../schema.js";

export const M9_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m9-m02-tableau-bord-comite",
  "missionCode": "M9-M02",
  "moduleCode": "M9",
  "title": "Tableau de bord du comite de direction",
  "preview": "Construisez le tableau de bord Equinoxe pour le comite avec les KPI definis.",
  "briefing": "Bonjour,\n\nLes KPI sont definis — maintenant il faut un tableau de bord que Marc, Patrick et Sophie comprennent en 30 secondes. Pas de graphiques decoratifs : chaque tuile doit declencher une question metier.\n\nStructurez le dashboard par domaine (CRM, P2P, O2C, GOV) avec signaux vert/jaune/rouge. Le comite se reunit jeudi; votre dashboard doit raconter l'histoire NordHabitat M1-M8.\n\nLa clarte vaut mieux que la complexite.\n\nNadia Fontaine\nBusiness Intelligence — NordHabitat",
  "unlockExplanation": "Completez d'abord « Atelier de definition des KPI » (cinq KPI valides).",
  "sequence": 2,
  "estimatedMinutes": 45,
  "difficulty": "advanced",
  "competencyCodes": [
    "C-BI-02",
    "C-COM-05"
  ],
  "contextItems": [
    {
      "key": "ctx-dashboard-layout",
      "title": "Structure tableau de bord Equinoxe",
      "body": "Quatre zones : CRM (NPS, delai P1); P2P (ecart reliquat); O2C (marge, frets); GOV (SoD remedie). Vue executive en haut; drill-down par domaine.",
      "required": true
    },
    {
      "key": "ctx-signal-status",
      "title": "Signaux actuels M1-M8",
      "body": "NPS 9 — vert; delai P1 22 h — vert; reliquat 500 CAD — jaune; marge -3,1 % — jaune; SoD 3/3 — vert.",
      "required": true
    },
    {
      "key": "ctx-audience",
      "title": "Audience comite jeudi",
      "body": "Marc (Finance), Patrick (Operations), Sophie (CRM), Isabelle (Gouvernance), DG. Temps disponible : 15 min par domaine.",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "dashboard-principle",
      "type": "SINGLE_CHOICE",
      "prompt": "Quel principe guide la conception du tableau de bord comite ?",
      "options": [
        {
          "key": "clarity",
          "label": "Clarte executive : signaux actionnables en 30 secondes"
        },
        {
          "key": "complexity",
          "label": "Maximum de graphiques et de metriques"
        },
        {
          "key": "decorative",
          "label": "Design decoratif sans lien metier"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "clarity"
        ]
      }
    },
    {
      "id": "dashboard-zones",
      "type": "MULTI_CHOICE",
      "prompt": "Quelles zones le tableau de bord Equinoxe doit-il inclure ?",
      "options": [
        {
          "key": "crm-zone",
          "label": "Zone CRM : NPS et delai P1"
        },
        {
          "key": "p2p-zone",
          "label": "Zone P2P : ecart reliquat PO-88421"
        },
        {
          "key": "o2c-zone",
          "label": "Zone O2C : marge et frets Sacre-Coeur"
        },
        {
          "key": "gov-zone",
          "label": "Zone GOV : remediation SoD Q3"
        },
        {
          "key": "random",
          "label": "Indicateurs sans lien M1-M8"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "crm-zone",
          "p2p-zone",
          "o2c-zone",
          "gov-zone"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "dashboard-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la presentation au comite jeudi.",
      "options": [
        {
          "key": "executive",
          "label": "Vue executive : signaux globaux vert/jaune/rouge"
        },
        {
          "key": "domain",
          "label": "Drill-down par domaine avec KPI"
        },
        {
          "key": "narrative",
          "label": "Narration metier M1-M8 par domaine"
        },
        {
          "key": "actions",
          "label": "Actions recommandees et proprietaires"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "executive",
          "domain",
          "narrative",
          "actions"
        ]
      }
    },
    {
      "id": "yellow-signals",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien de signaux jaunes le dashboard affiche-t-il actuellement (reliquat + marge) ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 2,
        "numericTolerance": 0
      }
    },
    {
      "id": "dashboard-narrative",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "Le reliquat P2P (500 CAD) est jaune. Que recommandez-vous au comite : ignorer ou action avec proprietaire ? Justifiez.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "reliquat",
          "action",
          "proprietaire",
          "comite"
        ]
      }
    }
  ],
  "completionFeedback": "Tableau de bord Equinoxe presente jeudi. Comite aligne sur signaux CRM, P2P, O2C et GOV. Actions assignees sur reliquat jaune.\n\nNadia Fontaine"
} as const satisfies MissionDefinitionDocument;
