import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { AuthController } from "./modules/auth/auth.controller";
import { AuthService } from "./modules/auth/auth.service";
import { IncidentsController } from "./modules/incidents/incidents.controller";
import { IncidentsService } from "./modules/incidents/incidents.service";

@Module({
  controllers: [HealthController, AuthController, IncidentsController],
  providers: [AuthService, IncidentsService]
})
export class AppModule {}
