export type JournalEntrySummary = {
  id: string;
  incidentId: string;
  title: string;
  body: string;
  createdAt: string;
  createdBy: string;
  sourceMessageId: string | null;
};

export type CreateJournalEntryInput = {
  title: string;
  body: string;
};

export interface JournalStore {
  listByIncident(incidentId: string): Promise<JournalEntrySummary[]>;
  create(
    incidentId: string,
    input: CreateJournalEntryInput,
    createdByUserId: string,
    sourceMessageId?: string | null
  ): Promise<JournalEntrySummary>;
}

export const JOURNAL_STORE = "JOURNAL_STORE";
