import { AppUser, AuthSession } from "../../shared/auth-config";

export type AuthenticatedSession = AuthSession & {
  permissions: string[];
};

export type StoredAuthUser = AppUser & {
  passwordHash: string;
  passwordSalt: string;
  permissions: string[];
};

export interface AuthStore {
  login(username: string, password: string): Promise<AuthenticatedSession | null>;
  resolveSession(token: string | undefined): Promise<AuthenticatedSession | null>;
  resolveUserDisplayName(userId: string): Promise<string>;
}

export const AUTH_STORE = "AUTH_STORE";
