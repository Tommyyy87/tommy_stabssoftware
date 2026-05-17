import type { IncidentSnapshot, MessageHistoryEntry, MessageSnapshot } from "../../../lib/api";
import { MessageComposer } from "./message-composer";
import { MessageDetail } from "./message-detail";
import { MessageFilters, type MessageFiltersState } from "./message-filters";
import { MessageList } from "./message-list";
import { MessageWorkspaceHeader } from "./message-workspace-header";

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

type MessageHistoryState = {
  visible: boolean;
  loading: boolean;
  error: string | null;
  entries: MessageHistoryEntry[];
};

export function MessagesPageClient({
  backendReachable,
  baseUrl,
  incidents,
  messages,
  visibleMessages,
  selectedIncidentId,
  selectedMessage,
  selectedMessageId,
  sessionLabel,
  filters,
  composerOpen,
  composer,
  canCreate,
  canUpdate,
  canReadHistory,
  isPending,
  workspaceError,
  feedback,
  messageHistoryState,
  onFiltersChange,
  onToggleComposer,
  onComposerChange,
  onComposerSubmit,
  onSelectMessage,
  onUpdateMessage,
  onToggleHistory,
  formatDate
}: {
  backendReachable: boolean;
  baseUrl: string;
  incidents: IncidentSnapshot[];
  messages: MessageSnapshot[];
  visibleMessages: MessageSnapshot[];
  selectedIncidentId: string;
  selectedMessage: MessageSnapshot | null;
  selectedMessageId: string;
  sessionLabel: string;
  filters: MessageFiltersState;
  composerOpen: boolean;
  composer: ComposerState;
  canCreate: boolean;
  canUpdate: boolean;
  canReadHistory: boolean;
  isPending: boolean;
  workspaceError: string | null;
  feedback: string | null;
  messageHistoryState?: MessageHistoryState;
  onFiltersChange: (next: MessageFiltersState) => void;
  onToggleComposer: () => void;
  onComposerChange: (next: ComposerState) => void;
  onComposerSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSelectMessage: (messageId: string) => void;
  onUpdateMessage: (input: {
    status?: MessageSnapshot["status"];
    assignee?: string;
  }) => void;
  onToggleHistory: () => void;
  formatDate: (value: string) => string;
}) {
  return (
    <section className="panel message-center-panel">
      <MessageWorkspaceHeader
        backendReachable={backendReachable}
        baseUrl={baseUrl}
        incidentCount={incidents.length}
        messageCount={messages.length}
        sessionLabel={sessionLabel}
      />

      <div className="workspace-grid">
        <div className="stack">
          <div className="status-card">
            <h3>Arbeitskontext</h3>
            <label className="field">
              <span>Aktive Lage</span>
              <select disabled value={selectedIncidentId}>
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
          <MessageFilters
            canCreate={canCreate}
            composerOpen={composerOpen}
            filters={filters}
            onChange={onFiltersChange}
            onToggleComposer={onToggleComposer}
          />

          {composerOpen ? (
            <MessageComposer
              composer={composer}
              isPending={isPending}
              onChange={onComposerChange}
              onSubmit={onComposerSubmit}
            />
          ) : null}

          {workspaceError ? <p className="error-text">{workspaceError}</p> : null}
          {feedback ? <p className="success-text">{feedback}</p> : null}

          <div className="message-center-shell">
            <MessageList
              formatDate={formatDate}
              incidents={incidents}
              messages={visibleMessages}
              onSelectMessage={onSelectMessage}
              selectedIncidentId={selectedIncidentId}
              selectedMessageId={selectedMessageId}
            />
            <MessageDetail
              canReadHistory={canReadHistory}
              canUpdate={canUpdate}
              formatDate={formatDate}
              historyState={messageHistoryState}
              message={selectedMessage}
              onToggleHistory={onToggleHistory}
              onUpdate={onUpdateMessage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
