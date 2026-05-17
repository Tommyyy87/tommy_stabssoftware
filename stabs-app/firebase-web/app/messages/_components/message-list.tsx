import type { IncidentSnapshot, MessageSnapshot } from "../../../lib/api";
import {
  getMessageDirectionLabel,
  getMessageStatusLabel
} from "../../../lib/message-center";

export function MessageList({
  messages,
  selectedMessageId,
  selectedIncidentId,
  incidents,
  onSelectMessage,
  formatDate
}: {
  messages: MessageSnapshot[];
  selectedMessageId: string;
  selectedIncidentId: string;
  incidents: IncidentSnapshot[];
  onSelectMessage: (messageId: string) => void;
  formatDate: (value: string) => string;
}) {
  return (
    <aside className="message-list-pane">
      <div className="message-section-header">
        <div>
          <h3>Nachrichtenliste</h3>
          <p className="muted-text">{messages.length} Nachricht(en) im Filter</p>
        </div>
        <span className="section-chip">
          {incidents.find((entry) => entry.id === selectedIncidentId)?.referenceNumber ??
            "keine Lage"}
        </span>
      </div>

      <div className="message-list">
        {messages.map((message) => (
          <button
            className={`message-list-item ${
              selectedMessageId === message.id ? "selected" : ""
            }`}
            key={message.id}
            onClick={() => onSelectMessage(message.id)}
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
  );
}
