import * as http from "http";
import * as express from "express";
import Container, { Service } from "typedi";
import { ApolloService, ConfigService, ControllerService, LoggingService, BrowserScriptService } from "./service";

@Service()
export class WebServer {
  private config = Container.get(ConfigService);
  private logger = Container.get(LoggingService);

  private apolloService = Container.get(ApolloService);
  private browserScriptService = Container.get(BrowserScriptService);
  private controllerService = Container.get(ControllerService);

  httpServer!: http.Server;
  express!: express.Application;

  async init() {
    this.express = express();
    this.apolloService.init(this.express);
    await this.browserScriptService.init();
    this.controllerService.init(this.express);
    this.httpServer = http.createServer(this.express);
  }

  async start() {
    await new Promise(resolve => this.httpServer.listen(this.config.httpPort, resolve));
    this.logger.debug("http.start", { port: this.config.httpPort });
  }

  async stop() {
    await new Promise((resolve, reject) =>
      this.httpServer.close(err => err ? reject(err) : resolve(err))
    );
    this.logger.debug("http.stop");
  }
}
