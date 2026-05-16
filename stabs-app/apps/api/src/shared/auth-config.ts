export const appRoles = [
  "system_admin",
  "lageleiter",
  "stabsleitung",
  "kgs",
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "reader"
] as const;

export type AppRole = (typeof appRoles)[number];

export type AppUser = {
  id: string;
  username: string;
  displayName: string;
  roles: AppRole[];
};

export type AuthSession = {
  token: string;
  user: AppUser;
};

export type RoleDefinition = {
  key: AppRole;
  displayName: string;
  permissions: string[];
};

export type SeededAuthUser = {
  id: string;
  username: string;
  displayName: string;
  password: string;
  passwordSalt: string;
  roles: AppRole[];
};

const roleDefinitions: RoleDefinition[] = [
  {
    key: "system_admin",
    displayName: "Systemadministrator",
    permissions: [
      "incidents.read",
      "incidents.create",
      "incidents.update",
      "messages.read",
      "messages.create",
      "messages.update",
      "roles.read",
      "audit.read"
    ]
  },
  {
    key: "lageleiter",
    displayName: "Lageleiter",
    permissions: [
      "incidents.read",
      "incidents.create",
      "incidents.update",
      "messages.read",
      "messages.create",
      "messages.update",
      "roles.read",
      "audit.read"
    ]
  },
  {
    key: "stabsleitung",
    displayName: "Stabsleitung",
    permissions: ["incidents.read", "messages.read", "audit.read"]
  },
  {
    key: "kgs",
    displayName: "KGS",
    permissions: ["incidents.read", "messages.read", "messages.create", "messages.update"]
  },
  { key: "s1", displayName: "S1", permissions: ["incidents.read", "messages.read"] },
  {
    key: "s2",
    displayName: "S2",
    permissions: ["incidents.read", "messages.read", "messages.create", "messages.update"]
  },
  {
    key: "s3",
    displayName: "S3",
    permissions: ["incidents.read", "messages.read", "messages.create", "messages.update"]
  },
  { key: "s4", displayName: "S4", permissions: ["incidents.read", "messages.read"] },
  { key: "s5", displayName: "S5", permissions: ["incidents.read", "messages.read"] },
  { key: "s6", displayName: "S6", permissions: ["incidents.read", "messages.read"] },
  { key: "reader", displayName: "Leser", permissions: ["incidents.read", "messages.read"] }
];

const seededAuthUsers: SeededAuthUser[] = [
  {
    id: "user-admin",
    username: "admin",
    displayName: "System Admin",
    password: "demo",
    passwordSalt: "seed-admin-demo",
    roles: ["system_admin", "lageleiter"]
  },
  {
    id: "user-s2",
    username: "s2",
    displayName: "S2 Lage",
    password: "demo",
    passwordSalt: "seed-s2-demo",
    roles: ["s2", "reader"]
  }
];

export function getRoleDefinitions() {
  return roleDefinitions.map((entry) => ({
    ...entry,
    permissions: [...entry.permissions]
  }));
}

export function getSeededAuthUsers() {
  return seededAuthUsers.map((entry) => ({
    ...entry,
    roles: [...entry.roles]
  }));
}

export function getPermissionsForRoles(roles: AppRole[]) {
  const definitionsByKey = new Map(
    roleDefinitions.map((definition) => [definition.key, definition.permissions] as const)
  );
  const permissions = new Set<string>();

  for (const role of roles) {
    for (const permission of definitionsByKey.get(role) ?? []) {
      permissions.add(permission);
    }
  }

  return Array.from(permissions).sort();
}
