import { Request } from "express";
import { WaspController } from "../service";
import { LoginPage } from "../views/login";

@WaspController.Service()
export class AuthController {
  @WaspController.get("/login")
  login(req: Request) {
    return LoginPage({ req });
  }
}
