import * as express from "express";
import * as http from "http";
import * as helpers from "../helpers";
import Application from "./Application";
import { EndpointRegistry } from "./index";

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
        this.express.all("/*", this.onRequest);
        await new Promise(resolve => this.httpServer.listen(3000, resolve));
        console.log("Started HTTP server, listening on port 3000.");
    }

    private async setupMiddleware() {
        type MiddlewareExports = { default(app: Application): void };
        const handlers = await helpers.require.fromDir<MiddlewareExports>(__dirname + "/middleware");
        handlers.forEach(h => h.default(this.app));
    }

    private onRequest: express.RequestHandler = (req, res) => {
        const endpoint = EndpointRegistry.httpEndpoints.find(e => e.isValidFor(req));
        if (endpoint === undefined) {
            res.status(404);
            return;
        }
        endpoint.call({ req, res }).catch(console.error);
    };
}
