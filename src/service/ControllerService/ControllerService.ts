import * as express from "express";
import Container, { Service } from "typedi";
import { Controller } from "../../Controller";
import { LoggingService } from "../LoggingService";

/**
 * registers HTTP controllers
 */
@Service()
export class ControllerService {
  private logger = Container.get(LoggingService);

  public init(app: express.Application) {
    const targets = Container.getMany(Controller.token);
    targets.forEach((target: any) => Object.getOwnPropertyNames(target.constructor.prototype).map(key => {
      if (!Reflect.hasMetadata("controller", target, key)) { return; }
      if (typeof(target[key]) !== "function") {
        throw new Error("Can't use " + target.constructor.name + "." + key + " as a controller");
      }
      const { method, url } = Reflect.getMetadata("controller", target, key);
      app[method === "GET" ? "get" : "post"](url, (req, res) => {
        (target[key](req, res) as Promise<void>).catch(err => {
          this.logger.error("controller", err, { route: req.path });
          res.sendStatus(500);
        });
      });
    }));
  }
}
