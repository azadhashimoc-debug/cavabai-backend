import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/response";
import { FeedbackReplyInput } from "@/modules/feedback/feedback.validation";

export async function submitReplyFeedback(
  userId: string,
  input: FeedbackReplyInput,
) {
  const request = await prisma.assistRequest.findFirst({
    where: {
      id: input.assistRequestId,
      userId,
    },
    include: {
      replies: true,
    },
  });

  if (!request) {
    throw new AppError(404, "ASSIST_REQUEST_NOT_FOUND", "Assist request not found");
  }

  const reply = request.replies.find(
    (item: (typeof request.replies)[number]) => item.id === input.assistReplyId,
  );

  if (!reply) {
    throw new AppError(404, "ASSIST_REPLY_NOT_FOUND", "Assist reply not found");
  }

  const eventType =
    input.outcome === "ignored"
      ? "REPLY_IGNORED"
      : input.wasEdited
        ? "REPLY_EDITED"
        : "REPLY_SELECTED";

  await prisma.$transaction([
    prisma.assistReply.updateMany({
      where: { requestId: request.id },
      data: { isSelected: false },
    }),
    prisma.assistReply.update({
      where: { id: reply.id },
      data: { isSelected: input.outcome !== "ignored" },
    }),
    prisma.styleLearningEvent.create({
      data: {
        userId,
        assistRequestId: request.id,
        assistReplyId: reply.id,
        eventType,
        payload: {
          outcome: input.outcome,
          wasEdited: input.wasEdited,
          finalSentReply: input.finalSentReply ?? reply.text,
          note: input.note ?? null,
          selectedLabel: reply.label,
        },
      },
    }),
    ...(input.outcome !== "ignored"
      ? [
          prisma.userMessageExample.create({
            data: {
              userId,
              text: input.finalSentReply ?? reply.text,
              platform: request.platform,
              context: request.relationshipContext,
              wasEdited: input.wasEdited,
            },
          }),
        ]
      : []),
  ]);

  return {
    assistRequestId: request.id,
    assistReplyId: reply.id,
    learned: input.outcome !== "ignored",
  };
}
