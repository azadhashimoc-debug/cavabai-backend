import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { getOpenAIClient, getOpenAIModel } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/response";
import { AssistReplyInput } from "@/modules/assist/assist.validation";
import { buildAssistPrompt } from "@/modules/assist/prompt-builder";

const generatedReplySchema = z.object({
  analysis: z.string().min(1).max(500),
  replies: z
    .array(
      z.object({
        label: z.enum(["Rahat", "Zarafatlı", "Flirt", "Qısa"]),
        text: z.string().min(1).max(220),
      }),
    )
    .length(4),
});

type GeneratedReply = z.infer<typeof generatedReplySchema>;

export async function generateAssistReply(userId: string, input: AssistReplyInput) {
  const [styleProfile, examples] = await Promise.all([
    prisma.userStyleProfile.upsert({
      where: { userId },
      update: {},
      create: { userId },
    }),
    prisma.userMessageExample.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        text: true,
        platform: true,
        context: true,
      },
    }),
  ]);

  const prompt = buildAssistPrompt({
    ...input,
    styleProfile,
    examples,
  });

  const completion = await getOpenAIClient().chat.completions.parse({
    model: getOpenAIModel(),
    temperature: 0.9,
    messages: [
      {
        role: "system",
        content:
          "You generate concise Azerbaijani/Turkish messaging replies and must return valid JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: zodResponseFormat(generatedReplySchema, "assist_reply"),
  });

  const parsed = completion.choices[0]?.message.parsed as GeneratedReply | null | undefined;

  if (!parsed) {
    throw new AppError(502, "OPENAI_INVALID_RESPONSE", "OpenAI returned an invalid structured response");
  }

  const uniqueLabels = new Set(parsed.replies.map((reply) => reply.label));

  if (uniqueLabels.size !== 4) {
    throw new AppError(502, "OPENAI_INVALID_RESPONSE", "OpenAI did not return four distinct reply labels");
  }

  const savedRequest = await prisma.assistRequest.create({
    data: {
      userId,
      incomingMessage: input.incomingMessage,
      mode: input.mode,
      platform: input.platform,
      relationshipContext: input.relationshipContext,
      analysis: parsed.analysis,
      replies: {
        create: parsed.replies.map((reply: GeneratedReply["replies"][number]) => ({
          label: reply.label,
          text: reply.text,
        })),
      },
    },
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return {
    assistRequestId: savedRequest.id,
    analysis: savedRequest.analysis,
    replies: savedRequest.replies.map((reply) => ({
      id: reply.id,
      label: reply.label,
      text: reply.text,
    })),
  };
}
