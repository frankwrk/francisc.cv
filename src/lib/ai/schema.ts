import { z } from "zod";

export const AssistantSupportLevelSchema = z.enum([
  "grounded",
  "partial",
  "insufficient",
]);

export const AssistantMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

export const AssistantContextInputSchema = z.object({
  pathname: z.string().trim().min(1).max(2048),
  title: z.string().trim().max(240).optional(),
});

export const AssistantChatRequestSchema = z.object({
  messages: z.array(AssistantMessageSchema).min(1).max(12),
  context: AssistantContextInputSchema,
});

export const AssistantModelAnswerSchema = z.object({
  answer: z.string().trim().min(1).max(4000),
  supportPoints: z.array(z.string().trim().min(1).max(280)).max(4),
  caveat: z.string().trim().max(400).nullable(),
  suggestedQuestions: z.array(z.string().trim().min(1).max(160)).max(3),
  supportLevel: AssistantSupportLevelSchema,
});

export const AssistantCitationSchema = z.object({
  title: z.string().trim().min(1),
  canonicalUrl: z.string().trim().min(1),
  sourceType: z.string().trim().min(1),
});

export const AssistantChatResponseSchema = z.object({
  requestId: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  supportPoints: z.array(z.string().trim().min(1)).max(4),
  caveat: z.string().trim().nullable(),
  suggestedQuestions: z.array(z.string().trim().min(1)).max(3),
  citations: z.array(AssistantCitationSchema).max(4),
  supportLevel: AssistantSupportLevelSchema,
});

export type AssistantMessage = z.infer<typeof AssistantMessageSchema>;
export type AssistantChatRequest = z.infer<typeof AssistantChatRequestSchema>;
export type AssistantModelAnswer = z.infer<typeof AssistantModelAnswerSchema>;
export type AssistantCitation = z.infer<typeof AssistantCitationSchema>;
export type AssistantChatResponse = z.infer<typeof AssistantChatResponseSchema>;
