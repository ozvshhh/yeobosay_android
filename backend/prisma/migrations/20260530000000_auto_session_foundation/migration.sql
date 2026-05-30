-- AlterEnum
ALTER TYPE "CallSessionStatus" ADD VALUE 'PROCESSING_TURN';
ALTER TYPE "CallSessionStatus" ADD VALUE 'WAITING_FOR_USER';
ALTER TYPE "CallSessionStatus" ADD VALUE 'AI_SPEAKING';
ALTER TYPE "CallSessionStatus" ADD VALUE 'ENDING';
ALTER TYPE "CallSessionStatus" ADD VALUE 'EXPIRED';

-- CreateEnum
CREATE TYPE "CallSessionMode" AS ENUM ('MANUAL_RECORDING', 'AUTO_CONVERSATION');

-- CreateEnum
CREATE TYPE "ConversationStep" AS ENUM ('GREETING', 'WELLBEING', 'MEAL', 'HEALTH', 'MEDICATION', 'SLEEP', 'SCHEDULE', 'MOOD', 'FREE_TALK', 'CLOSING');

-- CreateEnum
CREATE TYPE "ConversationTurnStatus" AS ENUM ('UPLOADED', 'TRANSCRIBING', 'TRANSCRIBED', 'RESPONDING', 'RESPONDED', 'SYNTHESIZING', 'COMPLETED', 'FAILED_STT', 'FAILED_LLM', 'FAILED_TTS', 'FAILED_UNKNOWN');

-- AlterTable
ALTER TABLE "CallSession" ADD COLUMN "mode" "CallSessionMode" NOT NULL DEFAULT 'MANUAL_RECORDING',
ADD COLUMN "currentStep" "ConversationStep",
ADD COLUMN "targetTurnCount" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "turnCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "riskFlag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "riskType" TEXT,
ADD COLUMN "endReason" TEXT;

-- AlterTable
ALTER TABLE "ConversationTurn" ADD COLUMN "clientTurnId" TEXT,
ADD COLUMN "status" "ConversationTurnStatus" NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN "conversationStep" "ConversationStep",
ADD COLUMN "bargeIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "errorCode" TEXT,
ADD COLUMN "completedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationTurn_callSessionId_clientTurnId_key" ON "ConversationTurn"("callSessionId", "clientTurnId");
