"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import {
  ApiSnapshot,
  AuthSession,
  CurrentUserSnapshot,
  IncidentHistoryEntry,
  IncidentSnapshot,
  createIncident,
  getIncidentHistory,
  listIncidents,
  loginWithDemoCredentials,
  readCurrentUser,
  updateIncident
} from "../lib/api";

const sessionStorageKey = "stabs-demo-session";

type OperationsConsoleProps = {
  initialSnapshot: ApiSnapshot;
};

type AuthState = {
  session: AuthSession | null;
  currentUser: CurrentUserSnapshot | null;
  error: string | null;
};

type IncidentFormState = {
  title: string;
  referenceNumber: string;
};

type EditFormState = {
  incidentId: string;
  title: string;
  referenceNumber: string;
  status: string;
} | null;

type IncidentHistoryState = {
  visible: boolean;
  loading: boolean;
  error: string | null;
  entries: IncidentHistoryEntry[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Berlin"
  }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unbekannter Fehler.";
}

export function OperationsConsole({ initialSnapshot }: OperationsConsoleProps) {
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "demo" });
  const [incidentForm, setIncidentForm] = useState<IncidentFormState>({
    title: "",
    referenceNumber: ""
  });
  const [editForm, setEditForm] = useState<EditFormState>(null);
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    currentUser: null,
    error: null
  });
  const [incidents, setIncidents] = useState(initialSnapshot.incidents);
  const [incidentHistory, setIncidentHistory] = useState<
    Record<string, IncidentHistoryState>
  >({});
  const [incidentFeedback, setIncidentFeedback] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(initialSnapshot.error);
  const [isPending, startTransition] = useTransition();

  const canAuthenticate = initialSnapshot.baseUrl.length > 0;
  const permissions = authState.currentUser?.permissions ?? [];
  const canCreate = permissions.includes("incidents.create");
  const canUpdate = permissions.includes("incidents.update");
  const canReadHistory =
    permissions.includes("audit.read") || permissions.includes("incidents.read");

  const sortedIncidents = useMemo(
    () =>
      [...incidents].sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt)
      ),
    [incidents]
  );

  useEffect(() => {
    if (!canAuthenticate) {
      return;
    }

    const storedSessionValue = window.localStorage.getItem(sessionStorageKey);

    if (!storedSessionValue) {
      return;
    }

    try {
      const storedSession = JSON.parse(storedSessionValue) as AuthSession;

      void hydrateCurrentUser(storedSession);
    } catch {
      window.localStorage.removeItem(sessionStorageKey);
    }
  }, [canAuthenticate]);

  async function hydrateCurrentUser(session: AuthSession) {
    try {
      const currentUser = await readCurrentUser({
        baseUrl: initialSnapshot.baseUrl,
        token: session.token
      });

      startTransition(() => {
        setAuthState({
          session,
          currentUser,
          error: null
        });
      });
    } catch (error) {
      window.localStorage.removeItem(sessionStorageKey);
      startTransition(() => {
        setAuthState({
          session: null,
          currentUser: null,
          error: getErrorMessage(error)
        });
      });
    }
  }

  async function refreshIncidents() {
    if (!canAuthenticate) {
      return;
    }

    try {
      const nextIncidents = await listIncidents({ baseUrl: initialSnapshot.baseUrl });

      startTransition(() => {
        setIncidents(nextIncidents);
        setRefreshError(null);
      });
    } catch (error) {
      startTransition(() => {
        setRefreshError(getErrorMessage(error));
      });
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIncidentFeedback(null);

    try {
      const session = await loginWithDemoCredentials({
        baseUrl: initialSnapshot.baseUrl,
        username: loginForm.username,
        password: loginForm.password
      });

      window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
      await hydrateCurrentUser(session);
    } catch (error) {
      startTransition(() => {
        setAuthState({
          session: null,
          currentUser: null,
          error: getErrorMessage(error)
        });
      });
    }
  }

  function handleLogout() {
    window.localStorage.removeItem(sessionStorageKey);
    setAuthState({
      session: null,
      currentUser: null,
      error: null
    });
    setEditForm(null);
    setIncidentHistory({});
    setIncidentFeedback(null);
  }

  async function handleCreateIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authState.session) {
      return;
    }

    try {
      const createdIncident = await createIncident({
        baseUrl: initialSnapshot.baseUrl,
        token: authState.session.token,
        input: incidentForm
      });

      startTransition(() => {
        setIncidents((current) => [createdIncident, ...current]);
        setIncidentForm({ title: "", referenceNumber: "" });
        setIncidentFeedback(`Lage ${createdIncident.referenceNumber} wurde angelegt.`);
      });
    } catch (error) {
      startTransition(() => {
        setIncidentFeedback(getErrorMessage(error));
      });
    }
  }

  async function handleUpdateIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authState.session || !editForm) {
      return;
    }

    try {
      const updatedIncident = await updateIncident({
        baseUrl: initialSnapshot.baseUrl,
        token: authState.session.token,
        incidentId: editForm.incidentId,
        input: {
          title: editForm.title,
          referenceNumber: editForm.referenceNumber,
          status: editForm.status
        }
      });

      startTransition(() => {
        setIncidents((current) =>
          current.map((incident) =>
            incident.id === updatedIncident.id ? updatedIncident : incident
          )
        );
        setIncidentHistory((current) => {
          const next = { ...current };
          delete next[updatedIncident.id];
          return next;
        });
        setEditForm(null);
        setIncidentFeedback(`Lage ${updatedIncident.referenceNumber} wurde aktualisiert.`);
      });
    } catch (error) {
      startTransition(() => {
        setIncidentFeedback(getErrorMessage(error));
      });
    }
  }

  async function handleToggleHistory(incidentId: string) {
    const currentHistory = incidentHistory[incidentId];

    if (currentHistory?.visible) {
      setIncidentHistory((current) => ({
        ...current,
        [incidentId]: {
          ...currentHistory,
          visible: false
        }
      }));
      return;
    }

    if (currentHistory && currentHistory.entries.length > 0) {
      setIncidentHistory((current) => ({
        ...current,
        [incidentId]: {
          ...currentHistory,
          visible: true,
          error: null
        }
      }));
      return;
    }

    if (!authState.session) {
      return;
    }

    setIncidentHistory((current) => ({
      ...current,
      [incidentId]: {
        visible: true,
        loading: true,
        error: null,
        entries: current[incidentId]?.entries ?? []
      }
    }));

    try {
      const entries = await getIncidentHistory({
        baseUrl: initialSnapshot.baseUrl,
        token: authState.session.token,
        incidentId
      });

      startTransition(() => {
        setIncidentHistory((current) => ({
          ...current,
          [incidentId]: {
            visible: true,
            loading: false,
            error: null,
            entries
          }
        }));
      });
    } catch (error) {
      startTransition(() => {
        setIncidentHistory((current) => ({
          ...current,
          [incidentId]: {
            visible: true,
            loading: false,
            error: getErrorMessage(error),
            entries: current[incidentId]?.entries ?? []
          }
        }));
      });
    }
  }

  return (
    <section className="panel workspace-panel">
      <div className="workspace-header">
        <div>
          <p className="eyebrow">Lagekontext</p>
          <h2>Login, Lagepflege und Verlauf</h2>
          <p className="muted-text">
            Diese Teilflaeche kuemmert sich nur um Sitzung, Lageanlage,
            Lagepflege und den Verlauf. Die fachliche Nachrichtenarbeit liegt
            auf `/messages`.
          </p>
        </div>

        <button className="ghost-button" onClick={() => void refreshIncidents()} type="button">
          {isPending ? "Aktualisiere..." : "Lagen neu laden"}
        </button>
      </div>

      <div className="workspace-grid">
        <div className="stack">
          <div className="status-card">
            <h3>Benutzerstatus</h3>

            {authState.currentUser ? (
              <div className="stack compact-stack">
                <p>
                  <strong>{authState.currentUser.user.displayName}</strong> ({authState.currentUser.user.username})
                </p>
                <p>Rollen: {authState.currentUser.user.roles.join(", ")}</p>
                <p>Berechtigungen: {authState.currentUser.permissions.join(", ")}</p>
                <button className="ghost-button" onClick={handleLogout} type="button">
                  Abmelden
                </button>
              </div>
            ) : (
              <form className="stack compact-stack" onSubmit={handleLogin}>
                <label className="field">
                  <span>Benutzername</span>
                  <input
                    name="username"
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        username: event.target.value
                      }))
                    }
                    value={loginForm.username}
                  />
                </label>
                <label className="field">
                  <span>Passwort</span>
                  <input
                    name="password"
                    onChange={(event) =>
                      setLoginForm((current) => ({
                        ...current,
                        password: event.target.value
                      }))
                    }
                    type="password"
                    value={loginForm.password}
                  />
                </label>
                <button className="primary-button" disabled={!canAuthenticate} type="submit">
                  Demo-Login
                </button>
                <p className="muted-text">Bekannter Demo-Zugang: admin / demo</p>
              </form>
            )}

            {authState.error ? <p className="error-text">{authState.error}</p> : null}
          </div>

          <div className="status-card">
            <h3>Neue Lage anlegen</h3>

            {canCreate ? (
              <form className="stack compact-stack" onSubmit={handleCreateIncident}>
                <label className="field">
                  <span>Titel</span>
                  <input
                    name="title"
                    onChange={(event) =>
                      setIncidentForm((current) => ({
                        ...current,
                        title: event.target.value
                      }))
                    }
                    placeholder="z. B. Starkregen Innenstadt"
                    value={incidentForm.title}
                  />
                </label>
                <label className="field">
                  <span>Aktenzeichen</span>
                  <input
                    name="referenceNumber"
                    onChange={(event) =>
                      setIncidentForm((current) => ({
                        ...current,
                        referenceNumber: event.target.value
                      }))
                    }
                    placeholder="z. B. SR-2026-003"
                    value={incidentForm.referenceNumber}
                  />
                </label>
                <button className="primary-button" type="submit">
                  Lage anlegen
                </button>
              </form>
            ) : (
              <p className="muted-text">
                Anmeldung mit einer Rolle mit `incidents.create` erforderlich.
              </p>
            )}

            {incidentFeedback ? <p className="success-text">{incidentFeedback}</p> : null}
          </div>
        </div>

        <div className="status-card">
          <div className="list-header">
            <div>
              <h3>Lageuebersicht</h3>
              <p className="muted-text">
                {sortedIncidents.length} Lage(n) aus dem Live-Backend
              </p>
            </div>
          </div>

          {refreshError ? <p className="error-text">{refreshError}</p> : null}

          <div className="incident-list">
            {sortedIncidents.map((incident) => {
              const isEditing = editForm?.incidentId === incident.id;

              return (
                <article className="incident-card" key={incident.id}>
                  <div className="incident-card-header">
                    <div>
                      <p className="incident-reference">{incident.referenceNumber}</p>
                      <h4>{incident.title}</h4>
                    </div>
                    <span className={`incident-status status-${incident.status}`}>
                      {incident.status}
                    </span>
                  </div>

                  <p className="muted-text">
                    Angelegt: {formatDate(incident.createdAt)} von {incident.createdBy}
                  </p>

                  {canReadHistory ? (
                    <button
                      className="ghost-button"
                      onClick={() => void handleToggleHistory(incident.id)}
                      type="button"
                    >
                      {incidentHistory[incident.id]?.visible
                        ? "Verlauf ausblenden"
                        : "Verlauf anzeigen"}
                    </button>
                  ) : null}

                  {canUpdate ? (
                    isEditing ? (
                      <form className="stack compact-stack" onSubmit={handleUpdateIncident}>
                        <label className="field">
                          <span>Titel</span>
                          <input
                            onChange={(event) =>
                              setEditForm((current) =>
                                current
                                  ? { ...current, title: event.target.value }
                                  : current
                              )
                            }
                            value={editForm.title}
                          />
                        </label>
                        <label className="field">
                          <span>Aktenzeichen</span>
                          <input
                            onChange={(event) =>
                              setEditForm((current) =>
                                current
                                  ? { ...current, referenceNumber: event.target.value }
                                  : current
                              )
                            }
                            value={editForm.referenceNumber}
                          />
                        </label>
                        <label className="field">
                          <span>Status</span>
                          <select
                            onChange={(event) =>
                              setEditForm((current) =>
                                current
                                  ? { ...current, status: event.target.value }
                                  : current
                              )
                            }
                            value={editForm.status}
                          >
                            <option value="draft">draft</option>
                            <option value="active">active</option>
                            <option value="closed">closed</option>
                            <option value="archived">archived</option>
                          </select>
                        </label>
                        <div className="button-row">
                          <button className="primary-button" type="submit">
                            Aenderungen speichern
                          </button>
                          <button
                            className="ghost-button"
                            onClick={() => setEditForm(null)}
                            type="button"
                          >
                            Abbrechen
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        className="ghost-button"
                        onClick={() =>
                          setEditForm({
                            incidentId: incident.id,
                            title: incident.title,
                            referenceNumber: incident.referenceNumber,
                            status: incident.status
                          })
                        }
                        type="button"
                      >
                        Lage bearbeiten
                      </button>
                    )
                  ) : null}

                  {incidentHistory[incident.id]?.visible ? (
                    <div className="history-panel">
                      <h5>Verlauf</h5>

                      {incidentHistory[incident.id]?.loading ? (
                        <p className="muted-text">Verlauf wird geladen...</p>
                      ) : null}

                      {incidentHistory[incident.id]?.error ? (
                        <p className="error-text">{incidentHistory[incident.id]?.error}</p>
                      ) : null}

                      <div className="history-list">
                        {incidentHistory[incident.id]?.entries.map((entry) => (
                          <article className="history-entry" key={entry.id}>
                            <div className="history-entry-header">
                              <strong>{entry.summary}</strong>
                              <span className="muted-text">{formatDate(entry.createdAt)}</span>
                            </div>
                            <p className="muted-text">
                              {entry.actor} · {entry.action}
                            </p>
                            <ul className="history-change-list">
                              {entry.changes.map((change, index) => (
                                <li key={`${entry.id}-${change.field}-${index}`}>
                                  {change.field}: {change.from ?? "leer"} → {change.to ?? "leer"}
                                </li>
                              ))}
                            </ul>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
