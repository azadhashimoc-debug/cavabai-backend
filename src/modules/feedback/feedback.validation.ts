import { z } from "zod";

export const feedbackReplySchema = z.object({
  assistRequestId: z.string().cuid(),
  assistReplyId: z.string().cuid(),
  finalSentReply: z.string().trim().min(1).max(220).optional(),
  wasEdited: z.boolean().default(false),
  outcome: z.enum(["sent", "liked", "ignored"]).default("sent"),
  note: z.string().trim().min(1).max(300).optional(),
});

export type FeedbackReplyInput = z.infer<typeof feedbackReplySchema>;
