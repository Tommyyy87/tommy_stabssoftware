"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import {
  createMessage,
  getMessageHistory,
  listMessages,
  loginWithDemoCredentials,
  MessageHistoryEntry,
  MessageSnapshot,
  readCurrentUser,
  updateMessage
} from "../../lib/api";
import { filterVisibleMessages } from "../../lib/messages-view";
import { useWorkspace } from "../_hooks/use-workspace";
import { MessageComposer } from "./_components/message-composer";
import {
  MessageFilters,
  type MessageFiltersState
} from "./_components/message-filters";
import { MessageDetail } from "./_components/message-detail";
import { MessageList } from "./_components/message-list";
import { MessageWorkspaceHeader } from "./_components/message-workspace-header";

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

function createInitialComposer(): ComposerState {
  return {
    direction: "eingang",
    channel: "telefon",
    priority: "hoch",
    messageTime: nowForInput(),
    senderLabel: "",
    recipientLabel: "Stabsraum S2/S3",
    subject: "",
    body: ""
  };
}

export function MessagesWorkspace() {
  const { state, setSelectedIncidentId, setSession } = useWorkspace();
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "demo" });
  const [messages, setMessages] = useState<MessageSnapshot[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [messageHistory, setMessageHistory] = useState<
    Record<string, MessageHistoryState>
  >({});
  const [composerOpen, setComposerOpen] = useState(false);
  const [composer, setComposer] = useState<ComposerState>(createInitialComposer());
  const [filters, setFilters] = useState<MessageFiltersState>({
    query: "",
    status: "alle",
    priority: "alle",
    direction: "alle"
  });
  const [workspaceError, setWorkspaceError] = useState<string | null>(
    state.backendReachable ? null : "Backend aktuell nicht erreichbar."
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const permissions = state.currentUser?.permissions ?? [];
  const canRead = permissions.includes("messages.read");
  const canCreate = permissions.includes("messages.create");
  const canUpdate = permissions.includes("messages.update");
  const canReadHistory = permissions.includes("audit.read") || canRead;

  const visibleMessages = useMemo(
    () => filterVisibleMessages(messages, filters),
    [filters, messages]
  );

  const selectedMessage =
    visibleMessages.find((message) => message.id === selectedMessageId) ??
    visibleMessages[0] ??
    null;

  useEffect(() => {
    if (!state.session || !state.selectedIncidentId || !canRead) {
      return;
    }

    void loadMessagesForIncident(state.selectedIncidentId, state.session.token);
  }, [canRead, state.baseUrl, state.selectedIncidentId, state.session]);

  useEffect(() => {
    setWorkspaceError(
      state.backendReachable ? null : "Backend aktuell nicht erreichbar."
    );
  }, [state.backendReachable]);

  useEffect(() => {
    setMessages([]);
    setSelectedMessageId("");
    setMessageHistory({});
    setFeedback(null);
  }, [state.selectedIncidentId]);

  useEffect(() => {
    if (state.session) {
      return;
    }

    setMessages([]);
    setSelectedMessageId("");
    setMessageHistory({});
  }, [state.session]);

  async function loadMessagesForIncident(incidentId: string, token: string) {
    try {
      const nextMessages = await listMessages({
        baseUrl: state.baseUrl,
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
    setMessages([]);
    setSelectedMessageId("");
    setMessageHistory({});
    setFeedback(null);
  }

  async function handleCreateMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!state.session || !state.selectedIncidentId) {
      return;
    }

    try {
      const created = await createMessage({
        baseUrl: state.baseUrl,
        incidentId: state.selectedIncidentId,
        token: state.session.token,
        input: {
          ...composer,
          messageTime: new Date(composer.messageTime).toISOString()
        }
      });

      startTransition(() => {
        setMessages((current) => [created, ...current]);
        setSelectedMessageId(created.id);
        setComposerOpen(false);
        setComposer(createInitialComposer());
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
    if (!state.session || !state.selectedIncidentId) {
      return;
    }

    try {
      const updated = await updateMessage({
        baseUrl: state.baseUrl,
        incidentId: state.selectedIncidentId,
        messageId,
        token: state.session.token,
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

    if (!state.session || !state.selectedIncidentId) {
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
        baseUrl: state.baseUrl,
        incidentId: state.selectedIncidentId,
        messageId,
        token: state.session.token
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
      <MessageWorkspaceHeader
        backendReachable={state.backendReachable}
        baseUrl={state.baseUrl}
        incidentCount={state.incidents.length}
        messageCount={messages.length}
        sessionLabel={state.currentUser ? state.currentUser.user.displayName : "offen"}
      />

      <div className="workspace-grid">
        <div className="stack">
          <div className="status-card">
            <h3>Benutzerstatus</h3>

            {state.currentUser ? (
              <div className="stack compact-stack">
                <p>
                  <strong>{state.currentUser.user.displayName}</strong> (
                  {state.currentUser.user.username})
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
                <button className="primary-button" disabled={!state.baseUrl} type="submit">
                  Demo-Login
                </button>
                <p className="muted-text">Bekannter Demo-Zugang: admin / demo</p>
              </form>
            )}

            {authError ? <p className="error-text">{authError}</p> : null}
          </div>

          <div className="status-card">
            <h3>Lagekontext</h3>
            <label className="field">
              <span>Aktive Lage</span>
              <select
                onChange={(event) => setSelectedIncidentId(event.target.value)}
                value={state.selectedIncidentId}
              >
                {state.incidents.map((incident) => (
                  <option key={incident.id} value={incident.id}>
                    {incident.referenceNumber} - {incident.title}
                  </option>
                ))}
              </select>
            </label>
            <p className="muted-text">
              Die aktive Lage kommt direkt aus dem globalen Workspace-Kontext.
            </p>
          </div>
        </div>

        <div className="status-card">
          <MessageFilters
            canCreate={canCreate}
            composerOpen={composerOpen}
            filters={filters}
            onChange={setFilters}
            onToggleComposer={() => setComposerOpen((current) => !current)}
          />

          {composerOpen ? (
            <MessageComposer
              composer={composer}
              isPending={isPending}
              onChange={setComposer}
              onSubmit={handleCreateMessage}
            />
          ) : null}

          {workspaceError ? <p className="error-text">{workspaceError}</p> : null}
          {feedback ? <p className="success-text">{feedback}</p> : null}

          <div className="message-center-shell">
            <MessageList
              formatDate={formatDate}
              incidents={state.incidents}
              messages={visibleMessages}
              onSelectMessage={setSelectedMessageId}
              selectedIncidentId={state.selectedIncidentId}
              selectedMessageId={selectedMessage?.id ?? ""}
            />

            <MessageDetail
              canReadHistory={canReadHistory}
              canUpdate={canUpdate}
              formatDate={formatDate}
              historyState={
                selectedMessage ? messageHistory[selectedMessage.id] : undefined
              }
              message={selectedMessage}
              onToggleHistory={() => {
                if (selectedMessage) {
                  void handleToggleHistory(selectedMessage.id);
                }
              }}
              onUpdate={(input) => {
                if (selectedMessage) {
                  void handleUpdateMessage(selectedMessage.id, input);
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
