import * as express from "express";
import * as _ from "lodash";
import Container, { Service } from "typedi";
import { ConfigService } from "../ConfigService";
import { LoggingService } from "../LoggingService";
import { WaspController } from "./WaspController";

/**
 * registers HTTP controllers
 */
@Service()
export class ControllerService {
  private config = Container.get(ConfigService);
  private logger = Container.get(LoggingService);

  public init(app: express.Application) {
    const controllers = this.findControllers();
    for (const { method, path, handler } of controllers) {
      app[method](path, handler);
    }
  }

  public findControllers(): {
    method: "get" | "post" | "delete" | "patch" | "put";
    path: string;
    handler: ReturnType<ControllerService["wrapController"]>
  }[] {
    const targets = Container.getMany(WaspController.token);
    return _.compact(_.flatten(targets.map((target: any) =>
      Object.getOwnPropertyNames(target.constructor.prototype).map(key => {
        if (!Reflect.hasMetadata("controller", target, key)) { return; }
        if (typeof(target[key]) !== "function") {
          throw new Error("Can't use " + target.constructor.name + "." + key + " as a controller");
        }
        const { method, path } = Reflect.getMetadata("controller", target, key);
        return {
          method, path,
          handler: this.wrapController(target[key])
        };
      })
    )));
  }

  protected wrapController(controller: (req: express.Request, res: express.Response) => any) {
    return async (req: express.Request, res: express.Response) => {
      try {
        // controllers can return non-promise values, but awaiting non-promises is harmless
        const data = await controller(req, res);
        if (data) {
          res.status(200).send(data);
        }
      } catch (err) {
        this.logger.error("controller", err, { path: req.path });
        if (this.config.inDevelopment) {
          res.status(500).send(err);
        } else {
          res.sendStatus(500);
        }
      }
    };
  }
}
