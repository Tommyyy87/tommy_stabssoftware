import type { MessageHistoryEntry, MessageSnapshot } from "../../../lib/api";
import {
  getMessageDirectionLabel,
  getMessageStatusLabel
} from "../../../lib/message-center";
import { MessageActions } from "./message-actions";

type MessageHistoryState = {
  visible: boolean;
  loading: boolean;
  error: string | null;
  entries: MessageHistoryEntry[];
};

export function MessageDetail({
  message,
  canUpdate,
  canReadHistory,
  historyState,
  onUpdate,
  onToggleHistory,
  formatDate
}: {
  message: MessageSnapshot | null;
  canUpdate: boolean;
  canReadHistory: boolean;
  historyState?: MessageHistoryState;
  onUpdate: (input: {
    status?: MessageSnapshot["status"];
    assignee?: string;
  }) => void;
  onToggleHistory: () => void;
  formatDate: (value: string) => string;
}) {
  if (!message) {
    return (
      <section className="message-detail-pane">
        <div className="empty-state">
          <h3>Keine Nachricht geladen</h3>
          <p className="muted-text">
            Melde dich an und waehle eine Lage, um Nachrichten zu laden.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="message-detail-pane">
      <div className="message-section-header">
        <div>
          <p className="message-tracking detail-tracking">{message.trackingNumber}</p>
          <h3>{message.subject}</h3>
        </div>
        <div className="detail-pill-row">
          <span className={`status-pill status-${message.status}`}>
            {getMessageStatusLabel(message.status)}
          </span>
          <span
            className={`status-pill priority-badge priority-badge-${message.priority}`}
          >
            {message.priority}
          </span>
        </div>
      </div>

      <div className="detail-grid">
        <article className="detail-card">
          <h4>Nachrichtenkopf</h4>
          <dl className="detail-definition-list">
            <div>
              <dt>Richtung</dt>
              <dd>{getMessageDirectionLabel(message.direction)}</dd>
            </div>
            <div>
              <dt>Kanal</dt>
              <dd>{message.channel}</dd>
            </div>
            <div>
              <dt>Absender</dt>
              <dd>{message.senderLabel}</dd>
            </div>
            <div>
              <dt>Empfaenger</dt>
              <dd>{message.recipientLabel}</dd>
            </div>
            <div>
              <dt>Nachrichtenzeit</dt>
              <dd>{formatDate(message.messageTime)}</dd>
            </div>
            <div>
              <dt>Erfasst</dt>
              <dd>{formatDate(message.recordedAt)}</dd>
            </div>
            <div>
              <dt>Zuweisung</dt>
              <dd>{message.assignee}</dd>
            </div>
            <div>
              <dt>Verteiler</dt>
              <dd>{message.distribution}</dd>
            </div>
          </dl>
        </article>

        <article className="detail-card">
          <h4>Inhalt</h4>
          <p className="detail-body">{message.body}</p>
          <p className="detail-note">
            <strong>Vermerk:</strong> {message.notes || "kein Vermerk"}
          </p>
        </article>
      </div>

      {canUpdate ? (
        <div className="detail-grid">
          <MessageActions message={message} onUpdate={onUpdate} />

          <article className="detail-card">
            <div className="message-section-header">
              <h4>Verlauf</h4>
              {canReadHistory ? (
                <button className="ghost-button" onClick={onToggleHistory} type="button">
                  {historyState?.visible ? "Verlauf ausblenden" : "Verlauf anzeigen"}
                </button>
              ) : null}
            </div>

            {historyState?.visible ? (
              <div className="timeline-list">
                {historyState.loading ? (
                  <p className="muted-text">Verlauf wird geladen...</p>
                ) : null}
                {historyState.error ? (
                  <p className="error-text">{historyState.error}</p>
                ) : null}
                {historyState.entries.map((entry) => (
                  <article className="timeline-entry" key={entry.id}>
                    <div className="timeline-marker" />
                    <div>
                      <div className="timeline-entry-head">
                        <strong>{entry.summary}</strong>
                        <span className="muted-text">{formatDate(entry.createdAt)}</span>
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
              <p className="muted-text">Verlauf bei Bedarf einblenden.</p>
            )}
          </article>
        </div>
      ) : null}
    </section>
  );
}
