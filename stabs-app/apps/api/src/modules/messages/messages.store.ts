export type MessageDirection = "eingang" | "ausgang";

export type MessageChannel =
  | "funk"
  | "telefon"
  | "email"
  | "melder"
  | "lagekontakt";

export type MessagePriority = "niedrig" | "normal" | "hoch" | "sofort";

export type MessageStatus =
  | "neu"
  | "gesichtet"
  | "in_bearbeitung"
  | "weitergeleitet"
  | "erledigt";

export type MessageSummary = {
  id: string;
  incidentId: string;
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
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

export type MessageHistoryChange = {
  field:
    | "subject"
    | "body"
    | "status"
    | "assignee"
    | "distribution"
    | "notes"
    | "priority"
    | "channel"
    | "senderLabel"
    | "recipientLabel"
    | "messageTime";
  from: string | null;
  to: string | null;
};

export type MessageHistoryEntry = {
  id: string;
  messageId: string;
  incidentId: string;
  action: "created" | "updated";
  summary: string;
  createdAt: string;
  actor: string;
  changes: MessageHistoryChange[];
};

export type CreateMessageInput = {
  direction: MessageDirection;
  channel: MessageChannel;
  priority: MessagePriority;
  messageTime: string;
  senderLabel: string;
  recipientLabel: string;
  subject: string;
  body: string;
  assignee?: string;
  distribution?: string;
  notes?: string;
};

export type UpdateMessageInput = {
  channel?: MessageChannel;
  priority?: MessagePriority;
  status?: MessageStatus;
  messageTime?: string;
  senderLabel?: string;
  recipientLabel?: string;
  subject?: string;
  body?: string;
  assignee?: string;
  distribution?: string;
  notes?: string;
};

export interface MessageStore {
  listByIncident(incidentId: string): Promise<MessageSummary[]>;
  listHistory(incidentId: string, messageId: string): Promise<MessageHistoryEntry[] | null>;
  create(
    incidentId: string,
    input: CreateMessageInput,
    createdByUserId: string
  ): Promise<MessageSummary>;
  update(
    incidentId: string,
    messageId: string,
    input: UpdateMessageInput,
    updatedByUserId: string
  ): Promise<MessageSummary | null>;
}

export const MESSAGE_STORE = "MESSAGE_STORE";
