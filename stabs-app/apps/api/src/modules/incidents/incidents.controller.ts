import { Body, Controller, Get, Headers, Param, Patch, Post } from "@nestjs/common";
import { IncidentsService } from "./incidents.service";
import { CreateIncidentInput, UpdateIncidentInput } from "./incidents.store";

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

  @Patch(":incidentId")
  update(
    @Param("incidentId") incidentId: string,
    @Body() body: UpdateIncidentInput,
    @Headers("authorization") authorizationHeader?: string
  ) {
    return this.incidentsService.update(incidentId, body, authorizationHeader);
  }
}
