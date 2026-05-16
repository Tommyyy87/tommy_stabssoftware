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
      "messages.dispatch",
      "messages.acknowledge",
      "journal.read",
      "journal.create",
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
      "messages.dispatch",
      "messages.acknowledge",
      "journal.read",
      "journal.create",
      "roles.read",
      "audit.read"
    ]
  },
  {
    key: "stabsleitung",
    displayName: "Stabsleitung",
    permissions: [
      "incidents.read",
      "messages.read",
      "messages.acknowledge",
      "journal.read",
      "audit.read"
    ]
  },
  {
    key: "kgs",
    displayName: "KGS",
    permissions: [
      "incidents.read",
      "messages.read",
      "messages.create",
      "messages.update",
      "messages.dispatch",
      "messages.acknowledge",
      "journal.read",
      "journal.create"
    ]
  },
  {
    key: "s1",
    displayName: "S1",
    permissions: ["incidents.read", "messages.read", "messages.acknowledge", "journal.read"]
  },
  {
    key: "s2",
    displayName: "S2",
    permissions: [
      "incidents.read",
      "messages.read",
      "messages.create",
      "messages.update",
      "messages.acknowledge",
      "journal.read",
      "journal.create"
    ]
  },
  {
    key: "s3",
    displayName: "S3",
    permissions: [
      "incidents.read",
      "messages.read",
      "messages.create",
      "messages.update",
      "messages.acknowledge",
      "journal.read",
      "journal.create"
    ]
  },
  {
    key: "s4",
    displayName: "S4",
    permissions: ["incidents.read", "messages.read", "messages.acknowledge", "journal.read"]
  },
  {
    key: "s5",
    displayName: "S5",
    permissions: ["incidents.read", "messages.read", "messages.acknowledge", "journal.read"]
  },
  {
    key: "s6",
    displayName: "S6",
    permissions: ["incidents.read", "messages.read", "messages.acknowledge", "journal.read"]
  },
  {
    key: "reader",
    displayName: "Leser",
    permissions: ["incidents.read", "messages.read", "journal.read"]
  }
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
  },
  {
    id: "user-kgs",
    username: "kgs",
    displayName: "KGS Nachrichtenzentrale",
    password: "demo",
    passwordSalt: "seed-kgs-demo",
    roles: ["kgs", "reader"]
  },
  {
    id: "user-s1",
    username: "s1",
    displayName: "S1 Personal",
    password: "demo",
    passwordSalt: "seed-s1-demo",
    roles: ["s1", "reader"]
  },
  {
    id: "user-s3",
    username: "s3",
    displayName: "S3 Einsatz",
    password: "demo",
    passwordSalt: "seed-s3-demo",
    roles: ["s3", "reader"]
  },
  {
    id: "user-s4",
    username: "s4",
    displayName: "S4 Versorgung",
    password: "demo",
    passwordSalt: "seed-s4-demo",
    roles: ["s4", "reader"]
  },
  {
    id: "user-s5",
    username: "s5",
    displayName: "S5 Oeffentlichkeitsarbeit",
    password: "demo",
    passwordSalt: "seed-s5-demo",
    roles: ["s5", "reader"]
  },
  {
    id: "user-s6",
    username: "s6",
    displayName: "S6 Kommunikation",
    password: "demo",
    passwordSalt: "seed-s6-demo",
    roles: ["s6", "reader"]
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
