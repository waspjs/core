import { DecoratorParams } from "./DecoratorParams";
import { EndpointRegistry } from "..";
import { Endpoint } from "./Endpoint";

const decorator = (params?: DecoratorParams): MethodDecorator => (target: any, methodName) => {
    EndpointRegistry.register(new Endpoint(target, methodName as string, params || {}));
};
export default decorator;
