import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { IncidentsService } from "./incidents.service";

type CreateIncidentInput = {
  title: string;
  referenceNumber: string;
};

@Controller("incidents")
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  list() {
    return this.incidentsService.list();
  }

  @Post()
  create(
    @Body() body: CreateIncidentInput,
    @Headers("authorization") authorizationHeader?: string
  ) {
    return this.incidentsService.create(body, authorizationHeader);
  }
}
