import * as express from "express";
import * as http from "http";
import Container, { Service } from "typedi";
import { ConfigService } from "./service/ConfigService";
import { LoggingService } from "./service/LoggingService";

@Service()
export class WebServer {
  private config = Container.get(ConfigService);
  private logger = Container.get(LoggingService);

  public httpServer!: http.Server;
  public express!: express.Application;

  public init() {
    this.express = express();
    this.httpServer = http.createServer(this.express);
  }

  public async start() {
    await new Promise(resolve => this.httpServer.listen(this.config.httpPort, resolve));
    this.logger.debug("http.start", { port: this.config.httpPort });
  }

  public async stop() {
    await new Promise((resolve, reject) =>
      this.httpServer.close(err => err ? reject(err) : resolve(err))
    );
    this.logger.debug("http.stop");
  }
}
