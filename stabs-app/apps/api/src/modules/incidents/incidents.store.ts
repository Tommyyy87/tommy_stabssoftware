export type IncidentStatus = "draft" | "active" | "closed" | "archived";

export type IncidentSummary = {
  id: string;
  title: string;
  referenceNumber: string;
  status: IncidentStatus;
  createdAt: string;
  createdBy: string;
};

export type IncidentHistoryChange = {
  field: "title" | "referenceNumber" | "status";
  from: string | null;
  to: string | null;
};

export type IncidentHistoryEntry = {
  id: string;
  incidentId: string;
  action: "created" | "updated";
  summary: string;
  createdAt: string;
  actor: string;
  changes: IncidentHistoryChange[];
};

export type CreateIncidentInput = {
  title: string;
  referenceNumber: string;
};

export type UpdateIncidentInput = {
  title?: string;
  referenceNumber?: string;
  status?: IncidentStatus;
};

export interface IncidentStore {
  list(): Promise<IncidentSummary[]>;
  listHistory(incidentId: string): Promise<IncidentHistoryEntry[] | null>;
  create(input: CreateIncidentInput, createdByUserId: string): Promise<IncidentSummary>;
  update(
    incidentId: string,
    input: UpdateIncidentInput,
    updatedByUserId: string
  ): Promise<IncidentSummary | null>;
}

export const INCIDENT_STORE = "INCIDENT_STORE";
