export type IncidentStatus = "draft" | "active" | "closed" | "archived";

export type AppRole =
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

export type Permission =
  | "incidents.read"
  | "incidents.create"
  | "incidents.update"
  | "roles.read"
  | "audit.read";

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

export type IncidentSummary = {
  id: string;
  title: string;
  referenceNumber: string;
  status: IncidentStatus;
  createdAt: string;
  createdBy: string;
};

export type CreateIncidentInput = {
  title: string;
  referenceNumber: string;
};
