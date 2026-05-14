import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  createIncident,
  CreateIncidentInput,
  IncidentStatus,
  listIncidents,
  updateIncident,
  UpdateIncidentInput
} from "../../shared/demo-store";
import { AuthService } from "../auth/auth.service";

const validIncidentStatuses = new Set<IncidentStatus>([
  "draft",
  "active",
  "closed",
  "archived"
]);

@Injectable()
export class IncidentsService {
  constructor(private readonly authService: AuthService) {}

  list() {
    return listIncidents();
  }

  create(input: CreateIncidentInput, authorizationHeader: string | undefined) {
    const session = this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (!session.permissions.includes("incidents.create")) {
      throw new ForbiddenException("Keine Berechtigung zum Anlegen von Lagen.");
    }

    return createIncident(
      {
        title: this.requireText(input.title, "Titel"),
        referenceNumber: this.requireText(input.referenceNumber, "Aktenzeichen")
      },
      session.user.id
    );
  }

  update(
    incidentId: string,
    input: UpdateIncidentInput,
    authorizationHeader: string | undefined
  ) {
    const session = this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (!session.permissions.includes("incidents.update")) {
      throw new ForbiddenException("Keine Berechtigung zum Bearbeiten von Lagen.");
    }

    const normalizedInput: UpdateIncidentInput = {};

    if (input.title !== undefined) {
      normalizedInput.title = this.requireText(input.title, "Titel");
    }

    if (input.referenceNumber !== undefined) {
      normalizedInput.referenceNumber = this.requireText(
        input.referenceNumber,
        "Aktenzeichen"
      );
    }

    if (input.status !== undefined) {
      if (!validIncidentStatuses.has(input.status)) {
        throw new BadRequestException("Ungueltiger Lagenstatus.");
      }

      normalizedInput.status = input.status;
    }

    if (Object.keys(normalizedInput).length === 0) {
      throw new BadRequestException("Keine gueltigen Aenderungen uebergeben.");
    }

    const updatedIncident = updateIncident(incidentId, normalizedInput);

    if (!updatedIncident) {
      throw new NotFoundException("Lage nicht gefunden.");
    }

    return updatedIncident;
  }

  private requireText(value: string, fieldLabel: string) {
    const normalized = value.trim();

    if (!normalized) {
      throw new BadRequestException(`${fieldLabel} darf nicht leer sein.`);
    }

    return normalized;
  }
}
