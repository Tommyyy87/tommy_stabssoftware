import { StaffAreaPage } from "../_components/staff-area-page";

export default function S3Page() {
  return (
    <StaffAreaPage
      code="S3"
      title="Einsatz"
      description="Fachbereich fuer operative Massnahmen, Auftragslage, Priorisierung und die fuehrungsseitige Steuerung des Einsatzes."
      currentFocus={[
        "Massnahmen und Auftraege strukturiert vorbereiten",
        "Operative Prioritaeten transparent halten",
        "Rueckmeldungen aus dem Einsatz anschlussfaehig machen"
      ]}
      upcomingTopics={[
        "Massnahmenboard und Auftragsstatus",
        "Prioritaeten und kritische Engpaesse",
        "Rueckmeldungen aus Abschnitten und Einheiten",
        "Uebergabe ans Tagebuch"
      ]}
    />
  );
}
