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
