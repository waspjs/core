import { resolve as resolvePath } from "path";
import * as _ from "lodash";
import { Service } from "typedi";
import { pathExists } from "../../util/pathExists";

@Service()
export class AssetDirectoryService {
  get javascriptDirs() {
    // Two `views/js` directories: core, and the application dir
    // We assume that the app is run from its own root.
    // Better detection methods welcome
    // If we're running core directly these will be the same
    return _.uniq([
      // Get out of "dist" so we can go back into "src"
      resolvePath(__dirname, "../../../src/views/js"),
      resolvePath(process.cwd(), "src/views/js")
    ]).map(d =>
      d.replace(/\\/g, "/")
    ).filter(d => pathExists(d));
  }
}
