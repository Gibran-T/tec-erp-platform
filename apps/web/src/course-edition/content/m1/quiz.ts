import type { ConsolidationQuizItem } from "../../types.js";
import { M1_SPINE } from "./spine.js";

export const M1_QUIZ: readonly ConsolidationQuizItem[] = [
  {
    id: "q1",
    prompt: "Que signifie principalement l’écart 40 versus 36 dans le Module 1 ?",
    options: [
      { key: "a", label: "Une obligation immédiate d’ajuster le stock" },
      { key: "b", label: "Un signal de fragmentation d’information entre départements" },
      { key: "c", label: "Une panne matérielle de l’entrepôt" },
      { key: "d", label: "Une erreur uniquement financière" },
    ],
    correctKey: "b",
    explanation:
      "Le Module 1 enseigne à lire l’écart comme fragmentation d’information, non comme transaction d’ajustement.",
  },
  {
    id: "q2",
    prompt: "Combien de départements structurants NordHabitat sont présentés en M1 ?",
    options: [
      { key: "a", label: "5" },
      { key: "b", label: "6" },
      { key: "c", label: "7" },
      { key: "d", label: "10" },
    ],
    correctKey: "c",
    explanation: "Direction, Opérations, Finance, Ventes, Approvisionnement, Entrepôt et TI.",
  },
  {
    id: "q3",
    prompt: "Quel est le rôle attendu de l’analyste en M1 ?",
    options: [
      { key: "a", label: "Exécuter immédiatement une réception marchandise" },
      { key: "b", label: "Observer, relier départements/processus et justifier avant transaction" },
      { key: "c", label: "Fermer le dossier client" },
      { key: "d", label: "Créer une commande d’achat" },
    ],
    correctKey: "b",
    explanation: "M1 est une mission d’observation-analyse, pas d’exécution transactionnelle.",
  },
  {
    id: "q4",
    prompt: `Quelle variance (unités) sépare système ${M1_SPINE.inventorySystemQty} et terrain ${M1_SPINE.inventoryPhysicalQty} ?`,
    options: [
      { key: "a", label: "2" },
      { key: "b", label: "3" },
      { key: "c", label: "4" },
      { key: "d", label: "6" },
    ],
    correctKey: "c",
    explanation: `${M1_SPINE.inventorySystemQty} − ${M1_SPINE.inventoryPhysicalQty} = ${M1_SPINE.inventoryVariance}.`,
  },
  {
    id: "q5",
    prompt: "Quel ordre de réponse organisationnelle est le plus cohérent ?",
    options: [
      {
        key: "a",
        label: "Finance → Ventes → Entrepôt → TI → Opérations",
      },
      {
        key: "b",
        label: "Observer terrain → vérifier système → alerter opérations → informer ventes → documenter finance",
      },
      {
        key: "c",
        label: "Automatiser d’abord → ajuster stock → informer direction",
      },
      {
        key: "d",
        label: "Ventes → client → facture → inventaire",
      },
    ],
    correctKey: "b",
    explanation: "La chaîne pédagogique M1 part du signal terrain vers la consolidation financière.",
  },
  {
    id: "q6",
    prompt: "Quel niveau de préparation M1-M03 considère comme correct pour NordHabitat ?",
    options: [
      { key: "a", label: "Prête — tout est déjà aligné" },
      { key: "b", label: "Partiellement prête — signaux visibles, gouvernance encore floue" },
      { key: "c", label: "Non prête — aucune visibilité" },
      { key: "d", label: "Certification Gold immédiate" },
    ],
    correctKey: "b",
    explanation: "Le diagnostic authored attendu est « partiellement prête ».",
  },
  {
    id: "q7",
    prompt: "Que consomme principalement la master data article dans ce module ?",
    options: [
      { key: "a", label: "Uniquement la paie" },
      { key: "b", label: "Plusieurs processus : inventaire, approvisionnement, ventes, finance" },
      { key: "c", label: "Uniquement le marketing" },
      { key: "d", label: "Aucun processus" },
    ],
    correctKey: "b",
    explanation: "La fiche SKU-HVAC-4421 illustre une donnée de référence multi-processus.",
  },
];
