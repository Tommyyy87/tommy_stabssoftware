import { ForbiddenException, Injectable } from "@nestjs/common";
import { createIncident, listIncidents } from "../../shared/demo-store";
import { AuthService } from "../auth/auth.service";

type CreateIncidentInput = {
  title: string;
  referenceNumber: string;
};

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

    return createIncident(input, session.user.id);
  }
}
