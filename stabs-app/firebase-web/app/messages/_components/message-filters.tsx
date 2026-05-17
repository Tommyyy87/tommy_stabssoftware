import {
  getMessageDirectionLabel,
  getMessagePriorityLabel,
  getMessageStatusLabel,
  messageDirections,
  messagePriorities,
  messageStatuses
} from "../../../lib/message-center";
import type { MessageSnapshot } from "../../../lib/api";

export type MessageFiltersState = {
  query: string;
  status: MessageSnapshot["status"] | "alle";
  priority: MessageSnapshot["priority"] | "alle";
  direction: MessageSnapshot["direction"] | "alle";
};

export function MessageFilters({
  filters,
  onChange,
  canCreate,
  composerOpen,
  onToggleComposer
}: {
  filters: MessageFiltersState;
  onChange: (next: MessageFiltersState) => void;
  canCreate: boolean;
  composerOpen: boolean;
  onToggleComposer: () => void;
}) {
  return (
    <div className="message-toolbar">
      <div className="toolbar-search">
        <label className="field">
          <span>Suche</span>
          <input
            onChange={(event) =>
              onChange({ ...filters, query: event.target.value })
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
              onChange({
                ...filters,
                status: event.target.value as MessageFiltersState["status"]
              })
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
              onChange({
                ...filters,
                priority: event.target.value as MessageFiltersState["priority"]
              })
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
              onChange({
                ...filters,
                direction: event.target.value as MessageFiltersState["direction"]
              })
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
            onClick={onToggleComposer}
            type="button"
          >
            {composerOpen ? "Erfassung schliessen" : "Neue Nachricht"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
