import type { AuthSession } from "./api";

export type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

const sessionKey = "stabs-workspace-session";
const incidentKey = "stabs-selected-incident";

export function readWorkspaceSession(storage: StorageLike): AuthSession | null {
  const raw = storage.getItem(sessionKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    storage.removeItem(sessionKey);
    return null;
  }
}

export function saveWorkspaceSession(
  storage: StorageLike,
  session: AuthSession
) {
  storage.setItem(sessionKey, JSON.stringify(session));
}

export function clearWorkspaceSession(storage: StorageLike) {
  storage.removeItem(sessionKey);
}

export function readSelectedIncidentId(storage: StorageLike) {
  return storage.getItem(incidentKey) ?? "";
}

export function saveSelectedIncidentId(
  storage: StorageLike,
  incidentId: string
) {
  storage.setItem(incidentKey, incidentId);
}
