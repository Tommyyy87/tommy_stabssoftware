import { StaffAreaPage } from "../_components/staff-area-page";

export default function S1Page() {
  return (
    <StaffAreaPage
      code="S1"
      title="Personal / Inneres"
      description="Fachbereich fuer Personalansatz, innere Organisation, Schichtfaehigkeit und administrative Stabsunterstuetzung."
      currentFocus={[
        "Personallage und Besetzungsluecken sichtbar machen",
        "Schichten, Erreichbarkeiten und Ablosen vorbereiten",
        "Administrative Innenlage geordnet halten"
      ]}
      upcomingTopics={[
        "Dienst- und Schichtuebersicht",
        "Kontakt- und Rufbereitschaftsverzeichnis",
        "Personalbedarf und Nachfuehrung",
        "Interne Aufgaben- und Beschlusslisten"
      ]}
    />
  );
}
