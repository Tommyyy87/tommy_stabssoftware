import crypto from "node:crypto";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { getSeededMessagesForIncidents, resolveUserDisplayName } from "../../shared/demo-store";
import {
  CreateMessageInput,
  DispatchMessageInput,
  MessageDispatchSummary,
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
    const prisma = this.prisma as any;
    const messageCount = await prisma.message.count();

    if (messageCount > 0) {
      return;
    }

    const seededMessages = getSeededMessagesForIncidents();

    await prisma.message.createMany({
      data: seededMessages.map((seeded) => ({
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
        updatedByUserId: seeded.updatedBy
      })),
      skipDuplicates: true
    });

    await prisma.messageDispatch.createMany({
      data: seededMessages.flatMap((seeded) =>
        seeded.dispatches.map((dispatch) => ({
          id: dispatch.id,
          incidentId: dispatch.incidentId,
          messageId: seeded.id,
          targetRole: dispatch.targetRole,
          dispatchedAt: new Date(dispatch.dispatchedAt),
          dispatchedByUserId: this.resolveSeedUserId(dispatch.dispatchedBy),
          dispatchNote: dispatch.dispatchNote,
          seenAt: dispatch.seenAt ? new Date(dispatch.seenAt) : null,
          acknowledgedAt: dispatch.acknowledgedAt
            ? new Date(dispatch.acknowledgedAt)
            : null,
          acknowledgedByUserId: dispatch.acknowledgedBy
            ? this.resolveSeedUserId(dispatch.acknowledgedBy)
            : null,
          processingStatus: dispatch.processingStatus
        }))
      ),
      skipDuplicates: true
    });

    await prisma.messageAuditEntry.createMany({
      data: seededMessages.map((seeded) => ({
        id: `message-audit-seed-${seeded.id}`,
        incidentId: seeded.incidentId,
        messageId: seeded.id,
        actorUserId: seeded.createdBy,
        action: "created",
        summary: "Nachricht erfasst.",
        changes: [
          { field: "subject", from: null, to: seeded.subject },
          { field: "status", from: null, to: seeded.status },
          { field: "assignee", from: null, to: seeded.assignee }
        ]
      })),
      skipDuplicates: true
    });
  }

  async listByIncident(incidentId: string): Promise<MessageSummary[]> {
    const prisma = this.prisma as any;
    const messages = await prisma.message.findMany({
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
        },
        dispatches: {
          include: {
            dispatchedBy: {
              select: {
                displayName: true
              }
            },
            acknowledgedBy: {
              select: {
                displayName: true
              }
            }
          },
          orderBy: [{ dispatchedAt: "desc" }, { id: "desc" }]
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
    const prisma = this.prisma as any;
    const message = await prisma.message.findFirst({
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

    const entries = await prisma.messageAuditEntry.findMany({
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
    const prisma = this.prisma as any;
    const message = await prisma.message.create({
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
        },
        dispatches: {
          include: {
            dispatchedBy: {
              select: {
                displayName: true
              }
            },
            acknowledgedBy: {
              select: {
                displayName: true
              }
            }
          },
          orderBy: [{ dispatchedAt: "desc" }, { id: "desc" }]
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
    const prisma = this.prisma as any;
    const existing = await prisma.message.findFirst({
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
        },
        dispatches: {
          include: {
            dispatchedBy: {
              select: {
                displayName: true
              }
            },
            acknowledgedBy: {
              select: {
                displayName: true
              }
            }
          },
          orderBy: [{ dispatchedAt: "desc" }, { id: "desc" }]
        }
      }
    });

    if (!existing) {
      return null;
    }

    const changes = this.buildChanges(existing, input);
    const now = new Date();

    const updated = await prisma.message.update({
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
        },
        dispatches: {
          include: {
            dispatchedBy: {
              select: {
                displayName: true
              }
            },
            acknowledgedBy: {
              select: {
                displayName: true
              }
            }
          },
          orderBy: [{ dispatchedAt: "desc" }, { id: "desc" }]
        }
      }
    });

    return this.toMessageSummary(updated);
  }

  async dispatch(
    incidentId: string,
    messageId: string,
    input: DispatchMessageInput,
    dispatchedByUserId: string
  ): Promise<MessageSummary | null> {
    const prisma = this.prisma as any;
    const existing = await prisma.message.findFirst({
      where: {
        id: messageId,
        incidentId
      },
      include: {
        dispatches: true
      }
    });

    if (!existing) {
      return null;
    }

    await prisma.$transaction(async (tx: any) => {
      for (const targetRole of input.targetRoles) {
        const knownDispatch = existing.dispatches.find(
          (entry: any) => entry.targetRole === targetRole
        );

        if (knownDispatch) {
          await tx.messageDispatch.update({
            where: {
              id: knownDispatch.id
            },
            data: {
              dispatchedAt: new Date(),
              dispatchedByUserId,
              dispatchNote: input.note ?? "",
              seenAt: null,
              acknowledgedAt: null,
              acknowledgedByUserId: null,
              processingStatus: "neu"
            }
          });
          continue;
        }

        await tx.messageDispatch.create({
          data: {
            id: `dispatch-${crypto.randomUUID()}`,
            incidentId,
            messageId,
            targetRole,
            dispatchedByUserId,
            dispatchNote: input.note ?? "",
            processingStatus: "neu"
          }
        });
      }

      await tx.message.update({
        where: {
          id: messageId
        },
        data: {
          status: "weitergeleitet",
          distribution: input.targetRoles.join(", "),
          updatedAt: new Date(),
          updatedByUserId: dispatchedByUserId,
          auditEntries: {
            create: {
              id: `message-audit-${crypto.randomUUID()}`,
              incidentId,
              actorUserId: dispatchedByUserId,
              action: "updated",
              summary: `Nachricht verteilt an ${input.targetRoles.join(", ")}.`,
              changes: [
                { field: "distribution", from: existing.distribution, to: input.targetRoles.join(", ") },
                { field: "status", from: existing.status, to: "weitergeleitet" }
              ]
            }
          }
        }
      });
    });

    return this.readMessageSummary(incidentId, messageId);
  }

  async acknowledgeDispatch(
    incidentId: string,
    messageId: string,
    dispatchId: string,
    acknowledgedByUserId: string
  ): Promise<MessageSummary | null> {
    const prisma = this.prisma as any;
    const dispatch = await prisma.messageDispatch.findFirst({
      where: {
        id: dispatchId,
        incidentId,
        messageId
      }
    });

    if (!dispatch) {
      return null;
    }

    await prisma.$transaction(async (tx: any) => {
      await tx.messageDispatch.update({
        where: {
          id: dispatchId
        },
        data: {
          seenAt: dispatch.seenAt ?? new Date(),
          acknowledgedAt: new Date(),
          acknowledgedByUserId,
          processingStatus: "quittiert"
        }
      });

      await tx.message.update({
        where: {
          id: messageId
        },
        data: {
          updatedAt: new Date(),
          updatedByUserId: acknowledgedByUserId,
          auditEntries: {
            create: {
              id: `message-audit-${crypto.randomUUID()}`,
              incidentId,
              actorUserId: acknowledgedByUserId,
              action: "updated",
              summary: `${dispatch.targetRole.toUpperCase()} hat den Eingang quittiert.`,
              changes: [{ field: "notes", from: null, to: `${dispatch.targetRole} quittiert` }]
            }
          }
        }
      });
    });

    return this.readMessageSummary(incidentId, messageId);
  }

  private toMessageSummary(message: any): MessageSummary {
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
      updatedBy: message.updatedBy.displayName,
      dispatches: message.dispatches.map((dispatch: any) =>
        this.toDispatchSummary(dispatch)
      )
    };
  }

  private toDispatchSummary(dispatch: any): MessageDispatchSummary {
    return {
      id: dispatch.id,
      incidentId: dispatch.incidentId,
      messageId: dispatch.messageId,
      targetRole: dispatch.targetRole as MessageDispatchSummary["targetRole"],
      dispatchedAt: dispatch.dispatchedAt.toISOString(),
      dispatchedBy: dispatch.dispatchedBy.displayName,
      dispatchNote: dispatch.dispatchNote,
      seenAt: dispatch.seenAt?.toISOString() ?? null,
      acknowledgedAt: dispatch.acknowledgedAt?.toISOString() ?? null,
      acknowledgedBy: dispatch.acknowledgedBy?.displayName ?? null,
      processingStatus:
        dispatch.processingStatus as MessageDispatchSummary["processingStatus"]
    };
  }

  private async readMessageSummary(incidentId: string, messageId: string) {
    const prisma = this.prisma as any;
    const message = await prisma.message.findFirst({
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
        },
        dispatches: {
          include: {
            dispatchedBy: {
              select: {
                displayName: true
              }
            },
            acknowledgedBy: {
              select: {
                displayName: true
              }
            }
          },
          orderBy: [{ dispatchedAt: "desc" }, { id: "desc" }]
        }
      }
    });

    return message ? this.toMessageSummary(message) : null;
  }

  private resolveSeedUserId(displayName: string) {
    const knownUsers = [
      "user-admin",
      "user-kgs",
      "user-s1",
      "user-s2",
      "user-s3",
      "user-s4",
      "user-s5",
      "user-s6"
    ];

    return (
      knownUsers.find((userId) => resolveUserDisplayName(userId) === displayName) ??
      "user-admin"
    );
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
