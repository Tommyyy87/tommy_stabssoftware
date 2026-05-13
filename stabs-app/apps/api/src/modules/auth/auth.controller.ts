import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

type LoginBody = {
  username?: string;
  password?: string;
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() body: LoginBody) {
    return this.authService.login(body.username ?? "", body.password ?? "");
  }

  @Get("me")
  me(@Headers("authorization") authorizationHeader?: string) {
    return this.authService.getPermissionsForCurrentUser(authorizationHeader);
  }
}
