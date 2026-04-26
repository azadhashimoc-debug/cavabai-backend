-- CreateEnum
CREATE TYPE "LearningEventType" AS ENUM ('PROFILE_UPDATED', 'REPLY_SELECTED', 'REPLY_EDITED', 'REPLY_IGNORED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStyleProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'az',
    "communicationTone" TEXT NOT NULL DEFAULT 'casual',
    "relationshipStyle" TEXT NOT NULL DEFAULT 'balanced',
    "bio" TEXT,
    "formalityLevel" INTEGER NOT NULL DEFAULT 2,
    "humorLevel" INTEGER NOT NULL DEFAULT 2,
    "flirtLevel" INTEGER NOT NULL DEFAULT 1,
    "brevityLevel" INTEGER NOT NULL DEFAULT 4,
    "emojiLevel" INTEGER NOT NULL DEFAULT 1,
    "avoidWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "favoritePhrases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStyleProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMessageExample" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "platform" TEXT,
    "context" TEXT,
    "wasEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMessageExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "incomingMessage" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "relationshipContext" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL DEFAULT 'v1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssistReply" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssistReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleLearningEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assistRequestId" TEXT,
    "assistReplyId" TEXT,
    "eventType" "LearningEventType" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StyleLearningEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserStyleProfile_userId_key" ON "UserStyleProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserStyleProfile" ADD CONSTRAINT "UserStyleProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessageExample" ADD CONSTRAINT "UserMessageExample_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistRequest" ADD CONSTRAINT "AssistRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssistReply" ADD CONSTRAINT "AssistReply_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "AssistRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleLearningEvent" ADD CONSTRAINT "StyleLearningEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleLearningEvent" ADD CONSTRAINT "StyleLearningEvent_assistRequestId_fkey" FOREIGN KEY ("assistRequestId") REFERENCES "AssistRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleLearningEvent" ADD CONSTRAINT "StyleLearningEvent_assistReplyId_fkey" FOREIGN KEY ("assistReplyId") REFERENCES "AssistReply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
