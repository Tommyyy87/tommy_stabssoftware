import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { JournalService } from "./journal.service";
import { CreateJournalEntryInput } from "./journal.store";

@Controller("incidents/:incidentId")
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get("journal")
  list(
    @Param("incidentId") incidentId: string,
    @Headers("authorization") authorizationHeader?: string
  ) {
    return this.journalService.listByIncident(incidentId, authorizationHeader);
  }

  @Post("journal")
  create(
    @Param("incidentId") incidentId: string,
    @Body() body: CreateJournalEntryInput,
    @Headers("authorization") authorizationHeader?: string
  ) {
    return this.journalService.create(incidentId, body, authorizationHeader);
  }

  @Post("messages/:messageId/journal-entries")
  createFromMessage(
    @Param("incidentId") incidentId: string,
    @Param("messageId") messageId: string,
    @Body() body: CreateJournalEntryInput,
    @Headers("authorization") authorizationHeader?: string
  ) {
    return this.journalService.create(
      incidentId,
      body,
      authorizationHeader,
      messageId
    );
  }
}
