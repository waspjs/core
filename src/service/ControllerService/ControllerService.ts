import * as express from "express";
import * as _ from "lodash";
import Container, { Service } from "typedi";
import { findDecoratedMethods } from "../../util";
import { ConfigService } from "../ConfigService";
import { LoggingService } from "../LoggingService";
import { HttpMethod, WaspController } from "./WaspController";

/**
 * registers HTTP controllers
 */
@Service()
export class ControllerService {
  private config = Container.get(ConfigService);
  private logger = Container.get(LoggingService);

  public init(app: express.Application) {
    const metadatas = findDecoratedMethods<{ method: HttpMethod; path: string }, any>(WaspController.token, "controller");
    metadatas.forEach(({ method, path, target, key }) => {
      const matcher = (app as any)[method.toLowerCase()].bind(app) as express.IRouterMatcher<express.Application>;
      matcher(path, this.wrapController(target[key]));
    });
  }

  public wrapController(controller: (req: express.Request, res: express.Response) => any) {
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
