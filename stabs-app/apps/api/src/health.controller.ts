import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      service: "stabs-api",
      status: "ok",
      stage: "mvp-0.1-foundation"
    };
  }
}
