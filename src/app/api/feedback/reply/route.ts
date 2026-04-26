import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { submitReplyFeedback } from "@/modules/feedback/feedback.service";
import { feedbackReplySchema } from "@/modules/feedback/feedback.validation";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = feedbackReplySchema.parse(await request.json());
    const result = await submitReplyFeedback(user.id, body);

    return successResponse("Reply feedback saved successfully", result);
  } catch (error) {
    return errorResponse(error);
  }
}
