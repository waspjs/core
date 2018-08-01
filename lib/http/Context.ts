import * as express from "express";
import Application from "../Application";

export default interface Context {
    req: express.Request;
    res: express.Response;
}

export abstract class Controller implements Context {
    req: express.Request;
    res: express.Response;

    constructor(
        init: Context,
        public app: Application
    ) {
        this.req = init.req;
        this.res = init.res;
    }
}
