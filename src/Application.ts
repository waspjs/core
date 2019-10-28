import Container, { Service } from "typedi";
import { MongoService } from "./service/MongoService";
import { WebServer } from "./WebServer";

@Service()
export class Application {
  private mongo = Container.get(MongoService);
  private webServer = Container.get(WebServer);

  public async init() {
    await this.mongo.init();
    this.webServer.init();
  }

  public async start() {
    await this.webServer.start();
  }

  public async stop() {
    await this.webServer.stop();
    await this.mongo.close();
  }
}
