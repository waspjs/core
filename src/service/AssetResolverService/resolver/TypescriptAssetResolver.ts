import * as fs from "fs";
import { resolve as resolvePath } from "path";
import { UrlWithStringQuery } from "url";
import * as express from "express";
import * as _ from "lodash";
import * as recursiveReaddir from "recursive-readdir";
import Container from "typedi";
import * as ts from "typescript";
import { ConfigService } from "../../ConfigService";
import { LoggingService } from "../../LoggingService";
import { AssetResolver } from "../AssetResolver";
import { AssetDirectoryService } from "../../AssetDirectoryService";

/**
 * Basically this handles finding JS files in the `views/js` director(y/ies),
 * and compiling them (on-demand in dev, at start in prod) to be served over HTTP
 */
@AssetResolver.Service()
export class TypescriptAssetResolver extends AssetResolver {
  pattern = /\.js$/;

  private assetDirectoryService = Container.get(AssetDirectoryService);
  private config = Container.get(ConfigService);
  private logger = Container.get(LoggingService);

  // Key: HTTP path
  private cache: {
    [key: string]: {
      filename: string;
      compiled: string;
      compilerOptions: any;
    };
  } = {};

  /**
   * Find and cache everything
   */
  async init(app: express.Application) {
    await Promise.all(this.assetDirectoryService.javascriptDirs.map(async dir => {
      const { compilerOptions } = JSON.parse(await fs.promises.readFile(resolvePath(dir, "tsconfig.json"), "utf8"));
      const filenames = (await recursiveReaddir(dir, [d => d.includes("node_modules")])).filter(f =>
        f.endsWith(".ts") &&
        !f.endsWith(".d.ts")
      ).map(f => f.replace(/\\/g, "/"));
      for (const filename of filenames) {
        this.cache["/js" + filename.slice(dir.length).replace(/\.ts$/, ".js")] = {
          filename,
          compilerOptions,
          compiled: await this.compileFile(filename, compilerOptions)
        };
      }
    }));
    app.get("/*", this.onRequest);
  }

  resolve(url: UrlWithStringQuery): string | undefined {
    if (!url.path || !this.cache[url.path]) {
      return undefined;
    }
    return url.path;
  }

  private onRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!this.cache[req.path]) {
      return next();
    }
    const { filename, compiled, compilerOptions } = this.cache[req.path];
    res.header("Content-Type", "application/javascript");
    if (this.config.inDevelopment) {
      this.compileFile(filename, compilerOptions)
        .then(compiledNew => res.send(compiledNew))
        .catch(err => res.status(500).send(err));
    } else {
      res.send(compiled);
    }
  };

  private async compileFile(filename: string, compilerOptions: any): Promise<string> {
    const { diagnostics, outputText } = ts.transpileModule(await fs.promises.readFile(filename, "utf8"), {
      fileName: filename,
      compilerOptions
    });
    if (diagnostics && diagnostics.length > 0) {
      this.logger.error("scripts.compileError", new Error("Compilation errors: " + diagnostics.map(d => d.messageText).join(", ")), { diagnostics });
      return "";
    } else {
      return outputText;
    }
  }
}
