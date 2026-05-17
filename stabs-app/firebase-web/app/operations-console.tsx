"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import {
  IncidentHistoryEntry,
  createIncident,
  getIncidentHistory,
  listIncidents,
  loginWithDemoCredentials,
  readCurrentUser,
  updateIncident
} from "../lib/api";
import { useWorkspace } from "./_hooks/use-workspace";

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

export function OperationsConsole() {
  const { state, setIncidents, setSelectedIncidentId, setSession, upsertIncident } =
    useWorkspace();
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "demo" });
  const [incidentForm, setIncidentForm] = useState<IncidentFormState>({
    title: "",
    referenceNumber: ""
  });
  const [editForm, setEditForm] = useState<EditFormState>(null);
  const [incidentHistory, setIncidentHistory] = useState<
    Record<string, IncidentHistoryState>
  >({});
  const [incidentFeedback, setIncidentFeedback] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(
    state.backendReachable ? null : "Backend aktuell nicht erreichbar."
  );
  const [isPending, startTransition] = useTransition();

  const canAuthenticate = state.baseUrl.length > 0;
  const permissions = state.currentUser?.permissions ?? [];
  const canCreate = permissions.includes("incidents.create");
  const canUpdate = permissions.includes("incidents.update");
  const canReadHistory =
    permissions.includes("audit.read") || permissions.includes("incidents.read");
  const activeIncident =
    state.incidents.find((incident) => incident.id === state.selectedIncidentId) ?? null;

  const sortedIncidents = useMemo(
    () =>
      [...state.incidents].sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt)
      ),
    [state.incidents]
  );

  async function refreshIncidents() {
    if (!canAuthenticate) {
      return;
    }

    try {
      const nextIncidents = await listIncidents({ baseUrl: state.baseUrl });

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
    setAuthError(null);

    try {
      const session = await loginWithDemoCredentials({
        baseUrl: state.baseUrl,
        username: loginForm.username,
        password: loginForm.password
      });

      const currentUser = await readCurrentUser({
        baseUrl: state.baseUrl,
        token: session.token
      });

      setSession(session, currentUser);
    } catch (error) {
      startTransition(() => {
        setSession(null, null);
        setAuthError(getErrorMessage(error));
      });
    }
  }

  function handleLogout() {
    setSession(null, null);
    setAuthError(null);
    setEditForm(null);
    setIncidentHistory({});
    setIncidentFeedback(null);
  }

  async function handleCreateIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!state.session) {
      return;
    }

    try {
      const createdIncident = await createIncident({
        baseUrl: state.baseUrl,
        token: state.session.token,
        input: incidentForm
      });

      startTransition(() => {
        upsertIncident(createdIncident);
        setSelectedIncidentId(createdIncident.id);
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

    if (!state.session || !editForm) {
      return;
    }

    try {
      const updatedIncident = await updateIncident({
        baseUrl: state.baseUrl,
        token: state.session.token,
        incidentId: editForm.incidentId,
        input: {
          title: editForm.title,
          referenceNumber: editForm.referenceNumber,
          status: editForm.status
        }
      });

      startTransition(() => {
        upsertIncident(updatedIncident);
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

    if (!state.session) {
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
        baseUrl: state.baseUrl,
        token: state.session.token,
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
          <h2>Gemeinsamer Workspace-Kontext</h2>
          <p className="muted-text">
            Sitzung, aktive Lage und Lagebestand werden hier einmal gepflegt
            und danach von `/messages`, `Tagebuch` und den kuenftigen
            Fachbereichen gemeinsam
            verwendet.
          </p>
        </div>

        <button className="ghost-button" onClick={() => void refreshIncidents()} type="button">
          {isPending ? "Aktualisiere..." : "Lagen neu laden"}
        </button>
      </div>

      <div className="workspace-grid">
        <div className="stack">
          <div className="status-card">
            <h3>Arbeitslage</h3>
            <label className="field">
              <span>Aktive Lage fuer alle Module</span>
              <select
                onChange={(event) => setSelectedIncidentId(event.target.value)}
                value={state.selectedIncidentId}
              >
                {sortedIncidents.map((incident) => (
                  <option key={incident.id} value={incident.id}>
                    {incident.referenceNumber} - {incident.title}
                  </option>
                ))}
              </select>
            </label>
            <p className="muted-text">
              {activeIncident
                ? `Aktiv: ${activeIncident.referenceNumber} - ${activeIncident.title}`
                : "Noch keine aktive Lage verfuegbar."}
            </p>
          </div>

          <div className="status-card">
            <h3>Benutzerstatus</h3>

            {state.currentUser ? (
              <div className="stack compact-stack">
                <p>
                  <strong>{state.currentUser.user.displayName}</strong> ({state.currentUser.user.username})
                </p>
                <p>Rollen: {state.currentUser.user.roles.join(", ")}</p>
                <p>Berechtigungen: {state.currentUser.permissions.join(", ")}</p>
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

            {authError ? <p className="error-text">{authError}</p> : null}
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
                {sortedIncidents.length} Lage(n) im gemeinsamen Workspace
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
