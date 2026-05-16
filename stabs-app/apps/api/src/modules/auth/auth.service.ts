import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AUTH_STORE, AuthStore } from "./auth.store";

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_STORE) private readonly authStore: AuthStore) {}

  async login(username: string, password: string) {
    const session = await this.authStore.login(username, password);

    if (!session) {
      throw new UnauthorizedException("Ungueltige Demo-Anmeldedaten.");
    }

    return {
      token: session.token,
      user: session.user
    };
  }

  async resolveSession(authorizationHeader: string | undefined) {
    const token = authorizationHeader?.replace("Bearer ", "").trim();
    return this.authStore.resolveSession(token);
  }

  async getPermissionsForCurrentUser(authorizationHeader: string | undefined) {
    const session = await this.resolveSession(authorizationHeader);

    if (!session) {
      throw new UnauthorizedException("Keine gueltige Sitzung vorhanden.");
    }

    return {
      user: session.user,
      permissions: session.permissions
    };
  }
}
