type AppRole =
  | "system_admin"
  | "lageleiter"
  | "stabsleitung"
  | "kgs"
  | "s1"
  | "s2"
  | "s3"
  | "s4"
  | "s5"
  | "s6"
  | "reader";

type AppUser = {
  id: string;
  username: string;
  displayName: string;
  roles: AppRole[];
};

type AuthSession = {
  token: string;
  user: AppUser;
};

type StoredIncident = {
  id: string;
  title: string;
  referenceNumber: string;
  status: "draft" | "active" | "closed" | "archived";
  createdAt: string;
  createdBy: string;
};

type CreateIncidentInput = {
  title: string;
  referenceNumber: string;
};

type UpdateIncidentInput = {
  title?: string;
  referenceNumber?: string;
  status?: "draft" | "active" | "closed" | "archived";
};

const now = new Date().toISOString();

const seededIncidents: StoredIncident[] = [
  {
    id: "incident-001",
    title: "Pilotlage Waldbrand",
    referenceNumber: "WB-2026-001",
    status: "active",
    createdAt: now,
    createdBy: "user-admin"
  }
];

const seededUsers: AppUser[] = [
  {
    id: "user-admin",
    username: "admin",
    displayName: "System Admin",
    roles: ["system_admin", "lageleiter"]
  },
  {
    id: "user-s2",
    username: "s2",
    displayName: "S2 Lage",
    roles: ["s2", "reader"]
  }
];

const rolePermissions = new Map<AppRole, string[]>([
  ["system_admin", ["incidents.read", "incidents.create", "incidents.update", "roles.read", "audit.read"]],
  ["lageleiter", ["incidents.read", "incidents.create", "incidents.update", "roles.read"]],
  ["stabsleitung", ["incidents.read"]],
  ["kgs", ["incidents.read"]],
  ["s1", ["incidents.read"]],
  ["s2", ["incidents.read"]],
  ["s3", ["incidents.read"]],
  ["s4", ["incidents.read"]],
  ["s5", ["incidents.read"]],
  ["s6", ["incidents.read"]],
  ["reader", ["incidents.read"]]
]);

const sessions = new Map<string, AuthSession>();

const incidents: StoredIncident[] = seededIncidents.map((incident) => ({ ...incident }));

export function getSeededUsers() {
  return seededUsers;
}

export function resolveUserDisplayName(userId: string) {
  return seededUsers.find((user) => user.id === userId)?.displayName ?? userId;
}

export function getSeededIncidents() {
  return seededIncidents.map((incident) => ({ ...incident }));
}

export function createSession(user: AppUser) {
  const token = `demo-${user.id}`;
  const session: AuthSession = { token, user };
  sessions.set(token, session);
  return session;
}

export function getSession(token: string | undefined) {
  if (!token) {
    return null;
  }

  return sessions.get(token) ?? null;
}

export function getPermissionsForRoles(roles: AppRole[]) {
  const permissions = new Set<string>();

  for (const role of roles) {
    const values = rolePermissions.get(role) ?? [];
    values.forEach((value) => permissions.add(value));
  }

  return Array.from(permissions).sort();
}

export function listIncidents() {
  return incidents;
}

export function createIncident(input: CreateIncidentInput, createdBy: string) {
  const incident: StoredIncident = {
    id: `incident-${String(incidents.length + 1).padStart(3, "0")}`,
    title: input.title.trim(),
    referenceNumber: input.referenceNumber.trim(),
    status: "draft",
    createdAt: new Date().toISOString(),
    createdBy
  };

  incidents.unshift(incident);
  return incident;
}

export function updateIncident(incidentId: string, input: UpdateIncidentInput) {
  const incident = incidents.find((entry) => entry.id === incidentId);

  if (!incident) {
    return null;
  }

  if (input.title !== undefined) {
    incident.title = input.title.trim();
  }

  if (input.referenceNumber !== undefined) {
    incident.referenceNumber = input.referenceNumber.trim();
  }

  if (input.status !== undefined) {
    incident.status = input.status;
  }

  return incident;
}
