import Container, { Service } from "typedi";
import { MongoService } from "./service/MongoService";
import { WebServer } from "./WebServer";

@Service()
export class Application {
  private mongo = Container.get(MongoService);
  private webServer = Container.get(WebServer);

  async init() {
    await this.mongo.init();
    await this.webServer.init();
  }

  async start() {
    await this.webServer.start();
  }

  async stop() {
    await this.webServer.stop();
    await this.mongo.close();
  }
}
