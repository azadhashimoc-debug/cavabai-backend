import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/response";

type JwtPayload = {
  sub: string;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError(500, "JWT_SECRET_MISSING", "JWT secret is not configured");
  }

  return secret;
}

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    throw new AppError(401, "UNAUTHORIZED", "Invalid or expired token");
  }
}

export function extractBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", "Authorization header is missing");
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function requireAuth(request: NextRequest) {
  const token = extractBearerToken(request);
  const payload = verifyAccessToken(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { styleProfile: true },
  });

  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "User not found");
  }

  return user;
}
