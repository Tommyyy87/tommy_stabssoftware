import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { getSeededMessagesForIncidents, resolveUserDisplayName } from "../../shared/demo-store";
import {
  CreateMessageInput,
  MessageHistoryChange,
  MessageHistoryEntry,
  MessageStore,
  MessageSummary,
  UpdateMessageInput
} from "./messages.store";

@Injectable()
export class PrismaMessagesStore implements MessageStore, OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const messageCount = await this.prisma.message.count();

    if (messageCount > 0) {
      return;
    }

    const seededMessages = getSeededMessagesForIncidents();

    for (const seeded of seededMessages) {
      await this.prisma.message.create({
        data: {
          id: seeded.id,
          incidentId: seeded.incidentId,
          trackingNumber: seeded.trackingNumber,
          direction: seeded.direction,
          channel: seeded.channel,
          priority: seeded.priority,
          status: seeded.status,
          messageTime: new Date(seeded.messageTime),
          recordedAt: new Date(seeded.recordedAt),
          senderLabel: seeded.senderLabel,
          recipientLabel: seeded.recipientLabel,
          subject: seeded.subject,
          body: seeded.body,
          assignee: seeded.assignee,
          distribution: seeded.distribution,
          notes: seeded.notes,
          createdAt: new Date(seeded.createdAt),
          createdByUserId: seeded.createdBy,
          updatedAt: new Date(seeded.updatedAt),
          updatedByUserId: seeded.updatedBy,
          auditEntries: {
            create: {
              id: `message-audit-seed-${seeded.id}`,
              incidentId: seeded.incidentId,
              actorUserId: seeded.createdBy,
              action: "created",
              summary: "Nachricht erfasst.",
              changes: [
                { field: "subject", from: null, to: seeded.subject },
                { field: "status", from: null, to: seeded.status },
                { field: "assignee", from: null, to: seeded.assignee }
              ]
            }
          }
        }
      });
    }
  }

  async listByIncident(incidentId: string): Promise<MessageSummary[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        incidentId
      },
      include: {
        createdBy: {
          select: {
            displayName: true
          }
        },
        updatedBy: {
          select: {
            displayName: true
          }
        }
      },
      orderBy: [{ messageTime: "desc" }, { createdAt: "desc" }, { id: "desc" }]
    });

    return messages.map((message: (typeof messages)[number]) =>
      this.toMessageSummary(message)
    );
  }

  async listHistory(
    incidentId: string,
    messageId: string
  ): Promise<MessageHistoryEntry[] | null> {
    const message = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        incidentId
      },
      select: {
        id: true
      }
    });

    if (!message) {
      return null;
    }

    const entries = await this.prisma.messageAuditEntry.findMany({
      where: {
        incidentId,
        messageId
      },
      include: {
        actorUser: {
          select: {
            displayName: true
          }
        }
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }]
    });

    return entries.map((entry: (typeof entries)[number]) => ({
      id: entry.id,
      messageId: entry.messageId,
      incidentId: entry.incidentId,
      action: entry.action,
      summary: entry.summary,
      createdAt: entry.createdAt.toISOString(),
      actor: entry.actorUser.displayName,
      changes: entry.changes as MessageHistoryChange[]
    }));
  }

  async create(
    incidentId: string,
    input: CreateMessageInput,
    createdByUserId: string
  ): Promise<MessageSummary> {
    const now = new Date();
    const message = await this.prisma.message.create({
      data: {
        id: `message-${crypto.randomUUID()}`,
        incidentId,
        trackingNumber: this.buildTrackingNumber(input.direction, now),
        direction: input.direction,
        channel: input.channel,
        priority: input.priority,
        status: "neu",
        messageTime: new Date(input.messageTime),
        recordedAt: now,
        senderLabel: input.senderLabel,
        recipientLabel: input.recipientLabel,
        subject: input.subject,
        body: input.body,
        assignee: input.assignee ?? "Sichtung offen",
        distribution: input.distribution ?? "offen",
        notes: input.notes ?? "",
        createdAt: now,
        createdByUserId,
        updatedAt: now,
        updatedByUserId: createdByUserId,
        auditEntries: {
          create: {
            id: `message-audit-${crypto.randomUUID()}`,
            incidentId,
            actorUserId: createdByUserId,
            action: "created",
            summary: "Nachricht erfasst.",
            changes: [
              { field: "subject", from: null, to: input.subject },
              { field: "status", from: null, to: "neu" },
              { field: "assignee", from: null, to: input.assignee ?? "Sichtung offen" }
            ]
          }
        }
      },
      include: {
        createdBy: {
          select: {
            displayName: true
          }
        },
        updatedBy: {
          select: {
            displayName: true
          }
        }
      }
    });

    return this.toMessageSummary(message);
  }

  async update(
    incidentId: string,
    messageId: string,
    input: UpdateMessageInput,
    updatedByUserId: string
  ): Promise<MessageSummary | null> {
    const existing = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        incidentId
      },
      include: {
        createdBy: {
          select: {
            displayName: true
          }
        },
        updatedBy: {
          select: {
            displayName: true
          }
        }
      }
    });

    if (!existing) {
      return null;
    }

    const changes = this.buildChanges(existing, input);
    const now = new Date();

    const updated = await this.prisma.message.update({
      where: {
        id: existing.id
      },
      data: {
        channel: input.channel,
        priority: input.priority,
        status: input.status,
        messageTime: input.messageTime ? new Date(input.messageTime) : undefined,
        senderLabel: input.senderLabel,
        recipientLabel: input.recipientLabel,
        subject: input.subject,
        body: input.body,
        assignee: input.assignee,
        distribution: input.distribution,
        notes: input.notes,
        updatedAt: now,
        updatedByUserId,
        auditEntries: {
          create: {
            id: `message-audit-${crypto.randomUUID()}`,
            incidentId,
            actorUserId: updatedByUserId,
            action: "updated",
            summary: this.buildSummary(changes),
            changes
          }
        }
      },
      include: {
        createdBy: {
          select: {
            displayName: true
          }
        },
        updatedBy: {
          select: {
            displayName: true
          }
        }
      }
    });

    return this.toMessageSummary(updated);
  }

  private toMessageSummary(message: {
    id: string;
    incidentId: string;
    trackingNumber: string;
    direction: MessageSummary["direction"];
    channel: MessageSummary["channel"];
    priority: MessageSummary["priority"];
    status: MessageSummary["status"];
    messageTime: Date;
    recordedAt: Date;
    senderLabel: string;
    recipientLabel: string;
    subject: string;
    body: string;
    assignee: string;
    distribution: string;
    notes: string;
    createdAt: Date;
    createdBy: { displayName: string };
    updatedAt: Date;
    updatedBy: { displayName: string };
  }): MessageSummary {
    return {
      id: message.id,
      incidentId: message.incidentId,
      trackingNumber: message.trackingNumber,
      direction: message.direction,
      channel: message.channel,
      priority: message.priority,
      status: message.status,
      messageTime: message.messageTime.toISOString(),
      recordedAt: message.recordedAt.toISOString(),
      senderLabel: message.senderLabel,
      recipientLabel: message.recipientLabel,
      subject: message.subject,
      body: message.body,
      assignee: message.assignee,
      distribution: message.distribution,
      notes: message.notes,
      createdAt: message.createdAt.toISOString(),
      createdBy: message.createdBy.displayName,
      updatedAt: message.updatedAt.toISOString(),
      updatedBy: message.updatedBy.displayName
    };
  }

  private buildTrackingNumber(direction: MessageSummary["direction"], now: Date) {
    const datePart = `${String(now.getUTCDate()).padStart(2, "0")}${String(
      now.getUTCHours()
    ).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}`;
    const prefix = direction === "eingang" ? "E" : "A";
    const suffix = Math.floor(100 + Math.random() * 899);
    return `${prefix}-${datePart}-${suffix}`;
  }

  private buildSummary(changes: MessageHistoryChange[]) {
    if (changes.length === 1 && changes[0]?.field === "status") {
      return `Statuswechsel von ${changes[0].from} zu ${changes[0].to}.`;
    }

    if (changes.length === 1 && changes[0]?.field === "assignee") {
      return `Zuweisung von ${changes[0].from ?? "offen"} zu ${changes[0].to ?? "offen"}.`;
    }

    if (changes.length === 0) {
      return "Nachricht aktualisiert.";
    }

    return `Nachricht aktualisiert: ${changes
      .map((entry) => entry.field)
      .join(", ")}.`;
  }

  private buildChanges(
    existing: {
      channel: MessageSummary["channel"];
      priority: MessageSummary["priority"];
      status: MessageSummary["status"];
      messageTime: Date;
      senderLabel: string;
      recipientLabel: string;
      subject: string;
      body: string;
      assignee: string;
      distribution: string;
      notes: string;
    },
    input: UpdateMessageInput
  ): MessageHistoryChange[] {
    const changes: MessageHistoryChange[] = [];

    const pushChange = (field: MessageHistoryChange["field"], from: string, to: string) => {
      if (from !== to) {
        changes.push({ field, from, to });
      }
    };

    if (input.channel !== undefined) {
      pushChange("channel", existing.channel, input.channel);
    }

    if (input.priority !== undefined) {
      pushChange("priority", existing.priority, input.priority);
    }

    if (input.status !== undefined) {
      pushChange("status", existing.status, input.status);
    }

    if (input.messageTime !== undefined) {
      pushChange("messageTime", existing.messageTime.toISOString(), input.messageTime);
    }

    if (input.senderLabel !== undefined) {
      pushChange("senderLabel", existing.senderLabel, input.senderLabel);
    }

    if (input.recipientLabel !== undefined) {
      pushChange("recipientLabel", existing.recipientLabel, input.recipientLabel);
    }

    if (input.subject !== undefined) {
      pushChange("subject", existing.subject, input.subject);
    }

    if (input.body !== undefined) {
      pushChange("body", existing.body, input.body);
    }

    if (input.assignee !== undefined) {
      pushChange("assignee", existing.assignee, input.assignee);
    }

    if (input.distribution !== undefined) {
      pushChange("distribution", existing.distribution, input.distribution);
    }

    if (input.notes !== undefined) {
      pushChange("notes", existing.notes, input.notes);
    }

    return changes;
  }
}
