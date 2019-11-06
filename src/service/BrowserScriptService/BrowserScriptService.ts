import * as fs from "fs";
import { resolve as resolvePath } from "path";
import * as _ from "lodash";
import * as recursiveReaddir from "recursive-readdir";
import Container, { Service } from "typedi";
import * as ts from "typescript";
import { LoggingService } from "../LoggingService";

/**
 * The name is difficult, yeah
 * Basically this handles finding JS files in the `views/js` director(y/ies),
 * and compiling them (on-demand in dev, at start in prod) to be served over HTTP
 */
@Service()
export class BrowserScriptService {
  private logger = Container.get(LoggingService);

  // Key: HTTP path
  private cache: {
    [key: string]: {
      filename: string;
      compiled: string;
      tsconfig: any;
    };
  } = {};

  /**
   * Find and cache everything
   */
  async init() {
    // Two `views/js` directories: core, and the application dir
    // We assume that the app is run from its own root.
    // Better detection methods welcome
    // If we're running core directly these will be the same
    const directories = _.uniq([
      // Get out of "dist" so we can go back into "src"
      resolvePath(__dirname, "../../../src/views/js"),
      resolvePath(process.cwd(), "src/views/js")
    ]);
    await Promise.all(directories.map(async dir => {
      const filenames = (await recursiveReaddir(dir)).filter(f =>
        f.endsWith(".ts") &&
        !f.endsWith(".d.ts") &&
        !f.includes("node_modules")
      );
      for (const filename of filenames) {
        this.cache[filename.slice(dir.length).replace(/\\/g, "/")] = {
          filename,
          tsconfig: {},
          compiled: await this.compileFile(filename, {})
        };
      }
    }));
    console.log(this.cache);
    this.logger.debug("foobar", { directories, cache: this.cache });
  }

  private async compileFile(filename: string, tsconfig: any): Promise<string> {
    const { diagnostics, outputText } = ts.transpileModule(await fs.promises.readFile(filename, "utf8"), {
      fileName: filename
    });
    if (diagnostics && diagnostics.length > 0) {
      console.error(diagnostics);
      return "";
    } else {
      return outputText;
    }
  }
}
