import * as fs from "fs-extra";
import * as recursiveReaddir from "recursive-readdir";

export default class HelperRequire {
    static async fromDir<Type = any>(dir: string, recursive = false): Promise<Type[]> {
        const files = recursive
            ? await recursiveReaddir(dir)
            : (await fs.readdir(dir)).map(f => dir + "/" + f);
        return files.filter(f => f.endsWith(".js")).map(require);
    }
}
