"use client";

import Link from "next/link";
import { useWorkspace } from "../_hooks/use-workspace";

export function JournalWorkspace() {
  const { state } = useWorkspace();
  const activeIncident =
    state.incidents.find((incident) => incident.id === state.selectedIncidentId) ?? null;

  return (
    <section className="panel module-panel">
      <div className="message-section-header">
        <div>
          <p className="eyebrow">Tagebuchfuehrung</p>
          <h2>Anschluss fuer Nachweis und Verdichtung</h2>
          <p className="lead">
            Das Tagebuch bleibt im jetzigen Stand noch schlank, ist aber
            fachlich bereits als eigener Nachweisraum in den Fuehrungsrahmen
            eingeordnet.
          </p>
        </div>
        <Link className="ghost-button" href="/messages">
          Zu den Nachrichten
        </Link>
      </div>

      <div className="overview-grid">
        <article className="status-card">
          <h3>Uebernahmekontext</h3>
          <div className="stack compact-stack">
            <p>
              Aktive Lage:{" "}
              {activeIncident
                ? `${activeIncident.referenceNumber} - ${activeIncident.title}`
                : "noch nicht ausgewaehlt"}
            </p>
            <p>
              Benutzer:{" "}
              {state.currentUser ? state.currentUser.user.displayName : "nicht angemeldet"}
            </p>
            <p className="muted-text">
              Dieser Kontext kommt bereits aus derselben Workspace-Quelle wie `/`
              und `/messages`.
            </p>
          </div>
        </article>

        <article className="status-card">
          <h3>Aktueller Fokus</h3>
          <ul className="milestones compact">
            <li>Tagebuch als sichtbar integrierter Nachweisraum</li>
            <li>gleicher Arbeitsrahmen wie auf `/` und `/messages`</li>
            <li>klarer Einstieg fuer neue Nutzer statt leerer Modulanker</li>
          </ul>
        </article>

        <article className="status-card">
          <h3>Geplanter Arbeitsweg</h3>
          <ol className="onboarding-steps">
            <li>Nachricht im Modul `Nachrichten` sichten und bewerten.</li>
            <li>Rueckmeldung oder Abschluss dort lagebezogen dokumentieren.</li>
            <li>Danach relevante Punkte hier mit derselben aktiven Lage uebernehmen.</li>
          </ol>
        </article>
      </div>
    </section>
  );
}
