"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import type {
  ApiSnapshot,
  AuthSession,
  CurrentUserSnapshot,
  IncidentSnapshot
} from "../../lib/api";
import { readCurrentUser } from "../../lib/api";
import {
  clearWorkspaceSession,
  readSelectedIncidentId,
  readWorkspaceSession,
  saveSelectedIncidentId,
  saveWorkspaceSession
} from "../../lib/workspace-storage";

export type WorkspaceState = {
  baseUrl: string;
  backendReachable: boolean;
  session: AuthSession | null;
  currentUser: CurrentUserSnapshot | null;
  incidents: IncidentSnapshot[];
  selectedIncidentId: string;
};

export function createInitialWorkspaceState(input: {
  baseUrl: string;
  backendReachable: boolean;
  incidents: IncidentSnapshot[];
  selectedIncidentId: string;
  session?: AuthSession | null;
  currentUser?: CurrentUserSnapshot | null;
}): WorkspaceState {
  const selectedIncidentId =
    input.incidents.some((incident) => incident.id === input.selectedIncidentId)
      ? input.selectedIncidentId
      : input.incidents[0]?.id || "";

  return {
    baseUrl: input.baseUrl,
    backendReachable: input.backendReachable,
    session: input.session ?? null,
    currentUser: input.currentUser ?? null,
    incidents: input.incidents,
    selectedIncidentId
  };
}

type WorkspaceContextValue = {
  state: WorkspaceState;
  setSelectedIncidentId: (incidentId: string) => void;
  setSession: (
    session: AuthSession | null,
    currentUser: CurrentUserSnapshot | null
  ) => void;
  setIncidents: (incidents: IncidentSnapshot[]) => void;
  upsertIncident: (incident: IncidentSnapshot) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  children,
  initialSnapshot
}: {
  children: ReactNode;
  initialSnapshot: ApiSnapshot;
}) {
  const [state, setState] = useState(() =>
    createInitialWorkspaceState({
      baseUrl: initialSnapshot.baseUrl,
      backendReachable: initialSnapshot.backendReachable,
      incidents: initialSnapshot.incidents,
      selectedIncidentId: ""
    })
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storage = window.localStorage;
    const storedSelectedIncidentId = readSelectedIncidentId(storage);
    const storedSession = readWorkspaceSession(storage);
    let cancelled = false;

    setState((current) =>
      createInitialWorkspaceState({
        ...current,
        selectedIncidentId: storedSelectedIncidentId || current.selectedIncidentId,
        session: storedSession,
        currentUser: storedSession ? current.currentUser : null
      })
    );

    if (!storedSession || !initialSnapshot.baseUrl) {
      return;
    }

    void readCurrentUser({
      baseUrl: initialSnapshot.baseUrl,
      token: storedSession.token
    })
      .then((currentUser) => {
        if (cancelled) {
          return;
        }

        setState((current) => ({
          ...current,
          session: storedSession,
          currentUser
        }));
      })
      .catch(() => {
        clearWorkspaceSession(storage);

        if (cancelled) {
          return;
        }

        setState((current) => ({
          ...current,
          session: null,
          currentUser: null
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [initialSnapshot.baseUrl]);

  useEffect(() => {
    setState((current) =>
      createInitialWorkspaceState({
        ...current,
        baseUrl: initialSnapshot.baseUrl,
        backendReachable: initialSnapshot.backendReachable,
        incidents: initialSnapshot.incidents,
        selectedIncidentId: current.selectedIncidentId
      })
    );
  }, [
    initialSnapshot.backendReachable,
    initialSnapshot.baseUrl,
    initialSnapshot.incidents
  ]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    saveSelectedIncidentId(window.localStorage, state.selectedIncidentId);
  }, [state.selectedIncidentId]);

  const value = useMemo(
    () => ({
      state,
      setSelectedIncidentId: (incidentId: string) =>
        setState((current) => ({
          ...current,
          selectedIncidentId: createInitialWorkspaceState({
            ...current,
            selectedIncidentId: incidentId
          }).selectedIncidentId
        })),
      setSession: (
        session: AuthSession | null,
        currentUser: CurrentUserSnapshot | null
      ) => {
        if (typeof window !== "undefined") {
          if (session) {
            saveWorkspaceSession(window.localStorage, session);
          } else {
            clearWorkspaceSession(window.localStorage);
          }
        }

        setState((current) => ({
          ...current,
          session,
          currentUser
        }));
      },
      setIncidents: (incidents: IncidentSnapshot[]) =>
        setState((current) =>
          createInitialWorkspaceState({
            ...current,
            incidents,
            selectedIncidentId: current.selectedIncidentId
          })
        ),
      upsertIncident: (incident: IncidentSnapshot) =>
        setState((current) => {
          const existingIndex = current.incidents.findIndex(
            (entry) => entry.id === incident.id
          );
          const incidents =
            existingIndex >= 0
              ? current.incidents.map((entry) =>
                  entry.id === incident.id ? incident : entry
                )
              : [incident, ...current.incidents];

          return createInitialWorkspaceState({
            ...current,
            incidents,
            selectedIncidentId:
              current.selectedIncidentId || incident.id
          });
        })
    }),
    [state]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const value = useContext(WorkspaceContext);

  if (!value) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }

  return value;
}
