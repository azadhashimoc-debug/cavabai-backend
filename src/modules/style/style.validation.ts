import { z } from "zod";

const boundedLevel = z.int().min(0).max(5);

export const updateStyleProfileSchema = z.object({
  preferredLanguage: z.enum(["az", "tr"]).optional(),
  communicationTone: z.enum(["casual", "playful", "confident", "soft"]).optional(),
  relationshipStyle: z.enum(["balanced", "warm", "reserved"]).optional(),
  bio: z.string().trim().min(2).max(240).nullable().optional(),
  formalityLevel: boundedLevel.optional(),
  humorLevel: boundedLevel.optional(),
  flirtLevel: boundedLevel.optional(),
  brevityLevel: boundedLevel.optional(),
  emojiLevel: boundedLevel.optional(),
  avoidWords: z.array(z.string().trim().min(1).max(32)).max(20).optional(),
  favoritePhrases: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
});

export type UpdateStyleProfileInput = z.infer<typeof updateStyleProfileSchema>;
