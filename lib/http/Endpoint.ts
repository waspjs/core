import * as express from "express";
import Application from "../Application";
import Context, { Controller } from "./Context";
import { DecoratorParams, HttpMethod } from "./DecoratorParams";
import * as helpers from "../../helpers";

type ControllerInstance = Controller & {
    constructor: new (context: Context, app: Application) => ControllerInstance
} & {
    [methodName: string]: <Return>(...params: any[]) => Promise<Return>;
};

export class Endpoint {
    method: HttpMethod;
    params: string[];
    url: string;
    constructor(
        public target: ControllerInstance,
        public methodName: string,
        params: DecoratorParams
    ) {
        this.method = params.method || "GET";
        this.params = helpers.function.getParameterNames(target[methodName]);
        this.url = params.url || target[methodName].name;
    }

    isValidFor(req: express.Request): boolean {
        return this.url === req.url && this.method === req.method;
    }

    async call(app: Application, context: Context): Promise<void> {
        const rawParams: {[key: string]: any} = context.req[context.req.method === "GET" ? "query" : "body"] || {};
        const params: any[] = this.params.map(p => rawParams[p]);
        let result: any;
        const controller: ControllerInstance = new this.target.constructor(context, app);
        try {
            result = await controller[this.methodName].apply(controller, params);
        } catch (err) {
            console.error("error occurred", err);
            context.res.sendStatus(500);
            return;
        }
        if (result === undefined) result = "";
        if (typeof(result) !== "string" && !(result instanceof Buffer)) {
            result = JSON.stringify(result);
            context.res.setHeader("Content-Type", "application/json");
        }
        context.res.send(result);
    }
}
