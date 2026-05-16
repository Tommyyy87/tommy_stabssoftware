"use client";

import { useDeferredValue, useEffect, useState } from "react";

import {
  assignMessage,
  buildStatusSummary,
  createLocalMessage,
  demoMessages,
  filterMessages,
  getMessageDirectionLabel,
  getMessagePriorityLabel,
  getMessageStatusLabel,
  MessageChannel,
  MessagePriority,
  MessageRecord,
  MessageStatus,
  messageDirections,
  messagePriorities,
  messageStatuses,
  updateMessageStatus
} from "../lib/message-center";

type ComposerState = {
  subject: string;
  body: string;
  senderLabel: string;
  recipientLabel: string;
  priority: MessagePriority;
  channel: MessageChannel;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin"
  }).format(new Date(value));
}

export function MessageCenter() {
  const [messages, setMessages] = useState(demoMessages);
  const [selectedId, setSelectedId] = useState(demoMessages[0]?.id ?? "");
  const [composerOpen, setComposerOpen] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    status: "alle" as const,
    priority: "alle" as const,
    direction: "alle" as const
  });
  const [composer, setComposer] = useState<ComposerState>({
    subject: "",
    body: "",
    senderLabel: "",
    recipientLabel: "Stabsraum S2/S3",
    priority: "hoch",
    channel: "telefon"
  });

  const deferredQuery = useDeferredValue(filters.query);
  const visibleMessages = filterMessages(messages, {
    ...filters,
    query: deferredQuery
  });
  const selectedMessage =
    visibleMessages.find((message) => message.id === selectedId) ??
    visibleMessages[0] ??
    null;
  const summary = buildStatusSummary(messages);

  useEffect(() => {
    if (!selectedMessage && visibleMessages[0]) {
      setSelectedId(visibleMessages[0].id);
      return;
    }

    if (selectedMessage && selectedMessage.id !== selectedId) {
      setSelectedId(selectedMessage.id);
    }
  }, [selectedId, selectedMessage, visibleMessages]);

  function patchSelectedMessage(transform: (message: MessageRecord) => MessageRecord) {
    if (!selectedMessage) {
      return;
    }

    setMessages((current) =>
      current.map((message) =>
        message.id === selectedMessage.id ? transform(message) : message
      )
    );
  }

  function handleCreateMessage() {
    if (!composer.subject.trim() || !composer.body.trim() || !composer.senderLabel.trim()) {
      return;
    }

    const created = createLocalMessage(composer);

    setMessages((current) => [created, ...current]);
    setSelectedId(created.id);
    setComposerOpen(false);
    setComposer({
      subject: "",
      body: "",
      senderLabel: "",
      recipientLabel: "Stabsraum S2/S3",
      priority: "hoch",
      channel: "telefon"
    });
  }

  return (
    <section className="panel message-center-panel">
      <div className="message-center-topline">
        <div>
          <p className="eyebrow">Nachrichtenmodul gestartet</p>
          <h2>Nachrichtenzentrale fuer Sichtung, Weiterleitung und Nachweis</h2>
          <p className="lead message-center-lead">
            Der erste sichtbare Fachstand priorisiert eingehende Meldungen,
            fuehrt Ausgaenge mit und zeigt die spaetere Arbeitslogik fuer
            Tagebuch-, Lage- und Auftragsbezug.
          </p>
        </div>

        <div className="message-summary-grid">
          <article className="summary-card emphasis-card">
            <span className="summary-label">Aktive Lage</span>
            <strong>Waldbrand Gummersbach</strong>
            <span className="summary-meta">Arbeitsraum S2/S3/KGS</span>
          </article>
          <article className="summary-card">
            <span className="summary-label">Neu</span>
            <strong>{summary.newCount}</strong>
            <span className="summary-meta">ungesichtete Meldung(en)</span>
          </article>
          <article className="summary-card">
            <span className="summary-label">Sofort</span>
            <strong>{summary.urgentCount}</strong>
            <span className="summary-meta">mit hoechster Dringlichkeit</span>
          </article>
          <article className="summary-card">
            <span className="summary-label">Ausgaenge</span>
            <strong>{summary.outgoingCount}</strong>
            <span className="summary-meta">im gleichen Nachweis</span>
          </article>
        </div>
      </div>

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
                  status: event.target.value as typeof current.status
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
                  priority: event.target.value as typeof current.priority
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
                  direction: event.target.value as typeof current.direction
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

          <button
            className="primary-button"
            onClick={() => setComposerOpen((current) => !current)}
            type="button"
          >
            {composerOpen ? "Erfassung schliessen" : "Neue Nachricht"}
          </button>
        </div>
      </div>

      {composerOpen ? (
        <section className="composer-card">
          <div className="message-section-header">
            <div>
              <h3>Neue Nachricht erfassen</h3>
              <p className="muted-text">
                Erste interaktive Frontend-Vorstufe fuer den digitalen
                Nachrichtenvordruck.
              </p>
            </div>
            <span className="status-pill status-neu">lokale Vorschau</span>
          </div>

          <div className="composer-grid">
            <label className="field">
              <span>Betreff</span>
              <input
                onChange={(event) =>
                  setComposer((current) => ({ ...current, subject: event.target.value }))
                }
                placeholder="z. B. Evakuierung Campingplatz vorbereiten"
                value={composer.subject}
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
                placeholder="z. B. Abschnitt Nord"
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
              <span>Kanal</span>
              <select
                onChange={(event) =>
                  setComposer((current) => ({
                    ...current,
                    channel: event.target.value as MessageChannel
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
                    priority: event.target.value as MessagePriority
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
            <label className="field composer-body">
              <span>Inhalt</span>
              <textarea
                onChange={(event) =>
                  setComposer((current) => ({ ...current, body: event.target.value }))
                }
                placeholder="Nachrichtentext kurz, eindeutig und ohne unnoetige Abkuerzungen erfassen."
                value={composer.body}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="primary-button" onClick={handleCreateMessage} type="button">
              Nachricht lokal erfassen
            </button>
            <span className="muted-text">
              In der naechsten Stufe wird diese Erfassung an das Backend-Modul
              `messages` angeschlossen.
            </span>
          </div>
        </section>
      ) : null}

      <div className="message-center-shell">
        <aside className="message-list-pane">
          <div className="message-section-header">
            <div>
              <h3>Nachweisen</h3>
              <p className="muted-text">
                {visibleMessages.length} von {messages.length} Nachricht(en)
              </p>
            </div>
            <span className="section-chip">eingangsorientiert</span>
          </div>

          <div className="message-list">
            {visibleMessages.map((message) => (
              <button
                className={`message-list-item ${
                  selectedMessage?.id === message.id ? "selected" : ""
                }`}
                key={message.id}
                onClick={() => setSelectedId(message.id)}
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
                    {getMessagePriorityLabel(selectedMessage.priority)}
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
                    <strong>Bearbeitungsvermerk:</strong> {selectedMessage.notes}
                  </p>
                </article>
              </div>

              <div className="detail-grid">
                <article className="detail-card">
                  <div className="message-section-header">
                    <h4>Naechste Bearbeitung</h4>
                    <span className="section-chip">lokale Interaktion</span>
                  </div>

                  <div className="action-stack">
                    <label className="field">
                      <span>Status</span>
                      <select
                        onChange={(event) =>
                          patchSelectedMessage((message) =>
                            updateMessageStatus(
                              message,
                              event.target.value as MessageStatus
                            )
                          )
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
                          patchSelectedMessage((message) =>
                            assignMessage(message, event.target.value)
                          )
                        }
                        value={selectedMessage.assignee}
                      >
                        <option value="Sichtung offen">Sichtung offen</option>
                        <option value="KGS Nachrichtenzentrale">KGS Nachrichtenzentrale</option>
                        <option value="S2 Lage">S2 Lage</option>
                        <option value="S3 Einsatz">S3 Einsatz</option>
                        <option value="S4 Versorgung">S4 Versorgung</option>
                        <option value="S5 Presse">S5 Presse</option>
                      </select>
                    </label>
                  </div>
                </article>

                <article className="detail-card">
                  <h4>Verknuepfungen</h4>
                  <div className="link-chip-row">
                    {selectedMessage.links.length > 0 ? (
                      selectedMessage.links.map((link) => (
                        <span className="link-chip" key={`${link.kind}-${link.value}`}>
                          {link.label}: {link.value}
                        </span>
                      ))
                    ) : (
                      <p className="muted-text">
                        Noch keine Fachverknuepfungen vorhanden.
                      </p>
                    )}
                  </div>
                </article>
              </div>

              <article className="detail-card timeline-card">
                <div className="message-section-header">
                  <h4>Bearbeitungsspur</h4>
                  <span className="section-chip">nachvollziehbar</span>
                </div>

                <div className="timeline-list">
                  {selectedMessage.timeline.map((entry) => (
                    <article className="timeline-entry" key={entry.id}>
                      <div className="timeline-marker" />
                      <div>
                        <div className="timeline-entry-head">
                          <strong>{entry.action}</strong>
                          <span className="muted-text">{formatDate(entry.at)}</span>
                        </div>
                        <p className="timeline-actor">
                          {entry.actor}
                        </p>
                        <p className="muted-text">{entry.note}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            </>
          ) : (
            <div className="empty-state">
              <h3>Keine Nachricht gefunden</h3>
              <p className="muted-text">
                Passe die Filter an oder erfasse eine neue Nachricht.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
