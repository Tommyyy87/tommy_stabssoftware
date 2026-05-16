"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import {
  AuthSession,
  createMessage,
  getMessageHistory,
  IncidentSnapshot,
  listMessages,
  loginWithDemoCredentials,
  MessageHistoryEntry,
  MessageSnapshot,
  readCurrentUser,
  updateMessage
} from "../../lib/api";
import {
  getMessageDirectionLabel,
  getMessagePriorityLabel,
  getMessageStatusLabel,
  messageDirections,
  messagePriorities,
  messageStatuses
} from "../../lib/message-center";

const sessionStorageKey = "stabs-demo-session";

type MessagesWorkspaceProps = {
  baseUrl: string;
  backendReachable: boolean;
  initialIncidents: IncidentSnapshot[];
};

type CurrentUserSnapshot = Awaited<ReturnType<typeof readCurrentUser>>;

type AuthState = {
  session: AuthSession | null;
  currentUser: CurrentUserSnapshot | null;
  error: string | null;
};

type MessageFilters = {
  query: string;
  status: MessageSnapshot["status"] | "alle";
  priority: MessageSnapshot["priority"] | "alle";
  direction: MessageSnapshot["direction"] | "alle";
};

type MessageHistoryState = {
  visible: boolean;
  loading: boolean;
  error: string | null;
  entries: MessageHistoryEntry[];
};

type ComposerState = {
  direction: MessageSnapshot["direction"];
  channel: MessageSnapshot["channel"];
  priority: MessageSnapshot["priority"];
  messageTime: string;
  senderLabel: string;
  recipientLabel: string;
  subject: string;
  body: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unbekannter Fehler.";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Berlin"
  }).format(new Date(value));
}

function nowForInput() {
  const now = new Date();
  const utc = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return utc.toISOString().slice(0, 16);
}

export function MessagesWorkspace({
  baseUrl,
  backendReachable,
  initialIncidents
}: MessagesWorkspaceProps) {
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "demo" });
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    currentUser: null,
    error: null
  });
  const [incidents, setIncidents] = useState(initialIncidents);
  const [selectedIncidentId, setSelectedIncidentId] = useState(
    initialIncidents[0]?.id ?? ""
  );
  const [messages, setMessages] = useState<MessageSnapshot[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [messageHistory, setMessageHistory] = useState<
    Record<string, MessageHistoryState>
  >({});
  const [composerOpen, setComposerOpen] = useState(false);
  const [composer, setComposer] = useState<ComposerState>({
    direction: "eingang",
    channel: "telefon",
    priority: "hoch",
    messageTime: nowForInput(),
    senderLabel: "",
    recipientLabel: "Stabsraum S2/S3",
    subject: "",
    body: ""
  });
  const [filters, setFilters] = useState<MessageFilters>({
    query: "",
    status: "alle",
    priority: "alle",
    direction: "alle"
  });
  const [workspaceError, setWorkspaceError] = useState<string | null>(
    backendReachable ? null : "Backend aktuell nicht erreichbar."
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const permissions = authState.currentUser?.permissions ?? [];
  const canRead = permissions.includes("messages.read");
  const canCreate = permissions.includes("messages.create");
  const canUpdate = permissions.includes("messages.update");
  const canReadHistory = permissions.includes("audit.read") || canRead;

  const visibleMessages = useMemo(() => {
    const needle = filters.query.trim().toLowerCase();

    return messages
      .filter((message) => {
        const matchesStatus =
          filters.status === "alle" || message.status === filters.status;
        const matchesPriority =
          filters.priority === "alle" || message.priority === filters.priority;
        const matchesDirection =
          filters.direction === "alle" || message.direction === filters.direction;
        const matchesQuery =
          needle.length === 0 ||
          [
            message.subject,
            message.body,
            message.senderLabel,
            message.recipientLabel,
            message.trackingNumber
          ]
            .join(" ")
            .toLowerCase()
            .includes(needle);

        return matchesStatus && matchesPriority && matchesDirection && matchesQuery;
      })
      .sort((left, right) => right.messageTime.localeCompare(left.messageTime));
  }, [filters, messages]);

  const selectedMessage =
    visibleMessages.find((message) => message.id === selectedMessageId) ??
    visibleMessages[0] ??
    null;

  useEffect(() => {
    if (!baseUrl) {
      return;
    }

    const stored = window.localStorage.getItem(sessionStorageKey);

    if (!stored) {
      return;
    }

    try {
      const session = JSON.parse(stored) as AuthSession;
      void hydrateCurrentUser(session);
    } catch {
      window.localStorage.removeItem(sessionStorageKey);
    }
  }, [baseUrl]);

  useEffect(() => {
    if (!authState.session || !selectedIncidentId || !canRead) {
      return;
    }

    void loadMessagesForIncident(selectedIncidentId, authState.session.token);
  }, [authState.session, canRead, selectedIncidentId]);

  async function hydrateCurrentUser(session: AuthSession) {
    try {
      const currentUser = await readCurrentUser({
        baseUrl,
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

  async function loadMessagesForIncident(incidentId: string, token: string) {
    try {
      const nextMessages = await listMessages({
        baseUrl,
        incidentId,
        token
      });

      startTransition(() => {
        setMessages(nextMessages);
        setSelectedMessageId(nextMessages[0]?.id ?? "");
        setWorkspaceError(null);
      });
    } catch (error) {
      startTransition(() => {
        setWorkspaceError(getErrorMessage(error));
      });
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const session = await loginWithDemoCredentials({
        baseUrl,
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
    setMessages([]);
    setSelectedMessageId("");
    setMessageHistory({});
    setFeedback(null);
  }

  async function handleCreateMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authState.session || !selectedIncidentId) {
      return;
    }

    try {
      const created = await createMessage({
        baseUrl,
        incidentId: selectedIncidentId,
        token: authState.session.token,
        input: {
          ...composer,
          messageTime: new Date(composer.messageTime).toISOString()
        }
      });

      startTransition(() => {
        setMessages((current) => [created, ...current]);
        setSelectedMessageId(created.id);
        setComposerOpen(false);
        setComposer({
          direction: "eingang",
          channel: "telefon",
          priority: "hoch",
          messageTime: nowForInput(),
          senderLabel: "",
          recipientLabel: "Stabsraum S2/S3",
          subject: "",
          body: ""
        });
        setFeedback(`Nachricht ${created.trackingNumber} wurde erfasst.`);
      });
    } catch (error) {
      startTransition(() => {
        setFeedback(getErrorMessage(error));
      });
    }
  }

  async function handleUpdateMessage(
    messageId: string,
    input: { status?: MessageSnapshot["status"]; assignee?: string }
  ) {
    if (!authState.session || !selectedIncidentId) {
      return;
    }

    try {
      const updated = await updateMessage({
        baseUrl,
        incidentId: selectedIncidentId,
        messageId,
        token: authState.session.token,
        input
      });

      startTransition(() => {
        setMessages((current) =>
          current.map((message) => (message.id === updated.id ? updated : message))
        );
        setMessageHistory((current) => {
          const next = { ...current };
          delete next[messageId];
          return next;
        });
        setFeedback(`Nachricht ${updated.trackingNumber} wurde aktualisiert.`);
      });
    } catch (error) {
      startTransition(() => {
        setFeedback(getErrorMessage(error));
      });
    }
  }

  async function handleToggleHistory(messageId: string) {
    const currentHistory = messageHistory[messageId];

    if (currentHistory?.visible) {
      setMessageHistory((current) => ({
        ...current,
        [messageId]: {
          ...currentHistory,
          visible: false
        }
      }));
      return;
    }

    if (currentHistory && currentHistory.entries.length > 0) {
      setMessageHistory((current) => ({
        ...current,
        [messageId]: {
          ...currentHistory,
          visible: true,
          error: null
        }
      }));
      return;
    }

    if (!authState.session || !selectedIncidentId) {
      return;
    }

    setMessageHistory((current) => ({
      ...current,
      [messageId]: {
        visible: true,
        loading: true,
        error: null,
        entries: current[messageId]?.entries ?? []
      }
    }));

    try {
      const entries = await getMessageHistory({
        baseUrl,
        incidentId: selectedIncidentId,
        messageId,
        token: authState.session.token
      });

      startTransition(() => {
        setMessageHistory((current) => ({
          ...current,
          [messageId]: {
            visible: true,
            loading: false,
            error: null,
            entries
          }
        }));
      });
    } catch (error) {
      startTransition(() => {
        setMessageHistory((current) => ({
          ...current,
          [messageId]: {
            visible: true,
            loading: false,
            error: getErrorMessage(error),
            entries: current[messageId]?.entries ?? []
          }
        }));
      });
    }
  }

  return (
    <section className="panel message-center-panel">
      <div className="message-center-topline">
        <div>
          <p className="eyebrow">Echter Datenpfad</p>
          <h2>Nachrichtenzentrale auf eigener Modulroute</h2>
          <p className="lead message-center-lead">
            Nachrichten werden jetzt ueber Incident-gebundene Endpunkte geladen
            und bearbeitet. Die Startseite bleibt dadurch kompakt, die
            Nachrichtenarbeit konzentriert sich auf diese Route.
          </p>
        </div>

        <div className="message-summary-grid">
          <article className="summary-card emphasis-card">
            <span className="summary-label">Backend</span>
            <strong>{backendReachable ? "verbunden" : "nicht verbunden"}</strong>
            <span className="summary-meta">{baseUrl || "keine API-URL gesetzt"}</span>
          </article>
          <article className="summary-card">
            <span className="summary-label">Lagen</span>
            <strong>{incidents.length}</strong>
            <span className="summary-meta">fuer den Nachrichtenkontext sichtbar</span>
          </article>
          <article className="summary-card">
            <span className="summary-label">Nachrichten</span>
            <strong>{messages.length}</strong>
            <span className="summary-meta">in der gewaehlten Lage geladen</span>
          </article>
          <article className="summary-card">
            <span className="summary-label">Sitzung</span>
            <strong>{authState.currentUser ? "aktiv" : "offen"}</strong>
            <span className="summary-meta">
              {authState.currentUser?.user.displayName ?? "Login erforderlich"}
            </span>
          </article>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="stack">
          <div className="status-card">
            <h3>Benutzerstatus</h3>

            {authState.currentUser ? (
              <div className="stack compact-stack">
                <p>
                  <strong>{authState.currentUser.user.displayName}</strong> (
                  {authState.currentUser.user.username})
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
                <button className="primary-button" disabled={!baseUrl} type="submit">
                  Demo-Login
                </button>
                <p className="muted-text">Bekannter Demo-Zugang: admin / demo</p>
              </form>
            )}

            {authState.error ? <p className="error-text">{authState.error}</p> : null}
          </div>

          <div className="status-card">
            <h3>Lagekontext</h3>
            <label className="field">
              <span>Aktive Lage</span>
              <select
                onChange={(event) => setSelectedIncidentId(event.target.value)}
                value={selectedIncidentId}
              >
                {incidents.map((incident) => (
                  <option key={incident.id} value={incident.id}>
                    {incident.referenceNumber} - {incident.title}
                  </option>
                ))}
              </select>
            </label>
            <p className="muted-text">
              Nachrichten werden pro Lage getrennt geladen und bearbeitet.
            </p>
          </div>
        </div>

        <div className="status-card">
          <div className="message-toolbar">
            <div className="toolbar-search">
              <label className="field">
                <span>Suche</span>
                <input
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, query: event.target.value }))
                  }
                  placeholder="Betreff, Inhalt, Absender oder Nachweisnummer"
                  value={filters.query}
                />
              </label>
            </div>

            <div className="toolbar-filters">
              <label className="field compact-field">
                <span>Status</span>
                <select
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      status: event.target.value as MessageFilters["status"]
                    }))
                  }
                  value={filters.status}
                >
                  {messageStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getMessageStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field compact-field">
                <span>Prioritaet</span>
                <select
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      priority: event.target.value as MessageFilters["priority"]
                    }))
                  }
                  value={filters.priority}
                >
                  {messagePriorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {getMessagePriorityLabel(priority)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field compact-field">
                <span>Richtung</span>
                <select
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      direction: event.target.value as MessageFilters["direction"]
                    }))
                  }
                  value={filters.direction}
                >
                  {messageDirections.map((direction) => (
                    <option key={direction} value={direction}>
                      {getMessageDirectionLabel(direction)}
                    </option>
                  ))}
                </select>
              </label>

              {canCreate ? (
                <button
                  className="primary-button"
                  onClick={() => setComposerOpen((current) => !current)}
                  type="button"
                >
                  {composerOpen ? "Erfassung schliessen" : "Neue Nachricht"}
                </button>
              ) : null}
            </div>
          </div>

          {composerOpen ? (
            <form className="composer-card" onSubmit={handleCreateMessage}>
              <div className="message-section-header">
                <div>
                  <h3>Neue Nachricht</h3>
                  <p className="muted-text">
                    Diese Erfassung schreibt jetzt in den echten Message-API-Pfad.
                  </p>
                </div>
                <span className="section-chip">persistiert</span>
              </div>

              <div className="composer-grid">
                <label className="field">
                  <span>Richtung</span>
                  <select
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        direction: event.target.value as MessageSnapshot["direction"]
                      }))
                    }
                    value={composer.direction}
                  >
                    <option value="eingang">Eingang</option>
                    <option value="ausgang">Ausgang</option>
                  </select>
                </label>
                <label className="field">
                  <span>Kanal</span>
                  <select
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        channel: event.target.value as MessageSnapshot["channel"]
                      }))
                    }
                    value={composer.channel}
                  >
                    <option value="telefon">telefon</option>
                    <option value="funk">funk</option>
                    <option value="email">email</option>
                    <option value="melder">melder</option>
                    <option value="lagekontakt">lagekontakt</option>
                  </select>
                </label>
                <label className="field">
                  <span>Prioritaet</span>
                  <select
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        priority: event.target.value as MessageSnapshot["priority"]
                      }))
                    }
                    value={composer.priority}
                  >
                    <option value="sofort">sofort</option>
                    <option value="hoch">hoch</option>
                    <option value="normal">normal</option>
                    <option value="niedrig">niedrig</option>
                  </select>
                </label>
                <label className="field">
                  <span>Nachrichtenzeit</span>
                  <input
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        messageTime: event.target.value
                      }))
                    }
                    type="datetime-local"
                    value={composer.messageTime}
                  />
                </label>
                <label className="field">
                  <span>Absender</span>
                  <input
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        senderLabel: event.target.value
                      }))
                    }
                    value={composer.senderLabel}
                  />
                </label>
                <label className="field">
                  <span>Empfaenger</span>
                  <input
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        recipientLabel: event.target.value
                      }))
                    }
                    value={composer.recipientLabel}
                  />
                </label>
                <label className="field">
                  <span>Betreff</span>
                  <input
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        subject: event.target.value
                      }))
                    }
                    value={composer.subject}
                  />
                </label>
                <label className="field composer-body">
                  <span>Inhalt</span>
                  <textarea
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        body: event.target.value
                      }))
                    }
                    value={composer.body}
                  />
                </label>
              </div>

              <div className="button-row">
                <button className="primary-button" disabled={isPending} type="submit">
                  Nachricht speichern
                </button>
              </div>
            </form>
          ) : null}

          {workspaceError ? <p className="error-text">{workspaceError}</p> : null}
          {feedback ? <p className="success-text">{feedback}</p> : null}

          <div className="message-center-shell">
            <aside className="message-list-pane">
              <div className="message-section-header">
                <div>
                  <h3>Nachrichtenliste</h3>
                  <p className="muted-text">
                    {visibleMessages.length} von {messages.length} Nachricht(en)
                  </p>
                </div>
                <span className="section-chip">
                  {incidents.find((entry) => entry.id === selectedIncidentId)?.referenceNumber ??
                    "keine Lage"}
                </span>
              </div>

              <div className="message-list">
                {visibleMessages.map((message) => (
                  <button
                    className={`message-list-item ${
                      selectedMessage?.id === message.id ? "selected" : ""
                    }`}
                    key={message.id}
                    onClick={() => setSelectedMessageId(message.id)}
                    type="button"
                  >
                    <div className="message-item-topline">
                      <span className={`priority-dot priority-${message.priority}`} />
                      <span className="message-tracking">{message.trackingNumber}</span>
                      <span className={`status-pill status-${message.status}`}>
                        {getMessageStatusLabel(message.status)}
                      </span>
                    </div>
                    <strong>{message.subject}</strong>
                    <p className="message-item-meta">
                      {getMessageDirectionLabel(message.direction)} · {message.senderLabel}
                    </p>
                    <p className="message-item-meta">
                      {formatDate(message.messageTime)} · {message.channel}
                    </p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="message-detail-pane">
              {selectedMessage ? (
                <>
                  <div className="message-section-header">
                    <div>
                      <p className="message-tracking detail-tracking">
                        {selectedMessage.trackingNumber}
                      </p>
                      <h3>{selectedMessage.subject}</h3>
                    </div>
                    <div className="detail-pill-row">
                      <span className={`status-pill status-${selectedMessage.status}`}>
                        {getMessageStatusLabel(selectedMessage.status)}
                      </span>
                      <span
                        className={`status-pill priority-badge priority-badge-${selectedMessage.priority}`}
                      >
                        {selectedMessage.priority}
                      </span>
                    </div>
                  </div>

                  <div className="detail-grid">
                    <article className="detail-card">
                      <h4>Nachrichtenkopf</h4>
                      <dl className="detail-definition-list">
                        <div>
                          <dt>Richtung</dt>
                          <dd>{getMessageDirectionLabel(selectedMessage.direction)}</dd>
                        </div>
                        <div>
                          <dt>Kanal</dt>
                          <dd>{selectedMessage.channel}</dd>
                        </div>
                        <div>
                          <dt>Absender</dt>
                          <dd>{selectedMessage.senderLabel}</dd>
                        </div>
                        <div>
                          <dt>Empfaenger</dt>
                          <dd>{selectedMessage.recipientLabel}</dd>
                        </div>
                        <div>
                          <dt>Nachrichtenzeit</dt>
                          <dd>{formatDate(selectedMessage.messageTime)}</dd>
                        </div>
                        <div>
                          <dt>Erfasst</dt>
                          <dd>{formatDate(selectedMessage.recordedAt)}</dd>
                        </div>
                        <div>
                          <dt>Zuweisung</dt>
                          <dd>{selectedMessage.assignee}</dd>
                        </div>
                        <div>
                          <dt>Verteiler</dt>
                          <dd>{selectedMessage.distribution}</dd>
                        </div>
                      </dl>
                    </article>

                    <article className="detail-card">
                      <h4>Inhalt</h4>
                      <p className="detail-body">{selectedMessage.body}</p>
                      <p className="detail-note">
                        <strong>Vermerk:</strong> {selectedMessage.notes || "kein Vermerk"}
                      </p>
                    </article>
                  </div>

                  {canUpdate ? (
                    <div className="detail-grid">
                      <article className="detail-card">
                        <h4>Bearbeitung</h4>
                        <div className="action-stack">
                          <label className="field">
                            <span>Status</span>
                            <select
                              onChange={(event) =>
                                void handleUpdateMessage(selectedMessage.id, {
                                  status: event.target.value as MessageSnapshot["status"]
                                })
                              }
                              value={selectedMessage.status}
                            >
                              <option value="neu">neu</option>
                              <option value="gesichtet">gesichtet</option>
                              <option value="in_bearbeitung">in Bearbeitung</option>
                              <option value="weitergeleitet">weitergeleitet</option>
                              <option value="erledigt">erledigt</option>
                            </select>
                          </label>
                          <label className="field">
                            <span>Zuweisung</span>
                            <select
                              onChange={(event) =>
                                void handleUpdateMessage(selectedMessage.id, {
                                  assignee: event.target.value
                                })
                              }
                              value={selectedMessage.assignee}
                            >
                              <option value="Sichtung offen">Sichtung offen</option>
                              <option value="KGS Nachrichtenzentrale">
                                KGS Nachrichtenzentrale
                              </option>
                              <option value="S2 Lage">S2 Lage</option>
                              <option value="S3 Einsatz">S3 Einsatz</option>
                              <option value="S4 Versorgung">S4 Versorgung</option>
                              <option value="S5 Presse">S5 Presse</option>
                            </select>
                          </label>
                        </div>
                      </article>

                      <article className="detail-card">
                        <div className="message-section-header">
                          <h4>Verlauf</h4>
                          {canReadHistory ? (
                            <button
                              className="ghost-button"
                              onClick={() => void handleToggleHistory(selectedMessage.id)}
                              type="button"
                            >
                              {messageHistory[selectedMessage.id]?.visible
                                ? "Verlauf ausblenden"
                                : "Verlauf anzeigen"}
                            </button>
                          ) : null}
                        </div>

                        {messageHistory[selectedMessage.id]?.visible ? (
                          <div className="timeline-list">
                            {messageHistory[selectedMessage.id]?.loading ? (
                              <p className="muted-text">Verlauf wird geladen...</p>
                            ) : null}
                            {messageHistory[selectedMessage.id]?.error ? (
                              <p className="error-text">
                                {messageHistory[selectedMessage.id]?.error}
                              </p>
                            ) : null}
                            {messageHistory[selectedMessage.id]?.entries.map((entry) => (
                              <article className="timeline-entry" key={entry.id}>
                                <div className="timeline-marker" />
                                <div>
                                  <div className="timeline-entry-head">
                                    <strong>{entry.summary}</strong>
                                    <span className="muted-text">
                                      {formatDate(entry.createdAt)}
                                    </span>
                                  </div>
                                  <p className="timeline-actor">{entry.actor}</p>
                                  <ul className="history-change-list">
                                    {entry.changes.map((change, index) => (
                                      <li key={`${entry.id}-${change.field}-${index}`}>
                                        {change.field}: {change.from ?? "leer"} -&gt;{" "}
                                        {change.to ?? "leer"}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <p className="muted-text">
                            Verlauf bei Bedarf einblenden.
                          </p>
                        )}
                      </article>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="empty-state">
                  <h3>Keine Nachricht geladen</h3>
                  <p className="muted-text">
                    Melde dich an und waehle eine Lage, um Nachrichten zu laden.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
