import * as sourceMapSupport from "source-map-support";
sourceMapSupport.install();
import * as redis from "redis";
import WebServer from "./WebServer";

export default class Application {
    server: WebServer;
    redisClient?: redis.RedisClient;

    constructor(
        public configs: {[key: string]: {[key: string]: any}}
    ) {
        this.server = new WebServer(this);
    }
}
