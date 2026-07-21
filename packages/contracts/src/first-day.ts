import { z } from "zod";

/**
 * RC01 Slice C1 — First-day inbox and task state contracts.
 * Message/task content is static in API code; only per-employee state crosses the boundary.
 */

export const MessageKeySchema = z.enum(["premier-message-gestionnaire"]);
export type MessageKey = z.infer<typeof MessageKeySchema>;

export const TaskKeySchema = z.enum(["decouvrir-nordhabitat"]);
export type TaskKey = z.infer<typeof TaskKeySchema>;

export const TaskStatusSchema = z.enum(["a_faire", "terminee"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const InboxMessageSchema = z.object({
  messageKey: MessageKeySchema,
  fromName: z.string().min(1),
  subject: z.string().min(1),
  preview: z.string().min(1),
  body: z.string().min(1),
  readAt: z.string().datetime().nullable(),
});
export type InboxMessage = z.infer<typeof InboxMessageSchema>;

export const InboxResponseSchema = z.object({
  messages: z.array(InboxMessageSchema),
  unreadCount: z.number().int().min(0),
});
export type InboxResponse = z.infer<typeof InboxResponseSchema>;

export const MarkMessageReadResponseSchema = z.object({
  messageKey: MessageKeySchema,
  readAt: z.string().datetime(),
});
export type MarkMessageReadResponse = z.infer<typeof MarkMessageReadResponseSchema>;

export const EmployeeTaskSchema = z.object({
  taskKey: TaskKeySchema,
  title: z.string().min(1),
  description: z.string().min(1),
  status: TaskStatusSchema,
});
export type EmployeeTask = z.infer<typeof EmployeeTaskSchema>;

export const TasksResponseSchema = z.object({
  tasks: z.array(EmployeeTaskSchema),
});
export type TasksResponse = z.infer<typeof TasksResponseSchema>;

export const CompleteTaskResponseSchema = z.object({
  taskKey: TaskKeySchema,
  completedAt: z.string().datetime(),
});
export type CompleteTaskResponse = z.infer<typeof CompleteTaskResponseSchema>;
