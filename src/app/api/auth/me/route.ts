import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    return successResponse("User loaded successfully", {
      id: user.id,
      email: user.email,
      name: user.name,
      styleProfile: user.styleProfile,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
