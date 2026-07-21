import { describe, expect, it } from "vitest";

import {
  CompleteTaskResponseSchema,
  InboxResponseSchema,
  MarkMessageReadResponseSchema,
  MessageKeySchema,
  TaskKeySchema,
  TasksResponseSchema,
} from "../first-day.js";

describe("first-day contracts", () => {
  it("accepts the RC01 manager message key", () => {
    expect(MessageKeySchema.safeParse("premier-message-gestionnaire").success).toBe(true);
    expect(MessageKeySchema.safeParse("unknown").success).toBe(false);
  });

  it("accepts the RC01 first task key", () => {
    expect(TaskKeySchema.safeParse("decouvrir-nordhabitat").success).toBe(true);
    expect(TaskKeySchema.safeParse("unknown").success).toBe(false);
  });

  it("validates an inbox response with unread state", () => {
    const parsed = InboxResponseSchema.safeParse({
      messages: [
        {
          messageKey: "premier-message-gestionnaire",
          fromName: "Claire Fontaine",
          subject: "Bienvenue chez NordHabitat",
          preview: "Bonjour et bienvenue.",
          body: "Bonjour et bienvenue dans l'équipe.",
          readAt: null,
        },
      ],
      unreadCount: 1,
    });

    expect(parsed.success).toBe(true);
  });

  it("validates mark-message-read and complete-task responses", () => {
    const readAt = new Date().toISOString();
    const completedAt = new Date().toISOString();

    expect(
      MarkMessageReadResponseSchema.safeParse({
        messageKey: "premier-message-gestionnaire",
        readAt,
      }).success,
    ).toBe(true);

    expect(
      CompleteTaskResponseSchema.safeParse({
        taskKey: "decouvrir-nordhabitat",
        completedAt,
      }).success,
    ).toBe(true);
  });

  it("validates a tasks response", () => {
    const parsed = TasksResponseSchema.safeParse({
      tasks: [
        {
          taskKey: "decouvrir-nordhabitat",
          title: "Découvrir NordHabitat",
          description: "Explorez votre environnement de travail.",
          status: "a_faire",
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });
});
