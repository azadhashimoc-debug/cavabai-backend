import { NextRequest } from "next/server";

import { requireAuth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { getStyleProfile, updateStyleProfile } from "@/modules/style/style.service";
import { updateStyleProfileSchema } from "@/modules/style/style.validation";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const profile = await getStyleProfile(user.id);

    return successResponse("Style profile loaded successfully", profile);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = updateStyleProfileSchema.parse(await request.json());
    const profile = await updateStyleProfile(user.id, body);

    return successResponse("Style profile updated successfully", profile);
  } catch (error) {
    return errorResponse(error);
  }
}
