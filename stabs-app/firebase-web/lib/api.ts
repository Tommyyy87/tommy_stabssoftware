export type HealthSnapshot = {
  service: string;
  status: string;
  stage: string;
};

export type AppUser = {
  id: string;
  username: string;
  displayName: string;
  roles: string[];
};

export type AuthSession = {
  token: string;
  user: AppUser;
};

export type CurrentUserSnapshot = {
  user: AppUser;
  permissions: string[];
};

export type IncidentSnapshot = {
  id: string;
  title: string;
  referenceNumber: string;
  status: string;
  createdAt: string;
  createdBy: string;
};

export type IncidentHistoryChange = {
  field: string;
  from: string | null;
  to: string | null;
};

export type IncidentHistoryEntry = {
  id: string;
  incidentId: string;
  action: "created" | "updated";
  summary: string;
  createdAt: string;
  actor: string;
  changes: IncidentHistoryChange[];
};

export type MessageDirection = "eingang" | "ausgang";

export type MessageChannel =
  | "funk"
  | "telefon"
  | "email"
  | "melder"
  | "lagekontakt";

export type MessagePriority =
  | "niedrig"
  | "normal"
  | "hoch"
  | "sofort"
  | "blitz"
  | "staatsnot";

export type MessageStatus =
  | "neu"
  | "gesichtet"
  | "in_bearbeitung"
  | "weitergeleitet"
  | "erledigt";

export type MessageDispatchStatus =
  | "neu"
  | "gesehen"
  | "quittiert"
  | "in_bearbeitung";

export type MessageDispatchSnapshot = {
  id: string;
  messageId: string;
  incidentId: string;
  targetRole: string;
  dispatchedAt: string;
  dispatchedBy: string;
  dispatchNote: string;
  seenAt: string | null;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  processingStatus: MessageDispatchStatus;
};

export type MessageSnapshot = {
  id: string;
  incidentId: string;
  trackingNumber: string;
  direction: MessageDirection;
  channel: MessageChannel;
  priority: MessagePriority;
  status: MessageStatus;
  messageTime: string;
  recordedAt: string;
  senderLabel: string;
  recipientLabel: string;
  subject: string;
  body: string;
  assignee: string;
  distribution: string;
  notes: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  dispatches: MessageDispatchSnapshot[];
};

export type JournalEntrySnapshot = {
  id: string;
  incidentId: string;
  title: string;
  body: string;
  createdAt: string;
  createdBy: string;
  sourceMessageId: string | null;
};

export type MessageHistoryChange = {
  field: string;
  from: string | null;
  to: string | null;
};

export type MessageHistoryEntry = {
  id: string;
  messageId: string;
  incidentId: string;
  action: "created" | "updated";
  summary: string;
  createdAt: string;
  actor: string;
  changes: MessageHistoryChange[];
};

export type ApiSnapshot = {
  baseUrl: string;
  backendReachable: boolean;
  health: HealthSnapshot | null;
  incidents: IncidentSnapshot[];
  error: string | null;
};

type FetchLike = typeof fetch;

type LoadApiSnapshotOptions = {
  baseUrl?: string;
  fetchImpl?: FetchLike;
};

type RequestOptions = {
  baseUrl?: string;
  fetchImpl?: FetchLike;
};

type AuthenticatedRequestOptions = RequestOptions & {
  token: string;
};

type CreateIncidentOptions = AuthenticatedRequestOptions & {
  input: {
    title: string;
    referenceNumber: string;
  };
};

type UpdateIncidentOptions = AuthenticatedRequestOptions & {
  incidentId: string;
  input: {
    title?: string;
    referenceNumber?: string;
    status?: string;
  };
};

type IncidentHistoryOptions = AuthenticatedRequestOptions & {
  incidentId: string;
};

type MessageListOptions = AuthenticatedRequestOptions & {
  incidentId: string;
};

type CreateMessageOptions = AuthenticatedRequestOptions & {
  incidentId: string;
  input: {
    direction: MessageDirection;
    channel: MessageChannel;
    priority: MessagePriority;
    messageTime: string;
    senderLabel: string;
    recipientLabel: string;
    subject: string;
    body: string;
  };
};

type UpdateMessageOptions = AuthenticatedRequestOptions & {
  incidentId: string;
  messageId: string;
  input: {
    status?: MessageStatus;
    assignee?: string;
    notes?: string;
  };
};

type MessageHistoryOptions = AuthenticatedRequestOptions & {
  incidentId: string;
  messageId: string;
};

type DispatchMessageOptions = AuthenticatedRequestOptions & {
  incidentId: string;
  messageId: string;
  input: {
    targetRoles: string[];
    note?: string;
  };
};

type AcknowledgeDispatchOptions = AuthenticatedRequestOptions & {
  incidentId: string;
  messageId: string;
  dispatchId: string;
};

type JournalOptions = AuthenticatedRequestOptions & {
  incidentId: string;
};

type CreateJournalEntryOptions = AuthenticatedRequestOptions & {
  incidentId: string;
  input: {
    title: string;
    body: string;
  };
  sourceMessageId?: string;
};

type LoginOptions = RequestOptions & {
  username: string;
  password: string;
};

function resolveBaseUrl(baseUrl?: string) {
  return (baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();
}

async function readJson<T>(response: Response) {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

async function requestJson<T>(
  url: string,
  init: RequestInit,
  fetchImpl: FetchLike
) {
  return readJson<T>(await fetchImpl(url, init));
}

function createJsonHeaders(token?: string) {
  const headers: Record<string, string> = {
    "content-type": "application/json"
  };

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function loadApiSnapshot(
  options: LoadApiSnapshotOptions = {}
): Promise<ApiSnapshot> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  if (!baseUrl) {
    return {
      baseUrl: "",
      backendReachable: false,
      health: null,
      incidents: [],
      error: "Keine API-Basis-URL konfiguriert."
    };
  }

  try {
    const [health, incidents] = await Promise.all([
      readJson<HealthSnapshot>(
        await fetchImpl(`${baseUrl}/api/health`, { cache: "no-store" })
      ),
      readJson<IncidentSnapshot[]>(
        await fetchImpl(`${baseUrl}/api/incidents`, { cache: "no-store" })
      )
    ]);

    return {
      baseUrl,
      backendReachable: true,
      health,
      incidents,
      error: null
    };
  } catch (error) {
    return {
      baseUrl,
      backendReachable: false,
      health: null,
      incidents: [],
      error: error instanceof Error ? error.message : "Unbekannter API-Fehler."
    };
  }
}

export async function loginWithDemoCredentials(
  options: LoginOptions
): Promise<AuthSession> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<AuthSession>(
    `${baseUrl}/api/auth/login`,
    {
      method: "POST",
      headers: createJsonHeaders(),
      body: JSON.stringify({
        username: options.username,
        password: options.password
      })
    },
    fetchImpl
  );
}

export async function readCurrentUser(
  options: AuthenticatedRequestOptions
): Promise<CurrentUserSnapshot> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<CurrentUserSnapshot>(
    `${baseUrl}/api/auth/me`,
    {
      method: "GET",
      headers: createJsonHeaders(options.token)
    },
    fetchImpl
  );
}

export async function listIncidents(
  options: RequestOptions = {}
): Promise<IncidentSnapshot[]> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<IncidentSnapshot[]>(
    `${baseUrl}/api/incidents`,
    {
      method: "GET",
      cache: "no-store"
    },
    fetchImpl
  );
}

export async function createIncident(
  options: CreateIncidentOptions
): Promise<IncidentSnapshot> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<IncidentSnapshot>(
    `${baseUrl}/api/incidents`,
    {
      method: "POST",
      headers: createJsonHeaders(options.token),
      body: JSON.stringify(options.input)
    },
    fetchImpl
  );
}

export async function updateIncident(
  options: UpdateIncidentOptions
): Promise<IncidentSnapshot> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<IncidentSnapshot>(
    `${baseUrl}/api/incidents/${options.incidentId}`,
    {
      method: "PATCH",
      headers: createJsonHeaders(options.token),
      body: JSON.stringify(options.input)
    },
    fetchImpl
  );
}

export async function getIncidentHistory(
  options: IncidentHistoryOptions
): Promise<IncidentHistoryEntry[]> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<IncidentHistoryEntry[]>(
    `${baseUrl}/api/incidents/${options.incidentId}/history`,
    {
      method: "GET",
      headers: createJsonHeaders(options.token),
      cache: "no-store"
    },
    fetchImpl
  );
}

export async function listMessages(
  options: MessageListOptions
): Promise<MessageSnapshot[]> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<MessageSnapshot[]>(
    `${baseUrl}/api/incidents/${options.incidentId}/messages`,
    {
      method: "GET",
      headers: createJsonHeaders(options.token),
      cache: "no-store"
    },
    fetchImpl
  );
}

export async function createMessage(
  options: CreateMessageOptions
): Promise<MessageSnapshot> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<MessageSnapshot>(
    `${baseUrl}/api/incidents/${options.incidentId}/messages`,
    {
      method: "POST",
      headers: createJsonHeaders(options.token),
      body: JSON.stringify(options.input)
    },
    fetchImpl
  );
}

export async function updateMessage(
  options: UpdateMessageOptions
): Promise<MessageSnapshot> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<MessageSnapshot>(
    `${baseUrl}/api/incidents/${options.incidentId}/messages/${options.messageId}`,
    {
      method: "PATCH",
      headers: createJsonHeaders(options.token),
      body: JSON.stringify(options.input)
    },
    fetchImpl
  );
}

export async function getMessageHistory(
  options: MessageHistoryOptions
): Promise<MessageHistoryEntry[]> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<MessageHistoryEntry[]>(
    `${baseUrl}/api/incidents/${options.incidentId}/messages/${options.messageId}/history`,
    {
      method: "GET",
      headers: createJsonHeaders(options.token),
      cache: "no-store"
    },
    fetchImpl
  );
}

export async function dispatchMessage(
  options: DispatchMessageOptions
): Promise<MessageSnapshot> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<MessageSnapshot>(
    `${baseUrl}/api/incidents/${options.incidentId}/messages/${options.messageId}/dispatches`,
    {
      method: "POST",
      headers: createJsonHeaders(options.token),
      body: JSON.stringify(options.input)
    },
    fetchImpl
  );
}

export async function acknowledgeMessageDispatch(
  options: AcknowledgeDispatchOptions
): Promise<MessageSnapshot> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<MessageSnapshot>(
    `${baseUrl}/api/incidents/${options.incidentId}/messages/${options.messageId}/dispatches/${options.dispatchId}/acknowledge`,
    {
      method: "PATCH",
      headers: createJsonHeaders(options.token)
    },
    fetchImpl
  );
}

export async function listJournalEntries(
  options: JournalOptions
): Promise<JournalEntrySnapshot[]> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  return requestJson<JournalEntrySnapshot[]>(
    `${baseUrl}/api/incidents/${options.incidentId}/journal`,
    {
      method: "GET",
      headers: createJsonHeaders(options.token),
      cache: "no-store"
    },
    fetchImpl
  );
}

export async function createJournalEntry(
  options: CreateJournalEntryOptions
): Promise<JournalEntrySnapshot> {
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;
  const path = options.sourceMessageId
    ? `${baseUrl}/api/incidents/${options.incidentId}/messages/${options.sourceMessageId}/journal-entries`
    : `${baseUrl}/api/incidents/${options.incidentId}/journal`;

  return requestJson<JournalEntrySnapshot>(
    path,
    {
      method: "POST",
      headers: createJsonHeaders(options.token),
      body: JSON.stringify(options.input)
    },
    fetchImpl
  );
}
