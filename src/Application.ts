import Container, { Service } from "typedi";
import { WebServer } from "./WebServer";

@Service()
export class Application {
  private webServer = Container.get(WebServer);

  public async init() {
    this.webServer.init();
  }

  public async start() {
    await this.webServer.start();
  }

  public async stop() {
    await this.webServer.stop();
  }
}
