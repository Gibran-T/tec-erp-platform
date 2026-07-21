import type { MissionDefinitionDocument } from "../schema.js";

export const M10_M02 = {
  "maxAttempts": 2,
  "passThresholdPercent": 70,
  "missionKey": "m10-m02-defi-final-equinoxe",
  "missionCode": "M10-M02",
  "moduleCode": "M10",
  "title": "Defi final Equinoxe (crise integree)",
  "preview": "Gerez la crise integree : lot LT-8842, ThermoRival et pression DG simultanees.",
  "briefing": "Bonjour,\n\nC'est le defi final. En une matinee, tout converge : nouveau signalement lot LT-8842 (5 unites), ThermoRival courtise Sacre-Coeur, Patrick demande PO d'urgence sans comite, Sophie a trois cas P1 ouverts.\n\nVous devez prioriser, coordonner et decider — sans contourner gouvernance, sans perdre le client, sans mentir au comite. C'est la crise integree Equinoxe.\n\nMontrez que vous maitrisez la chaine complete M1-M9.\n\nDirecteur General\nEquinoxe — NordHabitat",
  "unlockExplanation": "Completez d'abord « Diapositive conseil et synthese executive » (DG debloque le defi).",
  "sequence": 2,
  "estimatedMinutes": 60,
  "difficulty": "expert",
  "competencyCodes": [
    "C-CAP-01",
    "C-CAP-02"
  ],
  "contextItems": [
    {
      "key": "ctx-crisis-bundle",
      "title": "Bundle crise Equinoxe",
      "body": "5 unites LT-8842 signalees; ThermoRival offre -10 % Sacre-Coeur; Patrick PO 28K sans comite; Sophie 3 cas P1; Marc demande impact marge immediate.",
      "required": true
    },
    {
      "key": "ctx-constraints",
      "title": "Contraintes non negociables",
      "body": "Gouvernance : PO > 25K = comite; CRM : un seul contact client; Qualite : hold lot obligatoire; IA : reflection only, pas de decision.",
      "required": true
    },
    {
      "key": "ctx-stakeholders",
      "title": "Parties prenantes actives",
      "body": "Dr Meunier (Sacre-Coeur), Patrick (Operations), Sophie (CRM), Marc (Finance), Isabelle (Gouvernance), DG (arbitrage final).",
      "required": true
    }
  ],
  "interactions": [
    {
      "id": "crisis-priority",
      "type": "SINGLE_CHOICE",
      "prompt": "Quelle est votre premiere priorite dans la crise integree ?",
      "options": [
        {
          "key": "safety-quality",
          "label": "Hold qualite lot LT-8842 et proteger les patients"
        },
        {
          "key": "po-rush",
          "label": "Liberer la PO Patrick sans comite"
        },
        {
          "key": "rival-deal",
          "label": "Accepter la contre-offre ThermoRival immediatement"
        }
      ],
      "scoring": {
        "maxPoints": 20,
        "correctKeys": [
          "safety-quality"
        ]
      }
    },
    {
      "id": "crisis-actions",
      "type": "MULTI_CHOICE",
      "prompt": "Quelles actions coordonnees menez-vous en parallele ?",
      "options": [
        {
          "key": "quality-hold",
          "label": "Hold qualite lot LT-8842 avec tracabilite"
        },
        {
          "key": "crm-unified",
          "label": "Communication unifiee Sacre-Coeur via Sophie"
        },
        {
          "key": "gov-route",
          "label": "Router PO 28K vers comite achats"
        },
        {
          "key": "margin-brief",
          "label": "Brief marge Marc avec faits documentes"
        },
        {
          "key": "bypass-all",
          "label": "Contourner toutes les regles pour la vitesse"
        }
      ],
      "scoring": {
        "maxPoints": 25,
        "correctKeys": [
          "quality-hold",
          "crm-unified",
          "gov-route",
          "margin-brief"
        ],
        "minimumSelections": 4
      }
    },
    {
      "id": "crisis-flow",
      "type": "ORDERING",
      "prompt": "Ordonnez la gestion de la crise integree Equinoxe.",
      "options": [
        {
          "key": "assess",
          "label": "Evaluer severite et contraintes non negociables"
        },
        {
          "key": "prioritize",
          "label": "Prioriser securite patient et hold qualite"
        },
        {
          "key": "coordinate",
          "label": "Coordonner CRM, GOV, Finance en parallele"
        },
        {
          "key": "arbitrate",
          "label": "Arbitrer avec DG et documenter decisions"
        }
      ],
      "scoring": {
        "maxPoints": 30,
        "correctOrder": [
          "assess",
          "prioritize",
          "coordinate",
          "arbitrate"
        ]
      }
    },
    {
      "id": "p1-count",
      "type": "NUMERIC_INPUT",
      "prompt": "Combien de cas P1 Sophie a-t-elle ouverts simultanement ?",
      "scoring": {
        "maxPoints": 10,
        "numericTarget": 3,
        "numericTolerance": 0
      }
    },
    {
      "id": "crisis-reflection",
      "type": "DIAGNOSIS_RECOMMENDATION",
      "prompt": "ThermoRival offre -10 % a Sacre-Coeur pendant la crise. Que recommandez-vous au DG : contre-offre prix ou valeur tracabilite ? Justifiez.",
      "scoring": {
        "maxPoints": 15,
        "requiredConcepts": [
          "tracabilite",
          "client",
          "crise",
          "valeur"
        ]
      }
    }
  ],
  "completionFeedback": "Crise integree maitrisee. Hold qualite actif, gouvernance respectee, Sacre-Coeur retenu. Defi final Equinoxe reussi.\n\nDirecteur General"
} as const satisfies MissionDefinitionDocument;
