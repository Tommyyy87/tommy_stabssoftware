import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { AuthController } from "./modules/auth/auth.controller";
import { AuthService } from "./modules/auth/auth.service";
import { IncidentsController } from "./modules/incidents/incidents.controller";
import { InMemoryIncidentsStore } from "./modules/incidents/in-memory-incidents.store";
import { INCIDENT_STORE } from "./modules/incidents/incidents.store";
import { PrismaIncidentsStore } from "./modules/incidents/prisma-incidents.store";
import { IncidentsService } from "./modules/incidents/incidents.service";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  controllers: [HealthController, AuthController, IncidentsController],
  providers: [
    AuthService,
    IncidentsService,
    PrismaService,
    InMemoryIncidentsStore,
    PrismaIncidentsStore,
    {
      provide: INCIDENT_STORE,
      useFactory: (
        inMemoryIncidentsStore: InMemoryIncidentsStore,
        prismaIncidentsStore: PrismaIncidentsStore
      ) =>
        process.env.DATABASE_URL ? prismaIncidentsStore : inMemoryIncidentsStore,
      inject: [InMemoryIncidentsStore, PrismaIncidentsStore]
    }
  ]
})
export class AppModule {}
