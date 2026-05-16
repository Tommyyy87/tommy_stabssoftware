import { IncidentHistoryEntry } from "../modules/incidents/incidents.store";
import {
  CreateMessageInput,
  MessageHistoryEntry,
  MessageSummary,
  UpdateMessageInput
} from "../modules/messages/messages.store";

type StoredIncident = {
  id: string;
  title: string;
  referenceNumber: string;
  status: "draft" | "active" | "closed" | "archived";
  createdAt: string;
  createdBy: string;
};

type CreateIncidentInput = {
  title: string;
  referenceNumber: string;
};

type UpdateIncidentInput = {
  title?: string;
  referenceNumber?: string;
  status?: "draft" | "active" | "closed" | "archived";
};

const now = new Date().toISOString();

const displayNames = new Map<string, string>([
  ["user-admin", "System Admin"],
  ["user-s2", "S2 Lage"]
]);

const seededIncidents: StoredIncident[] = [
  {
    id: "incident-001",
    title: "Pilotlage Waldbrand",
    referenceNumber: "WB-2026-001",
    status: "active",
    createdAt: now,
    createdBy: "user-admin"
  }
];

const incidents: StoredIncident[] = seededIncidents.map((incident) => ({ ...incident }));

const incidentHistory = new Map<string, IncidentHistoryEntry[]>(
  seededIncidents.map((incident) => [
    incident.id,
    [
      {
        id: `audit-seed-${incident.id}`,
        incidentId: incident.id,
        action: "created",
        summary: "Lage angelegt.",
        createdAt: incident.createdAt,
        actor: resolveUserDisplayName(incident.createdBy),
        changes: [
          { field: "title", from: null, to: incident.title },
          { field: "referenceNumber", from: null, to: incident.referenceNumber },
          { field: "status", from: null, to: incident.status }
        ]
      }
    ]
  ])
);

type StoredMessage = Omit<MessageSummary, "createdBy" | "updatedBy"> & {
  createdBy: string;
  updatedBy: string;
};

const seededMessages: StoredMessage[] = [
  {
    id: "message-001",
    incidentId: "incident-001",
    trackingNumber: "E-240516-001",
    direction: "eingang",
    channel: "funk",
    priority: "sofort",
    status: "neu",
    messageTime: now,
    recordedAt: now,
    senderLabel: "Abschnitt Nord",
    recipientLabel: "Stabsraum S2/S3",
    subject: "Evakuierung vorbereiten",
    body: "Winddreher nach Ost. Bitte Evakuierung vorbereiten.",
    assignee: "S3 Einsatz",
    distribution: "S2, S3, S5",
    notes: "Quittierung ausstehend.",
    createdAt: now,
    createdBy: "user-admin",
    updatedAt: now,
    updatedBy: "user-admin"
  }
];

const messages: StoredMessage[] = seededMessages.map((message) => ({ ...message }));

const messageHistory = new Map<string, MessageHistoryEntry[]>(
  seededMessages.map((message) => [
    message.id,
    [
      {
        id: `message-audit-seed-${message.id}`,
        messageId: message.id,
        incidentId: message.incidentId,
        action: "created",
        summary: "Nachricht erfasst.",
        createdAt: message.createdAt,
        actor: resolveUserDisplayName(message.createdBy),
        changes: [
          { field: "subject", from: null, to: message.subject },
          { field: "status", from: null, to: message.status },
          { field: "assignee", from: null, to: message.assignee }
        ]
      }
    ]
  ])
);

export function resolveUserDisplayName(userId: string) {
  return displayNames.get(userId) ?? userId;
}

export function getSeededIncidents() {
  return seededIncidents.map((incident) => ({ ...incident }));
}

export function getSeededMessagesForIncidents() {
  return seededMessages.map((message) => ({ ...message }));
}

export function listIncidents() {
  return incidents;
}

export function listMessagesByIncident(incidentId: string) {
  return messages
    .filter((message) => message.incidentId === incidentId)
    .sort((left, right) => right.messageTime.localeCompare(left.messageTime));
}

export function getIncidentHistory(incidentId: string) {
  const history = incidentHistory.get(incidentId);
  return history ? history.map((entry) => ({ ...entry, changes: [...entry.changes] })) : null;
}

export function getMessageHistory(incidentId: string, messageId: string) {
  const message = messages.find(
    (entry) => entry.id === messageId && entry.incidentId === incidentId
  );

  if (!message) {
    return null;
  }

  const history = messageHistory.get(messageId);
  return history ? history.map((entry) => ({ ...entry, changes: [...entry.changes] })) : null;
}

export function createIncident(input: CreateIncidentInput, createdBy: string) {
  const incident: StoredIncident = {
    id: `incident-${String(incidents.length + 1).padStart(3, "0")}`,
    title: input.title.trim(),
    referenceNumber: input.referenceNumber.trim(),
    status: "draft",
    createdAt: new Date().toISOString(),
    createdBy
  };

  incidents.unshift(incident);
  incidentHistory.set(incident.id, [
    {
      id: `audit-${incident.id}-created`,
      incidentId: incident.id,
      action: "created",
      summary: "Lage angelegt.",
      createdAt: incident.createdAt,
      actor: resolveUserDisplayName(createdBy),
      changes: [
        { field: "title", from: null, to: incident.title },
        { field: "referenceNumber", from: null, to: incident.referenceNumber },
        { field: "status", from: null, to: incident.status }
      ]
    }
  ]);

  return incident;
}

export function updateIncident(
  incidentId: string,
  input: UpdateIncidentInput,
  updatedBy: string
) {
  const incident = incidents.find((entry) => entry.id === incidentId);

  if (!incident) {
    return null;
  }

  const changes: IncidentHistoryEntry["changes"] = [];

  if (input.title !== undefined) {
    const nextTitle = input.title.trim();

    if (nextTitle !== incident.title) {
      changes.push({
        field: "title",
        from: incident.title,
        to: nextTitle
      });
    }

    incident.title = nextTitle;
  }

  if (input.referenceNumber !== undefined) {
    const nextReferenceNumber = input.referenceNumber.trim();

    if (nextReferenceNumber !== incident.referenceNumber) {
      changes.push({
        field: "referenceNumber",
        from: incident.referenceNumber,
        to: nextReferenceNumber
      });
    }

    incident.referenceNumber = nextReferenceNumber;
  }

  if (input.status !== undefined) {
    if (input.status !== incident.status) {
      changes.push({
        field: "status",
        from: incident.status,
        to: input.status
      });
    }

    incident.status = input.status;
  }

  if (changes.length > 0) {
    const history = incidentHistory.get(incident.id) ?? [];
    history.unshift({
      id: `audit-${incident.id}-${history.length + 1}`,
      incidentId: incident.id,
      action: "updated",
      summary:
        changes.length === 1 && changes[0]?.field === "status"
          ? `Statuswechsel von ${changes[0].from} zu ${changes[0].to}.`
          : `Lage aktualisiert: ${changes.map((entry) => entry.field).join(", ")}.`,
      createdAt: new Date().toISOString(),
      actor: resolveUserDisplayName(updatedBy),
      changes
    });
    incidentHistory.set(incident.id, history);
  }

  return incident;
}

export function createMessage(
  incidentId: string,
  input: CreateMessageInput,
  createdBy: string
) {
  const createdAt = new Date().toISOString();
  const message: StoredMessage = {
    id: `message-${String(messages.length + 1).padStart(3, "0")}`,
    incidentId,
    trackingNumber: `E-${createdAt.slice(8, 10)}${createdAt.slice(11, 13)}${createdAt.slice(
      14,
      16
    )}-${String(messages.length + 1).padStart(3, "0")}`,
    direction: input.direction,
    channel: input.channel,
    priority: input.priority,
    status: "neu",
    messageTime: input.messageTime,
    recordedAt: createdAt,
    senderLabel: input.senderLabel,
    recipientLabel: input.recipientLabel,
    subject: input.subject,
    body: input.body,
    assignee: input.assignee ?? "Sichtung offen",
    distribution: input.distribution ?? "offen",
    notes: input.notes ?? "",
    createdAt,
    createdBy,
    updatedAt: createdAt,
    updatedBy: createdBy
  };

  messages.unshift(message);
  messageHistory.set(message.id, [
    {
      id: `message-audit-${message.id}-created`,
      messageId: message.id,
      incidentId,
      action: "created",
      summary: "Nachricht erfasst.",
      createdAt,
      actor: resolveUserDisplayName(createdBy),
      changes: [
        { field: "subject", from: null, to: message.subject },
        { field: "status", from: null, to: message.status },
        { field: "assignee", from: null, to: message.assignee }
      ]
    }
  ]);

  return message;
}

export function updateMessage(
  incidentId: string,
  messageId: string,
  input: UpdateMessageInput,
  updatedBy: string
) {
  const message = messages.find(
    (entry) => entry.id === messageId && entry.incidentId === incidentId
  );

  if (!message) {
    return null;
  }

  const changes: MessageHistoryEntry["changes"] = [];

  function pushChange(
    field: MessageHistoryEntry["changes"][number]["field"],
    from: string,
    to: string
  ) {
    if (from !== to) {
      changes.push({ field, from, to });
    }
  }

  if (input.channel !== undefined) {
    pushChange("channel", message.channel, input.channel);
    message.channel = input.channel;
  }

  if (input.priority !== undefined) {
    pushChange("priority", message.priority, input.priority);
    message.priority = input.priority;
  }

  if (input.status !== undefined) {
    pushChange("status", message.status, input.status);
    message.status = input.status;
  }

  if (input.messageTime !== undefined) {
    pushChange("messageTime", message.messageTime, input.messageTime);
    message.messageTime = input.messageTime;
  }

  if (input.senderLabel !== undefined) {
    pushChange("senderLabel", message.senderLabel, input.senderLabel);
    message.senderLabel = input.senderLabel;
  }

  if (input.recipientLabel !== undefined) {
    pushChange("recipientLabel", message.recipientLabel, input.recipientLabel);
    message.recipientLabel = input.recipientLabel;
  }

  if (input.subject !== undefined) {
    pushChange("subject", message.subject, input.subject);
    message.subject = input.subject;
  }

  if (input.body !== undefined) {
    pushChange("body", message.body, input.body);
    message.body = input.body;
  }

  if (input.assignee !== undefined) {
    pushChange("assignee", message.assignee, input.assignee);
    message.assignee = input.assignee;
  }

  if (input.distribution !== undefined) {
    pushChange("distribution", message.distribution, input.distribution);
    message.distribution = input.distribution;
  }

  if (input.notes !== undefined) {
    pushChange("notes", message.notes, input.notes);
    message.notes = input.notes;
  }

  message.updatedAt = new Date().toISOString();
  message.updatedBy = updatedBy;

  if (changes.length > 0) {
    const history = messageHistory.get(message.id) ?? [];
    history.unshift({
      id: `message-audit-${message.id}-${history.length + 1}`,
      messageId: message.id,
      incidentId,
      action: "updated",
      summary:
        changes.length === 1 && changes[0]?.field === "status"
          ? `Statuswechsel von ${changes[0].from} zu ${changes[0].to}.`
          : changes.length === 1 && changes[0]?.field === "assignee"
            ? `Zuweisung von ${changes[0].from ?? "offen"} zu ${changes[0].to ?? "offen"}.`
            : `Nachricht aktualisiert: ${changes.map((entry) => entry.field).join(", ")}.`,
      createdAt: message.updatedAt,
      actor: resolveUserDisplayName(updatedBy),
      changes
    });
    messageHistory.set(message.id, history);
  }

  return message;
}
