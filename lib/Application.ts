import WebServer from "./WebServer";

export default class Application {
    server: WebServer;

    constructor() {
        this.server = new WebServer(this);
    }
}
