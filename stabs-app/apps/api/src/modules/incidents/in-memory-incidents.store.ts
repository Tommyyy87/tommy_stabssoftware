import { Injectable } from "@nestjs/common";
import {
  createIncident,
  listIncidents,
  resolveUserDisplayName,
  updateIncident
} from "../../shared/demo-store";
import {
  CreateIncidentInput,
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
    input: UpdateIncidentInput
  ): Promise<IncidentSummary | null> {
    const incident = updateIncident(incidentId, input);

    if (!incident) {
      return null;
    }

    return {
      ...incident,
      createdBy: resolveUserDisplayName(incident.createdBy)
    };
  }
}
