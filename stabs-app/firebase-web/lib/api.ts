export type HealthSnapshot = {
  service: string;
  status: string;
  stage: string;
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

async function readJson<T>(response: Response) {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function loadApiSnapshot(
  options: LoadApiSnapshotOptions = {}
): Promise<ApiSnapshot> {
  const baseUrl = (options.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();
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
