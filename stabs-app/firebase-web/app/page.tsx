import Link from "next/link";
import { OperationsConsole } from "./operations-console";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const staffAreas = [
    "S1 Personal / Inneres",
    "S2 Lage",
    "S3 Einsatz",
    "S4 Versorgung",
    "S5 Presse / Oeffentlichkeit",
    "S6 Information / Kommunikation"
  ];

  return (
    <main className="shell page-stack">
      <section className="hero page-hero tactical-hero">
        <p className="eyebrow">Fuehrungsueberblick</p>
        <h1>Moderner Fuehrungsraum fuer die Stabsarbeit</h1>
        <p className="lead">
          Zentrale Uebersicht fuer Lagekontext, Fachbereiche und die
          querschnittliche Arbeit mit Nachrichten und Tagebuch. Die Startseite
          bleibt bewusst Fuehrungsraum und verteilt danach in die S-Funktionen.
        </p>

        <div className="hero-actions">
          <Link className="primary-button" href="/messages">
            Nachrichten oeffnen
          </Link>
          <Link className="ghost-button" href="/journal">
            Tagebuch oeffnen
          </Link>
        </div>
      </section>

      <section className="overview-grid">
        <article className="status-card command-card">
          <div className="card-topline">
            <h3>Fuehrungslogik</h3>
            <span className="section-chip">Arbeitsrahmen</span>
          </div>
          <p className="muted-text">
            Die Oberflaeche trennt bewusst zwischen Fuehrungsueberblick,
            Facharbeit der S-Bereiche und den querschnittlichen Werkzeugen fuer
            Informationsfluss und Nachweis.
          </p>
          <ol className="onboarding-steps">
            <li>Aktive Lage setzen und Fuehrungskontext herstellen.</li>
            <li>Fachbereich oder Querschnittsmodul gezielt ansteuern.</li>
            <li>Nachrichten, Beschluesse und Nachweise anschlussfaehig halten.</li>
          </ol>
        </article>

        <article className="status-card command-card">
          <div className="card-topline">
            <h3>Fachbereiche</h3>
            <span className="section-chip">S1 bis S6</span>
          </div>
          <ul className="milestones compact">
            {staffAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </article>

        <article className="status-card command-card">
          <div className="card-topline">
            <h3>Querschnittsmodule</h3>
            <span className="section-chip">Heute nutzbar</span>
          </div>
          <ul className="milestones compact">
            <li>`Nachrichten` fuer Eingang, Bewertung und Weitergabe</li>
            <li>`Tagebuch` fuer Uebernahme, Nachweis und spaetere Verdichtung</li>
            <li>Weitere Fachthemen werden sichtbar vorgemerkt aufgebaut</li>
          </ul>
        </article>
      </section>

      <OperationsConsole />
    </main>
  );
}
