import { Service, Token } from "typedi";

export type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

export class WaspController {
  static token = new Token("controller");
  static Service = () => Service({ id: WaspController.token, multiple: true });

  static get = WaspController.buildDefiner("GET");
  static post = WaspController.buildDefiner("POST");
  static delete = WaspController.buildDefiner("DELETE");
  static patch = WaspController.buildDefiner("PATCH");
  static put = WaspController.buildDefiner("PUT");

  protected static buildDefiner(method: HttpMethod) {
    return (path: string) => (target: any, key: string) => {
      Reflect.defineMetadata("controller", { method, path }, target, key);
    };
  }
}
