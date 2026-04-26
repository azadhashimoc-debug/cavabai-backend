import { z } from "zod";

export const assistReplySchema = z.object({
  incomingMessage: z.string().trim().min(1).max(1000),
  mode: z.enum(["casual", "flirt", "confident", "friendly", "soft"]),
  platform: z.enum(["whatsapp", "instagram", "telegram", "messenger", "other"]),
  relationshipContext: z.enum([
    "new_chat",
    "friends",
    "dating",
    "talking_stage",
    "partner",
    "colleague",
    "other",
  ]),
});

export type AssistReplyInput = z.infer<typeof assistReplySchema>;
