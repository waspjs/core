import * as express from "express";
import * as http from "http";
import * as helpers from "../helpers";
import Application from "./Application";

export default class WebServer {
    express: express.Application;
    httpServer: http.Server;

    constructor(
        public app: Application
    ) {
        this.express = express();
        this.httpServer = http.createServer(this.express);
    }

    async start() {
        await this.setupMiddleware();
        await new Promise(resolve => this.httpServer.listen(3000, resolve));
        console.log("Started HTTP server, listening on port 3000.");
    }

    private async setupMiddleware() {
        type MiddlewareExports = { default(app: Application): void };
        const handlers = await helpers.require.fromDir<MiddlewareExports>(__dirname + "/middleware");
        handlers.forEach(h => h.default(this.app));
    }
}
