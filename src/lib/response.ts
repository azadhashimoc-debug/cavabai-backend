import { NextResponse } from "next/server";
import { ZodError } from "zod";

type ErrorPayload = {
  code: string;
  message: string;
  details?: unknown;
};

export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function successResponse<T>(
  message: string,
  data: T,
  status = 200,
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details ?? {},
        } satisfies ErrorPayload,
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: error.flatten(),
        } satisfies ErrorPayload,
      },
      { status: 400 },
    );
  }

  console.error(error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        details: {},
      } satisfies ErrorPayload,
    },
    { status: 500 },
  );
}
