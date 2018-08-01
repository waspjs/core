import * as fs from "fs-extra";
import * as path from "path";

export default class HelperConfig {
    static async loadFromDir(dir: string): Promise<{[key: string]: any}> {
        const sections = (await fs.readdir(dir))
            .filter(f => f.endsWith(".json"))
            .map(f => f.replace(/\.json$/, ""));
        const config: {[key: string]: any} = {};
        await Promise.all(sections.map(async section => {
            config[section] = await fs.readJSON(path.join(dir, section + ".json"));
        }));
        return config;
    }
}
