import Link from "next/link";

export const dynamic = "force-dynamic";

export default function JournalPage() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Modulroute</p>
        <h1>Tagebuch</h1>
        <p className="lead">
          Bewusste Tagebuchuebernahme erfolgt in der ersten Ausbaustufe direkt aus
          der Nachrichtenzentrale. Diese Route markiert das Modul und wird in der
          naechsten Stufe zur eigenstaendigen Journal-Arbeitsflaeche ausgebaut.
        </p>
        <div className="hero-actions">
          <Link className="ghost-button" href="/messages">
            Zur Nachrichtenzentrale
          </Link>
        </div>
      </section>
    </main>
  );
}
