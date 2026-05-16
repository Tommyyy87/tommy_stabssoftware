import crypto from "node:crypto";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateJournalEntryInput,
  JournalEntrySummary,
  JournalStore
} from "./journal.store";

@Injectable()
export class PrismaJournalStore implements JournalStore {
  constructor(private readonly prisma: PrismaService) {}

  async listByIncident(incidentId: string): Promise<JournalEntrySummary[]> {
    const prisma = this.prisma as any;
    const entries = await prisma.journalEntry.findMany({
      where: {
        incidentId
      },
      include: {
        createdBy: {
          select: {
            displayName: true
          }
        }
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }]
    });

    return entries.map((entry: (typeof entries)[number]) => ({
      id: entry.id,
      incidentId: entry.incidentId,
      title: entry.title,
      body: entry.body,
      createdAt: entry.createdAt.toISOString(),
      createdBy: entry.createdBy.displayName,
      sourceMessageId: entry.sourceMessageId
    }));
  }

  async create(
    incidentId: string,
    input: CreateJournalEntryInput,
    createdByUserId: string,
    sourceMessageId?: string | null
  ): Promise<JournalEntrySummary> {
    const prisma = this.prisma as any;
    const entry = await prisma.journalEntry.create({
      data: {
        id: `journal-${crypto.randomUUID()}`,
        incidentId,
        title: input.title,
        body: input.body,
        createdByUserId,
        sourceMessageId: sourceMessageId ?? null
      },
      include: {
        createdBy: {
          select: {
            displayName: true
          }
        }
      }
    });

    return {
      id: entry.id,
      incidentId: entry.incidentId,
      title: entry.title,
      body: entry.body,
      createdAt: entry.createdAt.toISOString(),
      createdBy: entry.createdBy.displayName,
      sourceMessageId: entry.sourceMessageId
    };
  }
}
