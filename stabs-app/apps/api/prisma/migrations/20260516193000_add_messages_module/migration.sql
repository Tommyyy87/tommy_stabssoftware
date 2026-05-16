-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('eingang', 'ausgang');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('funk', 'telefon', 'email', 'melder', 'lagekontakt');

-- CreateEnum
CREATE TYPE "MessagePriority" AS ENUM ('niedrig', 'normal', 'hoch', 'sofort');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('neu', 'gesichtet', 'in_bearbeitung', 'weitergeleitet', 'erledigt');

-- CreateEnum
CREATE TYPE "MessageAuditAction" AS ENUM ('created', 'updated');

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "priority" "MessagePriority" NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'neu',
    "messageTime" TIMESTAMP(3) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "senderLabel" TEXT NOT NULL,
    "recipientLabel" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "assignee" TEXT NOT NULL,
    "distribution" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedByUserId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageAuditEntry" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "action" "MessageAuditAction" NOT NULL,
    "summary" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageAuditEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Message_incidentId_trackingNumber_key" ON "Message"("incidentId", "trackingNumber");

-- CreateIndex
CREATE INDEX "Message_incidentId_messageTime_idx" ON "Message"("incidentId", "messageTime" DESC);

-- CreateIndex
CREATE INDEX "Message_updatedAt_idx" ON "Message"("updatedAt" DESC);

-- CreateIndex
CREATE INDEX "MessageAuditEntry_incidentId_messageId_createdAt_idx" ON "MessageAuditEntry"("incidentId", "messageId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_updatedByUserId_fkey" FOREIGN KEY ("updatedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAuditEntry" ADD CONSTRAINT "MessageAuditEntry_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAuditEntry" ADD CONSTRAINT "MessageAuditEntry_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageAuditEntry" ADD CONSTRAINT "MessageAuditEntry_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
