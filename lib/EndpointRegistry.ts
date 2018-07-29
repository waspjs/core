import { Endpoint as HttpEndpoint } from "./http";

export class EndpointRegistry {
    httpEndpoints: HttpEndpoint[] = [];

    register(endpoint: HttpEndpoint) {
        this.httpEndpoints.push(endpoint);
    }
}

const registry = new EndpointRegistry();
export default registry;
