import type { MessageSnapshot } from "../../../lib/api";

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

export function MessageComposer({
  composer,
  isPending,
  onChange,
  onSubmit
}: {
  composer: ComposerState;
  isPending: boolean;
  onChange: (next: ComposerState) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="composer-card" onSubmit={onSubmit}>
      <div className="message-section-header">
        <div>
          <h3>Neue Nachricht</h3>
          <p className="muted-text">
            Diese Erfassung schreibt in den echten Message-API-Pfad.
          </p>
        </div>
        <span className="section-chip">persistiert</span>
      </div>

      <div className="composer-grid">
        <label className="field">
          <span>Richtung</span>
          <select
            onChange={(event) =>
              onChange({
                ...composer,
                direction: event.target.value as ComposerState["direction"]
              })
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
              onChange({
                ...composer,
                channel: event.target.value as ComposerState["channel"]
              })
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
              onChange({
                ...composer,
                priority: event.target.value as ComposerState["priority"]
              })
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
              onChange({
                ...composer,
                messageTime: event.target.value
              })
            }
            type="datetime-local"
            value={composer.messageTime}
          />
        </label>
        <label className="field">
          <span>Absender</span>
          <input
            onChange={(event) =>
              onChange({
                ...composer,
                senderLabel: event.target.value
              })
            }
            value={composer.senderLabel}
          />
        </label>
        <label className="field">
          <span>Empfaenger</span>
          <input
            onChange={(event) =>
              onChange({
                ...composer,
                recipientLabel: event.target.value
              })
            }
            value={composer.recipientLabel}
          />
        </label>
        <label className="field">
          <span>Betreff</span>
          <input
            onChange={(event) =>
              onChange({
                ...composer,
                subject: event.target.value
              })
            }
            value={composer.subject}
          />
        </label>
        <label className="field composer-body">
          <span>Inhalt</span>
          <textarea
            onChange={(event) =>
              onChange({
                ...composer,
                body: event.target.value
              })
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
  );
}
