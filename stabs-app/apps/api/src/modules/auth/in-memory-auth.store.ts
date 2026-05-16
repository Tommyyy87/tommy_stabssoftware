import { Injectable } from "@nestjs/common";
import { AuthStore, AuthenticatedSession } from "./auth.store";
import {
  AppRole,
  getPermissionsForRoles,
  getSeededAuthUsers
} from "../../shared/auth-config";
import { hashPassword, verifyPassword } from "../../shared/passwords";

type InMemoryUserRecord = {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  passwordSalt: string;
  roles: AppRole[];
};

@Injectable()
export class InMemoryAuthStore implements AuthStore {
  private readonly users = getSeededAuthUsers().map<InMemoryUserRecord>((entry) => ({
    id: entry.id,
    username: entry.username,
    displayName: entry.displayName,
    passwordSalt: entry.passwordSalt,
    passwordHash: hashPassword(entry.password, entry.passwordSalt),
    roles: [...entry.roles]
  }));

  private readonly sessions = new Map<string, AuthenticatedSession>();

  async login(username: string, password: string): Promise<AuthenticatedSession | null> {
    const user = this.users.find((entry) => entry.username === username);

    if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
      return null;
    }

    const session = this.createSession(user);
    this.sessions.set(session.token, session);
    return session;
  }

  async resolveSession(token: string | undefined): Promise<AuthenticatedSession | null> {
    if (!token) {
      return null;
    }

    return this.sessions.get(token) ?? null;
  }

  async resolveUserDisplayName(userId: string) {
    return this.users.find((entry) => entry.id === userId)?.displayName ?? userId;
  }

  private createSession(user: InMemoryUserRecord): AuthenticatedSession {
    const roles = [...user.roles].sort();

    return {
      token: `demo-${user.id}`,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        roles
      },
      permissions: getPermissionsForRoles(roles)
    };
  }
}
