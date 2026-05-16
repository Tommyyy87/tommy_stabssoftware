import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { AuthController } from "./modules/auth/auth.controller";
import { AUTH_STORE } from "./modules/auth/auth.store";
import { AuthService } from "./modules/auth/auth.service";
import { InMemoryAuthStore } from "./modules/auth/in-memory-auth.store";
import { PrismaAuthStore } from "./modules/auth/prisma-auth.store";
import { IncidentsController } from "./modules/incidents/incidents.controller";
import { InMemoryIncidentsStore } from "./modules/incidents/in-memory-incidents.store";
import { INCIDENT_STORE } from "./modules/incidents/incidents.store";
import { PrismaIncidentsStore } from "./modules/incidents/prisma-incidents.store";
import { IncidentsService } from "./modules/incidents/incidents.service";
import { JournalController } from "./modules/journal/journal.controller";
import { InMemoryJournalStore } from "./modules/journal/in-memory-journal.store";
import { JOURNAL_STORE } from "./modules/journal/journal.store";
import { JournalService } from "./modules/journal/journal.service";
import { PrismaJournalStore } from "./modules/journal/prisma-journal.store";
import { MessagesController } from "./modules/messages/messages.controller";
import { InMemoryMessagesStore } from "./modules/messages/in-memory-messages.store";
import { MESSAGE_STORE } from "./modules/messages/messages.store";
import { PrismaMessagesStore } from "./modules/messages/prisma-messages.store";
import { MessagesService } from "./modules/messages/messages.service";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  controllers: [
    HealthController,
    AuthController,
    IncidentsController,
    JournalController,
    MessagesController
  ],
  providers: [
    AuthService,
    IncidentsService,
    JournalService,
    MessagesService,
    PrismaService,
    InMemoryAuthStore,
    PrismaAuthStore,
    InMemoryIncidentsStore,
    PrismaIncidentsStore,
    InMemoryJournalStore,
    PrismaJournalStore,
    InMemoryMessagesStore,
    PrismaMessagesStore,
    {
      provide: AUTH_STORE,
      useFactory: (
        inMemoryAuthStore: InMemoryAuthStore,
        prismaAuthStore: PrismaAuthStore
      ) => (process.env.DATABASE_URL ? prismaAuthStore : inMemoryAuthStore),
      inject: [InMemoryAuthStore, PrismaAuthStore]
    },
    {
      provide: INCIDENT_STORE,
      useFactory: (
        inMemoryIncidentsStore: InMemoryIncidentsStore,
        prismaIncidentsStore: PrismaIncidentsStore
      ) =>
        process.env.DATABASE_URL ? prismaIncidentsStore : inMemoryIncidentsStore,
      inject: [InMemoryIncidentsStore, PrismaIncidentsStore]
    },
    {
      provide: JOURNAL_STORE,
      useFactory: (
        inMemoryJournalStore: InMemoryJournalStore,
        prismaJournalStore: PrismaJournalStore
      ) => (process.env.DATABASE_URL ? prismaJournalStore : inMemoryJournalStore),
      inject: [InMemoryJournalStore, PrismaJournalStore]
    },
    {
      provide: MESSAGE_STORE,
      useFactory: (
        inMemoryMessagesStore: InMemoryMessagesStore,
        prismaMessagesStore: PrismaMessagesStore
      ) => (process.env.DATABASE_URL ? prismaMessagesStore : inMemoryMessagesStore),
      inject: [InMemoryMessagesStore, PrismaMessagesStore]
    }
  ]
})
export class AppModule {}
