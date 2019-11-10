import { WaspController } from "../service";

@WaspController.Service()
export class HelloController {
  @WaspController.get("/hello")
  hello() {
    return "Hello, world!";
  }
}
