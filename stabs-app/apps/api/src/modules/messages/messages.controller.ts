import { Body, Controller, Get, Headers, Param, Patch, Post } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageInput, UpdateMessageInput } from "./messages.store";

@Controller("incidents/:incidentId/messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  list(
    @Param("incidentId") incidentId: string,
    @Headers("authorization") authorizationHeader?: string
  ) {
    return this.messagesService.listByIncident(incidentId, authorizationHeader);
  }

  @Get(":messageId/history")
  history(
    @Param("incidentId") incidentId: string,
    @Param("messageId") messageId: string,
    @Headers("authorization") authorizationHeader?: string
  ) {
    return this.messagesService.listHistory(
      incidentId,
      messageId,
      authorizationHeader
    );
  }

  @Post()
  create(
    @Param("incidentId") incidentId: string,
    @Body() body: CreateMessageInput,
    @Headers("authorization") authorizationHeader?: string
  ) {
    return this.messagesService.create(incidentId, body, authorizationHeader);
  }

  @Patch(":messageId")
  update(
    @Param("incidentId") incidentId: string,
    @Param("messageId") messageId: string,
    @Body() body: UpdateMessageInput,
    @Headers("authorization") authorizationHeader?: string
  ) {
    return this.messagesService.update(
      incidentId,
      messageId,
      body,
      authorizationHeader
    );
  }
}
