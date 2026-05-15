export type IncidentStatus = "draft" | "active" | "closed" | "archived";

export type IncidentSummary = {
  id: string;
  title: string;
  referenceNumber: string;
  status: IncidentStatus;
  createdAt: string;
  createdBy: string;
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
  create(input: CreateIncidentInput, createdByUserId: string): Promise<IncidentSummary>;
  update(
    incidentId: string,
    input: UpdateIncidentInput
  ): Promise<IncidentSummary | null>;
}

export const INCIDENT_STORE = "INCIDENT_STORE";
