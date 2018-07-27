import * as fs from "fs-extra";

export default class HelperRequire {
    static async fromDir<Type = any>(dir: string, synchronous = false): Promise<Type[]> {
        const files = synchronous ? fs.readdirSync(dir) : await fs.readdir(dir);
        return files.filter(f => f.endsWith(".js")).map(f => require(dir + "/" + f));
    }
}
