import { WaspController } from "../service";

@WaspController.Service()
export class HelloController {
  @WaspController.get("/hello")
  public hello() {
    return "Hello, world!";
  }
}
