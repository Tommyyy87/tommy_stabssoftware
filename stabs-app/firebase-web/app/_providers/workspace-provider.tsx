"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";

import type {
  AuthSession,
  CurrentUserSnapshot,
  IncidentSnapshot
} from "../../lib/api";

export type WorkspaceState = {
  session: AuthSession | null;
  currentUser: CurrentUserSnapshot | null;
  incidents: IncidentSnapshot[];
  selectedIncidentId: string;
};

export function createInitialWorkspaceState(input: {
  incidents: IncidentSnapshot[];
  selectedIncidentId: string;
}): WorkspaceState {
  const selectedIncidentId = input.selectedIncidentId || input.incidents[0]?.id || "";

  return {
    session: null,
    currentUser: null,
    incidents: input.incidents,
    selectedIncidentId
  };
}

type WorkspaceContextValue = {
  state: WorkspaceState;
  setSelectedIncidentId: (incidentId: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  children,
  initialState
}: {
  children: ReactNode;
  initialState: WorkspaceState;
}) {
  const [state, setState] = useState(initialState);

  const value = useMemo(
    () => ({
      state,
      setSelectedIncidentId: (incidentId: string) =>
        setState((current) => ({ ...current, selectedIncidentId: incidentId }))
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
