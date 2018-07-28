import * as express from "express";
import Context from "./Context";
import { DecoratorParams, HttpMethod } from "./DecoratorParams";
import * as helpers from "../../helpers";

type ControllerInstance = Context & {
    [methodName: string]: <Return>(...params: any[]) => Promise<Return>;
};

type Controller = typeof Context & {
    prototype: ControllerInstance;
};

export class Endpoint {
    method: HttpMethod;
    params: string[];
    url: string;
    constructor(
        public target: Controller,
        public methodName: string,
        params: DecoratorParams
    ) {
        this.method = params.method || "GET";
        this.params = helpers.function.getParameterNames(target.prototype[methodName]);
        this.url = params.url || target.prototype[methodName].name;
    }

    isValidFor(req: express.Request): boolean {
        return this.url === req.url && this.method === req.method;
    }

    async call(context: Context): Promise<void> {
        const rawParams: {[key: string]: any} = context.req[context.req.method === "GET" ? "query" : "body"] || {};
        const params: any[] = this.params.map(p => rawParams[p]);
        let result: any;
        const controller: ControllerInstance = new this.target(context) as any;
        try {
            result = await controller[this.methodName].apply(controller, params);
        } catch (err) {
            console.error(err);
        }
        if (result === undefined) return;
        if (typeof(result) !== "string" && !(result instanceof Buffer)) {
            result = JSON.stringify(result);
            context.res.setHeader("Content-Type", "application/json");
        }
        context.res.send(result);
    }
}
