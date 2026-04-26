import { prisma } from "@/lib/prisma";
import { UpdateStyleProfileInput } from "@/modules/style/style.validation";

export async function getStyleProfile(userId: string) {
  const profile = await prisma.userStyleProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  return profile;
}

export async function updateStyleProfile(
  userId: string,
  input: UpdateStyleProfileInput,
) {
  const profile = await prisma.userStyleProfile.upsert({
    where: { userId },
    update: input,
    create: {
      userId,
      ...input,
    },
  });

  await prisma.styleLearningEvent.create({
    data: {
      userId,
      eventType: "PROFILE_UPDATED",
      payload: input,
    },
  });

  return profile;
}
