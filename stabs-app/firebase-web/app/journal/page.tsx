import { JournalWorkspace } from "./journal-workspace";

export const dynamic = "force-dynamic";

export default function JournalPage() {
  return (
    <main className="shell page-stack">
      <section className="hero page-hero tactical-hero">
        <p className="eyebrow">Querschnittsmodul</p>
        <h1>Tagebuch</h1>
        <p className="lead">
          Das Tagebuch bildet den geordneten Nachweisraum fuer relevante
          Entwicklungen, Uebernahmen und spaetere Verdichtung aus der
          Stabsarbeit.
        </p>
      </section>

      <JournalWorkspace />
    </main>
  );
}
