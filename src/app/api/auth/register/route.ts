import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/response";
import { registerUser } from "@/modules/auth/auth.service";
import { registerSchema } from "@/modules/auth/auth.validation";

export async function POST(request: NextRequest) {
  try {
    const body = registerSchema.parse(await request.json());
    const result = await registerUser(body);

    return successResponse("User registered successfully", result, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
