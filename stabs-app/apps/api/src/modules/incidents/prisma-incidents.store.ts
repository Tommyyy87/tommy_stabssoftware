import { ConflictException, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateIncidentInput,
  IncidentHistoryChange,
  IncidentHistoryEntry,
  IncidentStore,
  IncidentSummary,
  UpdateIncidentInput
} from "./incidents.store";
import { getSeededIncidents } from "../../shared/demo-store";
import { getSeededAuthUsers } from "../../shared/auth-config";
import { hashPassword } from "../../shared/passwords";

@Injectable()
export class PrismaIncidentsStore implements IncidentStore, OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    for (const user of getSeededAuthUsers()) {
      await this.prisma.user.upsert({
        where: {
          id: user.id
        },
        update: {
          username: user.username,
          displayName: user.displayName,
          passwordSalt: user.passwordSalt,
          passwordHash: hashPassword(user.password, user.passwordSalt)
        },
        create: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          passwordSalt: user.passwordSalt,
          passwordHash: hashPassword(user.password, user.passwordSalt)
        }
      });
    }

    const incidentCount = await this.prisma.incident.count();

    if (incidentCount > 0) {
      return;
    }

    const seededIncidents = getSeededIncidents().map((incident) => ({
      id: incident.id,
      title: incident.title,
      referenceNumber: incident.referenceNumber,
      status: incident.status,
      createdAt: new Date(incident.createdAt),
      createdByUserId: incident.createdBy
    }));

    if (seededIncidents.length > 0) {
      await this.prisma.incident.createMany({
        data: seededIncidents
      });

      await this.prisma.incidentAuditEntry.createMany({
        data: seededIncidents.map((incident) => ({
          id: `audit-seed-${incident.id}`,
          incidentId: incident.id,
          actorUserId: incident.createdByUserId,
          action: "created",
          summary: "Lage angelegt.",
          changes: [
            { field: "title", from: null, to: incident.title },
            {
              field: "referenceNumber",
              from: null,
              to: incident.referenceNumber
            },
            { field: "status", from: null, to: incident.status }
          ]
        }))
      });
    }
  }

  async list(): Promise<IncidentSummary[]> {
    const incidents = await this.prisma.incident.findMany({
      include: {
        createdBy: {
          select: {
            displayName: true
          }
        }
      },
      orderBy: [
        {
          createdAt: "desc"
        },
        {
          id: "desc"
        }
      ]
    });

    return incidents.map((incident: (typeof incidents)[number]) =>
      this.toIncidentSummary(incident)
    );
  }

  async listHistory(incidentId: string): Promise<IncidentHistoryEntry[] | null> {
    const incident = await this.prisma.incident.findUnique({
      where: {
        id: incidentId
      },
      select: {
        id: true
      }
    });

    if (!incident) {
      return null;
    }

    const entries = await this.prisma.incidentAuditEntry.findMany({
      where: {
        incidentId
      },
      include: {
        actorUser: {
          select: {
            displayName: true
          }
        }
      },
      orderBy: [
        {
          createdAt: "desc"
        },
        {
          id: "desc"
        }
      ]
    });

    return entries.map((entry) => ({
      id: entry.id,
      incidentId: entry.incidentId,
      action: entry.action,
      summary: entry.summary,
      createdAt: entry.createdAt.toISOString(),
      actor: entry.actorUser.displayName,
      changes: entry.changes as IncidentHistoryChange[]
    }));
  }

  async create(
    input: CreateIncidentInput,
    createdByUserId: string
  ): Promise<IncidentSummary> {
    try {
      const incident = await this.prisma.incident.create({
        data: {
          id: `incident-${crypto.randomUUID()}`,
          title: input.title,
          referenceNumber: input.referenceNumber,
          status: "draft",
          createdByUserId,
          auditEntries: {
            create: {
              id: `audit-${crypto.randomUUID()}`,
              actorUserId: createdByUserId,
              action: "created",
              summary: "Lage angelegt.",
              changes: [
                { field: "title", from: null, to: input.title },
                { field: "referenceNumber", from: null, to: input.referenceNumber },
                { field: "status", from: null, to: "draft" }
              ]
            }
          }
        },
        include: {
          createdBy: {
            select: {
              displayName: true
            }
          }
        }
      });

      return this.toIncidentSummary(incident);
    } catch (error) {
      this.throwOnUniqueConstraint(error);
      throw error;
    }
  }

  async update(
    incidentId: string,
    input: UpdateIncidentInput,
    updatedByUserId: string
  ): Promise<IncidentSummary | null> {
    const existingIncident = await this.prisma.incident.findUnique({
      where: {
        id: incidentId
      },
      include: {
        createdBy: {
          select: {
            displayName: true
          }
        }
      }
    });

    if (!existingIncident) {
      return null;
    }

    const changes = this.buildChanges(existingIncident, input);

    try {
      const incident = await this.prisma.incident.update({
        where: {
          id: incidentId
        },
        data: {
          title: input.title,
          referenceNumber: input.referenceNumber,
          status: input.status,
          auditEntries: {
            create: {
              id: `audit-${crypto.randomUUID()}`,
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
          }
        }
      });

      return this.toIncidentSummary(incident);
    } catch (error) {
      this.throwOnUniqueConstraint(error);
      throw error;
    }
  }

  private toIncidentSummary(incident: {
    id: string;
    title: string;
    referenceNumber: string;
    status: IncidentSummary["status"];
    createdAt: Date;
    createdBy: {
      displayName: string;
    };
  }): IncidentSummary {
    return {
      id: incident.id,
      title: incident.title,
      referenceNumber: incident.referenceNumber,
      status: incident.status,
      createdAt: incident.createdAt.toISOString(),
      createdBy: incident.createdBy.displayName
    };
  }

  private buildChanges(
    existingIncident: {
      title: string;
      referenceNumber: string;
      status: IncidentSummary["status"];
    },
    input: UpdateIncidentInput
  ): IncidentHistoryChange[] {
    const changes: IncidentHistoryChange[] = [];

    if (input.title !== undefined && input.title !== existingIncident.title) {
      changes.push({
        field: "title",
        from: existingIncident.title,
        to: input.title
      });
    }

    if (
      input.referenceNumber !== undefined &&
      input.referenceNumber !== existingIncident.referenceNumber
    ) {
      changes.push({
        field: "referenceNumber",
        from: existingIncident.referenceNumber,
        to: input.referenceNumber
      });
    }

    if (input.status !== undefined && input.status !== existingIncident.status) {
      changes.push({
        field: "status",
        from: existingIncident.status,
        to: input.status
      });
    }

    return changes;
  }

  private buildSummary(changes: IncidentHistoryChange[]) {
    if (changes.length === 1 && changes[0]?.field === "status") {
      return `Statuswechsel von ${changes[0].from} zu ${changes[0].to}.`;
    }

    if (changes.length === 0) {
      return "Lage aktualisiert.";
    }

    return `Lage aktualisiert: ${changes.map((entry) => entry.field).join(", ")}.`;
  }

  private throwOnUniqueConstraint(error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictException("Aktenzeichen existiert bereits.");
    }
  }
}
