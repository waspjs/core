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
export class WaspController {
  public static token = new Token("controller");
  public static Service = () => Service({ id: WaspController.token, multiple: true });

  public static get = WaspController.buildDefiner("GET");
  public static post = WaspController.buildDefiner("POST");
  public static delete = WaspController.buildDefiner("DELETE");
  public static patch = WaspController.buildDefiner("PATCH");
  public static put = WaspController.buildDefiner("PUT");

  protected static buildDefiner(method: HttpMethod) {
    return (path: string) => {
      return (target: any, key: string) => {
        Reflect.defineMetadata("controller", { method, path }, target, key);
      };
    };
  }
}
