import { Service, Token } from "typedi";

export type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

export function controller(method: HttpMethod, path: string) {
  return (target: any, key: string) => {
    Reflect.defineMetadata("controller", { method, path }, target, key);
  };
}

/**
 * Dummy class to host static token/Service fields
 */
export class Controller {
  public static token = new Token("controller");
  public static Service = () => Service({ id: Controller.token, multiple: true });
}
