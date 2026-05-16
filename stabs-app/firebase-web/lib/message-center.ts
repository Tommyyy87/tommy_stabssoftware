export type MessageDirection = "eingang" | "ausgang";

export type MessagePriority = "niedrig" | "normal" | "hoch" | "sofort";

export type MessageStatus =
  | "neu"
  | "gesichtet"
  | "in_bearbeitung"
  | "weitergeleitet"
  | "erledigt";

export type MessageChannel = "funk" | "telefon" | "email" | "melder" | "lagekontakt";

export type MessageTimelineEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  note: string;
};

export type MessageLink = {
  label: string;
  kind: "lage" | "tagebuch" | "auftrag";
  value: string;
};

export type MessageRecord = {
  id: string;
  incidentLabel: string;
  trackingNumber: string;
  direction: MessageDirection;
  channel: MessageChannel;
  priority: MessagePriority;
  status: MessageStatus;
  messageTime: string;
  recordedAt: string;
  senderLabel: string;
  recipientLabel: string;
  subject: string;
  body: string;
  assignee: string;
  distribution: string;
  notes: string;
  timeline: MessageTimelineEntry[];
  links: MessageLink[];
};

export type MessageFilters = {
  query: string;
  status: MessageStatus | "alle";
  priority: MessagePriority | "alle";
  direction: MessageDirection | "alle";
};

export const messageStatuses: Array<MessageStatus | "alle"> = [
  "alle",
  "neu",
  "gesichtet",
  "in_bearbeitung",
  "weitergeleitet",
  "erledigt"
];

export const messagePriorities: Array<MessagePriority | "alle"> = [
  "alle",
  "sofort",
  "hoch",
  "normal",
  "niedrig"
];

export const messageDirections: Array<MessageDirection | "alle"> = [
  "alle",
  "eingang",
  "ausgang"
];

export const demoMessages: MessageRecord[] = [
  {
    id: "msg-018",
    incidentLabel: "Waldbrand Gummersbach",
    trackingNumber: "E-240516-018",
    direction: "eingang",
    channel: "funk",
    priority: "sofort",
    status: "neu",
    messageTime: "2026-05-16T11:45:00.000Z",
    recordedAt: "2026-05-16T11:47:00.000Z",
    senderLabel: "Abschnitt Nord",
    recipientLabel: "Stabsraum S2/S3",
    subject: "Evakuierung Campingplatz vorbereiten",
    body:
      "Winddreher nach Ost. Funkenflug in Richtung Campingplatz. Bitte Evakuierung vorbereiten und Buskapazitaet pruefen.",
    assignee: "S3 Einsatz",
    distribution: "S2, S3, S5",
    notes: "Quittierung ausstehend. Lagekarte aktualisieren.",
    timeline: [
      {
        id: "msg-018-t1",
        at: "2026-05-16T11:47:00.000Z",
        actor: "KGS Funkstelle",
        action: "Aufgenommen",
        note: "Per Funk aufgenommen und als Vorrang sofort markiert."
      },
      {
        id: "msg-018-t2",
        at: "2026-05-16T11:48:00.000Z",
        actor: "Sichter S2",
        action: "Vorgeprueft",
        note: "Relevanz fuer Lagekarte und Abschnitt Nord bestaetigt."
      }
    ],
    links: [
      { kind: "lage", label: "Lagekarte", value: "Gefahrenkante Nordost" },
      { kind: "tagebuch", label: "Tagebuch", value: "Eintrag 241" }
    ]
  },
  {
    id: "msg-017",
    incidentLabel: "Waldbrand Gummersbach",
    trackingNumber: "A-240516-017",
    direction: "ausgang",
    channel: "telefon",
    priority: "hoch",
    status: "weitergeleitet",
    messageTime: "2026-05-16T11:32:00.000Z",
    recordedAt: "2026-05-16T11:34:00.000Z",
    senderLabel: "Stabsleitung",
    recipientLabel: "Leitstelle Oberberg",
    subject: "Busse fuer Vorsorgeevakuierung anfordern",
    body:
      "Anforderung von drei Reisebussen fuer vorsorgliche Evakuierung des Campingplatzbereichs binnen 45 Minuten.",
    assignee: "KGS Nachrichtenzentrale",
    distribution: "S3, S4",
    notes: "Rueckmeldung der Leitstelle bis 12:00 angefordert.",
    timeline: [
      {
        id: "msg-017-t1",
        at: "2026-05-16T11:34:00.000Z",
        actor: "Stabsleitung",
        action: "Freigegeben",
        note: "Ausgang nach Ruecksprache mit S3 formuliert."
      },
      {
        id: "msg-017-t2",
        at: "2026-05-16T11:37:00.000Z",
        actor: "KGS Nachrichtenzentrale",
        action: "Weitergeleitet",
        note: "Telefonisch uebermittelt, Name Gegenstelle dokumentiert."
      }
    ],
    links: [{ kind: "auftrag", label: "Auftrag", value: "Transportmittel Evakuierung" }]
  },
  {
    id: "msg-016",
    incidentLabel: "Waldbrand Gummersbach",
    trackingNumber: "E-240516-016",
    direction: "eingang",
    channel: "email",
    priority: "normal",
    status: "gesichtet",
    messageTime: "2026-05-16T10:58:00.000Z",
    recordedAt: "2026-05-16T11:02:00.000Z",
    senderLabel: "Stadtwerke",
    recipientLabel: "Stabsraum",
    subject: "Wasserdruck im Industriegebiet stabil",
    body:
      "Hydrantennetz aktuell stabil. Zusatzversorgung ueber Hochbehaelter bis auf Weiteres gesichert.",
    assignee: "S4 Versorgung",
    distribution: "S2, S4",
    notes: "Nur beobachten, keine Sofortmassnahme.",
    timeline: [
      {
        id: "msg-016-t1",
        at: "2026-05-16T11:02:00.000Z",
        actor: "KGS Poststelle",
        action: "Erfasst",
        note: "Eingang per E-Mail mit Anlagenverweis."
      },
      {
        id: "msg-016-t2",
        at: "2026-05-16T11:06:00.000Z",
        actor: "S4 Versorgung",
        action: "Gesichtet",
        note: "Fuer Versorgungslage vorgemerkt."
      }
    ],
    links: [{ kind: "lage", label: "Versorgungslage", value: "Wasser Nordost" }]
  },
  {
    id: "msg-015",
    incidentLabel: "Waldbrand Gummersbach",
    trackingNumber: "E-240516-015",
    direction: "eingang",
    channel: "telefon",
    priority: "hoch",
    status: "in_bearbeitung",
    messageTime: "2026-05-16T10:42:00.000Z",
    recordedAt: "2026-05-16T10:44:00.000Z",
    senderLabel: "Polizei Einsatzleitung",
    recipientLabel: "Stabsleitung",
    subject: "Sperrung L323 bis auf Weiteres",
    body:
      "Zufahrt L323 wegen Rauchentwicklung komplett gesperrt. Umleitung ueber Westtrasse eingerichtet.",
    assignee: "S2 Lage",
    distribution: "S2, S3, S5",
    notes: "Pressebaustein und Kartenanpassung erforderlich.",
    timeline: [
      {
        id: "msg-015-t1",
        at: "2026-05-16T10:44:00.000Z",
        actor: "KGS Funkstelle",
        action: "Erfasst",
        note: "Telefonischer Eingang in Nachweisung uebernommen."
      },
      {
        id: "msg-015-t2",
        at: "2026-05-16T10:49:00.000Z",
        actor: "S2 Lage",
        action: "In Bearbeitung",
        note: "Abgleich mit Lagekarte und Verkehrsraum gestartet."
      }
    ],
    links: [
      { kind: "lage", label: "Verkehrslage", value: "L323 Sperrung" },
      { kind: "tagebuch", label: "Tagebuch", value: "Eintrag 236" }
    ]
  }
];

export function sortMessages(messages: MessageRecord[]) {
  return [...messages].sort((left, right) =>
    right.messageTime.localeCompare(left.messageTime)
  );
}

export function filterMessages(messages: MessageRecord[], filters: MessageFilters) {
  const needle = filters.query.trim().toLowerCase();

  return sortMessages(messages).filter((message) => {
    const matchesStatus =
      filters.status === "alle" || message.status === filters.status;
    const matchesPriority =
      filters.priority === "alle" || message.priority === filters.priority;
    const matchesDirection =
      filters.direction === "alle" || message.direction === filters.direction;
    const matchesQuery =
      needle.length === 0 ||
      [
        message.subject,
        message.body,
        message.senderLabel,
        message.recipientLabel,
        message.trackingNumber
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);

    return matchesStatus && matchesPriority && matchesDirection && matchesQuery;
  });
}

export function buildStatusSummary(messages: MessageRecord[]) {
  return {
    total: messages.length,
    newCount: messages.filter((message) => message.status === "neu").length,
    urgentCount: messages.filter((message) => message.priority === "sofort").length,
    outgoingCount: messages.filter((message) => message.direction === "ausgang").length
  };
}

export function getMessageStatusLabel(status: MessageStatus | "alle") {
  switch (status) {
    case "in_bearbeitung":
      return "in Bearbeitung";
    default:
      return status;
  }
}

export function getMessagePriorityLabel(priority: MessagePriority | "alle") {
  return priority;
}

export function getMessageDirectionLabel(direction: MessageDirection | "alle") {
  switch (direction) {
    case "eingang":
      return "Eingang";
    case "ausgang":
      return "Ausgang";
    default:
      return direction;
  }
}

export function createLocalMessage(input: {
  subject: string;
  body: string;
  senderLabel: string;
  recipientLabel: string;
  priority: MessagePriority;
  channel: MessageChannel;
}): MessageRecord {
  const now = new Date();
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const trackingNumber = `E-${day}${hours}${minutes}-${Math.floor(
    100 + Math.random() * 899
  )}`;

  return {
    id: `msg-${trackingNumber.toLowerCase()}`,
    incidentLabel: "Waldbrand Gummersbach",
    trackingNumber,
    direction: "eingang",
    channel: input.channel,
    priority: input.priority,
    status: "neu",
    messageTime: now.toISOString(),
    recordedAt: now.toISOString(),
    senderLabel: input.senderLabel,
    recipientLabel: input.recipientLabel,
    subject: input.subject,
    body: input.body,
    assignee: "Sichtung offen",
    distribution: "noch offen",
    notes: "Lokal angelegte Vorschau fuer den ersten Frontend-Stand.",
    timeline: [
      {
        id: `${trackingNumber}-t1`,
        at: now.toISOString(),
        actor: "Frontend-Vorschau",
        action: "Erfasst",
        note: "Noch nicht im Backend gespeichert."
      }
    ],
    links: []
  };
}

export function updateMessageStatus(
  message: MessageRecord,
  status: MessageStatus
): MessageRecord {
  const now = new Date().toISOString();

  return {
    ...message,
    status,
    timeline: [
      {
        id: `${message.id}-${status}-${message.timeline.length + 1}`,
        at: now,
        actor: "Arbeitsflaeche",
        action: "Status aktualisiert",
        note: `Status auf ${status} gesetzt.`
      },
      ...message.timeline
    ]
  };
}

export function assignMessage(
  message: MessageRecord,
  assignee: string
): MessageRecord {
  const now = new Date().toISOString();

  return {
    ...message,
    assignee,
    timeline: [
      {
        id: `${message.id}-assignee-${message.timeline.length + 1}`,
        at: now,
        actor: "Arbeitsflaeche",
        action: "Zugewiesen",
        note: `An ${assignee} uebergeben.`
      },
      ...message.timeline
    ]
  };
}
