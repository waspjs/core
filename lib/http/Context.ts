import * as express from "express";

export default abstract class Context {
    req: express.Request;
    res: express.Response;

    constructor(init: Context) {
        this.req = init.req;
        this.res = init.res;
    }
}
