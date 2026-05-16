import { JournalEntrySummary } from "../modules/journal/journal.store";
import { IncidentHistoryEntry } from "../modules/incidents/incidents.store";
import {
  CreateMessageInput,
  DispatchMessageInput,
  MessageDispatchSummary,
  MessageHistoryEntry,
  MessageSummary,
  UpdateMessageInput
} from "../modules/messages/messages.store";
import { AppRole } from "./auth-config";

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
  ["user-kgs", "KGS Nachrichtenzentrale"],
  ["user-s1", "S1 Personal"],
  ["user-s2", "S2 Lage"],
  ["user-s3", "S3 Einsatz"],
  ["user-s4", "S4 Versorgung"],
  ["user-s5", "S5 Oeffentlichkeitsarbeit"],
  ["user-s6", "S6 Kommunikation"]
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

type StoredDispatch = Omit<
  MessageDispatchSummary,
  "dispatchedBy" | "acknowledgedBy"
> & {
  dispatchedBy: string;
  acknowledgedBy: string | null;
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
    updatedBy: "user-admin",
    dispatches: []
  }
];

const messages: StoredMessage[] = seededMessages.map((message) => ({ ...message }));
const messageDispatches = new Map<string, StoredDispatch[]>();
const journalEntries: JournalEntrySummary[] = [];

const seededDispatches: StoredDispatch[] = [
  {
    id: "dispatch-001",
    incidentId: "incident-001",
    messageId: "message-001",
    targetRole: "kgs",
    dispatchedAt: now,
    dispatchedBy: "user-admin",
    dispatchNote: "Bitte sichten und weitergeben.",
    seenAt: now,
    acknowledgedAt: now,
    acknowledgedBy: "user-kgs",
    processingStatus: "quittiert"
  },
  {
    id: "dispatch-002",
    incidentId: "incident-001",
    messageId: "message-001",
    targetRole: "s2",
    dispatchedAt: now,
    dispatchedBy: "user-admin",
    dispatchNote: "Lagebewertung erforderlich.",
    seenAt: null,
    acknowledgedAt: null,
    acknowledgedBy: null,
    processingStatus: "neu"
  },
  {
    id: "dispatch-003",
    incidentId: "incident-001",
    messageId: "message-001",
    targetRole: "s4",
    dispatchedAt: now,
    dispatchedBy: "user-admin",
    dispatchNote: "Versorgungsauswirkungen pruefen.",
    seenAt: null,
    acknowledgedAt: null,
    acknowledgedBy: null,
    processingStatus: "neu"
  }
];

for (const dispatch of seededDispatches) {
  const current = messageDispatches.get(dispatch.messageId) ?? [];
  current.push(dispatch);
  messageDispatches.set(dispatch.messageId, current);
}

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
  return seededMessages.map((message) => ({
    ...message,
    dispatches: (messageDispatches.get(message.id) ?? []).map((dispatch) => ({ ...dispatch }))
  }));
}

export function listIncidents() {
  return incidents;
}

export function listMessagesByIncident(incidentId: string) {
  return messages
    .filter((message) => message.incidentId === incidentId)
    .sort((left, right) => right.messageTime.localeCompare(left.messageTime))
    .map((message) => ({
      ...message,
      dispatches: mapDispatchesForMessage(message.id)
    }));
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
    updatedBy: createdBy,
    dispatches: []
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

  return {
    ...message,
    dispatches: mapDispatchesForMessage(message.id)
  };
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

  return {
    ...message,
    dispatches: mapDispatchesForMessage(message.id)
  };
}

export function dispatchMessage(
  incidentId: string,
  messageId: string,
  input: DispatchMessageInput,
  dispatchedBy: string
) {
  const message = messages.find(
    (entry) => entry.id === messageId && entry.incidentId === incidentId
  );

  if (!message) {
    return null;
  }

  const current = messageDispatches.get(messageId) ?? [];
  const nowTimestamp = new Date().toISOString();

  for (const targetRole of input.targetRoles) {
    const existing = current.find((dispatch) => dispatch.targetRole === targetRole);

    if (existing) {
      existing.dispatchNote = input.note?.trim() || existing.dispatchNote;
      existing.dispatchedAt = nowTimestamp;
      existing.dispatchedBy = dispatchedBy;
      existing.processingStatus = existing.acknowledgedAt ? "quittiert" : "neu";
      existing.seenAt = null;
      existing.acknowledgedAt = null;
      existing.acknowledgedBy = null;
      continue;
    }

    current.push({
      id: `dispatch-${String(current.length + 1).padStart(3, "0")}-${messageId}`,
      incidentId,
      messageId,
      targetRole,
      dispatchedAt: nowTimestamp,
      dispatchedBy,
      dispatchNote: input.note?.trim() || "",
      seenAt: null,
      acknowledgedAt: null,
      acknowledgedBy: null,
      processingStatus: "neu"
    });
  }

  messageDispatches.set(messageId, current);
  message.updatedAt = nowTimestamp;
  message.updatedBy = dispatchedBy;
  message.status = "weitergeleitet";
  message.distribution = input.targetRoles.map(toRoleLabel).join(", ");

  const history = messageHistory.get(message.id) ?? [];
  history.unshift({
    id: `message-audit-${message.id}-${history.length + 1}`,
    messageId: message.id,
    incidentId,
    action: "updated",
    summary: `Nachricht verteilt an ${input.targetRoles.map(toRoleLabel).join(", ")}.`,
    createdAt: nowTimestamp,
    actor: resolveUserDisplayName(dispatchedBy),
    changes: [
      {
        field: "distribution",
        from: null,
        to: input.targetRoles.map(toRoleLabel).join(", ")
      },
      {
        field: "status",
        from: "neu",
        to: "weitergeleitet"
      }
    ]
  });
  messageHistory.set(message.id, history);

  return {
    ...message,
    dispatches: mapDispatchesForMessage(message.id)
  };
}

export function acknowledgeMessageDispatch(
  incidentId: string,
  messageId: string,
  dispatchId: string,
  acknowledgedBy: string
) {
  const message = messages.find(
    (entry) => entry.id === messageId && entry.incidentId === incidentId
  );

  if (!message) {
    return null;
  }

  const dispatch = (messageDispatches.get(messageId) ?? []).find(
    (entry) => entry.id === dispatchId
  );

  if (!dispatch) {
    return null;
  }

  const nowTimestamp = new Date().toISOString();
  dispatch.seenAt = dispatch.seenAt ?? nowTimestamp;
  dispatch.acknowledgedAt = nowTimestamp;
  dispatch.acknowledgedBy = acknowledgedBy;
  dispatch.processingStatus = "quittiert";
  message.updatedAt = nowTimestamp;
  message.updatedBy = acknowledgedBy;

  const history = messageHistory.get(message.id) ?? [];
  history.unshift({
    id: `message-audit-${message.id}-${history.length + 1}`,
    messageId: message.id,
    incidentId,
    action: "updated",
    summary: `${toRoleLabel(dispatch.targetRole)} hat den Eingang quittiert.`,
    createdAt: nowTimestamp,
    actor: resolveUserDisplayName(acknowledgedBy),
    changes: [
      {
        field: "notes",
        from: null,
        to: `${toRoleLabel(dispatch.targetRole)} quittiert`
      }
    ]
  });
  messageHistory.set(message.id, history);

  return {
    ...message,
    dispatches: mapDispatchesForMessage(message.id)
  };
}

export function listJournalEntriesByIncident(incidentId: string) {
  return journalEntries
    .filter((entry) => entry.incidentId === incidentId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function createJournalEntry(
  incidentId: string,
  input: { title: string; body: string },
  createdBy: string,
  sourceMessageId: string | null = null
) {
  const entry: JournalEntrySummary = {
    id: `journal-${String(journalEntries.length + 1).padStart(3, "0")}`,
    incidentId,
    title: input.title.trim(),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    createdBy: resolveUserDisplayName(createdBy),
    sourceMessageId
  };

  journalEntries.unshift(entry);
  return entry;
}

function mapDispatchesForMessage(messageId: string): MessageDispatchSummary[] {
  return (messageDispatches.get(messageId) ?? []).map((dispatch) => ({
    ...dispatch,
    dispatchedBy: resolveUserDisplayName(dispatch.dispatchedBy),
    acknowledgedBy: dispatch.acknowledgedBy
      ? resolveUserDisplayName(dispatch.acknowledgedBy)
      : null
  }));
}

function toRoleLabel(role: AppRole) {
  const labels: Record<AppRole, string> = {
    system_admin: "Systemadministrator",
    lageleiter: "Lageleiter",
    stabsleitung: "Stabsleitung",
    kgs: "KGS",
    s1: "S1",
    s2: "S2",
    s3: "S3",
    s4: "S4",
    s5: "S5",
    s6: "S6",
    reader: "Leser"
  };

  return labels[role];
}
