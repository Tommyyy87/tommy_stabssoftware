import { Injectable } from "@nestjs/common";
import {
  createJournalEntry,
  listJournalEntriesByIncident
} from "../../shared/demo-store";
import {
  CreateJournalEntryInput,
  JournalEntrySummary,
  JournalStore
} from "./journal.store";

@Injectable()
export class InMemoryJournalStore implements JournalStore {
  async listByIncident(incidentId: string): Promise<JournalEntrySummary[]> {
    return listJournalEntriesByIncident(incidentId);
  }

  async create(
    incidentId: string,
    input: CreateJournalEntryInput,
    createdByUserId: string,
    sourceMessageId?: string | null
  ): Promise<JournalEntrySummary> {
    return createJournalEntry(
      incidentId,
      input,
      createdByUserId,
      sourceMessageId ?? null
    );
  }
}
