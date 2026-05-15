import { ConflictException, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  getSeededIncidents,
  resolveUserDisplayName
} from "../../shared/demo-store";
import { PrismaService } from "../../prisma/prisma.service";
import {
  CreateIncidentInput,
  IncidentStore,
  IncidentSummary,
  UpdateIncidentInput
} from "./incidents.store";

@Injectable()
export class PrismaIncidentsStore implements IncidentStore, OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
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
    }
  }

  async list(): Promise<IncidentSummary[]> {
    const incidents = await this.prisma.incident.findMany({
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
          createdByUserId
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
    input: UpdateIncidentInput
  ): Promise<IncidentSummary | null> {
    const existingIncident = await this.prisma.incident.findUnique({
      where: {
        id: incidentId
      }
    });

    if (!existingIncident) {
      return null;
    }

    try {
      const incident = await this.prisma.incident.update({
        where: {
          id: incidentId
        },
        data: {
          title: input.title,
          referenceNumber: input.referenceNumber,
          status: input.status
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
    createdByUserId: string;
  }): IncidentSummary {
    return {
      id: incident.id,
      title: incident.title,
      referenceNumber: incident.referenceNumber,
      status: incident.status,
      createdAt: incident.createdAt.toISOString(),
      createdBy: resolveUserDisplayName(incident.createdByUserId)
    };
  }

  private throwOnUniqueConstraint(error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictException("Aktenzeichen existiert bereits.");
    }
  }
}
