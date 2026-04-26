import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { generateAssistReply } from "@/modules/assist/assist.service";
import { assistReplySchema } from "@/modules/assist/assist.validation";

type AssistReplyItem = {
  id: string;
  label: string;
  text: string;
};

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = assistReplySchema.parse(await request.json());
    const result = await generateAssistReply(user.id, body);

    const replies = result.replies as AssistReplyItem[];

    return successResponse("Reply generated successfully", {
      analysis: result.analysis,
      replies: replies.map((reply: AssistReplyItem) => ({
        id: reply.id,
        label: reply.label,
        text: reply.text,
      })),
      assistRequestId: result.assistRequestId,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
