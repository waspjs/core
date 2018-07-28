import * as express from "express";
import * as helpers from "../../helpers";
import { EndpointRegistry } from "..";
export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export abstract class EndpointContext {
    req: express.Request;
    res: express.Response;
}

export type Callback = <Result>(this: EndpointContext, ...params: any[]) => Promise<Result>;

export const Decorator = (params: DecoratorParams): MethodDecorator =>
    (target: any, methodName) => {
        EndpointRegistry.register(new HttpEndpoint(target[methodName], params));
    };
export default Decorator;

export type DecoratorParams = {
    name: string;
    method?: HttpMethod;
    url?: string;
};

export class HttpEndpoint {
    method: HttpMethod;
    params: string[];
    url: string;

    constructor(public callback: Callback, params: DecoratorParams) {
        this.method = params.method || "GET";
        this.params = helpers.function.getParameterNames(callback);
        this.url = params.url || callback.name;
    }

    isValidFor(req: express.Request): boolean {
        return this.url === req.url && this.method === req.method;
    }

    async call(transaction: EndpointContext): Promise<void> {
        const rawParams: {[key: string]: any} = transaction.req[transaction.req.method === "GET" ? "query" : "body"] || {};
        const params: any[] = this.params.map(p => rawParams[p]);
        let result: any;
        try {
            result = await this.callback.apply(transaction, params);
        } catch (err) {
            console.error(err);
        }
        if (result === undefined) return;
        if (typeof(result) !== "string" && !(result instanceof Buffer)) {
            result = JSON.stringify(result);
            transaction.res.setHeader("Content-Type", "application/json");
        }
        transaction.res.send(result);
    }
}
