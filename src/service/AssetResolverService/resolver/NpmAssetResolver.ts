import * as fs from "fs";
import { resolve as resolvePath } from "path";
import { UrlWithStringQuery } from "url";
import * as express from "express";
import * as _ from "lodash";
import Container from "typedi";
import { AssetResolver } from "../AssetResolver";
import { AssetDirectoryService } from "../../AssetDirectoryService";
import { pathExists } from "../../../util/pathExists";

@AssetResolver.Service()
export class NpmAssetResolver extends AssetResolver {
  private assetDirectoryService = Container.get(AssetDirectoryService);

  pattern = /^\/js\/npm\//;

  // Structure: moduleName: fileContents
  private cache: {[moduleName: string]: string} = {};

  async init(app: express.Application) {
    await Promise.all(this.assetDirectoryService.javascriptDirs.map(async jsDir => {
      const modulesDir = resolvePath(jsDir, "node_modules");
      const modules = await fs.promises.readdir(modulesDir);
      await Promise.all(modules.map(async moduleName => {
        const packageFilename = resolvePath(modulesDir, moduleName, "package.json");
        if (!await pathExists(packageFilename)) {
          return;
        }
        const packageInfo = JSON.parse(await fs.promises.readFile(packageFilename, "utf8"));
        if (!packageInfo.main) {
          return;
        }
        let scriptFilename = resolvePath(modulesDir, moduleName, packageInfo.main);
        if (!scriptFilename.endsWith(".js")) {
          scriptFilename += ".js";
        }
        this.cache[moduleName] = await fs.promises.readFile(scriptFilename, "utf8");
      }));
    }));
    app.get("/js/npm/*", (req, res, next) => {
      const moduleName = req.path.split("/").slice(-1)[0];
      if (!this.cache[moduleName]) {
        return next();
      }
      res.header("Content-Type", "application/json");
      res.send(this.cache[moduleName]);
    });
    this.setupSystemjsMapRoute(app);
  }

  resolve(url: UrlWithStringQuery) {
    return url.toString();
  }

  private setupSystemjsMapRoute(app: express.Application) {
    const map: {[key: string]: string} = {};
    Object.keys(this.cache).forEach(moduleName =>
      map[moduleName] = `/js/npm/${moduleName}`
    );
    app.get("/systemjs-config.json", (req, res) => {
      res.header("Content-Type", "application/json");
      res.send({ imports: map });
    });
  }
}
