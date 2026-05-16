ALTER TYPE "MessagePriority" ADD VALUE IF NOT EXISTS 'blitz';
ALTER TYPE "MessagePriority" ADD VALUE IF NOT EXISTS 'staatsnot';

CREATE TABLE "MessageDispatch" (
  "id" TEXT NOT NULL,
  "incidentId" TEXT NOT NULL,
  "messageId" TEXT NOT NULL,
  "targetRole" TEXT NOT NULL,
  "dispatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dispatchedByUserId" TEXT NOT NULL,
  "dispatchNote" TEXT NOT NULL,
  "seenAt" TIMESTAMP(3),
  "acknowledgedAt" TIMESTAMP(3),
  "acknowledgedByUserId" TEXT,
  "processingStatus" TEXT NOT NULL,
  CONSTRAINT "MessageDispatch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "JournalEntry" (
  "id" TEXT NOT NULL,
  "incidentId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdByUserId" TEXT NOT NULL,
  "sourceMessageId" TEXT,
  CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MessageDispatch_incidentId_targetRole_processingStatus_idx"
  ON "MessageDispatch"("incidentId", "targetRole", "processingStatus");
CREATE INDEX "MessageDispatch_messageId_targetRole_idx"
  ON "MessageDispatch"("messageId", "targetRole");
CREATE INDEX "JournalEntry_incidentId_createdAt_idx"
  ON "JournalEntry"("incidentId", "createdAt" DESC);

ALTER TABLE "MessageDispatch"
  ADD CONSTRAINT "MessageDispatch_incidentId_fkey"
  FOREIGN KEY ("incidentId") REFERENCES "Incident"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MessageDispatch"
  ADD CONSTRAINT "MessageDispatch_messageId_fkey"
  FOREIGN KEY ("messageId") REFERENCES "Message"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MessageDispatch"
  ADD CONSTRAINT "MessageDispatch_dispatchedByUserId_fkey"
  FOREIGN KEY ("dispatchedByUserId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MessageDispatch"
  ADD CONSTRAINT "MessageDispatch_acknowledgedByUserId_fkey"
  FOREIGN KEY ("acknowledgedByUserId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "JournalEntry"
  ADD CONSTRAINT "JournalEntry_incidentId_fkey"
  FOREIGN KEY ("incidentId") REFERENCES "Incident"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "JournalEntry"
  ADD CONSTRAINT "JournalEntry_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
