type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface HttpEndpointParams {
    method?: HttpMethod;
    url?: string;
}

export default class HttpEndpoint {
    method: HttpMethod;
    target: (...params: any[]) => Promise<any>;
    url: string;

    constructor(controller: Function, methodName: string, params: HttpEndpointParams) {
        this.method = params.method || "GET";
        this.target = controller.prototype[methodName];
        this.url = params.url || controller.prototype[methodName].name;
    }
}
