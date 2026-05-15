CREATE TYPE "IncidentStatus" AS ENUM ('draft', 'active', 'closed', 'archived');

CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Incident_referenceNumber_key" ON "Incident"("referenceNumber");

CREATE INDEX "Incident_createdAt_idx" ON "Incident"("createdAt" DESC);
