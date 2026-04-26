import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/response";
import { loginUser } from "@/modules/auth/auth.service";
import { loginSchema } from "@/modules/auth/auth.validation";

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const result = await loginUser(body);

    return successResponse("Login successful", result);
  } catch (error) {
    return errorResponse(error);
  }
}
