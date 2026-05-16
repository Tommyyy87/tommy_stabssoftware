import { Injectable } from "@nestjs/common";
import {
  createIncident,
  getIncidentHistory,
  listIncidents,
  resolveUserDisplayName,
  updateIncident
} from "../../shared/demo-store";
import {
  CreateIncidentInput,
  IncidentHistoryEntry,
  IncidentStore,
  IncidentSummary,
  UpdateIncidentInput
} from "./incidents.store";

@Injectable()
export class InMemoryIncidentsStore implements IncidentStore {
  async list(): Promise<IncidentSummary[]> {
    return listIncidents().map((incident) => ({
      ...incident,
      createdBy: resolveUserDisplayName(incident.createdBy)
    }));
  }

  async listHistory(incidentId: string): Promise<IncidentHistoryEntry[] | null> {
    const history = getIncidentHistory(incidentId);
    return history ? history.map((entry) => ({ ...entry, changes: [...entry.changes] })) : null;
  }

  async create(
    input: CreateIncidentInput,
    createdByUserId: string
  ): Promise<IncidentSummary> {
    const incident = createIncident(input, createdByUserId);

    return {
      ...incident,
      createdBy: resolveUserDisplayName(incident.createdBy)
    };
  }

  async update(
    incidentId: string,
    input: UpdateIncidentInput,
    updatedByUserId: string
  ): Promise<IncidentSummary | null> {
    const incident = updateIncident(incidentId, input, updatedByUserId);

    if (!incident) {
      return null;
    }

    return {
      ...incident,
      createdBy: resolveUserDisplayName(incident.createdBy)
    };
  }
}
