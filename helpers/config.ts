import * as fs from "fs-extra";
import * as _ from "lodash";
import * as path from "path";

export default class HelperConfig {
    static async loadFromDir(dir: string): Promise<{[host: string]: {[key: string]: any}}> {
        const hosts = (await fs.readdir(dir))
            .filter(f => f.endsWith(".json"))
            .map(f => f.split(".").slice(0, -1).join("."));
        const configs: {[host: string]: {[key: string]: any}} = {};
        await Promise.all(hosts.map(async host => {
            const config = await fs.readJSON(path.join(dir, host + ".json"));
            configs[host] = config;
        }));
        if (!("global" in configs)) return configs;
        return _.mapValues(configs, (config, host) => {
            if (host === "global") return config;
            return _.merge(config, configs.global);
        });
    }
}
