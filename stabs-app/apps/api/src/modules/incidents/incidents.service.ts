import {
  Inject,
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  CreateIncidentInput,
  INCIDENT_STORE,
  IncidentHistoryEntry,
  IncidentStatus,
  IncidentStore,
  UpdateIncidentInput
} from "./incidents.store";
import { AuthService } from "../auth/auth.service";

const validIncidentStatuses = new Set<IncidentStatus>([
  "draft",
  "active",
  "closed",
  "archived"
]);

@Injectable()
export class IncidentsService {
  constructor(
    private readonly authService: AuthService,
    @Inject(INCIDENT_STORE) private readonly incidentStore: IncidentStore
  ) {}

  async list() {
    return this.incidentStore.list();
  }

  async listHistory(incidentId: string, authorizationHeader: string | undefined) {
    const session = await this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (
      !session.permissions.includes("audit.read") &&
      !session.permissions.includes("incidents.read")
    ) {
      throw new ForbiddenException("Keine Berechtigung zum Lesen des Verlaufs.");
    }

    const history = await this.incidentStore.listHistory(incidentId);

    if (!history) {
      throw new NotFoundException("Lage nicht gefunden.");
    }

    return history;
  }

  async create(input: CreateIncidentInput, authorizationHeader: string | undefined) {
    const session = await this.authService.getPermissionsForCurrentUser(authorizationHeader);

    if (!session.permissions.includes("incidents.create")) {
      throw new ForbiddenException("Keine Berechtigung zum Anlegen von Lagen.");
    }

    return this.incidentStore.create(
      {
        title: this.requireText(input.title, "Titel"),
        referenceNumber: this.requireText(input.referenceNumber, "Aktenzeichen")
      },
      session.user.id
    );
  }

  async update(
    incidentId: string,
    input: UpdateIncidentInput,
    authorizationHeader: string | undefined
  ) {
    const session = await this.authService.getPermissionsForCurrentUser(authorizationHeader);

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

    const updatedIncident = await this.incidentStore.update(
      incidentId,
      normalizedInput,
      session.user.id
    );

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
