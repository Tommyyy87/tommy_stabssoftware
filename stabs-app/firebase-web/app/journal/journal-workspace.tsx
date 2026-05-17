import Link from "next/link";

export function JournalWorkspace() {
  return (
    <section className="panel module-panel">
      <div className="message-section-header">
        <div>
          <p className="eyebrow">Sekundaermodul</p>
          <h2>Journalischer Anschluss</h2>
          <p className="lead">
            Das Journal bleibt in Sprint 1 bewusst schlank. Es bildet den
            Anschluss fuer Uebernahme, Nachweis und spaetere Verdichtung aus der
            Nachrichtenarbeit.
          </p>
        </div>
        <Link className="ghost-button" href="/messages">
          Zum Nachrichtenworkflow
        </Link>
      </div>

      <div className="overview-grid">
        <article className="status-card">
          <h3>Aktueller Fokus</h3>
          <ul className="milestones compact">
            <li>Journal als sichtbar integrierter Nebenpfad</li>
            <li>gleicher Arbeitsrahmen wie auf `/` und `/messages`</li>
            <li>klarer Einstieg fuer neue Nutzer statt leerer Modulanker</li>
          </ul>
        </article>

        <article className="status-card">
          <h3>Geplanter Arbeitsweg</h3>
          <ol className="onboarding-steps">
            <li>Nachricht im Modul `Nachrichten` sichten und bewerten.</li>
            <li>Rueckmeldung oder Abschluss dort dokumentieren.</li>
            <li>Danach relevante Punkte hier als Journalpfad uebernehmen.</li>
          </ol>
        </article>
      </div>
    </section>
  );
}
