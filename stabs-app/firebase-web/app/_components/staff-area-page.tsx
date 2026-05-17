import Link from "next/link";

type StaffAreaPageProps = {
  code: string;
  title: string;
  description: string;
  currentFocus: string[];
  upcomingTopics: string[];
};

export function StaffAreaPage({
  code,
  title,
  description,
  currentFocus,
  upcomingTopics
}: StaffAreaPageProps) {
  return (
    <main className="shell page-stack">
      <section className="hero page-hero tactical-hero">
        <p className="eyebrow">Fachbereich</p>
        <h1>
          {code} {title}
        </h1>
        <p className="lead">{description}</p>

        <div className="hero-actions">
          <Link className="primary-button" href="/messages">
            Nachrichten oeffnen
          </Link>
          <Link className="ghost-button" href="/journal">
            Zum Tagebuch
          </Link>
        </div>
      </section>

      <section className="overview-grid">
        <article className="status-card placeholder-card">
          <div className="card-topline">
            <h3>Aktueller Platzhalter</h3>
            <span className="section-chip">In Vorbereitung</span>
          </div>
          <p className="muted-text">
            Dieser Bereich ist fachlich bereits im Fuehrungsraum verankert und
            wird im naechsten Ausbau mit eigener Arbeitslogik befuellt.
          </p>
          <ul className="milestones compact">
            {currentFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="status-card placeholder-card">
          <div className="card-topline">
            <h3>Kuenftige Themen</h3>
            <span className="section-chip">Vormarkiert</span>
          </div>
          <ul className="milestones compact">
            {upcomingTopics.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="status-card placeholder-card">
          <div className="card-topline">
            <h3>Anschluss im Gesamtbild</h3>
            <span className="section-chip">Querschnitt</span>
          </div>
          <p className="muted-text">
            Facharbeit in {code} verbindet sich spaeter direkt mit Lagekontext,
            Nachrichtenfluss und Tagebuchfuehrung. Der Bereich bleibt deshalb
            schon jetzt sichtbar und korrekt benannt.
          </p>
        </article>
      </section>
    </main>
  );
}
