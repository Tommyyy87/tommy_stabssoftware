import { StatusBadge } from "./status-badge";

export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header-copy">
        <p className="app-kicker">Stabs-App</p>
        <h1>Fuehrungsarbeitsplatz</h1>
        <p>
          Gemeinsamer Rahmen fuer Lageuebersicht, Nachrichten und Journal.
        </p>
      </div>

      <div className="app-header-status">
        <StatusBadge tone="neutral">Sprint 1</StatusBadge>
      </div>
    </header>
  );
}
