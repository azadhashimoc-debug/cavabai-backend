import bcrypt from "bcryptjs";

import { signAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/response";
import { LoginInput, RegisterInput } from "@/modules/auth/auth.validation";

function serializeUser(user: {
  id: string;
  email: string;
  name: string | null;
  styleProfile?: unknown;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    styleProfile: user.styleProfile ?? null,
  };
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, "EMAIL_ALREADY_EXISTS", "This email is already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
      styleProfile: {
        create: {},
      },
    },
    include: {
      styleProfile: true,
    },
  });

  const token = signAccessToken({ sub: user.id, email: user.email });

  return {
    token,
    user: serializeUser(user),
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: {
      styleProfile: true,
    },
  });

  if (!user) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Email or password is incorrect");
  }

  const token = signAccessToken({ sub: user.id, email: user.email });

  return {
    token,
    user: serializeUser(user),
  };
}
