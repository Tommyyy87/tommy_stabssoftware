import { Injectable, UnauthorizedException } from "@nestjs/common";
import {
  createSession,
  getPermissionsForRoles,
  getSeededUsers,
  getSession
} from "../../shared/demo-store";

@Injectable()
export class AuthService {
  login(username: string, password: string) {
    const user = getSeededUsers().find((entry) => entry.username === username);

    if (!user || password !== "demo") {
      throw new UnauthorizedException("Ungueltige Demo-Anmeldedaten.");
    }

    return createSession(user);
  }

  resolveSession(authorizationHeader: string | undefined) {
    const token = authorizationHeader?.replace("Bearer ", "").trim();
    return getSession(token);
  }

  getPermissionsForCurrentUser(authorizationHeader: string | undefined) {
    const session = this.resolveSession(authorizationHeader);

    if (!session) {
      throw new UnauthorizedException("Keine gueltige Sitzung vorhanden.");
    }

    return {
      user: session.user,
      permissions: getPermissionsForRoles(session.user.roles)
    };
  }
}
