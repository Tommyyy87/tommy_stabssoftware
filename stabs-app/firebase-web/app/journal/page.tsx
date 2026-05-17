import { JournalWorkspace } from "./journal-workspace";

export const dynamic = "force-dynamic";

export default function JournalPage() {
  return (
    <main className="shell page-stack">
      <section className="hero page-hero">
        <p className="eyebrow">Sekundaermodul</p>
        <h1>Journal</h1>
        <p className="lead">
          Das Journal ist in Sprint 1 bewusst schlanker, aber voll in den
          gemeinsamen Arbeitsrahmen integriert.
        </p>
      </section>

      <JournalWorkspace />
    </main>
  );
}
