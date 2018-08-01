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
        await new Promise(resolve => this.httpServer.listen(3000, resolve));
        await this.app.firePluginEvent("onStart");
        console.log("Started HTTP server, listening on port 3000.");
    }

    async setupMiddleware() {
        type MiddlewareExports = { default(app: Application): void };
        const middlewares = await helpers.require.fromDir<MiddlewareExports>(__dirname + "/middleware");
        middlewares.forEach(m => m.default(this.app));
        this.express.all("/*", this.onRequest);
    }

    private onRequest: express.RequestHandler = (req, res) => {
        const endpoint = EndpointRegistry.httpEndpoints.find(e => e.isValidFor(req));
        if (endpoint === undefined) {
            res.sendStatus(404);
            return;
        }
        endpoint.call(this.app, { req, res }).catch(console.error);
    };
}
