import type { MessageSnapshot } from "../../../lib/api";

export function MessageActions({
  message,
  onUpdate
}: {
  message: MessageSnapshot;
  onUpdate: (input: {
    status?: MessageSnapshot["status"];
    assignee?: string;
  }) => void;
}) {
  return (
    <article className="detail-card">
      <h4>Bearbeitung</h4>
      <div className="action-stack">
        <label className="field">
          <span>Status</span>
          <select
            onChange={(event) =>
              onUpdate({
                status: event.target.value as MessageSnapshot["status"]
              })
            }
            value={message.status}
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
              onUpdate({
                assignee: event.target.value
              })
            }
            value={message.assignee}
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
  );
}
