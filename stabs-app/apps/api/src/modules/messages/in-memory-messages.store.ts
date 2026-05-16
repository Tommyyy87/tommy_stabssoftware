import { Injectable } from "@nestjs/common";
import {
  createMessage,
  getMessageHistory,
  listMessagesByIncident,
  resolveUserDisplayName,
  updateMessage
} from "../../shared/demo-store";
import {
  CreateMessageInput,
  MessageHistoryEntry,
  MessageStore,
  MessageSummary,
  UpdateMessageInput
} from "./messages.store";

@Injectable()
export class InMemoryMessagesStore implements MessageStore {
  async listByIncident(incidentId: string): Promise<MessageSummary[]> {
    return listMessagesByIncident(incidentId).map((message) => ({
      ...message,
      createdBy: resolveUserDisplayName(message.createdBy),
      updatedBy: resolveUserDisplayName(message.updatedBy)
    }));
  }

  async listHistory(
    incidentId: string,
    messageId: string
  ): Promise<MessageHistoryEntry[] | null> {
    const history = getMessageHistory(incidentId, messageId);
    return history ? history.map((entry) => ({ ...entry, changes: [...entry.changes] })) : null;
  }

  async create(
    incidentId: string,
    input: CreateMessageInput,
    createdByUserId: string
  ): Promise<MessageSummary> {
    const message = createMessage(incidentId, input, createdByUserId);

    return {
      ...message,
      createdBy: resolveUserDisplayName(message.createdBy),
      updatedBy: resolveUserDisplayName(message.updatedBy)
    };
  }

  async update(
    incidentId: string,
    messageId: string,
    input: UpdateMessageInput,
    updatedByUserId: string
  ): Promise<MessageSummary | null> {
    const message = updateMessage(incidentId, messageId, input, updatedByUserId);

    if (!message) {
      return null;
    }

    return {
      ...message,
      createdBy: resolveUserDisplayName(message.createdBy),
      updatedBy: resolveUserDisplayName(message.updatedBy)
    };
  }
}
