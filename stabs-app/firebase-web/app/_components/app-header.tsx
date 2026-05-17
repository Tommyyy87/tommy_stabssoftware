"use client";

import { useWorkspace } from "../_hooks/use-workspace";
import { StatusBadge } from "./status-badge";

export function AppHeader() {
  const { state } = useWorkspace();
  const activeIncident =
    state.incidents.find((incident) => incident.id === state.selectedIncidentId) ?? null;

  return (
    <header className="app-header">
      <div className="app-header-copy">
        <div>
          <p className="app-kicker">Stabs-App</p>
          <h1>Fuehrungsraum</h1>
        </div>
        <p>
          Sachlich gefuehrter Arbeitsrahmen fuer Fuehrungsueberblick,
          S-Funktionen, Nachrichten und Tagebuch.
        </p>
      </div>

      <div className="app-header-context">
        <article className="context-card context-card-strong">
          <span className="context-label">Aktive Lage</span>
          <strong>
            {activeIncident
              ? `${activeIncident.referenceNumber} - ${activeIncident.title}`
              : "Noch keine Lage aktiv"}
          </strong>
          <span className="context-meta">
            Gemeinsamer Bezugspunkt fuer alle Bereiche
          </span>
        </article>

        <article className="context-card">
          <span className="context-label">Fuehrungsstatus</span>
          <strong>{state.backendReachable ? "Betriebsbereit" : "Verbindung stoert"}</strong>
          <span className="context-meta">
            {state.baseUrl || "Keine API-Basis-URL gesetzt"}
          </span>
        </article>

        <article className="context-card">
          <span className="context-label">Bedienkontext</span>
          <strong>
            {state.currentUser ? state.currentUser.user.displayName : "Nicht angemeldet"}
          </strong>
          <span className="context-meta">
            {state.currentUser
              ? state.currentUser.user.roles.join(", ")
              : "Anmeldung fuer Facharbeit erforderlich"}
          </span>
        </article>

        <article className="context-card context-card-badge">
          <span className="context-label">Ausbaustand</span>
          <StatusBadge tone="neutral">Sprint 1 plus Fachrahmen</StatusBadge>
          <span className="context-meta">Fachbereiche sind bereits angelegt</span>
        </article>
      </div>
    </header>
  );
}
