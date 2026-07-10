import type { MessageKey, TaskKey } from "@tec-platform/contracts";

export const MANAGER_MESSAGE_KEY = "premier-message-gestionnaire" satisfies MessageKey;
export const FIRST_TASK_KEY = "decouvrir-nordhabitat" satisfies TaskKey;

export interface CatalogMessage {
  readonly messageKey: MessageKey;
  readonly fromName: string;
  readonly subject: string;
  readonly preview: string;
  readonly body: string;
}

export interface CatalogTask {
  readonly taskKey: TaskKey;
  readonly title: string;
  readonly description: string;
}

export const FIRST_DAY_MESSAGE_CATALOG: readonly CatalogMessage[] = [
  {
    messageKey: MANAGER_MESSAGE_KEY,
    fromName: "Claire Fontaine",
    subject: "Bienvenue chez NordHabitat — votre première journée",
    preview:
      "Bonjour, bienvenue au Centre d'excellence ERP de NordHabitat. Je suis Claire Fontaine, votre gestionnaire.",
    body:
      "Bonjour, bienvenue au Centre d'excellence ERP de NordHabitat. Je suis Claire Fontaine, votre gestionnaire.\n\n" +
      "Votre poste de travail numérique est prêt. Commencez par votre boîte de réception et vos tâches : c'est ainsi que les informations et les responsabilités circulent dans notre environnement de travail.\n\n" +
      "Explorez également les applications disponibles. Celles qui portent la mention « Accès en préparation » s'ouvriront progressivement, selon vos responsabilités.\n\n" +
      "Dès que vous aurez pris connaissance de ce message, une première responsabilité vous sera confiée.",
  },
];

export const FIRST_DAY_TASK_CATALOG: readonly CatalogTask[] = [
  {
    taskKey: FIRST_TASK_KEY,
    title: "Découvrir NordHabitat",
    description:
      "Observez votre environnement de travail : repérez les applications actives, celles en préparation, et la façon dont une responsabilité vous est transmise après un message de votre gestionnaire.",
  },
];

export function isKnownMessageKey(messageKey: string): messageKey is MessageKey {
  return FIRST_DAY_MESSAGE_CATALOG.some((message) => message.messageKey === messageKey);
}

export function isKnownTaskKey(taskKey: string): taskKey is TaskKey {
  return FIRST_DAY_TASK_CATALOG.some((task) => task.taskKey === taskKey);
}
