import * as sourceMapSupport from "source-map-support";
sourceMapSupport.install();
import * as redis from "redis";
import Plugin from "./Plugin";
import WebServer from "./WebServer";

export default class Application {
    server: WebServer;
    redisClient?: redis.RedisClient;

    constructor(
        public config: {[key: string]: any},
        public plugins: Plugin[] = []
    ) {
        plugins.forEach(p => p.app = this);
        this.server = new WebServer(this);
    }

    firePluginEvent(eventName: keyof Plugin, ...params: any[]) {
        return Promise.all(this.plugins.filter(p => !!p[eventName]).map(plugin =>
            (plugin[eventName] as Function)(...params)
        ));
    }
}
